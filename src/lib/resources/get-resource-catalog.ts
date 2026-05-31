import { parseResourceCatalogParams } from "@/lib/resources/parse-resource-params";
import { guidePath, templatePath } from "@/lib/resources/paths";
import type {
  ResourceCatalogItem,
  ResourceCatalogPageData,
  ResourceCategory,
  ResourceKind,
  ResourcePageConfig,
} from "@/types/resource-catalog.types";

function itemPath(kind: ResourceKind, slug: string): string {
  return kind === "guide" ? guidePath(slug) : templatePath(slug);
}

function collectTags(items: readonly ResourceCatalogItem[]) {
  const map = new Map<string, string>();
  for (const item of items) {
    for (const tag of item.tags) {
      const slug = tag.toLowerCase().replace(/\s+/g, "-");
      if (!map.has(slug)) map.set(slug, tag);
    }
  }
  return [...map.entries()].map(([slug, name]) => ({ slug, name }));
}

function filterItems(
  items: readonly ResourceCatalogItem[],
  params: ReturnType<typeof parseResourceCatalogParams>,
): ResourceCatalogItem[] {
  return items.filter((item) => {
    if (params.category && item.categorySlug !== params.category) {
      return false;
    }
    if (params.tag) {
      const tagMatch = item.tags.some(
        (t) => t.toLowerCase().replace(/\s+/g, "-") === params.tag,
      );
      if (!tagMatch) return false;
    }
    if (params.q) {
      const q = params.q.toLowerCase();
      const haystack = [
        item.title,
        item.subtitle ?? "",
        item.excerpt,
        ...item.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function getResourceCatalogPageData(
  config: ResourcePageConfig,
  kind: ResourceKind,
  items: readonly ResourceCatalogItem[],
  categories: readonly ResourceCategory[],
  searchParams: Record<string, string | string[] | undefined>,
): ResourceCatalogPageData {
  const filters = parseResourceCatalogParams(searchParams);
  const filtered = filterItems(items, filters);
  const featuredItems = filtered.filter((item) => item.featured);

  return {
    kind,
    items: filtered,
    featuredItems: !filters.q && featuredItems.length > 0 ? featuredItems : [],
    categories: [...categories],
    tags: collectTags(items),
    filters,
  };
}

export function findResourceBySlug(
  items: readonly ResourceCatalogItem[],
  slug: string,
): ResourceCatalogItem | undefined {
  return items.find((item) => item.slug === slug);
}

export { itemPath };
