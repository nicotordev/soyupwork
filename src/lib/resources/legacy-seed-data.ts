import type {
  ResourceCatalogItem,
  ResourceCategory,
} from "@/types/resource-catalog.types";
import type { TemplateSection } from "@/lib/resources/template-content";

export const SEED_GUIDE_CATEGORIES: readonly ResourceCategory[] = [
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

export const SEED_TEMPLATE_CATEGORIES: readonly ResourceCategory[] = [
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

export const SEED_GUIDE_ITEMS: readonly ResourceCatalogItem[] = [
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

export const SEED_TEMPLATE_ITEMS: readonly ResourceCatalogItem[] = [
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

export const SEED_GUIDE_CONTENT: Record<string, string> = {
  "leer-job-post-3-minutos": `## Objetivo

Decidir en pocos minutos si un proyecto merece Connects y energía mental.

## 1. Budget y tipo de fee

- ¿Hourly o fixed? Si fixed, ¿hay rango o es "open"?
- ¿El budget es realista para el scope descrito?
- Red flag: "we'll discuss budget later" sin señales de urgencia claras.

## 2. Señales de comprador serio

- Historial de gasto en Upwork o equipo con roles definidos.
- Preguntas concretas en la descripción (stack, deadline, entregables).
- Evitar: copy-paste genérico, "simple task", "ASAP" sin contexto.

## 3. Fit con tu oferta

- ¿Podés demostrar 1–2 proyectos similares en las primeras líneas?
- ¿El idioma del post coincide con tu nivel operativo (no nativo fingido)?

## 4. Competencia esperada

- ¿Cuántos freelancers ya postularon?
- Si hay 50+ propuestas en 2 horas, necesitás un ángulo muy específico o pasar.

## Regla práctica

Si falla budget + fit, no postules. Usá el tiempo en mejorar perfil o outreach directo.`,

  "estructura-propuesta-sin-plantilla": `## Marco de 4 bloques

### 1. Hook contextual (2–3 líneas)

Referencia algo específico del post: métrica, stack, industria o restricción. Nada de "I am passionate about...".

### 2. Relevancia breve

Una prueba social alineada: proyecto similar, resultado numérico o proceso comparable. Un enlace o captura basta.

### 3. Plan en 3 pasos

Qué harías primero, qué entregarías y en qué orden. El cliente debe visualizar el trabajo sin leer un ensayo.

### 4. Pregunta de cierre

Una pregunta que invite respuesta: aclarar scope, prioridad o criterio de éxito. Facilita el reply.

## Errores comunes en LATAM

- Propuesta larga en español cuando el post está en inglés.
- Copiar la misma intro en 20 posts del día.
- Prometer timeline sin preguntar dependencias del cliente.

## Próximo paso

Adaptá este esqueleto y medí tasa de respuesta por nicho durante dos semanas.`,

  "pricing-por-valor-freelance": `## Cuando piden hourly

Muchos posts en Upwork piden hourly por defecto. Podés responder con un paquete acotado que ancle valor.

## Anclas útiles

- Rango de inversión ("projects like this typically land between X–Y").
- Qué incluye y qué queda fuera del scope.
- Opción de fase 1 pequeña (audit, discovery) antes del build grande.

## Red flags del cliente

- "We have a small budget but unlimited revisions."
- Comparación directa con la propuesta más barata sin criterio de calidad.
- Cambios de scope sin ajuste de precio acordado por escrito.

## Cómo presentarlo en la propuesta

1. Resumí el outcome deseado en una línea.
2. Ofrecé 2 tiers (esencial vs. completo) si aplica.
3. Pedí una call corta solo si el scope es ambiguo — no regales horas.

## Mentalidad

El precio comunica posicionamiento. Si dudás, subí el piso y mejorá el filtro de leads, no bajes a competir por volumen.`,

  "primeros-30-dias-perfil-upwork": `## Semana 1: Fundamentos

- Título orientado a outcome, no a herramienta ("I help X achieve Y").
- 1 caso de estudio bien escrito > 5 bullets genéricos.
- Foto y video opcional: profesional, no corporativo falso.

## Semana 2: Prueba social

- Pedí testimonios cortos a clientes previos (aunque no sean de Upwork).
- Subí muestras reales: capturas, métricas, antes/después.
- Definí 1 nicho para no parecer "hago de todo".

## Semana 3: Primeras postulaciones

- 5–8 propuestas/semana con criterio, no spam.
- Registrá qué hooks tuvieron reply.
- Ajustá título según el tipo de proyecto que más miran.

## Semana 4: Iteración

- Revisá Job Success y feedback temprano.
- Documentá objeciones en calls y mejorá FAQ del perfil.
- Conectá con catálogo de cursos si necesitás sistema completo.

## Recordatorio

El perfil es landing page. Debe responder: qué problema resolvés, para quién y por qué confiar.`,

  "frases-entrevista-ingles-funcional": `## Apertura de call

- "Thanks for your time — I reviewed the brief and have a few clarifying questions."
- "My goal today is to understand success criteria before we talk scope."

## Preguntas de discovery

- "What does done look like for this phase?"
- "Who else is involved in approvals?"
- "Are there technical or brand constraints I should know upfront?"

## Si no entendés algo

- "Let me repeat that back to make sure I got it right..."
- "Could you give me an example of what you mean by [term]?"

## Cierre

- "I'll send a short summary and next steps within [timeframe]."
- "Does this timeline align with your internal deadline?"

## Mindset

Claridad > perfección gramatical. El cliente compra seguridad de ejecución.`,
};

export type SeedTemplateDetail = {
  sections: TemplateSection[];
  includes: string[];
};

export const SEED_TEMPLATE_DETAILS: Record<string, SeedTemplateDetail> = {
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
    includes: [
      "3 emails cortos",
      "Versión para chat de Upwork",
      "Checklist anti-spam",
    ],
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
    includes: [
      "PDF imprimible",
      "Versión Notion",
      "Script de pedido de review",
    ],
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
