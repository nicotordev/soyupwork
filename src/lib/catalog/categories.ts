import 'server-only';
import prisma from "@/lib/prisma";
import type { CatalogFilterCategory } from "@/types/catalog-filters";

export interface CatalogTopicChip {
  label: string;
  categorySlug: string;
}

export async function getCatalogCategories(): Promise<CatalogFilterCategory[]> {
  return prisma.courseCategory.findMany({
    orderBy: { position: "asc" },
    select: { name: true, slug: true },
  });
}

/** Map legacy `?category=` display names or slugs → canonical slugs */
export function normalizeCategorySlugs(
  rawValues: string[],
  categories: CatalogFilterCategory[],
): string[] {
  if (rawValues.length === 0) return [];

  const slugSet = new Set(categories.map((c) => c.slug));
  const nameToSlug = new Map(categories.map((c) => [c.name, c.slug]));

  const resolved = rawValues
    .map((value) => (slugSet.has(value) ? value : nameToSlug.get(value)))
    .filter((slug): slug is string => Boolean(slug));

  return [...new Set(resolved)];
}

export function buildCatalogTopicChips(
  categories: CatalogFilterCategory[],
): CatalogTopicChip[] {
  return categories.map((category) => ({
    label: category.name,
    categorySlug: category.slug,
  }));
}
