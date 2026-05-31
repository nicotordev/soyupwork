import { buildLegalMetadata } from "@/lib/legal/build-legal-metadata";
import { TEMPLATES_INDEX_PATH } from "@/lib/resources/paths";
import type { ResourcePageConfig } from "@/types/resource-catalog.types";

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

export function buildTemplatesIndexMetadata() {
  const { title, description, keywords } = TEMPLATES_PAGE.metadata;
  return buildLegalMetadata({
    path: TEMPLATES_PAGE.path,
    title,
    description,
    keywords,
  });
}
