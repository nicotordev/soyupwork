import type { NavSection } from "@/types/marketing-nav.types";

export const catalogDescription =
  "Formación práctica para vender servicios en Upwork: propuestas, nichos, pricing, inglés para entrevistas y operación freelance internacional. Elige por tema, empieza gratis o mira lo que más está creciendo ahora.";

export const catalogDescriptionShort =
  "Formación práctica para vender en Upwork: propuestas, nichos, pricing e inglés para entrevistas.";

export const navSections: readonly NavSection[] = [
  {
    label: "Recursos",
    items: [
      {
        title: "Guías",
        href: "/resources/guias",
        description: "Material práctico para freelancers",
      },
      {
        title: "Plantillas",
        href: "/resources/plantillas",
        description: "Propuestas y documentos listos",
      },
      {
        title: "Blog",
        href: "/resources/blog",
        description: "Artículos y novedades",
      },
    ],
  },
  {
    label: "Precios",
    items: [
      {
        title: "Planes",
        href: "/pricing",
        description: "Compara opciones de acceso",
      },
      {
        title: "Preguntas frecuentes",
        href: "/pricing#faq",
        description: "Dudas sobre pagos y acceso",
      },
    ],
  },
];
