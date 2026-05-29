import type { Metadata } from "next";

const SITE_NAME = "soyup.work";

export const CATALOG_PAGE = {
  metadataTitle: `Upwork LATAM: Catálogo de Cursos en Español para Freelancers Latinoamérica | ${SITE_NAME}`,
  metadataDescription:
    "¿Cómo funciona Upwork? Cursos prácticos de Upwork en Latinoamérica: propuestas que convierten, pricing, Connects, entrevistas en inglés y operación freelance internacional. Sin teoría vacía.",
  keywords: [
    "upwork",
    "upwork latam",
    "upwork español",
    "upwork latam es confiable",
    "como funciona upwork",
    "que es upwork",
    "registrarse en upwork",
    "cursos upwork",
    "trabajo remoto",
    "propuestas upwork",
    "freelancer latam",
    "upwork vale la pena",
  ],
  categoryMetadataTitle: (categoryName: string) =>
    `Cursos de ${categoryName} para freelancers | ${SITE_NAME}`,
  categoryMetadataDescription: (categoryName: string) =>
    `Explora cursos de ${categoryName} en soyup.work: formación práctica de Upwork en español para vender mejor tus servicios freelance a nivel internacional.`,
  categoryPageDescription: (categoryName: string) =>
    `Rutas y cursos de ${categoryName} para freelancers de LATAM: plantillas, ejercicios reales y enfoque comercial estratégico en Upwork.`,
  emptyCatalogTitle: "El catálogo se está preparando",
  emptyCatalogDescription:
    "¿Es confiable Upwork? Sí. Todavía no hay cursos publicados, pero estamos armando rutas prácticas de Upwork en Latinoamérica sobre cómo crear cuenta, registrarse en Upwork y competir comercialmente.",
  emptyCatalogCta: "Volver al inicio",
  emptyCategoryTitle: (categoryName: string) =>
    `Aún no hay cursos en ${categoryName}`,
  emptyCategoryDescription:
    "Esta categoría todavía no tiene cursos publicados. Explora cómo funciona Upwork en las otras rutas de nuestro catálogo completo.",
  emptyCategoryCta: "Ver todo el catálogo",
  emptyFilteredTitle: "No se encontraron cursos",
  emptyFilteredDescription:
    "Ningún curso coincide con los criterios de filtrado seleccionados. Intenta quitar algunos filtros o cambiar la búsqueda de temas.",
  emptyFilteredCta: "Restaurar filtros",
  valueEyebrow: "Upwork LATAM · Trabajo Remoto · Freelance Latinoamérica",
  valueTitle:
    "Cursos de Upwork en Español: Aprende a Facturar, No Solo a Registrarse en Upwork",
  valueDescription:
    "¿Upwork vale la pena? Totalmente. soyup.work reúne formación práctica sobre cómo funciona Upwork y cómo competir comercialmente en el mercado internacional: propuestas cortas que reciben respuestas de clientes premium, cuidado de Connects, pricing real y simulación de llamadas en inglés.",
  valueNotDoTitle: "Lo que no encontrarás aquí",
  valueNotDoItems: [
    "Tutoriales paso a paso solo para registrarse en Upwork sin estrategia",
    "Promesas mágicas de ingresos pasivos o atajos sin esfuerzo real",
    "Foro de soporte general, comunidad masiva o mentorías grupales (aún no)",
    "Membresías genéricas ilimitadas: compras exactamente el curso práctico que necesitas",
  ] as const,
  valueFeatures: [
    {
      title: "Propuestas y perfil",
      desc: "Mensajes breves, lectura rápida de proyectos en Upwork y señales comerciales de perfil — nada de plantillas largas genéricas.",
    },
    {
      title: "Connects y pricing",
      desc: "Criterios claros para postular en Upwork en LATAM, cuidar tu presupuesto de Connects y cotizar tarifas con lógica comercial.",
    },
    {
      title: "Trabajo remoto Upwork",
      desc: "Aprende cómo funciona Upwork para freelancers en Latinoamérica, compitiendo comercialmente por contratos de alta gama.",
    },
    {
      title: "Formato del curso",
      desc: "Lecciones en video y texto, ejercicios prácticos de pricing, quizzes y progreso dinámico. Certificado al completar.",
    },
  ] as const,
  valueCtaLabel: "Conocer la metodología",
  valueCtaHref: "/",
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
