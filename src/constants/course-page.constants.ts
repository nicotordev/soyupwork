import type { LessonType } from "@/generated/prisma/client";

export const COURSE_PAGE = {
  dashboardEyebrow: "Mis cursos",
  dashboardTitle: "Cursos",
  dashboardDescription: "Continúa donde lo dejaste.",
  continueLabel: "Continuar curso",
  startLabel: "Empezar curso",
  syllabusTitle: "Temario del curso",
  previewLessonBadge: "Vista previa",
  lockedLessonLabel: "Bloqueada",
  backToCourse: "Volver al curso",
  backToCourses: "Mis cursos",
  enrollCta: "Inscríbete para acceder",
  noLessonsYet: "Este curso aún no tiene lecciones publicadas.",
  videoPending: "El vídeo se está procesando. Vuelve en unos minutos.",
  videoError: "Hubo un error al procesar el vídeo.",
  videoUnavailable: "El vídeo no está disponible.",
  muxDisabled: "La reproducción de vídeo está deshabilitada.",
  quizPlaceholderTitle: "Cuestionario",
  quizPlaceholderBody:
    "El cuestionario estará disponible cuando tomes el curso. Aquí verás las preguntas y podrás responderlas.",
  quizPassingScore: (score: number) => `Nota mínima para aprobar: ${score}%`,
  quizQuestionCount: (count: number) =>
    count === 1 ? "1 pregunta" : `${count} preguntas`,
} as const;

export const ADMIN_COURSE_PREVIEW_PAGE = {
  bannerTitle: "Vista previa de administrador",
  bannerDescription:
    "Así verán el curso los alumnos. No visible en el catálogo si está en borrador.",
  backToEditor: "Volver al editor",
} as const;

export const LESSON_TYPE_ICONS_LABEL: Record<LessonType, string> = {
  VIDEO: "Vídeo",
  TEXT: "Texto",
  QUIZ: "Quiz",
  DOWNLOAD: "Descarga",
};
