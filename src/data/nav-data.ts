import type { CatalogSection, NavSection } from "@/types/marketing-nav.types";
import { IconGift, IconLayoutGrid, IconTrendingUp } from "@tabler/icons-react";

export const catalogSections: CatalogSection[] = [
  {
    title: "Temas populares",
    icon: IconLayoutGrid,
    items: [
      { title: "Ventas B2B en Upwork", href: "/catalog?subject=ventas-b2b" },
      {
        title: "Propuestas que convierten",
        href: "/catalog?subject=propuestas",
      },
      { title: "Nichos y pricing", href: "/catalog?subject=nichos-pricing" },
      { title: "Inglés para entrevistas", href: "/catalog?subject=ingles" },
      {
        title: "Connects y operación freelance",
        href: "/catalog?subject=operacion",
      },
    ],
  },
  {
    title: "Cursos gratuitos",
    icon: IconGift,
    items: [
      {
        title: "Primeros pasos en Upwork",
        href: "/catalog?free=true&course=primeros-pasos",
      },
      {
        title: "Mini guía de propuestas",
        href: "/catalog?free=true&course=mini-propuestas",
      },
      { title: "Ver todos los gratuitos", href: "/catalog?free=true" },
    ],
  },
  {
    title: "En tendencia",
    icon: IconTrendingUp,
    items: [
      {
        title: "Freelance internacional desde LATAM",
        href: "/catalog?featured=freelance-latam",
      },
      {
        title: "Cierre de clientes en inglés",
        href: "/catalog?featured=clientes-ingles",
      },
      { title: "Explorar tendencias", href: "/catalog?sort=trending" },
    ],
  },
];

export const catalogDescription =
  "Formación práctica para vender servicios en Upwork: propuestas, nichos, pricing, inglés para entrevistas y operación freelance internacional. Elige por tema, empieza gratis o mira lo que más está creciendo ahora.";

export const catalogDescriptionShort =
  "Formación práctica para vender en Upwork: propuestas, nichos, pricing e inglés para entrevistas.";

export const navSections: readonly NavSection[] = [
  {
    label: "Catálogo",
    items: catalogSections.flatMap((section) => section.items),
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
