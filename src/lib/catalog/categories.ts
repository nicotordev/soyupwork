import prisma from "@/lib/prisma";
import type { CatalogFilterCategory } from "@/types/catalog-filters";
import type { CatalogSection } from "@/types/marketing-nav.types";

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

export async function getCatalogNavSections(): Promise<CatalogSection[]> {
  const categories = await getCatalogCategories();

  return [
    {
      title: "Temas populares",
      iconKey: "topics",
      items: categories.map((category) => ({
        title: category.name,
        href: `/catalog?subject=${category.slug}`,
      })),
    },
    {
      title: "Cursos gratuitos",
      iconKey: "free",
      items: [
        {
          title: "Ver todos los gratuitos",
          href: "/catalog?access=free",
        },
      ],
    },
    {
      title: "En tendencia",
      iconKey: "trending",
      items: [
        {
          title: "Explorar tendencias",
          href: "/catalog?sort=trending",
        },
      ],
    },
  ];
}
