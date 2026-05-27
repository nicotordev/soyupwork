import type { LessonType, LessonVideoStatus } from "@/generated/prisma/client";

export const ADMIN_CURRICULUM_PAGE = {
  eyebrow: "Contenido del curso",
  backLabel: "Volver a cursos",
  addModuleLabel: "Nuevo módulo",
  addLessonLabel: "Nueva lección",
  addQuizLessonLabel: "Nueva lección (quiz)",
  previewLabel: "Vista previa",
  previewOpenHint: "Abre la vista previa del curso en una pestaña nueva",
  quizEditorTitle: "Editor de quiz",
  quizSaveLabel: "Guardar quiz",
  quizPassingScoreLabel: "Nota mínima para aprobar (%)",
  quizAddQuestionLabel: "Añadir pregunta",
  quizAddOptionLabel: "Añadir opción",
  quizCorrectOptionLabel: "Correcta",
  quizQuestionsSummary: (count: number) =>
    count === 1 ? "1 pregunta" : `${count} preguntas`,
  quizTypeChangeConfirm:
    "Se eliminará el quiz y todas sus preguntas. ¿Continuar?",
  emptyModulesTitle: "Sin módulos",
  emptyModulesDescription:
    "Añade un módulo para organizar las lecciones de este curso.",
} as const;

export const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  VIDEO: "Vídeo",
  TEXT: "Texto",
  QUIZ: "Quiz",
  DOWNLOAD: "Descarga",
};

export const LESSON_TYPES_V1 = [
  "VIDEO",
  "TEXT",
  "QUIZ",
] as const satisfies readonly LessonType[];

export type CurriculumLessonTypeV1 = (typeof LESSON_TYPES_V1)[number];

export const LESSON_VIDEO_STATUS_LABELS: Record<LessonVideoStatus, string> = {
  PENDING: "Procesando",
  READY: "Listo",
  ERRORED: "Error",
  DELETED: "Eliminado",
};

export const LESSON_VIDEO_STATUS_VARIANTS: Record<
  LessonVideoStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  PENDING: "secondary",
  READY: "default",
  ERRORED: "destructive",
  DELETED: "outline",
};
