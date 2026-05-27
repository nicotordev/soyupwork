export const ADMIN_COURSES_PAGE = {
  eyebrow: "Gestión de contenido",
  title: "Cursos",
  description:
    "Crea, publica y organiza cursos, módulos y lecciones desde un solo lugar.",
  thumbnailLabel: "Imagen del curso",
  thumbnailHint: "JPG, PNG o WebP. Recomendado 16:9, mín. 1280×720 px.",
  thumbnailUploadLabel: "Subir imagen",
  thumbnailReplaceLabel: "Cambiar imagen",
  thumbnailRemoveLabel: "Quitar imagen",
  thumbnailStorageMissing:
    "Configura R2 en variables de entorno o en Ajustes → Almacenamiento para subir imágenes.",
} as const;

export const ADMIN_COURSE_STATUS_LABELS = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
} as const;

export type AdminCourseStatusKey = keyof typeof ADMIN_COURSE_STATUS_LABELS;

export const ADMIN_COURSE_STATUS_VARIANTS = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "outline",
} as const satisfies Record<
  AdminCourseStatusKey,
  "default" | "secondary" | "outline" | "destructive"
>;

export const ADMIN_COURSES_FILTER_ALL = "all" as const;

export const ADMIN_COURSES_DEFAULT_PAGE = 1;
export const ADMIN_COURSES_DEFAULT_PAGE_SIZE = 20;
export const ADMIN_COURSES_MAX_PAGE_SIZE = 50;

export const ADMIN_COURSES_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export const ADMIN_COURSES_STATUS_FILTER_OPTIONS = [
  { value: ADMIN_COURSES_FILTER_ALL, label: "Todos los estados" },
  { value: "PUBLISHED", label: ADMIN_COURSE_STATUS_LABELS.PUBLISHED },
  { value: "DRAFT", label: ADMIN_COURSE_STATUS_LABELS.DRAFT },
  { value: "ARCHIVED", label: ADMIN_COURSE_STATUS_LABELS.ARCHIVED },
] as const;

export const ADMIN_COURSES_LEVEL_FILTER_OPTIONS = [
  { value: ADMIN_COURSES_FILTER_ALL, label: "Todos los niveles" },
  { value: "BEGINNER", label: "Principiante" },
  { value: "INTERMEDIATE", label: "Intermedio" },
  { value: "ADVANCED", label: "Avanzado" },
] as const;
