import { BLOG_INDEX_PATH } from "@/lib/seo/blog-paths";
import { buildLegalMetadata } from "@/lib/legal/build-legal-metadata";
import type { BlogPostStatus } from "@/generated/prisma/client";

export { BLOG_INDEX_PATH };

export const BLOG_DEFAULT_PAGE = 1;
export const BLOG_DEFAULT_PAGE_SIZE = 12;
export const BLOG_MAX_PAGE_SIZE = 24;

export const ADMIN_BLOG_DEFAULT_PAGE = 1;
export const ADMIN_BLOG_DEFAULT_PAGE_SIZE = 20;
export const ADMIN_BLOG_MAX_PAGE_SIZE = 50;
export const ADMIN_BLOG_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export const ADMIN_BLOG_FILTER_ALL = "all" as const;

export const BLOG_POST_STATUS_LABELS: Record<BlogPostStatus, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
};

export const ADMIN_BLOG_STATUS_FILTER_OPTIONS = [
  { value: ADMIN_BLOG_FILTER_ALL, label: "Todos los estados" },
  { value: "DRAFT", label: BLOG_POST_STATUS_LABELS.DRAFT },
  { value: "PUBLISHED", label: BLOG_POST_STATUS_LABELS.PUBLISHED },
  { value: "ARCHIVED", label: BLOG_POST_STATUS_LABELS.ARCHIVED },
] as const;

export const ADMIN_BLOG_PAGE = {
  eyebrow: "Contenido",
  title: "Blog",
  description:
    "Publica artículos para SEO, autoridad y captación de freelancers Upwork en LATAM.",
  createLabel: "Nuevo artículo",
  editLabel: "Editar artículo",
  deleteTitle: "Eliminar artículo",
  deleteDescription: (title: string) =>
    `Se eliminará "${title}" y su metadata SEO. Esta acción no se puede deshacer.`,
  empty: {
    title: "Aún no hay artículos",
    description:
      "Publicá guías sobre propuestas, Connects y freelancing LATAM. Cada post puede llevar su propio SEO para captar tráfico orgánico.",
    createCta: "Crear primer artículo",
    filteredTitle: "Sin resultados",
    filteredDescription:
      "Probá con otros filtros o limpiá la búsqueda para ver todos los artículos.",
    clearFilters: "Limpiar filtros",
    hints: [
      "Markdown listo para publicar",
      "Meta title y description por artículo",
      "Categorías y tags para el índice",
    ] as const,
  },
} as const;

export const BLOG_INDEX_EMPTY = {
  filteredTitle: "Sin artículos con estos filtros",
  filteredDescription:
    "Probá otra categoría, tag o volvé al listado completo del blog.",
  filteredCta: "Ver todos los artículos",
  comingSoonTitle: "Próximamente",
  comingSoonDescription:
    "Estamos preparando guías prácticas sobre Upwork, propuestas y operación freelance en LATAM.",
} as const;

export const BLOG_INDEX_PAGE = {
  eyebrow: "RECURSOS · SOYUP.WORK",
  title: "Blog",
  titleHighlight: "Upwork",
  titleTrail: " y freelancing LATAM",
  description:
    "Guías prácticas sobre propuestas, Connects, pricing, entrevistas y operación freelance internacional.",
  metadata: {
    title: "Blog · Upwork LATAM y freelancing",
    description:
      "Artículos y guías de soyup.work para freelancers en Latinoamérica: Upwork, propuestas, trabajo remoto y criterio comercial.",
    keywords: [
      "blog upwork latam",
      "freelancing latam",
      "propuestas upwork",
      "trabajo remoto",
      "cursos freelance",
      "academia upwork",
    ] as const,
  },
} as const;

export const DEFAULT_BLOG_CATEGORIES = [
  {
    slug: "propuestas-upwork",
    name: "Propuestas Upwork",
    description: "Redacción, estructura y conversión de propuestas.",
    position: 0,
  },
  {
    slug: "pricing-freelance",
    name: "Pricing freelance",
    description: "Tarifas, paquetes y negociación internacional.",
    position: 1,
  },
  {
    slug: "operacion-latam",
    name: "Operación LATAM",
    description: "Herramientas, fiscalidad básica y día a día remoto.",
    position: 2,
  },
] as const;

export function buildBlogIndexMetadata() {
  const { title, description, keywords } = BLOG_INDEX_PAGE.metadata;
  return buildLegalMetadata({
    path: BLOG_INDEX_PATH,
    title,
    description,
    keywords,
  });
}
