import { buildLegalMetadata } from "@/lib/legal/build-legal-metadata";
import { GUIDES_INDEX_PATH } from "@/lib/resources/paths";
import type { ResourcePageConfig } from "@/types/resource-catalog.types";

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

export function buildGuidesIndexMetadata() {
  const { title, description, keywords } = GUIDES_PAGE.metadata;
  return buildLegalMetadata({
    path: GUIDES_PAGE.path,
    title,
    description,
    keywords,
  });
}
