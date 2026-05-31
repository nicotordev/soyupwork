import { buildLegalMetadata } from "@/lib/legal/build-legal-metadata";
import { GUIDES_INDEX_PATH } from "@/lib/resources/paths";
import type {
  ResourceCatalogItem,
  ResourceCategory,
  ResourcePageConfig,
} from "@/types/resource-catalog.types";

export const GUIDES_PAGE: ResourcePageConfig = {
  path: GUIDES_INDEX_PATH,
  eyebrow: "RECURSOS · GUÍAS",
  title: "Guías",
  titleHighlight: "prácticas",
  titleTrail: " para Upwork LATAM",
  description:
    "Playbooks cortos y accionables: propuestas, lectura de proyectos, pricing, entrevistas y operación freelance sin humo.",
  metadata: {
    title: "Guías Upwork LATAM · Freelancing práctico",
    description:
      "Guías gratuitas de soyup.work para freelancers en Latinoamérica: propuestas Upwork, Connects, pricing y trabajo remoto internacional.",
    keywords: [
      "guías upwork latam",
      "propuestas upwork",
      "freelancing latam",
      "trabajo remoto",
      "cómo ganar en upwork",
    ] as const,
  },
  empty: {
    filteredTitle: "Sin guías con estos filtros",
    filteredDescription:
      "Probá otra categoría o volvé al listado completo de guías.",
    filteredCta: "Ver todas las guías",
    emptyTitle: "Guías en preparación",
    emptyDescription:
      "Estamos armando playbooks descargables y lectura rápida para tu operación en Upwork.",
  },
  detailEyebrow: "GUÍA · SOYUP.WORK",
};

export const GUIDE_CATEGORIES: readonly ResourceCategory[] = [
  {
    slug: "propuestas",
    name: "Propuestas",
    description: "Estructura, primeras líneas y criterio comercial.",
  },
  {
    slug: "pricing",
    name: "Pricing",
    description: "Tarifas, paquetes y negociación.",
  },
  {
    slug: "perfil",
    name: "Perfil y operación",
    description: "Setup, reputación y día a día.",
  },
] as const;

export const GUIDE_ITEMS: readonly ResourceCatalogItem[] = [
  {
    id: "guide-job-post-scan",
    slug: "leer-job-post-3-minutos",
    title: "Cómo leer un job post en 3 minutos",
    subtitle: "Señales de compra vs. ruido",
    excerpt:
      "Checklist para decidir si vale la pena gastar Connects antes de escribir una sola línea.",
    categorySlug: "propuestas",
    tags: ["connects", "criterio"],
    kind: "guide",
    availability: "available",
    readingTimeMinutes: 6,
    featured: true,
  },
  {
    id: "guide-proposal-structure",
    slug: "estructura-propuesta-sin-plantilla",
    title: "Estructura de propuesta que no suena a plantilla",
    subtitle: "Contexto → plan → evidencia → pregunta",
    excerpt:
      "Marco de cuatro bloques para mercados en inglés sin copiar textos genéricos de YouTube.",
    categorySlug: "propuestas",
    tags: ["propuestas", "inglés"],
    kind: "guide",
    availability: "available",
    readingTimeMinutes: 10,
    featured: true,
  },
  {
    id: "guide-pricing-value",
    slug: "pricing-por-valor-freelance",
    title: "Pricing por valor cuando el cliente pide hourly",
    subtitle: "Anclas, rangos y red flags",
    excerpt:
      "Cómo presentar paquetes y límites sin regalar horas ni asustar al comprador internacional.",
    categorySlug: "pricing",
    tags: ["pricing", "negociación"],
    kind: "guide",
    availability: "available",
    readingTimeMinutes: 8,
    featured: false,
  },
  {
    id: "guide-profile-30-days",
    slug: "primeros-30-dias-perfil-upwork",
    title: "Primeros 30 días de perfil en Upwork",
    subtitle: "Orden de prioridades",
    excerpt:
      "Qué optimizar primero si venís de cero: título, portafolio mínimo viable y prueba social honesta.",
    categorySlug: "perfil",
    tags: ["perfil", "onboarding"],
    kind: "guide",
    availability: "available",
    readingTimeMinutes: 12,
    featured: false,
  },
  {
    id: "guide-interview-phrases",
    slug: "frases-entrevista-ingles-funcional",
    title: "Frases para entrevista en inglés funcional",
    subtitle: "Sin speech perfecto",
    excerpt:
      "Scripts cortos para discovery, scope y próximos pasos cuando tu inglés es operativo, no nativo.",
    categorySlug: "propuestas",
    tags: ["entrevistas", "inglés"],
    kind: "guide",
    availability: "available",
    readingTimeMinutes: 7,
    featured: false,
  },
  {
    id: "guide-connects-budget",
    slug: "presupuesto-connects-semanal",
    title: "Presupuesto semanal de Connects",
    subtitle: "Postular menos, mejor",
    excerpt:
      "Regla simple para LATAM: cuántas postulaciones sostener según ticket objetivo y tasa de respuesta.",
    categorySlug: "propuestas",
    tags: ["connects", "operación"],
    kind: "guide",
    availability: "coming_soon",
    readingTimeMinutes: 5,
    featured: false,
  },
] as const;

export function buildGuidesIndexMetadata() {
  const { title, description, keywords } = GUIDES_PAGE.metadata;
  return buildLegalMetadata({
    path: GUIDES_PAGE.path,
    title,
    description,
    keywords,
  });
}

export function getGuideSlugs(): string[] {
  return GUIDE_ITEMS.map((item) => item.slug);
}
