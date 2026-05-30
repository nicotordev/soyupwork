import type { Metadata } from "next";
import type {
  PricingComparisonFeature,
  PricingFaqItem,
  PricingFlagshipProduct,
  PricingMiniModule,
  PricingPremiumOffer,
  PricingTrustItem,
} from "@/types/pricing.types";

const SITE_NAME = "soyup.work";

export const PRICING_PAGE = {
  metadata: {
    title: `Precios · Sistema Upwork LATAM | ${SITE_NAME}`,
    description:
      "Mini cursos desde $29, curso completo de ventas en Upwork desde $99 (lanzamiento) y cohorte premium con mentoría. Pago único, acceso lifetime, enfoque LATAM. Sin promesas de ingresos.",
    keywords: [
      "precios soyup.work",
      "curso upwork latam precio",
      "formación freelance latinoamérica",
      "upwork español",
      "freelancer latam",
    ],
  },
  hero: {
    eyebrow: "Precios para freelancers serios en Upwork",
    titleLead: "Un sistema de ventas internacional",
    titleHighlight: "diseñado para LATAM",
    titleTrail: ", no otro cursito genérico",
    description:
      "Aprende a competir comercialmente en Upwork: propuestas, Connects, pricing, entrevistas, operación freelance y herramientas prácticas para mercados en inglés.",
    descriptionEmphasis:
      "Pago único · acceso de por vida · sin suscripción mensual.",
    ctaPrimary: "Obtener curso completo",
    ctaPrimaryHref: "#pricing",
    ctaSecondary: "Ver comparativa",
    ctaSecondaryHref: "#comparison",
    trustChecks: [
      "Pago único · sin mensualidad",
      "Precios pensados para LATAM",
      "Templates, quizzes y certificado",
      "Checkout seguro con Stripe",
    ] as const,
  },
  productsSection: {
    badge: "PRECIOS",
    title: "Elige cómo quieres aprender",
    description:
      "Mini cursos temáticos, el sistema completo o mentoría en cohorte. Pago único · sin mensualidad.",
    commercialModel: {
      label: "Modelo comercial",
      title: "Pago por producto · acceso de por vida",
    },
  },
  miniModulesSection: {
    badge: "APRENDE POR MÓDULO",
    title: "Mini cursos temáticos",
    description:
      "Entrada de bajo riesgo si quieres resolver un problema puntual antes del sistema completo.",
    fromPriceLabel: "Desde $29 USD",
    catalogCta: "Ver catálogo completo",
    catalogHref: "/catalog",
  },
  flagshipSection: {
    badge: "PRODUCTO PRINCIPAL",
    recommendedBadge: "Recomendado",
    launchBadge: "Precio de lanzamiento",
    normalPriceNote: "Precio regular",
  },
  premiumSection: {
    badge: "UPGRADE PREMIUM",
    title: "Cohorte con mentoría",
    description:
      "Para quien quiere feedback en vivo, revisión de propuestas y accountability en grupo.",
  },
  comparisonSection: {
    badge: "COMPARATIVA",
    title: "Qué incluye cada opción",
    description:
      "El curso completo concentra el valor. Los mini cursos cubren un tema. La cohorte agrega mentoría.",
    planLabels: {
      mini: "Mini curso",
      flagship: "Curso completo",
      premium: "Cohorte",
    },
  },
  trustSection: {
    badge: "COMPRA CON CONFIANZA",
    title: "Transparencia antes del pago",
    description:
      "Sin letra chica ni promesas irreales. Sabes qué compras, cómo pagas y cuándo obtienes acceso.",
  },
  faqSection: {
    badge: "PREGUNTAS FRECUENTES",
    title: "Dudas sobre precios y acceso",
  },
  finalCta: {
    badge: "SIGUIENTE PASO",
    titleLead: "Deja de adivinar.",
    titleHighlight: "Construye un sistema repetible de ventas en Upwork",
    description:
      "El curso completo reúne propuestas, Connects, pricing, entrevistas, operación LATAM y herramientas prácticas en una sola ruta.",
    ctaPrimary: "Obtener curso completo · $99",
    ctaPrimaryHref: "#pricing",
    ctaSecondary: "Ver comparativa",
    ctaSecondaryHref: "#comparison",
  },
} as const;

