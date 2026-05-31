import type { LegalSection, LegalTocItem } from "@/types/legal-page.types";
import { buildLegalMetadata } from "@/lib/legal/build-legal-metadata";
import {
  LEGAL_FOOTER_DISCLAIMER,
  legalFooterLinks,
} from "@/constants/legal-shared.constants";

export const REFUNDS_PAGE = {
  path: "/reembolsos",
  hero: {
    eyebrow: "REEMBOLSOS · SOYUP.WORK",
    title: "Política de Reembolsos",
    subtitle:
      "Reglas claras sobre devoluciones en compras digitales: cuándo aplican, cómo solicitarlas y qué esperar. Diseñada para productos educativos con acceso inmediato.",
  },
  metadata: {
    title: "Política de Reembolsos · Academia Upwork LATAM",
    description:
      "Ventana de reembolso, elegibilidad y proceso de devolución en soyup.work. Cursos freelance Upwork LATAM con pago único vía Stripe.",
    keywords: [
      "reembolsos soyup.work",
      "devolución curso upwork",
      "política de reembolso lms",
      "freelancing latam",
      "stripe reembolso",
    ] as const,
  },
  footer: {
    disclaimer: LEGAL_FOOTER_DISCLAIMER,
    links: legalFooterLinks("/reembolsos"),
  },
} as const;

export const REFUNDS_TOC: readonly LegalTocItem[] = [
  { id: "introduccion", label: "Introducción" },
  { id: "alcance", label: "Alcance" },
  { id: "ventana", label: "Ventana de reembolso" },
  { id: "elegibilidad", label: "Elegibilidad" },
  { id: "no-reembolsable", label: "No reembolsable" },
  { id: "como-solicitar", label: "Cómo solicitar" },
  { id: "proceso", label: "Proceso y plazos" },
  { id: "disputas", label: "Disputas bancarias" },
  { id: "contacto-reembolsos", label: "Contacto" },
] as const;

