import prisma from "@/lib/prisma";
import type { CatalogFilterCategory } from "@/types/catalog-filters";
import type { CatalogSection } from "@/types/marketing-nav.types";
import { IconGift, IconLayoutGrid, IconTrendingUp } from "@tabler/icons-react";

export interface CatalogTopicChip {
  label: string;
  categorySlug: string;
}

export async function getCatalogCategories(): Promise<CatalogFilterCategory[]> {
  return prisma.courseCategory.findMany({
    orderBy: { position: "asc" },
    select: { name: true, slug: true, icon: true },
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
      items: categories.map((category) => ({
        title: category.name,
        href: `/catalog?subject=${category.slug}`,
      })),
    },
    {
      title: "Cursos gratuitos",
      items: [
        {
          title: "Ver todos los gratuitos",
          href: "/catalog?access=free",
        },
      ],
    },
    {
      title: "En tendencia",
      items: [
        {
          title: "Explorar tendencias",
          href: "/catalog?sort=trending",
        },
      ],
    },
  ];
}
