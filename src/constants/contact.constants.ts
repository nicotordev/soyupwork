import type { LegalSection, LegalTocItem } from "@/types/legal-page.types";
import { buildLegalMetadata } from "@/lib/legal/build-legal-metadata";
import {
  LEGAL_FOOTER_DISCLAIMER,
  legalFooterLinks,
} from "@/constants/legal-shared.constants";

export const CONTACT_TOPICS = [
  { value: "access", label: "Acceso a cursos / cuenta" },
  { value: "billing", label: "Facturación y pagos" },
  { value: "refund", label: "Reembolso" },
  { value: "technical", label: "Problema técnico" },
  { value: "privacy", label: "Privacidad y datos" },
  { value: "other", label: "Otro" },
] as const;

export type ContactTopicValue = (typeof CONTACT_TOPICS)[number]["value"];

export const CONTACT_PAGE = {
  path: "/contacto",
  hero: {
    eyebrow: "SOPORTE · SOYUP.WORK",
    title: "Soporte y Contacto",
    subtitle:
      "¿Problema con tu acceso, un cobro o el contenido? Escríbenos con contexto. Respondemos en español, directo y sin tickets infinitos.",
  },
  metadata: {
    title: "Soporte y Contacto · Academia Upwork LATAM",
    description:
      "Contacta al equipo de soyup.work: acceso LMS, pagos Stripe, reembolsos, privacidad y soporte técnico para freelancers Upwork en LATAM.",
    keywords: [
      "soporte soyup.work",
      "contacto academia upwork",
      "ayuda curso freelance",
      "upwork latam soporte",
    ] as const,
  },
  responseTime: "2–5 días hábiles",
  footer: {
    disclaimer: LEGAL_FOOTER_DISCLAIMER,
    links: legalFooterLinks("/contacto"),
  },
} as const;

export const CONTACT_TOC: readonly LegalTocItem[] = [
  { id: "canales", label: "Canales" },
  { id: "formulario", label: "Formulario" },
  { id: "temas", label: "Temas frecuentes" },
  { id: "antes-de-escribir", label: "Antes de escribir" },
] as const;

export const CONTACT_SECTIONS: readonly LegalSection[] = [
  {
    id: "canales",
    title: "Canales de contacto",
    blocks: [
      {
        type: "p",
        text: "El formulario de esta página es el canal preferido: llega al equipo con el contexto ordenado. Si tu cuenta está activa, incluye siempre el correo con el que te registraste.",
      },
      {
        type: "meta",
        items: [
          { label: "Tiempo de respuesta", value: "2–5 días hábiles" },
          { label: "Idioma", value: "Español (LATAM)" },
          { label: "Horario", value: "Lunes a viernes" },
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Reembolsos y facturación",
        body: "Revisa primero /reembolsos para conocer la ventana y elegibilidad. Así aceleramos tu caso.",
      },
    ],
  },
  {
    id: "temas",
    title: "Temas que atendemos",
    blocks: [
      {
        type: "ul",
        items: [
          "Acceso a cursos tras compra o invitación.",
          "Errores de video, lecciones o progreso no guardado.",
          "Facturas, cobros duplicados y métodos de pago (Stripe).",
          "Solicitudes de reembolso dentro de política.",
          "Privacidad, exportación o eliminación de datos.",
          "Reportes de abuso en comunidad o contenido.",
        ],
      },
    ],
  },
  {
    id: "antes-de-escribir",
    title: "Antes de escribir",
    blocks: [
      {
        type: "ol",
        items: [
          "Revisa /pricing y la página del curso por FAQs de acceso.",
          "Prueba cerrar sesión y volver a entrar si es un problema de cuenta.",
          "Para pagos, ten a mano fecha de compra y últimos 4 dígitos si aplica.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "No garantizamos ingresos en Upwork",
        body: "El soporte no gestiona perfiles de marketplace ni resultados comerciales. Ayudamos con la plataforma educativa y tu compra.",
      },
    ],
  },
] as const;

export function buildContactMetadata() {
  const { title, description, keywords } = CONTACT_PAGE.metadata;
  return buildLegalMetadata({
    path: CONTACT_PAGE.path,
    title,
    description,
    keywords,
  });
}
