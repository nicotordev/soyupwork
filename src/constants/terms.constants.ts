import type { LegalSection, LegalTocItem } from "@/types/legal-page.types";
import { buildLegalMetadata } from "@/lib/legal/build-legal-metadata";
import { legalFooterLinks } from "@/constants/legal-shared.constants";

export const TERMS_PAGE = {
  path: "/terminos",
  hero: {
    eyebrow: "LEGAL · SOYUP.WORK",
    title: "Términos y Condiciones",
    subtitle:
      "Al crear una cuenta, comprar un curso o usar cualquier parte de la plataforma, aceptas estas condiciones. Léelas con calma: están escritas para que entiendas cómo operamos, qué puedes esperar y qué no.",
  },
  metadata: {
    title: "Términos y Condiciones · Academia Upwork LATAM",
    description:
      "Condiciones de uso de soyup.work: acceso a cursos, pagos con Stripe, propiedad intelectual, comunidad, reembolsos y limitaciones para freelancers de Upwork en Latinoamérica.",
    keywords: [
      "términos soyup.work",
      "upwork latam",
      "freelancing latam",
      "cursos freelance",
      "trabajo remoto",
      "academia upwork",
      "condiciones de uso lms",
    ] as const,
  },
  footer: {
    disclaimer:
      "Este documento no sustituye asesoría legal personalizada. Si operas como empresa o tienes obligaciones fiscales específicas en tu país, consulta a un profesional local. Los términos pueden actualizarse; la fecha vigente siempre aparece arriba.",
    links: legalFooterLinks("/terminos"),
  },
} as const;

export const TERMS_TOC: readonly LegalTocItem[] = [
  { id: "introduccion", label: "Introducción" },
  { id: "uso-plataforma", label: "Uso de la plataforma" },
  { id: "pagos", label: "Pagos y suscripciones" },
  { id: "propiedad-intelectual", label: "Propiedad intelectual" },
  { id: "conducta", label: "Conducta prohibida" },
  { id: "responsabilidad", label: "Limitación de responsabilidad" },
  { id: "reembolsos", label: "Cancelaciones y reembolsos" },
  { id: "comunidad", label: "Comunidad y contenido" },
  { id: "privacidad", label: "Privacidad" },
  { id: "modificaciones", label: "Modificaciones" },
  { id: "contacto", label: "Contacto" },
] as const;

