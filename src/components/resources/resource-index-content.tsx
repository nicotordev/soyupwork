import { ResourceFilters } from "@/components/resources/resource-filters";
import { ResourceIndexEmpty } from "@/components/resources/resource-index-empty";
import { ResourceIndexHero } from "@/components/resources/resource-index-hero";
import { ResourceItemCard } from "@/components/resources/resource-item-card";
import { ResourcesHubStrip } from "@/components/resources/resources-hub-strip";
import type {
  ResourceCatalogPageData,
  ResourcePageConfig,
} from "@/types/resource-catalog.types";
import { cn } from "@/lib/utils";

type ResourceIndexContentProps = {
  page: ResourcePageConfig;
  data: ResourceCatalogPageData;
  hubActive: "guias" | "plantillas";
};

function categoryName(
  categories: ResourceCatalogPageData["categories"],
  slug: string,
): string | undefined {
  return categories.find((c) => c.slug === slug)?.name;
}

export function ResourceIndexContent({
  page,
  data,
  hubActive,
}: ResourceIndexContentProps) {
  const hasFilters = Boolean(
    data.filters.q || data.filters.category || data.filters.tag,
  );
  const listItems = data.items.filter(
    (item) => !data.featuredItems.some((f) => f.id === item.id) || hasFilters,
  );

  return (
    <div className="relative z-10">
      <ResourceIndexHero page={page} />
      <ResourcesHubStrip current={hubActive} />

      <div
        className={cn(
          "mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 sm:px-6 lg:px-8",
          data.categories.length > 0 && "lg:grid-cols-[minmax(0,16rem)_1fr]",
        )}
      >
        {data.categories.length > 0 ? (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ResourceFilters
              indexPath={page.path}
              categories={data.categories}
              tags={data.tags}
              activeCategory={data.filters.category || undefined}
              activeTag={data.filters.tag || undefined}
            />
          </aside>
        ) : null}

        <div className="min-w-0 space-y-8">
          {data.featuredItems.length > 0 && !hasFilters ? (
            <section aria-label="Destacados" className="space-y-4">
              <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Destacados
              </p>
              {data.featuredItems.map((item) => (
                <ResourceItemCard
                  key={item.id}
                  item={item}
                  categoryName={categoryName(
                    data.categories,
                    item.categorySlug,
                  )}
                  featured
                />
              ))}
            </section>
          ) : null}

          <section aria-label="Listado" className="space-y-4">
            {data.items.length === 0 ? (
              <ResourceIndexEmpty page={page} hasFilters={hasFilters} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {listItems.map((item) => (
                  <ResourceItemCard
                    key={item.id}
                    item={item}
                    categoryName={categoryName(
                      data.categories,
                      item.categorySlug,
                    )}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
