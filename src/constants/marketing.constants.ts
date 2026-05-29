import type { Metadata } from "next";

const SITE_NAME = "soyup.work";

export const MARKETING_PAGE = {
  metadataTitle: `Upwork Chile: Cursos en Español para Freelancers LATAM | ${SITE_NAME}`,
  metadataDescription:
    "¿Cómo funciona Upwork y vale la pena en Chile? Academia práctica en español: propuestas, Connects, pricing, entrevistas en inglés y operación freelance. Aprende a facturar, no solo a registrarte.",
  keywords: [
    "upwork",
    "upwork chile",
    "upwork español",
    "upwork chile es confiable",
    "como funciona upwork",
    "que es upwork",
    "registrarse en upwork",
    "cursos upwork",
    "trabajo remoto upwork",
    "propuestas upwork",
    "freelancer latam",
    "upwork vale la pena",
  ],
  hero: {
    eyebrow: "Upwork Chile · Trabajo remoto · Freelance LATAM",
    titleLead: "Cursos de Upwork en español:",
    titleHighlight: "aprende a facturar",
    titleTrail: ", no solo a registrarte",
    description:
      "soyup.work es una academia práctica para freelancers de Chile y LATAM que quieren vender servicios en Upwork con criterio comercial: propuestas breves, Connects, pricing, entrevistas en inglés y operación freelance internacional.",
    descriptionEmphasis:
      "Sin promesas mágicas de ingresos: formación aplicada con video, texto y cuestionarios.",
    ctaPrimary: "Unirme a la lista",
    ctaSecondary: "Ver demo del curso",
    trustChecks: [
      "Cursos por tema (compra el que necesitas)",
      "Video, texto, quizzes y certificado",
      "Enfoque Chile y LATAM · trabajo remoto",
    ] as const,
  },
  valuePillars: [
    {
      title: "Cursos",
      subtitle: "POR TEMA · SIN MEMBRESÍA GENÉRICA",
    },
    {
      title: "Contenido",
      subtitle: "VIDEO, TEXTO, QUIZZES Y RECURSOS",
    },
    {
      title: "Enfoque",
      subtitle: "PROPUESTAS · CONNECTS · PRICING · OPERACIÓN",
    },
  ] as const,
  strategyComparison: {
    badge: "COMPAREMOS ENFOQUES",
    title: "No vendemos atajos. Enseñamos criterio para competir en Upwork.",
    description:
      "Muchos tutoriales se quedan en crear cuenta o copiar plantillas. Nosotros ordenamos el camino comercial: nicho, propuestas, Connects, entrevistas y operación freelance para Chile y LATAM.",
    superficialLabel: "Tutoriales superficiales",
    sistemaLabel: "Metodología soyup.work",
    rows: [
      {
        aspect: "Posicionamiento",
        superficial:
          "Registrarse en Upwork, completar el perfil y esperar mensajes",
        sistema:
          "Definir nicho, oferta vendible, palabras clave y señales comerciales del perfil",
      },
      {
        aspect: "Propuestas",
        superficial: "Plantillas largas iguales para todos los proyectos",
        sistema:
          "Leer el proyecto, mensajes breves con contexto y ejemplos comentados",
      },
      {
        aspect: "Connects",
        superficial: "Postular a todo sin criterio ni medir cada intento",
        sistema:
          "Elegir oportunidades, cuidar presupuesto de Connects y aprender de cada postulación",
      },
      {
        aspect: "Operación",
        superficial: "Improvisar precio, llamadas, entrega y seguimiento",
        sistema:
          "Pricing, entrevistas en inglés funcional, entrega profesional y nociones legales/fiscales para LATAM",
      },
    ] as const,
  },
  proposalSimulator: {
    badge: "SIMULADOR DE PROPUESTAS",
    title: "La diferencia entre copiar una plantilla y entender al cliente",
    description:
      "En Upwork no alcanza con tener cuenta. Un curso de soyup.work te enseña a leer la oportunidad, detectar el problema real y escribir una propuesta específica — no un mensaje automático que suena a spam.",
    bullets: [
      "Separar proyectos viables del ruido antes de gastar Connects.",
      "Evitar copy-paste genérico y saludos sin contexto.",
      "Practicar con ejemplos en video, texto y cuestionarios.",
    ] as const,
    genericTab: "Propuesta genérica",
    contextTab: "Propuesta con contexto",
    genericProposal:
      '"Dear Hiring Manager, I am a senior fullstack engineer with 8 years of experience. I have massive skills in Node, React and AWS. I can do it very cheap. Check my profile..."',
    genericWhy:
      "El saludo es amplio, parte desde tu experiencia y no demuestra que entendiste el problema del proyecto.",
    contextProposal:
      '"Hi Sarah — I noticed your Node.js endpoint is failing because Shopify webhook batches are massive. I recorded a 2-min Loom diagnostics audit for your DB: loom.com/share/df92..."',
    contextWhy:
      "Parte del problema publicado, propone una hipótesis concreta y abre conversación con valor antes de hablar de precio.",
    projectLabel: "PROYECTO CLIENTE (EE.UU.):",
    projectSnippet:
      '"Need Node.js backend expert to optimize Shopify webhooks database crashes..."',
  },
  curriculum: {
    badge: "RUTA DE APRENDIZAJE",
    title:
      "De entender cómo funciona Upwork a operar como freelancer internacional",
    description:
      "No es un tutorial de registro. El contenido se ordena para competir mejor: perfil, Connects, propuestas, entrevistas, pricing, entrega y operación en mercados en inglés.",
    steps: [
      {
        num: "01",
        title: "Perfil y nicho",
        desc: "Qué es Upwork en la práctica, especialización, nichos con demanda y perfil optimizado para búsqueda internacional.",
      },
      {
        num: "02",
        title: "Connects y propuestas",
        desc: "Economía de Connects, cuándo postular en Upwork Chile y propuestas cortas alineadas al problema del cliente.",
      },
      {
        num: "03",
        title: "Entrevistas y pricing",
        desc: "Inglés comercial para llamadas, cotización con lógica, paquetes y retainers sin improvisar.",
      },
      {
        num: "04",
        title: "Entrega y operación",
        desc: "Entrega profesional, reputación (JSS), nociones legales/fiscales LATAM y herramientas de IA cuando aporten al flujo.",
      },
    ] as const,
  },
  trackSelector: {
    badge: "ELIGE POR DÓNDE EMPEZAR",
    title: "Cursos pensados para problemas concretos de Upwork",
    description:
      "Cada ruta combina video protegido, texto guiado, ejercicios, quizzes y progreso por lección. Compras el curso que necesitas; sin membresía genérica ilimitada.",
    selectLabel: "Área de aprendizaje:",
    selectStep: "1. SELECCIONA UNA RUTA",
    formatTitle: "Formato de curso",
    formatItems: [
      { label: "Video protegido" },
      { label: "Texto guiado" },
      { label: "Quizzes simples" },
      { label: "Certificado verificable" },
    ] as const,
    selectedRoute: "Ruta seleccionada",
    commercialModel: "Modelo comercial",
    payPerCourse: "Pago por curso",
    focusLabel: "Enfoque del curso",
    outputLabel: "Resultado entregable",
    accessLabel: "Acceso:",
    accessValue: "Stripe Checkout",
    progressLabel: "Progreso:",
    progressValue: "Por lección",
    tracks: {
      profile: {
        title: "Perfil y nicho",
        focus:
          "Define una especialidad vendible y ordena tu perfil para que comunique valor con claridad en Upwork.",
        output:
          "Perfil enfocado, palabras clave, posicionamiento y propuesta de servicios concreta.",
      },
      proposals: {
        title: "Propuestas y Connects",
        focus:
          "Aprende a leer proyectos, priorizar oportunidades y escribir mensajes breves que abran conversaciones.",
        output:
          "Criterios para postular, ejemplos comentados y mensajes adaptados al cliente — sin plantillas largas.",
      },
      interviews: {
        title: "Entrevistas e inglés",
        focus:
          "Practica llamadas comerciales, preguntas frecuentes y respuestas para negociar sin improvisar.",
        output:
          "Guiones de entrevista, vocabulario útil y estructura para alcance, precio y siguientes pasos.",
      },
      operations: {
        title: "Operación freelance",
        focus:
          "Ordena pricing, entrega, cobros y seguimiento para trabajar con más criterio en trabajo remoto.",
        output:
          "Sistema operativo simple: dónde aplicar, cuánto cobrar y cómo sostener la relación con el cliente.",
      },
    },
  },
  lmsSection: {
    badge: "PLATAFORMA PROPIA",
    title:
      "Academia custom en español, no un curso suelto en Hotmart o Teachable",
    cards: [
      {
        title: "Acceso por compra",
        desc: "Stripe Checkout, inscripción automática y contenido protegido solo para estudiantes activos del curso.",
      },
      {
        title: "Progreso y drip content",
        desc: "Módulos por lección, avance registrado, quizzes y liberación gradual cuando el curso lo requiera.",
      },
      {
        title: "Evolución honesta",
        desc: "Primero validamos contenido y retención. Comunidad, cohortes y gamificación pueden llegar después — hoy el foco es el curso.",
      },
    ] as const,
  },
  ctaFinal: {
    badge: "SIGUIENTE PASO",
    titleLead: "Si quieres vender en Upwork desde Chile o LATAM, empieza por",
    titleHighlight: "competir con criterio comercial",
    description:
      "Explora el catálogo por tema: propuestas, Connects, entrevistas, pricing y operación freelance internacional. Sin atajos ni promesas de ingresos.",
    button: "Ver catálogo de cursos",
    href: "/catalog",
  },
  footer: {
    banner: "¿Listo para competir en Upwork con criterio?",
    bannerCta: "Explorar cursos",
    tagline:
      "Formación práctica en español para freelancers de Chile y LATAM que quieren vender en Upwork — propuestas, Connects, pricing y entrevistas, sin reemplazar la plataforma.",
  },
} as const;

function getAppOrigin(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!url) return "https://soyup.work";
  return url.replace(/\/$/, "");
}

export function buildMarketingMetadata(path = "/"): Metadata {
  const origin = getAppOrigin();
  const canonical = `${origin}${path.startsWith("/") ? path : `/${path}`}`;

  return {
    title: MARKETING_PAGE.metadataTitle,
    description: MARKETING_PAGE.metadataDescription,
    keywords: [...MARKETING_PAGE.keywords],
    alternates: { canonical },
    openGraph: {
      title: MARKETING_PAGE.metadataTitle,
      description: MARKETING_PAGE.metadataDescription,
      url: canonical,
      siteName: SITE_NAME,
      locale: "es_CL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: MARKETING_PAGE.metadataTitle,
      description: MARKETING_PAGE.metadataDescription,
    },
  };
}
