import type { LegalSection, LegalTocItem } from "@/types/legal-page.types";
import { buildLegalMetadata } from "@/lib/legal/build-legal-metadata";
import {
  LEGAL_FOOTER_DISCLAIMER,
  legalFooterLinks,
} from "@/constants/legal-shared.constants";

export const PRIVACY_PAGE = {
  path: "/privacidad",
  hero: {
    eyebrow: "PRIVACIDAD · SOYUP.WORK",
    title: "Política de Privacidad",
    subtitle:
      "Explicamos qué datos recopilamos al operar la academia, por qué los usamos, con quién los compartimos y cómo puedes ejercer tus derechos. Sin letra chica imposible.",
  },
  metadata: {
    title: "Política de Privacidad · Academia Upwork LATAM",
    description:
      "Tratamiento de datos en soyup.work: cuenta, progreso, pagos con Stripe, video, email y derechos de privacidad para freelancers en Latinoamérica.",
    keywords: [
      "privacidad soyup.work",
      "datos personales lms",
      "upwork latam privacidad",
      "freelancing latam",
      "política de cookies",
      "derechos arco latam",
    ] as const,
  },
  footer: {
    disclaimer: LEGAL_FOOTER_DISCLAIMER,
    links: legalFooterLinks("/privacidad"),
  },
} as const;

export const PRIVACY_TOC: readonly LegalTocItem[] = [
  { id: "introduccion", label: "Introducción" },
  { id: "responsable", label: "Responsable" },
  { id: "datos-recopilados", label: "Datos que recopilamos" },
  { id: "finalidades", label: "Finalidades" },
  { id: "proveedores", label: "Proveedores" },
  { id: "conservacion", label: "Conservación" },
  { id: "derechos", label: "Tus derechos" },
  { id: "cookies", label: "Cookies" },
  { id: "menores", label: "Menores" },
  { id: "cambios", label: "Cambios" },
  { id: "contacto-privacidad", label: "Contacto" },
] as const;

