import Link from "next/link";
import { MarkdownContent } from "@/components/common/markdown-content";
import { Badge } from "@/components/ui/badge";
import { BLOG_INDEX_PATH } from "@/lib/seo/blog-paths";
import type { BlogPostDetail } from "@/types/blog.types";
import { ArrowLeft, Clock } from "lucide-react";

type BlogPostArticleProps = {
  post: BlogPostDetail;
};

export function BlogPostArticle({ post }: BlogPostArticleProps) {
  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("es", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
      <Link
        href={BLOG_INDEX_PATH}
        className="mb-6 inline-flex min-h-10 items-center gap-2 font-mono text-xs font-bold uppercase text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver al blog
      </Link>

      <header className="mb-8 space-y-4 border-b-2 border-foreground pb-8">
        <div className="flex flex-wrap gap-2">
          {post.category ? (
            <Badge variant="outline">{post.category.name}</Badge>
          ) : null}
          {post.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-[10px]">
              #{tag.name}
            </Badge>
          ))}
        </div>

        <h1 className="font-heading text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl md:text-[2.5rem]">
          {post.title}
        </h1>

        {post.subtitle ? (
          <p className="text-lg font-semibold text-muted-foreground">
            {post.subtitle}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] font-bold uppercase text-muted-foreground">
          {publishedLabel ? (
            <time dateTime={post.publishedAt!}>{publishedLabel}</time>
          ) : null}
          {post.readingTimeMinutes ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {post.readingTimeMinutes} min lectura
            </span>
          ) : null}
          {post.author ? <span>{post.author.name}</span> : null}
        </div>

        {post.coverImageUrl ? (
          <div className="overflow-hidden rounded-2xl border-2 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImageUrl}
              alt=""
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        ) : null}
      </header>

      <MarkdownContent content={post.content} className="prose-base" />
    </article>
  );
}
