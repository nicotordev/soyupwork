import { BlogFilters } from "@/components/blog/blog-filters";
import { BlogIndexEmpty } from "@/components/blog/blog-index-empty";
import { BlogIndexHero } from "@/components/blog/blog-index-hero";
import { ResourcesHubStrip } from "@/components/resources/resources-hub-strip";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BLOG_INDEX_PATH } from "@/lib/seo/blog-paths";
import type { BlogIndexPageData } from "@/types/blog.types";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BlogIndexContentProps = {
  data: BlogIndexPageData;
};

function pageHref(page: number, filters: BlogIndexPageData["filters"]): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("categoria", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  if (page > 1) params.set("page", String(page));
  const q = params.toString();
  return q ? `${BLOG_INDEX_PATH}?${q}` : BLOG_INDEX_PATH;
}

export function BlogIndexContent({ data }: BlogIndexContentProps) {
  const { filters, pagination } = data;
  const hasFilters = Boolean(filters.q || filters.category || filters.tag);
  const visiblePosts = data.posts.filter(
    (p) =>
      !data.featuredPosts.some((f) => f.id === p.id) ||
      filters.q ||
      filters.page > 1,
  );
  const showEmpty =
    data.posts.length === 0 && (hasFilters || data.featuredPosts.length === 0);

  return (
    <div className="relative z-10">
      <BlogIndexHero />
      <ResourcesHubStrip current="blog" />

      <div className={
        cn(
          "mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 sm:px-6 lg:px-8",
          data.categories.length > 0 && "lg:grid-cols-[minmax(0,16rem)_1fr]",
          data.categories.length === 0 && "lg:grid-cols-1",
        )
      }>
        {data.categories.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BlogFilters
              categories={data.categories}
              tags={data.tags}
              activeCategory={filters.category || undefined}
              activeTag={filters.tag || undefined}
            />
          </aside>
        )}

        <div className="w-full space-y-8">
          {data.featuredPosts.length > 0 && !filters.q && filters.page === 1 ? (
            <section aria-label="Destacados" className="space-y-4">
              <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Destacados
              </p>
              {data.featuredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} featured />
              ))}
            </section>
          ) : null}

          <section aria-label="Artículos" className="space-y-4">
            {showEmpty ? (
              <BlogIndexEmpty hasFilters={hasFilters} />
            ) : visiblePosts.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {visiblePosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : null}
          </section>

          {pagination.totalPages > 1 ? (
            <nav
              aria-label="Paginación"
              className="flex items-center justify-between gap-4 rounded-xl border-2 border-foreground bg-card px-4 py-3 shadow-[2px_2px_0px_0px_var(--foreground)]"
            >
              {pagination.page > 1 ? (
                <Link
                  href={pageHref(pagination.page - 1, filters)}
                  className="font-mono text-xs font-bold uppercase hover:text-primary"
                >
                  ← Anterior
                </Link>
              ) : (
                <span />
              )}
              <span className="font-mono text-xs font-bold tabular-nums">
                {pagination.page} / {pagination.totalPages}
              </span>
              {pagination.page < pagination.totalPages ? (
                <Link
                  href={pageHref(pagination.page + 1, filters)}
                  className={cn(
                    "font-mono text-xs font-bold uppercase hover:text-primary",
                  )}
                >
                  Siguiente →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}