export function getRefundsSections(
  refundPolicyDays: number,
): readonly LegalSection[] {
  const daysLabel =
    refundPolicyDays === 1 ? "1 día" : `${refundPolicyDays} días`;

  return [
    {
      id: "introduccion",
      title: "Introducción",
      blocks: [
        {
          type: "p",
          text: "En soyup.work vendemos contenido digital educativo con acceso inmediato tras el pago. Esta Política explica cuándo puedes solicitar un reembolso y cómo lo gestionamos de forma justa para ambas partes.",
        },
        {
          type: "callout",
          variant: "highlight",
          title: "Pago único, acceso digital",
          body: "La mayoría de productos son compra única con acceso lifetime al material adquirido. No hay suscripción mensual salvo planes que lo indiquen explícitamente.",
        },
      ],
    },
    {
      id: "alcance",
      title: "Alcance",
      blocks: [
        {
          type: "p",
          text: "Aplica a compras realizadas en soyup.work a través de Stripe Checkout u otros métodos oficiales indicados en la Plataforma. No cubre compras a terceros, bundles externos ni servicios de Upwork u otros marketplaces.",
        },
        {
          type: "ul",
          items: [
            "Mini cursos y módulos temáticos.",
            "Curso completo / producto flagship.",
            "Cohortes premium o mentoría, cuando estén disponibles y salvo condiciones específicas del plan.",
          ],
        },
      ],
    },
    {
      id: "ventana",
      title: "Ventana de reembolso",
      blocks: [
        {
          type: "meta",
          items: [
            { label: "Ventana estándar", value: daysLabel },
            { label: "Desde", value: "Fecha de confirmación del pago" },
            { label: "Configurable", value: "Puede ajustarse por producto" },
          ],
        },
        {
          type: "p",
          text: `Salvo indicación distinta en la página del producto, puedes solicitar reembolso dentro de los ${daysLabel} calendario siguientes a la compra, siempre que cumplas los criterios de elegibilidad de esta Política.`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Valor vigente en plataforma",
          body: `La ventana operativa actual es de ${daysLabel}. Si cambia, la nueva regla aplica a compras posteriores a la publicación del cambio.`,
        },
      ],
    },
    {
      id: "elegibilidad",
      title: "Elegibilidad",
      blocks: [
        {
          type: "p",
          text: "Revisamos cada solicitud de buena fe. En general, son elegibles casos como:",
        },
        {
          type: "ul",
          items: [
            "Problemas técnicos que impidan acceder al contenido y que no resolvamos en un plazo razonable.",
            "Cobro duplicado o error evidente en el monto facturado.",
            "Compra accidental del producto equivocado, reportada prontamente y sin consumo sustancial del material.",
            "Insatisfacción dentro de la ventana, sin abuso ni patrones de solicitudes repetitivas.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Consumo sustancial",
          body: "Si completaste un porcentaje alto del curso, descargaste la mayoría de plantillas o participaste en cohorte en vivo, podemos ofrecer crédito o acceso alternativo en lugar de reembolso total.",
        },
      ],
    },
    {
      id: "no-reembolsable",
      title: "Casos no reembolsables",
      blocks: [
        {
          type: "ul",
          items: [
            "Solicitudes fuera de la ventana sin causa legal imperativa en tu país.",
            "Abuso de la política (múltiples compras/reembolsos, chargeback previo, violación de Términos).",
            "Expectativa de ingresos en Upwork: el contenido es educativo y no garantiza resultados comerciales.",
            "Suspensión de cuenta por conducta prohibida atribuible al Usuario.",
            "Productos gratuitos, becas o accesos promocionales sin cobro.",
          ],
        },
        {
          type: "quote",
          text: "Un reembolso no es «probar el curso gratis». Es una red de seguridad cuando algo falló de nuestro lado o la compra no fue lo que esperabas dentro de reglas claras.",
        },
      ],
    },
    {
      id: "como-solicitar",
      title: "Cómo solicitar",
      blocks: [
        {
          type: "ol",
          items: [
            "Envía la solicitud desde /contacto con tema «Reembolso / facturación» o al correo de soporte oficial.",
            "Incluye el correo de la cuenta, producto comprado, fecha aproximada y motivo concreto.",
            "Adjunta comprobante de pago o ID de sesión de Stripe si lo tienes (opcional pero acelera el proceso).",
          ],
        },
        {
          type: "callout",
          variant: "caution",
          title: "Antes de disputar con el banco",
          body: "Contáctanos primero. Los chargebacks sin intento de resolución pueden bloquear tu cuenta y retrasar soluciones más simples.",
        },
      ],
    },
    {
      id: "proceso",
      title: "Proceso y plazos",
      blocks: [
        {
          type: "p",
          text: "Confirmaremos recepción en un plazo habitual de 2 a 5 días hábiles. Si aprobamos el reembolso, lo procesamos por el mismo medio de pago cuando sea posible. Los plazos de acreditación dependen de tu banco o emisor de tarjeta (habitualmente 5–10 días hábiles adicionales).",
        },
        {
          type: "p",
          text: "Al reembolsar, revocamos el acceso al enrollment asociado. Si se otorgó certificado reciente, puede quedar invalidado en nuestros registros.",
        },
      ],
    },
    {
      id: "disputas",
      title: "Disputas bancarias",
      blocks: [
        {
          type: "p",
          text: "Si inicias un contracargo sin contactarnos, podemos suspender el acceso mientras se resuelve el caso y aportar evidencia de entrega del servicio digital al procesador de pagos.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Derechos de consumo",
          body: "Nada en esta Política limita derechos irrenunciables que reconozca la ley de tu país para contenido digital.",
        },
      ],
    },
    {
      id: "contacto-reembolsos",
      title: "Contacto",
      blocks: [
        {
          type: "p",
          text: "Dudas sobre elegibilidad o estado de tu solicitud: /contacto. Consulta también los Términos en /terminos y la Política de Privacidad en /privacidad.",
        },
      ],
    },
  ];
}

export function buildRefundsMetadata() {
  const { title, description, keywords } = REFUNDS_PAGE.metadata;
  return buildLegalMetadata({
    path: REFUNDS_PAGE.path,
    title,
    description,
    keywords,
  });
}
