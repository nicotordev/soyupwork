export const COURSES_PAGE = {
  eyebrow: "Gestión de contenido",
  title: "Cursos",
  description:
    "Crea, publica y organiza cursos, módulos y lecciones desde un solo lugar.",
} as const;

export const COURSE_STATUS_LABELS = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
} as const;

export type CourseStatusKey = keyof typeof COURSE_STATUS_LABELS;

export const COURSE_STATUS_VARIANTS = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "outline",
} as const satisfies Record<
  CourseStatusKey,
  "default" | "secondary" | "outline" | "destructive"
>;

export const ADMIN_COURSES_FILTER_ALL = "all" as const;

export const ADMIN_COURSES_STATUS_FILTER_OPTIONS = [
  { value: ADMIN_COURSES_FILTER_ALL, label: "Todos los estados" },
  { value: "PUBLISHED", label: COURSE_STATUS_LABELS.PUBLISHED },
  { value: "DRAFT", label: COURSE_STATUS_LABELS.DRAFT },
  { value: "ARCHIVED", label: COURSE_STATUS_LABELS.ARCHIVED },
] as const;

export const ADMIN_COURSES_LEVEL_FILTER_OPTIONS = [
  { value: ADMIN_COURSES_FILTER_ALL, label: "Todos los niveles" },
  { value: "BEGINNER", label: "Principiante" },
  { value: "INTERMEDIATE", label: "Intermedio" },
  { value: "ADVANCED", label: "Avanzado" },
] as const;
