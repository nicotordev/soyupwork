import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { blogPostPath } from "@/lib/seo/blog-paths";
import { cn } from "@/lib/utils";
import type { BlogPostSummary } from "@/types/blog.types";
import { Clock } from "lucide-react";

type BlogPostCardProps = {
  post: BlogPostSummary;
  featured?: boolean;
};

export function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  const href = blogPostPath(post.slug);
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("es", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border-2 border-foreground bg-card",
        "shadow-[4px_4px_0px_0px_var(--foreground)] transition-all",
        "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)]",
        featured && "md:flex-row",
      )}
    >
      {post.coverImageUrl ? (
        <Link
          href={href}
          className={cn(
            "relative block shrink-0 overflow-hidden border-b-2 border-foreground bg-muted",
            featured ? "md:w-2/5 md:border-b-0 md:border-r-2" : "aspect-[16/9]",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImageUrl}
            alt=""
            className="size-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        </Link>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {post.category ? (
            <Badge variant="outline" className="text-[10px]">
              {post.category.name}
            </Badge>
          ) : null}
          {post.isFeatured ? (
            <Badge variant="secondary" className="text-[10px]">
              Destacado
            </Badge>
          ) : null}
        </div>

        <div className="space-y-2">
          <Link href={href}>
            <h2
              className={cn(
                "font-heading font-black tracking-tight text-foreground group-hover:text-primary",
                featured ? "text-xl sm:text-2xl" : "text-lg",
              )}
            >
              {post.title}
            </h2>
          </Link>
          {post.subtitle ? (
            <p className="text-sm font-semibold text-muted-foreground">
              {post.subtitle}
            </p>
          ) : null}
          {post.excerpt ? (
            <p className="line-clamp-3 text-sm leading-relaxed text-foreground/85">
              {post.excerpt}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold uppercase text-muted-foreground">
          {date ? <time dateTime={post.publishedAt!}>{date}</time> : null}
          {post.readingTimeMinutes ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden />
              {post.readingTimeMinutes} min
            </span>
          ) : null}
          {post.author ? <span>{post.author.name}</span> : null}
        </div>
      </div>
    </article>
  );
}