export const PRICING_MINI_MODULES: readonly PricingMiniModule[] = [
  {
    id: "proposals",
    name: "Propuestas que convierten",
    description: "Estructura, primeras líneas y plantillas comentadas.",
    priceLabel: "$29 USD",
    ctaHref: "/catalog",
  },
  {
    id: "connects",
    name: "Connects y bidding",
    description: "ROI, priorización de jobs y presupuesto de postulación.",
    priceLabel: "$29 USD",
    ctaHref: "/catalog",
  },
  {
    id: "profile",
    name: "Perfil optimizado",
    description: "Nicho, oferta vendible y señales comerciales del perfil.",
    priceLabel: "$29 USD",
    ctaHref: "/catalog",
  },
  {
    id: "interviews",
    name: "Entrevistas en inglés",
    description: "Inglés comercial funcional para calls y cierre.",
    priceLabel: "$29 USD",
    ctaHref: "/catalog",
  },
];

export const PRICING_FLAGSHIP: PricingFlagshipProduct = {
  id: "flagship",
  name: "Curso completo Upwork LATAM",
  tagline: "Sistema de ventas internacional para freelancers de Latinoamérica",
  description:
    "La ruta integral para posicionarte, postular con criterio, cotizar, cerrar entrevistas y operar como freelancer internacional.",
  launchPriceLabel: "$99 USD",
  normalPriceLabel: "$129 USD",
  billingLabel: "Pago único · acceso lifetime · actualizaciones incluidas",
  ctaLabel: "Obtener acceso completo",
  ctaHref: "/courses/demo",
  courseSlug: "demo",
  features: [
    "Sistema completo de ventas en Upwork",
    "Plantillas de propuestas y calculadoras",
    "Módulos de Connects, pricing y entrevistas",
    "Operación freelance y contexto LATAM",
    "Quizzes, progreso y certificado verificable",
    "Comunidad básica y actualizaciones de por vida",
  ],
};

export const PRICING_PREMIUM: PricingPremiumOffer = {
  id: "premium",
  name: "Cohorte Premium",
  description:
    "Mentoría guiada con sesiones en vivo, revisión de propuestas y accountability en grupo.",
  priceLabel: "Consultar",
  billingLabel: "Cupos limitados · cohorte guiada",
  ctaLabel: "Consultar disponibilidad",
  ctaHref: "/waitlist",
  features: [
    "Todo lo del curso completo incluido",
    "Sesiones grupales en vivo",
    "Revisión de propuestas y perfil",
    "Comunidad privada y accountability",
    "Auditorías y feedback prioritario",
  ],
};

export const PRICING_COMPARISON: readonly PricingComparisonFeature[] = [
  {
    id: "topic-focus",
    label: "Enfoque temático único",
    mini: true,
    flagship: false,
    premium: false,
  },
  {
    id: "full-system",
    label: "Sistema completo de ventas Upwork",
    mini: false,
    flagship: true,
    premium: true,
  },
  {
    id: "templates",
    label: "Plantillas y recursos descargables",
    mini: "Básico",
    flagship: true,
    premium: true,
  },
  {
    id: "calculators",
    label: "Calculadoras (Connects, pricing)",
    mini: false,
    flagship: true,
    premium: true,
  },
  {
    id: "quizzes",
    label: "Quizzes y seguimiento de progreso",
    mini: true,
    flagship: true,
    premium: true,
  },
  {
    id: "certificate",
    label: "Certificado verificable",
    mini: "Si aplica",
    flagship: true,
    premium: true,
  },
  {
    id: "lifetime",
    label: "Acceso lifetime + actualizaciones",
    mini: true,
    flagship: true,
    premium: true,
  },
  {
    id: "community",
    label: "Comunidad",
    mini: false,
    flagship: "Básica",
    premium: "Privada",
  },
  {
    id: "live-calls",
    label: "Calls grupales en vivo",
    mini: false,
    flagship: false,
    premium: true,
  },
  {
    id: "proposal-review",
    label: "Revisión de propuestas",
    mini: false,
    flagship: false,
    premium: true,
  },
];

