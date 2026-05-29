import type { Metadata } from "next";

const SITE_NAME = "soyup.work";

export const CATALOG_PAGE = {
  metadataTitle: `Catálogo de cursos Upwork para freelancers LATAM | ${SITE_NAME}`,
  metadataDescription:
    "Cursos prácticos de Upwork para LATAM: propuestas que convierten, pricing, entrevistas en inglés, Connects y operación freelance internacional. Sin teoría vacía.",
  keywords: [
    "upwork",
    "freelance",
    "cursos upwork",
    "trabajo remoto",
    "propuestas upwork",
    "freelancer latam",
    "upwork español",
    "freelancer chile",
  ],
  categoryMetadataTitle: (categoryName: string) =>
    `Cursos de ${categoryName} para freelancers | ${SITE_NAME}`,
  categoryMetadataDescription: (categoryName: string) =>
    `Explora cursos de ${categoryName} en soyup.work: formación práctica para vender mejor tus servicios en Upwork y plataformas internacionales.`,
  categoryPageDescription: (categoryName: string) =>
    `Rutas y cursos de ${categoryName} para freelancers de LATAM: plantillas, ejercicios reales y enfoque comercial en Upwork.`,
  emptyCatalogTitle: "El catálogo se está preparando",
  emptyCatalogDescription:
    "Todavía no hay cursos publicados. Estamos armando rutas prácticas de Upwork, propuestas y pricing para freelancers de LATAM.",
  emptyCatalogCta: "Volver al inicio",
  emptyCategoryTitle: (categoryName: string) =>
    `Aún no hay cursos en ${categoryName}`,
  emptyCategoryDescription:
    "Esta categoría todavía no tiene cursos publicados. Explora otras rutas en el catálogo completo.",
  emptyCategoryCta: "Ver todo el catálogo",
  emptyFilteredTitle: "No se encontraron cursos",
  emptyFilteredDescription:
    "Ningún curso coincide con los criterios de filtrado seleccionados. Intenta quitar algunos filtros o cambiar la búsqueda.",
  emptyFilteredCta: "Restaurar filtros",
} as const;

function getAppOrigin(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!url) return "https://soyup.work";
  return url.replace(/\/$/, "");
}

export function buildCatalogMetadata(path = "/catalog"): Metadata {
  const origin = getAppOrigin();
  const canonical = `${origin}${path}`;

  return {
    title: CATALOG_PAGE.metadataTitle,
    description: CATALOG_PAGE.metadataDescription,
    keywords: [...CATALOG_PAGE.keywords],
    alternates: { canonical },
    openGraph: {
      title: CATALOG_PAGE.metadataTitle,
      description: CATALOG_PAGE.metadataDescription,
      url: canonical,
      type: "website",
      locale: "es_LA",
      siteName: SITE_NAME,
    },
  };
}

export function buildCategoryMetadata(
  categoryName: string,
  slug: string,
): Metadata {
  const path = `/category/${slug}`;
  const title = CATALOG_PAGE.categoryMetadataTitle(categoryName);
  const description = CATALOG_PAGE.categoryMetadataDescription(categoryName);
  const origin = getAppOrigin();
  const canonical = `${origin}${path}`;

  return {
    title,
    description,
    keywords: [...CATALOG_PAGE.keywords, categoryName.toLowerCase()],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: "es_LA",
      siteName: SITE_NAME,
    },
  };
}
