import type { ResourceCatalogItem } from "@/types/resource-catalog.types";

export type TemplateSection = {
  title: string;
  body: string;
};

export type TemplateDetail = {
  item: ResourceCatalogItem;
  sections: TemplateSection[];
  includes: string[];
};

const TEMPLATE_DETAILS: Record<string, Omit<TemplateDetail, "item">> = {
  "propuesta-corta-connects": {
    sections: [
      {
        title: "Opening",
        body: "Hi [Name] — I read your post about [specific outcome]. I recently [one-line proof].",
      },
      {
        title: "Plan",
        body: "1) Quick audit of [area]  2) Deliver [artifact]  3) Handoff + recommendations",
      },
      {
        title: "CTA",
        body: "Happy to clarify scope — what's the single metric that would make this project a win?",
      },
    ],
    includes: [
      "Plantilla en inglés (copy-paste editable)",
      "Variantes para fixed vs hourly",
      "Notas de longitud máxima recomendada",
    ],
  },
  "propuesta-discovery-call": {
    sections: [
      {
        title: "Context",
        body: "Summarize the problem in the client's words before proposing deliverables.",
      },
      {
        title: "Discovery offer",
        body: "Propose a paid or bounded discovery phase with clear outputs (doc, wireframe list, estimate range).",
      },
      {
        title: "Next step",
        body: "Suggest a 20–30 min call with 3 questions sent in advance.",
      },
    ],
    includes: [
      "Bloques para proyectos consultivos",
      "Lista de preguntas de calificación",
      "Ejemplo de timeline post-discovery",
    ],
  },
  "follow-up-post-propuesta": {
    sections: [
      {
        title: "Valor añadido (48h)",
        body: "Share one insight or micro-audit relevant to their post — not a generic bump.",
      },
      {
        title: "Aclaración (72h)",
        body: "Ask if timing changed or if they need a different scope angle.",
      },
      {
        title: "Cierre elegante",
        body: "Leave the door open without pressure; mention capacity if useful.",
      },
    ],
    includes: ["3 emails cortos", "Versión para chat de Upwork", "Checklist anti-spam"],
  },
  "checklist-entrega-cliente": {
    sections: [
      {
        title: "Pre-handoff",
        body: "Scope checklist signed off, assets organized, access documented.",
      },
      {
        title: "Entrega",
        body: "Loom walkthrough or live session, README for maintainers, support window defined.",
      },
      {
        title: "Post-entrega",
        body: "Testimonial request, upsell only if natural, archive for portafolio.",
      },
    ],
    includes: ["PDF imprimible", "Versión Notion", "Script de pedido de review"],
  },
  "rate-card-servicios": {
    sections: [
      {
        title: "Tier Essential",
        body: "Core deliverables, response time, revision limit.",
      },
      {
        title: "Tier Growth",
        body: "Expanded scope, priority support, strategic layer.",
      },
      {
        title: "Out of scope",
        body: "Explicit list to prevent scope creep.",
      },
    ],
    includes: [
      "Hoja Excel con fórmulas de ejemplo",
      "Notas para presentar en propuesta",
      "Disponible con curso completo en catálogo",
    ],
  },
};

export function getTemplateDetail(
  item: ResourceCatalogItem,
): TemplateDetail | null {
  const detail = TEMPLATE_DETAILS[item.slug];
  if (!detail) return null;
  return { item, ...detail };
}