export const TERMS_SECTIONS: readonly LegalSection[] = [
  {
    id: "introduccion",
    title: "Introducción",
    blocks: [
      {
        type: "p",
        text: "Bienvenido a soyup.work. Operamos una academia en línea orientada a freelancers de Latinoamérica que quieren competir en Upwork y en mercados internacionales con criterio comercial: propuestas, Connects, pricing, entrevistas, nichos y operación del negocio freelance.",
      },
      {
        type: "meta",
        items: [
          { label: "Operador", value: "soyup.work" },
          { label: "Idioma", value: "Español (LATAM)" },
          { label: "Ámbito", value: "Plataforma web y productos digitales" },
        ],
      },
      {
        type: "callout",
        variant: "highlight",
        title: "Contenido exclusivamente educativo",
        body: "Nuestros cursos, plantillas y recursos tienen fines formativos. No somos empleadores, agencia de colocación ni representantes de Upwork. Las marcas de terceros pertenecen a sus titulares.",
      },
      {
        type: "p",
        text: "Estos Términos regulan el acceso a la plataforma, la compra de productos digitales, el uso de la comunidad (cuando esté disponible) y la relación entre tú («Usuario» o «Alumno») y nosotros («soyup.work», «nosotros» o «la Plataforma»). Si no estás de acuerdo, no uses el servicio.",
      },
      {
        type: "ul",
        items: [
          "Debes tener capacidad legal para contratar en tu jurisdicción.",
          "La información de registro debe ser veraz y actualizada.",
          "Eres responsable de la confidencialidad de tus credenciales de acceso.",
        ],
      },
    ],
  },
  {
    id: "uso-plataforma",
    title: "Uso de la plataforma",
    blocks: [
      {
        type: "p",
        text: "Te otorgamos una licencia personal, limitada, no exclusiva y no transferible para acceder al contenido adquirido mientras tu cuenta esté activa y el enrollment correspondiente se encuentre vigente, salvo que el producto indique acceso de por vida («lifetime»).",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Acceso por enrollment",
        body: "Cada curso o módulo se habilita según tu compra o invitación. Compartir credenciales, revender accesos o usar cuentas múltiples para eludir límites constituye abuso y puede derivar en suspensión inmediata.",
      },
      {
        type: "ol",
        items: [
          "Registrarte con un correo válido y completar los datos mínimos requeridos.",
          "Comprar o activar el producto que corresponda a tu nivel de acceso.",
          "Consumir el material desde la interfaz oficial (web o apps autorizadas, si existieran).",
          "Respetar los límites técnicos razonables (descargas masivas, scraping o automatización no autorizada están prohibidos).",
        ],
      },
      {
        type: "p",
        text: "Podemos actualizar la interfaz, reorganizar módulos o añadir material complementario sin costo adicional cuando el producto lo permita. Cambios estructurales mayores se comunicarán por correo o aviso en la plataforma.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Disponibilidad del servicio",
        body: "Buscamos alta disponibilidad, pero no garantizamos operación ininterrumpida. Mantenimientos, incidentes de proveedores (hosting, video, pagos) o fuerza mayor pueden afectar temporalmente el acceso.",
      },
      {
        type: "quote",
        text: "Tu cuenta es personal. Trátala como acceso a un sistema operativo de tu negocio freelance, no como un login compartido del equipo — salvo planes empresariales expresamente contratados.",
      },
    ],
  },
  {
    id: "pagos",
    title: "Pagos y suscripciones",
    blocks: [
      {
        type: "p",
        text: "Las compras se procesan principalmente a través de Stripe u otros proveedores de pago que indiquemos en el checkout. Los precios se muestran en la moneda declarada en la página de producto; impuestos o retenciones locales pueden aplicar según tu país.",
      },
      {
        type: "meta",
        items: [
          { label: "Modelo habitual", value: "Pago único por producto" },
          { label: "Procesador", value: "Stripe (u equivalente indicado)" },
          { label: "Facturación", value: "Según datos ingresados en checkout" },
        ],
      },
      {
        type: "ul",
        items: [
          "Al confirmar el pago, recibes acceso al enrollment vinculado al producto comprado.",
          "No almacenamos números completos de tarjeta; el proveedor de pagos gestiona datos sensibles.",
          "Si un pago es rechazado, disputado o revertido, podemos suspender el acceso hasta regularizar la situación.",
          "Ofertas promocionales, cupones o precios de lanzamiento pueden tener condiciones y fechas de vigencia específicas.",
        ],
      },
      {
        type: "p",
        text: "Cuando ofrezcamos suscripciones o cohortes con pagos recurrentes, los términos del plan (periodicidad, renovación, cancelación) se mostrarán antes de cobrar. La falta de pago en renovaciones puede cancelar el acceso premium asociado.",
      },
    ],
  },
  {
    id: "propiedad-intelectual",
    title: "Propiedad intelectual",
    blocks: [
      {
        type: "p",
        text: "Todo el contenido de la Plataforma — videos, textos, plantillas, diseños, código, marcas, identidad visual y metodologías — es propiedad de soyup.work o de sus licenciantes, protegido por leyes de propiedad intelectual y tratados internacionales.",
      },
      {
        type: "callout",
        variant: "caution",
        title: "Prohibida la redistribución",
        body: "No puedes copiar, republicar, revender, subir a sitios de descarga, compartir en grupos masivos ni extraer el material para crear productos competidores, salvo autorización escrita expresa.",
      },
      {
        type: "ul",
        items: [
          "Puedes usar plantillas y recursos descargables para tu operación freelance personal o de tu estudio, según la licencia del producto.",
          "No puedes eliminar marcas de agua, avisos de copyright ni restricciones técnicas.",
          "El feedback que envíes puede usarse para mejorar el producto sin obligación de compensación, salvo acuerdo distinto.",
        ],
      },
      {
        type: "p",
        text: "Si crees que algún material infringe derechos de terceros, escríbenos con detalle (URL, descripción, titularidad reclamada) y revisaremos el caso con prontitud.",
      },
    ],
  },
  {
    id: "conducta",
    title: "Conducta prohibida",
    blocks: [
      {
        type: "p",
        text: "Esperamos un entorno profesional y respetuoso. La comunidad, comentarios en lecciones, cohortes o canales asociados deben usarse para aprender y colaborar, no para spam, acoso o prácticas engañosas.",
      },
      {
        type: "ul",
        items: [
          "Acoso, discriminación, amenazas o lenguaje violento hacia personas o grupos.",
          "Publicar datos personales de terceros sin consentimiento (doxxing).",
          "Promover esquemas fraudulentos, cuentas de Upwork compartidas ilegalmente o «garantías» de ingresos engañosas.",
          "Ingeniería inversa, ataques, malware o intentos de acceder a áreas restringidas.",
          "Uso de bots o IA para automatizar interacciones en la plataforma sin permiso.",
          "Revender acceso, «piratear» contenido o eludir controles de enrollment.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Suspensión por abuso",
        body: "Podemos advertir, limitar funciones o cerrar cuentas ante incumplimientos graves o reincidentes, sin reembolso cuando la causa sea atribuible al Usuario.",
      },
    ],
  },
  {
    id: "responsabilidad",
    title: "Limitación de responsabilidad",
    blocks: [
      {
        type: "callout",
        variant: "caution",
        title: "No garantizamos ingresos en Upwork",
        body: "Los resultados en freelancing dependen de tu nicho, propuesta, reputación, mercado, idioma y ejecución. Mostramos marcos y tácticas; no prometemos contratos, ingresos mínimos ni tasas de conversión específicas.",
      },
      {
        type: "p",
        text: "En la máxima medida permitida por la ley aplicable, soyup.work no será responsable por lucro cesante, pérdida de oportunidades comerciales, suspensiones de cuentas en marketplaces de terceros, ni daños indirectos derivados del uso o la imposibilidad de uso del servicio.",
      },
      {
        type: "p",
        text: "El contenido puede mencionar herramientas de inteligencia artificial. Eres responsable de revisar políticas de plataformas (Upwork, clientes, privacidad) antes de usar IA en entregables o propuestas. No asumimos responsabilidad por sanciones de terceros por uso indebido de IA.",
      },
      {
        type: "ul",
        items: [
          "La Plataforma se ofrece «tal cual» y «según disponibilidad».",
          "Nuestra responsabilidad total agregada, cuando corresponda, se limitará al monto pagado por el Usuario por el producto que originó el reclamo en los últimos doce (12) meses.",
          "Nada en estos términos limita derechos irrenunciables que te reconozca la ley de consumo de tu país.",
        ],
      },
    ],
  },
  {
    id: "reembolsos",
    title: "Cancelaciones y reembolsos",
    blocks: [
      {
        type: "p",
        text: "Salvo que la ley local exija lo contrario o que un producto anuncie una política específica, las ventas de contenido digital con acceso inmediato son finales una vez consumido material sustancial o transcurrido el plazo indicado en checkout.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Política de reembolsos",
        body: "Los detalles operativos (plazos, elegibilidad, proceso) se describen en nuestra Política de Reembolsos. Ante dudas, contacta soporte antes de disputar el cargo con tu banco.",
      },
      {
        type: "ol",
        items: [
          "Solicitudes deben enviarse desde el correo de la cuenta de compra.",
          "Indica el producto, fecha de compra y motivo concreto.",
          "Evaluaremos casos de acceso técnico no resuelto o cobros duplicados de buena fe.",
        ],
      },
      {
        type: "p",
        text: "Puedes cancelar comunicaciones de marketing en cualquier momento; eso no afecta obligaciones ya contraídas por compras realizadas.",
      },
    ],
  },
  {
    id: "comunidad",
    title: "Comunidad y contenido",
    blocks: [
      {
        type: "p",
        text: "Cuando participes en foros, comentarios, cohortes o espacios grupales, publicas bajo tu responsabilidad. Concedes a soyup.work una licencia no exclusiva para alojar, mostrar y moderar ese contenido dentro del servicio.",
      },
      {
        type: "ul",
        items: [
          "Mantén confidencialidad de materiales compartidos en cohortes cerradas.",
          "No uses la comunidad para captar clientes masivamente sin permiso (spam comercial).",
          "Podemos eliminar publicaciones que violen estos términos o la convivencia del grupo.",
        ],
      },
      {
        type: "quote",
        text: "Compartir wins y métricas es bienvenido; vender humo o prometer resultados ajenos, no.",
      },
    ],
  },
  {
    id: "privacidad",
    title: "Privacidad",
    blocks: [
      {
        type: "p",
        text: "El tratamiento de datos personales se rige por nuestra Política de Privacidad, que forma parte integrante de esta relación. Allí explicamos qué datos recopilamos (cuenta, progreso, pagos, soporte), bases legales, proveedores y tus derechos.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Datos y proveedores",
        body: "Usamos infraestructura y servicios de terceros (autenticación, pagos, email, video, analítica acotada). Solo compartimos lo necesario para operar el servicio y cumplir la ley.",
      },
      {
        type: "p",
        text: "Al usar la Plataforma, confirmas que has leído la Política de Privacidad vigente en /privacidad.",
      },
    ],
  },
  {
    id: "modificaciones",
    title: "Modificaciones",
    blocks: [
      {
        type: "p",
        text: "Podemos actualizar estos Términos para reflejar cambios legales, nuevos productos o mejoras operativas. Publicaremos la versión vigente en esta URL con fecha de actualización visible.",
      },
      {
        type: "ul",
        items: [
          "Cambios materiales pueden notificarse por correo o banner en la cuenta.",
          "El uso continuado tras la entrada en vigor implica aceptación, salvo derechos imperativos de tu jurisdicción.",
          "Si no aceptas una modificación sustancial, puedes dejar de usar el servicio y contactar soporte respecto a accesos ya pagados.",
        ],
      },
    ],
  },
  {
    id: "contacto",
    title: "Contacto y jurisdicción",
    blocks: [
      {
        type: "p",
        text: "Para preguntas sobre estos Términos, accesos, facturación o reportes de abuso, utiliza los canales oficiales de soporte indicados en la Plataforma o en /contacto.",
      },
      {
        type: "meta",
        items: [
          { label: "Soporte", value: "Formulario y correo en /contacto" },
          { label: "Reembolsos", value: "/reembolsos" },
          { label: "Privacidad", value: "/privacidad" },
        ],
      },
      {
        type: "p",
        text: "Estos Términos se interpretan de buena fe y, salvo norma imperativa local, se regirán por las leyes del país de constitución del operador que designemos en aviso legal, con tribunales competentes en esa jurisdicción para controversias no sujetas a arbitraje obligatorio de consumo.",
      },
      {
        type: "callout",
        variant: "highlight",
        title: "Gracias por leer hasta aquí",
        body: "Construimos soyup.work para freelancers serios en LATAM. Si algo no está claro, escríbenos antes de asumir — preferimos conversación directa a malentendidos.",
      },
    ],
  },
] as const;

export function buildTermsMetadata() {
  const { title, description, keywords } = TERMS_PAGE.metadata;
  return buildLegalMetadata({
    path: TERMS_PAGE.path,
    title,
    description,
    keywords,
  });
}
