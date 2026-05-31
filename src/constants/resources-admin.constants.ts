import type {
  ResourceAvailability,
  ResourceKind,
  ResourceStatus,
} from "@/generated/prisma/client";

export const ADMIN_RESOURCES_DEFAULT_PAGE = 1;
export const ADMIN_RESOURCES_DEFAULT_PAGE_SIZE = 20;
export const ADMIN_RESOURCES_MAX_PAGE_SIZE = 50;
export const ADMIN_RESOURCES_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export const ADMIN_RESOURCES_FILTER_ALL = "all" as const;

export const ADMIN_RESOURCES_KIND_GUIDE = "guia" as const;
export const ADMIN_RESOURCES_KIND_TEMPLATE = "plantilla" as const;

export type AdminResourcesKindParam =
  | typeof ADMIN_RESOURCES_KIND_GUIDE
  | typeof ADMIN_RESOURCES_KIND_TEMPLATE;

export const RESOURCE_STATUS_LABELS: Record<ResourceStatus, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
};

export const RESOURCE_AVAILABILITY_LABELS: Record<
  ResourceAvailability,
  string
> = {
  AVAILABLE: "Disponible",
  COMING_SOON: "Próximamente",
  COURSE: "En curso",
};

export const ADMIN_RESOURCES_STATUS_FILTER_OPTIONS = [
  { value: ADMIN_RESOURCES_FILTER_ALL, label: "Todos los estados" },
  { value: "DRAFT", label: RESOURCE_STATUS_LABELS.DRAFT },
  { value: "PUBLISHED", label: RESOURCE_STATUS_LABELS.PUBLISHED },
  { value: "ARCHIVED", label: RESOURCE_STATUS_LABELS.ARCHIVED },
] as const;

export const ADMIN_RESOURCES_KIND_TABS = [
  { value: ADMIN_RESOURCES_KIND_GUIDE, label: "Guías" },
  { value: ADMIN_RESOURCES_KIND_TEMPLATE, label: "Plantillas" },
] as const;

export const ADMIN_RESOURCES_PAGE = {
  eyebrow: "Contenido",
  title: "Recursos",
  description:
    "Gestiona guías y plantillas del catálogo público: contenido, categorías, disponibilidad y destacados.",
  createGuideLabel: "Nueva guía",
  createTemplateLabel: "Nueva plantilla",
  editGuideLabel: "Editar guía",
  editTemplateLabel: "Editar plantilla",
  deleteTitle: "Eliminar recurso",
  deleteDescription: (title: string) =>
    `Se eliminará "${title}" del catálogo. Esta acción no se puede deshacer.`,
  empty: {
    title: "Aún no hay recursos",
    description:
      "Creá guías en markdown o plantillas con secciones de preview para el catálogo público.",
    createGuideCta: "Crear primera guía",
    createTemplateCta: "Crear primera plantilla",
    filteredTitle: "Sin resultados",
    filteredDescription:
      "Probá con otros filtros o limpiá la búsqueda para ver todos los recursos.",
    clearFilters: "Limpiar filtros",
    hints: [
      "Guías en markdown",
      "Plantillas con secciones",
      "Disponibilidad y destacados",
    ] as const,
  },
} as const;
