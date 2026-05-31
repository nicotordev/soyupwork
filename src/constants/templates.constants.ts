import { buildLegalMetadata } from "@/lib/legal/build-legal-metadata";
import { TEMPLATES_INDEX_PATH } from "@/lib/resources/paths";
import type {
  ResourceCatalogItem,
  ResourceCategory,
  ResourcePageConfig,
} from "@/types/resource-catalog.types";

export const TEMPLATES_PAGE: ResourcePageConfig = {
  path: TEMPLATES_INDEX_PATH,
  eyebrow: "RECURSOS · PLANTILLAS",
  title: "Plantillas",
  titleHighlight: "listas",
  titleTrail: " para operar en Upwork",
  description:
    "Documentos y estructuras para propuestas, seguimiento, entregables y pricing. Copiá el esqueleto, adaptá el criterio.",
  metadata: {
    title: "Plantillas Upwork · Propuestas y documentos freelance",
    description:
      "Plantillas de propuestas, follow-up y entrega para freelancers Upwork en LATAM. Formatos listos desde soyup.work.",
    keywords: [
      "plantillas upwork",
      "plantilla propuesta upwork",
      "freelancing latam",
      "propuesta freelance",
      "documentos freelance",
    ] as const,
  },
  empty: {
    filteredTitle: "Sin plantillas con estos filtros",
    filteredDescription: "Probá otra categoría o volvé al catálogo completo.",
    filteredCta: "Ver todas las plantillas",
    emptyTitle: "Plantillas en camino",
    emptyDescription:
      "Estamos preparando archivos editables y versiones comentadas dentro de los cursos.",
  },
  detailEyebrow: "PLANTILLA · SOYUP.WORK",
};

export const TEMPLATE_CATEGORIES: readonly ResourceCategory[] = [
  {
    slug: "propuestas",
    name: "Propuestas",
    description: "Aperturas, cuerpo y cierres.",
  },
  {
    slug: "seguimiento",
    name: "Seguimiento",
    description: "Follow-up y discovery.",
  },
  {
    slug: "entrega",
    name: "Entrega y pricing",
    description: "Cierre, briefs y tarifas.",
  },
] as const;

export const TEMPLATE_ITEMS: readonly ResourceCatalogItem[] = [
  {
    id: "tpl-short-proposal",
    slug: "propuesta-corta-connects",
    title: "Propuesta corta (Connects limitados)",
    subtitle: "Menos de 300 palabras",
    excerpt:
      "Estructura en inglés para proyectos acotados: hook, relevancia, plan en 3 pasos y CTA.",
    categorySlug: "propuestas",
    tags: ["propuestas", "inglés"],
    kind: "template",
    availability: "available",
    fileLabel: "Markdown + Notion",
    featured: true,
  },
  {
    id: "tpl-discovery-proposal",
    slug: "propuesta-discovery-call",
    title: "Propuesta con discovery call",
    subtitle: "Proyectos consultivos",
    excerpt:
      "Bloques para calificar scope, riesgos y siguiente paso sin prometer entregables prematuros.",
    categorySlug: "propuestas",
    tags: ["discovery", "consultoría"],
    kind: "template",
    availability: "available",
    fileLabel: "Google Doc",
    featured: true,
  },
  {
    id: "tpl-follow-up",
    slug: "follow-up-post-propuesta",
    title: "Follow-up post-propuesta",
    subtitle: "48–72 h sin respuesta",
    excerpt:
      "Tres variantes de seguimiento: valor añadido, aclaración y cierre elegante.",
    categorySlug: "seguimiento",
    tags: ["follow-up", "ventas"],
    kind: "template",
    availability: "available",
    fileLabel: "Email + DM",
    featured: false,
  },
  {
    id: "tpl-delivery-checklist",
    slug: "checklist-entrega-cliente",
    title: "Checklist de entrega al cliente",
    subtitle: "Cierre profesional",
    excerpt:
      "Lista para handoff, revisión de scope, pedido de testimonio y próximo upsell sin sonar desesperado.",
    categorySlug: "entrega",
    tags: ["entrega", "reputación"],
    kind: "template",
    availability: "available",
    fileLabel: "PDF + Sheet",
    featured: false,
  },
  {
    id: "tpl-rate-card",
    slug: "rate-card-servicios",
    title: "Rate card de servicios",
    subtitle: "Paquetes y límites",
    excerpt:
      "Tabla para presentar tiers, entregables incluidos y qué queda fuera de scope.",
    categorySlug: "entrega",
    tags: ["pricing", "paquetes"],
    kind: "template",
    availability: "course",
    fileLabel: "Excel",
    featured: false,
    relatedHref: "/catalog",
    relatedLabel: "Ver en catálogo de cursos",
  },
  {
    id: "tpl-brief",
    slug: "brief-proyecto-cliente",
    title: "Brief de proyecto para cliente",
    subtitle: "Alinear expectativas",
    excerpt:
      "Formulario previo al kickoff: objetivos, restricciones, stakeholders y definición de hecho.",
    categorySlug: "seguimiento",
    tags: ["brief", "kickoff"],
    kind: "template",
    availability: "coming_soon",
    fileLabel: "Notion",
    featured: false,
  },
] as const;

export function buildTemplatesIndexMetadata() {
  const { title, description, keywords } = TEMPLATES_PAGE.metadata;
  return buildLegalMetadata({
    path: TEMPLATES_PAGE.path,
    title,
    description,
    keywords,
  });
}

export function getTemplateSlugs(): string[] {
  return TEMPLATE_ITEMS.map((item) => item.slug);
}
