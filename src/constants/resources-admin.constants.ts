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

export const RESOURCE_KIND = {
  GUIDE: "GUIDE",
  TEMPLATE: "TEMPLATE",
} as const;

export type ResourceKindValue =
  (typeof RESOURCE_KIND)[keyof typeof RESOURCE_KIND];

export const RESOURCE_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type ResourceStatusValue =
  (typeof RESOURCE_STATUS)[keyof typeof RESOURCE_STATUS];

export const RESOURCE_AVAILABILITY = {
  AVAILABLE: "AVAILABLE",
  COMING_SOON: "COMING_SOON",
  COURSE: "COURSE",
} as const;

export type ResourceAvailabilityValue =
  (typeof RESOURCE_AVAILABILITY)[keyof typeof RESOURCE_AVAILABILITY];

export const RESOURCE_STATUS_LABELS: Record<ResourceStatusValue, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
};

export const RESOURCE_AVAILABILITY_LABELS: Record<
  ResourceAvailabilityValue,
  string
> = {
  AVAILABLE: "Disponible",
  COMING_SOON: "Próximamente",
  COURSE: "En curso",
};

export const ADMIN_RESOURCES_STATUS_FILTER_OPTIONS = [
  { value: ADMIN_RESOURCES_FILTER_ALL, label: "Todos los estados" },
  { value: RESOURCE_STATUS.DRAFT, label: RESOURCE_STATUS_LABELS.DRAFT },
  {
    value: RESOURCE_STATUS.PUBLISHED,
    label: RESOURCE_STATUS_LABELS.PUBLISHED,
  },
  { value: RESOURCE_STATUS.ARCHIVED, label: RESOURCE_STATUS_LABELS.ARCHIVED },
] as const;

export const ADMIN_RESOURCES_AVAILABILITY_OPTIONS = [
  RESOURCE_AVAILABILITY.AVAILABLE,
  RESOURCE_AVAILABILITY.COMING_SOON,
  RESOURCE_AVAILABILITY.COURSE,
] as const;

export const ADMIN_RESOURCES_KIND_TABS = [
  { value: ADMIN_RESOURCES_KIND_GUIDE, label: "Guías" },
  { value: ADMIN_RESOURCES_KIND_TEMPLATE, label: "Plantillas" },
] as const;

export function resourceKindValueToAdminParam(
  kind: ResourceKindValue,
): AdminResourcesKindParam {
  return kind === RESOURCE_KIND.GUIDE
    ? ADMIN_RESOURCES_KIND_GUIDE
    : ADMIN_RESOURCES_KIND_TEMPLATE;
}

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