export const PRICING_TRUST_ITEMS: readonly PricingTrustItem[] = [
  {
    id: "stripe",
    title: "Pago seguro con Stripe",
    description:
      "Procesamos pagos con Stripe Checkout. No almacenamos datos de tarjeta en soyup.work.",
  },
  {
    id: "webhook",
    title: "Acceso tras pago verificado",
    description:
      "Tu inscripción se activa cuando el webhook de Stripe confirma el pago. No depende solo de volver a la página de éxito.",
  },
  {
    id: "no-promises",
    title: "Sin promesas de ingresos",
    description:
      "Enseñamos criterio comercial y sistemas aplicables. Los resultados dependen de tu nicho, ejecución y consistencia.",
  },
  {
    id: "latam",
    title: "Operación freelance LATAM",
    description:
      "Contenido pensado para freelancers de Latinoamérica que compiten en mercados internacionales en inglés.",
  },
];

export const PRICING_FAQ_ITEMS: readonly PricingFaqItem[] = [
  {
    id: "pricing-faq-mini-vs-full",
    question: "¿Compro un mini curso o el curso completo?",
    answer:
      "Si necesitas resolver un tema puntual (propuestas, Connects, perfil), un mini curso desde $29 puede bastar. Si quieres el sistema integral para competir en Upwork con criterio comercial, el curso completo es la mejor inversión.",
  },
  {
    id: "pricing-faq-launch",
    question: "¿Por qué $99 y no $129?",
    answer:
      "Estamos en fase de lanzamiento. El precio de $99 USD es una oferta inicial para primeros estudiantes mientras construimos testimonios y casos de éxito. El precio regular será $129 USD.",
  },
  {
    id: "pricing-faq-latam",
    question: "¿Está pensado para LATAM?",
    answer:
      "Sí. Los precios están calibrados para freelancers latinoamericanos. El contenido está en español y considera operación internacional, inglés comercial funcional y contexto regional.",
  },
  {
    id: "pricing-faq-guarantee",
    question: "¿Esto garantiza conseguir clientes?",
    answer:
      "No. No prometemos ingresos ni contratos. La promesa es formación práctica con honestidad comercial: propuestas, Connects, pricing, entrevistas y operación freelance.",
  },
  {
    id: "pricing-faq-payments",
    question: "¿Cómo funcionan los pagos?",
    answer:
      "Pagas una sola vez con Stripe Checkout. Cuando el pago se verifica vía webhook, se activa tu acceso automáticamente. Hoy no ofrecemos suscripciones mensuales.",
  },
  {
    id: "pricing-faq-access",
    question: "¿Tengo acceso de por vida?",
    answer:
      "Sí, al contenido del producto que compres. El curso completo incluye acceso lifetime y actualizaciones del temario publicado en esa ruta.",
  },
  {
    id: "pricing-faq-cohort",
    question: "¿Qué incluye la cohorte premium?",
    answer:
      "El curso completo más mentoría guiada: sesiones en vivo, revisión de propuestas, comunidad privada y accountability. Los cupos y el precio se confirman al consultar — únete a la lista de espera para recibir detalles.",
  },
];

function getAppOrigin(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!url) return "https://soyup.work";
  return url.replace(/\/$/, "");
}

export function buildPricingMetadata(): Metadata {
  const origin = getAppOrigin();
  const canonical = `${origin}/pricing`;
  const { title, description, keywords } = PRICING_PAGE.metadata;

  return {
    title,
    description,
    keywords: [...keywords],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "es_LA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
