import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ResourceCategory } from "@/types/resource-catalog.types";

type ResourceFiltersProps = {
  indexPath: string;
  categories: ResourceCategory[];
  tags: { slug: string; name: string }[];
  activeCategory?: string;
  activeTag?: string;
};

function filterHref(
  indexPath: string,
  params: Record<string, string | undefined>,
): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const q = search.toString();
  return q ? `${indexPath}?${q}` : indexPath;
}

export function ResourceFilters({
  indexPath,
  categories,
  tags,
  activeCategory,
  activeTag,
}: ResourceFiltersProps) {
  if (categories.length === 0 && tags.length === 0) return null;

  return (
    <nav
      aria-label="Filtrar recursos"
      className="space-y-4 rounded-2xl border-2 border-foreground bg-card p-4 shadow-[3px_3px_0px_0px_var(--foreground)]"
    >
      {categories.length > 0 ? (
        <div>
          <p className="mb-2 font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Categorías
          </p>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link
                href={filterHref(indexPath, { tag: activeTag })}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-lg border-2 border-foreground px-3 text-xs font-bold transition-all",
                  !activeCategory
                    ? "bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)]"
                    : "bg-background hover:bg-muted",
                )}
              >
                Todas
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={filterHref(indexPath, {
                    categoria: cat.slug,
                    tag: activeTag,
                  })}
                  className={cn(
                    "inline-flex min-h-9 items-center rounded-lg border-2 border-foreground px-3 text-xs font-bold transition-all",
                    activeCategory === cat.slug
                      ? "bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)]"
                      : "bg-background hover:bg-muted",
                  )}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div>
          <p className="mb-2 font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Tags
          </p>
          <ul className="flex flex-wrap gap-2">
            {activeTag ? (
              <li>
                <Link
                  href={filterHref(indexPath, { categoria: activeCategory })}
                  className="inline-flex min-h-8 items-center rounded-md border-2 border-dashed border-foreground/40 px-2 text-[10px] font-bold uppercase text-muted-foreground"
                >
                  Quitar tag
                </Link>
              </li>
            ) : null}
            {tags.map((tag) => (
              <li key={tag.slug}>
                <Link
                  href={filterHref(indexPath, {
                    categoria: activeCategory,
                    tag: tag.slug,
                  })}
                  className={cn(
                    "inline-flex min-h-8 items-center rounded-md border-2 border-foreground px-2 text-[10px] font-bold uppercase",
                    activeTag === tag.slug
                      ? "bg-secondary shadow-[1px_1px_0px_0px_var(--foreground)]"
                      : "bg-background hover:bg-muted",
                  )}
                >
                  #{tag.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
