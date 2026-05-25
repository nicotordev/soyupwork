import type { NavSection } from "@/types/marketing-nav.types";

export const catalogDescription =
  "Formación práctica para vender servicios en Upwork: propuestas, nichos, pricing, inglés para entrevistas y operación freelance internacional. Elige por tema, empieza gratis o mira lo que más está creciendo ahora.";

export const catalogDescriptionShort =
  "Formación práctica para vender en Upwork: propuestas, nichos, pricing e inglés para entrevistas.";

export const navSections: readonly NavSection[] = [
  {
    label: "Catálogo",
    items: [],
  },
  {
    label: "Recursos",
    items: [
      {
        title: "Guías",
        href: "/recursos/guias",
        description: "Material práctico para freelancers",
      },
      {
        title: "Plantillas",
        href: "/recursos/plantillas",
        description: "Propuestas y documentos listos",
      },
      {
        title: "Blog",
        href: "/recursos/blog",
        description: "Artículos y novedades",
      },
    ],
  },
  {
    label: "Comunidad",
    items: [
      {
        title: "Foro",
        href: "/comunidad/foro",
        description: "Pregunta y comparte experiencias",
      },
      {
        title: "Eventos",
        href: "/comunidad/eventos",
        description: "Sesiones en vivo y workshops",
      },
      {
        title: "Historias",
        href: "/comunidad/historias",
        description: "Casos de éxito de alumnos",
      },
    ],
  },
  {
    label: "Precios",
    items: [
      {
        title: "Planes",
        href: "/precios",
        description: "Compara opciones de acceso",
      },
      {
        title: "Empresas",
        href: "/precios/empresas",
        description: "Formación para equipos",
      },
      {
        title: "Preguntas frecuentes",
        href: "/precios#faq",
        description: "Dudas sobre pagos y acceso",
      },
    ],
  },
];