export const PRIVACY_SECTIONS: readonly LegalSection[] = [
  {
    id: "introduccion",
    title: "Introducción",
    blocks: [
      {
        type: "p",
        text: "En soyup.work respetamos tu privacidad. Esta Política describe cómo tratamos datos personales cuando visitas el sitio, creas una cuenta, compras cursos, participas en la comunidad o contactas soporte.",
      },
      {
        type: "callout",
        variant: "highlight",
        title: "Transparencia operativa",
        body: "No vendemos tu lista de correos a terceros. Usamos datos para operar la academia, mejorar el producto y cumplir obligaciones legales — no para perfilarte con fines ajenos al servicio.",
      },
      {
        type: "p",
        text: "Si no estás de acuerdo con esta Política, no utilices la Plataforma. Los Términos y Condiciones complementan este documento en /terminos.",
      },
    ],
  },
  {
    id: "responsable",
    title: "Responsable del tratamiento",
    blocks: [
      {
        type: "p",
        text: "El responsable del tratamiento es el operador de soyup.work, identificado en avisos legales y facturación. Para ejercer derechos o consultas de privacidad, utiliza los canales en /contacto indicando «Privacidad» como tema.",
      },
      {
        type: "meta",
        items: [
          { label: "Sitio", value: "soyup.work" },
          { label: "Ámbito", value: "Usuarios y visitantes del LMS" },
          { label: "Idioma", value: "Español (LATAM)" },
        ],
      },
    ],
  },
  {
    id: "datos-recopilados",
    title: "Datos que recopilamos",
    blocks: [
      {
        type: "p",
        text: "Según cómo interactúes con la Plataforma, podemos tratar las siguientes categorías:",
      },
      {
        type: "ul",
        items: [
          "Identificación y cuenta: nombre, correo, imagen de perfil (opcional), identificadores de autenticación.",
          "Comercial y facturación: historial de compras, productos adquiridos, moneda, identificadores de pago procesados por Stripe (no almacenamos PAN completo de tarjetas).",
          "Aprendizaje: progreso en lecciones, quizzes, certificados, comentarios en contenido formativo.",
          "Soporte: mensajes que envíes por formulario o correo, adjuntos que compartas voluntariamente.",
          "Técnicos: dirección IP, user-agent, logs de seguridad, cookies esenciales y preferencias (p. ej. tema claro/oscuro).",
          "Comunicaciones: suscripción a newsletter o lista de espera, si te registraste explícitamente.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Datos que no pedimos innecesariamente",
        body: "No necesitamos tu documento de identidad para consumir cursos salvo requisito legal puntual o proceso de facturación que tú inicies con datos fiscales en checkout.",
      },
    ],
  },
  {
    id: "finalidades",
    title: "Finalidades y bases legales",
    blocks: [
      {
        type: "ul",
        items: [
          "Prestar el servicio contratado (acceso a cursos, certificados, soporte): ejecución de contrato.",
          "Gestionar pagos y reembolsos: ejecución de contrato e interés legítimo en seguridad financiera.",
          "Autenticación y seguridad de la cuenta: interés legítimo y obligación legal cuando aplique.",
          "Comunicaciones transaccionales (confirmación de compra, acceso, certificado): ejecución de contrato.",
          "Marketing con consentimiento (newsletter, novedades comerciales): consentimiento, revocable en cualquier momento.",
          "Analítica agregada y mejora del producto: interés legítimo, con datos minimizados y sin perfiles invasivos.",
          "Cumplimiento legal y resolución de disputas: obligación legal e interés legítimo.",
        ],
      },
      {
        type: "quote",
        text: "Si solo navegas precios sin registrarte, tratamos datos técnicos mínimos para entregar la web de forma segura.",
      },
    ],
  },
  {
    id: "proveedores",
    title: "Proveedores y transferencias",
    blocks: [
      {
        type: "p",
        text: "Usamos encargados de tratamiento que nos ayudan a operar el servicio. Compartimos solo lo necesario y bajo acuerdos de confidencialidad y protección de datos.",
      },
      {
        type: "ul",
        items: [
          "Autenticación y sesión (p. ej. proveedor de identidad configurado en la plataforma).",
          "Pagos: Stripe y servicios asociados al checkout.",
          "Email transaccional y campañas opt-in (p. ej. Resend u equivalente configurado).",
          "Hosting, base de datos, almacenamiento de video y archivos (infraestructura cloud).",
          "Protección anti-abuso (p. ej. Cloudflare Turnstile en formularios públicos).",
          "Herramientas de analítica acotada, si están activas, con configuración orientada a minimización.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Transferencias internacionales",
        body: "Algunos proveedores pueden procesar datos fuera de tu país. Cuando ocurre, aplicamos salvaguardas contractuales razonables según la normativa aplicable.",
      },
    ],
  },
  {
    id: "conservacion",
    title: "Conservación",
    blocks: [
      {
        type: "p",
        text: "Conservamos los datos el tiempo necesario para las finalidades descritas:",
      },
      {
        type: "ul",
        items: [
          "Cuenta activa: mientras mantengas relación con la Plataforma y plazos de prescripción aplicables.",
          "Registros de compra: según obligaciones contables y fiscales locales.",
          "Logs de seguridad: periodos cortos, salvo investigación de incidentes.",
          "Marketing: hasta que retires consentimiento o solicites baja.",
        ],
      },
      {
        type: "p",
        text: "Tras un periodo de inactividad prolongado o cierre de cuenta, podemos anonimizar o eliminar datos no sujetos a retención legal.",
      },
    ],
  },
  {
    id: "derechos",
    title: "Tus derechos",
    blocks: [
      {
        type: "p",
        text: "Según tu jurisdicción (p. ej. RGPD, leyes locales de protección de datos en LATAM), puedes tener derecho a:",
      },
      {
        type: "ol",
        items: [
          "Acceder a tus datos y obtener copia.",
          "Rectificar datos inexactos.",
          "Solicitar supresión cuando corresponda.",
          "Oponerte u oponerte a decisiones automatizadas, cuando existan.",
          "Solicitar portabilidad en formatos estructurados.",
          "Retirar consentimiento sin afectar tratamientos previos lícitos.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Plazo de respuesta",
        body: "Atenderemos solicitudes en un plazo razonable (habitualmente dentro de 30 días). Podemos pedir verificación de identidad para proteger tu cuenta.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies y tecnologías similares",
    blocks: [
      {
        type: "ul",
        items: [
          "Esenciales: sesión, seguridad, preferencias de interfaz.",
          "Funcionales: recordar estado de UI (p. ej. tema).",
          "Analíticas: solo si están habilitadas, para medir uso agregado.",
        ],
      },
      {
        type: "p",
        text: "Puedes gestionar cookies desde la configuración de tu navegador. Bloquear cookies esenciales puede afectar el inicio de sesión o el checkout.",
      },
    ],
  },
  {
    id: "menores",
    title: "Menores",
    blocks: [
      {
        type: "p",
        text: "La Plataforma está dirigida a personas con edad mínima para contratar en su país (habitualmente 18 años). No recopilamos conscientemente datos de menores. Si detectamos una cuenta de menor sin autorización parental verificable, podemos cerrarla y eliminar datos asociados.",
      },
    ],
  },
  {
    id: "cambios",
    title: "Cambios a esta Política",
    blocks: [
      {
        type: "p",
        text: "Publicaremos actualizaciones en esta URL con fecha visible. Cambios relevantes pueden notificarse por correo o banner en la cuenta. El uso continuado tras la vigencia implica conocimiento de la versión publicada, sin perjuicio de derechos imperativos.",
      },
    ],
  },
  {
    id: "contacto-privacidad",
    title: "Contacto de privacidad",
    blocks: [
      {
        type: "p",
        text: "Para consultas sobre esta Política o ejercicio de derechos, escríbenos desde /contacto seleccionando el tema «Privacidad» o enviando un correo al canal de soporte indicado en la Plataforma.",
      },
      {
        type: "callout",
        variant: "highlight",
        title: "Seguridad de la cuenta",
        body: "Si sospechas acceso no autorizado, cambia tu contraseña y contáctanos de inmediato con el correo de tu cuenta.",
      },
    ],
  },
] as const;

export function buildPrivacyMetadata() {
  const { title, description, keywords } = PRIVACY_PAGE.metadata;
  return buildLegalMetadata({
    path: PRIVACY_PAGE.path,
    title,
    description,
    keywords,
  });
}
