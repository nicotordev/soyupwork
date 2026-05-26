import {
  buildCatalogTopicChips,
  getCatalogCategories,
  normalizeCategorySlugs,
} from "@/lib/catalog/categories";
import {
  buildLegacyCategoryRedirectPath,
  getCategoryPath,
} from "@/lib/catalog/category-paths";
import {
  countActiveCatalogFilters,
  parseCatalogSearchParams,
} from "@/lib/catalog/filters";
import { getCatalogCourses } from "@/lib/catalog/get-catalog-courses";
import { getCatalogFilterOptions } from "@/lib/catalog/get-catalog-filter-options";
import type { CatalogFilterCategory } from "@/types/catalog-filters";
import { notFound, permanentRedirect } from "next/navigation";

type CatalogPageSearchParams = Record<string, string | string[] | undefined>;

export async function getCatalogPageViewModel(
  resolvedParams: CatalogPageSearchParams,
  options?: { fixedCategorySlug?: string },
) {
  const rawParsed = parseCatalogSearchParams(resolvedParams);

  const [categories, filterOptions] = await Promise.all([
    getCatalogCategories(),
    getCatalogFilterOptions(),
  ]);

  if (options?.fixedCategorySlug) {
    const category = categories.find(
      (entry) => entry.slug === options.fixedCategorySlug,
    );
    if (!category) notFound();
  }

  const normalizedCategorySlugs = options?.fixedCategorySlug
    ? [options.fixedCategorySlug]
    : normalizeCategorySlugs(rawParsed.categorySlugs, categories);

  if (
    !options?.fixedCategorySlug &&
    normalizedCategorySlugs.length === 1 &&
    rawParsed.categorySlugs.length > 0
  ) {
    permanentRedirect(
      buildLegacyCategoryRedirectPath(
        normalizedCategorySlugs[0],
        resolvedParams,
      ),
    );
  }

  const parsed = {
    ...rawParsed,
    categorySlugs: normalizedCategorySlugs,
  };

  const [{ courses, featuredCourses }, topicChips] = await Promise.all([
    getCatalogCourses(parsed),
    Promise.resolve(buildCatalogTopicChips(categories)),
  ]);

  const activeCategory =
    options?.fixedCategorySlug != null
      ? (categories.find((entry) => entry.slug === options.fixedCategorySlug) ??
        null)
      : null;

  const promoCategory = activeCategory ?? categories[0] ?? null;

  return {
    filterOptions,
    topicChips,
    promoCategory,
    activeCategory,
    courses,
    featuredCourses,
    activeFiltersCount: countActiveCatalogFilters({
      ...parsed,
      categorySlugs: options?.fixedCategorySlug ? [] : parsed.categorySlugs,
    }),
    searchQuery: parsed.q,
    selectedCategorySlugs: parsed.categorySlugs,
    selectedLevels: parsed.levels,
    selectedDurations: parsed.selectedDurations,
    selectedAccess: parsed.selectedAccess,
    selectedCertificate: parsed.selectedCertificate,
    sortBy: parsed.sortBy,
  };
}

export async function getCatalogCategoryBySlug(
  slug: string,
): Promise<CatalogFilterCategory | null> {
  const categories = await getCatalogCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export function getCategoryCanonicalPath(slug: string): string {
  return getCategoryPath(slug);
}
