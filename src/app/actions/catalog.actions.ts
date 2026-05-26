"use server";

import { getCatalogCategories } from "@/lib/catalog/categories";
import { CatalogSection } from "@/types/marketing-nav.types";


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
