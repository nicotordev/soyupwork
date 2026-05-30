import type { LessonType } from "@/generated/prisma/client";

import { CERTIFICATE_COPY } from "@/constants/certificate.constants";

export const COURSE_PAGE = {
  dashboardEyebrow: "Mis cursos",
  dashboardTitle: "Cursos",
  dashboardDescription: "Continúa donde lo dejaste.",
  continueLabel: "Continuar curso",
  startLabel: "Empezar curso",
  syllabusTitle: "Temario del curso",
  previewLessonBadge: "Vista previa",
  lockedLessonLabel: "Bloqueada",
  lockedLessonSequential: "Completa la lección anterior para desbloquear esta.",
  lockedLessonTitle: "Lección bloqueada",
  lockedLessonBack: "Ir a tu lección actual",
  markLessonComplete: "Marcar como completada",
  lessonCompleted: "Lección completada",
  lessonCompleteContinue: "Siguiente lección",
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
  videoAiPanelTitle: "Asistente del vídeo",
  videoAiPanelEmpty:
    "El resumen con IA estará disponible pronto. Podrás pedir explicaciones, ejemplos y repasos del contenido.",
  videoAiDemoNotice:
    "Vista de demostración — las respuestas reales llegarán en una próxima versión.",
  videoAiAskPlaceholder: "Pregunta sobre esta lección…",
  videoAiAskSoon: "Próximamente",
  videoAiHighlightsTitle: "Puntos clave",
  videoAiSuggestedTitle: "Preguntas sugeridas",
  videoPublishedRecently: "Publicado recientemente",
  videoCommentsTitle: "Comentarios de la lección",
  videoCommentsEmpty: "Sé el primero en comentar esta lección.",
  videoCommentsPlaceholder: "Escribe un comentario…",
  videoCommentsSubmitSoon: "Próximamente",
  videoCommentDelete: "Eliminar",
  videoCommentDeleteTitle: "¿Eliminar comentario?",
  videoCommentDeleteDescription:
    "Las respuestas también se borrarán. Esta acción no se puede deshacer.",
  videoCommentDeleteCancel: "Cancelar",
  videoCommentDeleteConfirm: "Eliminar",
  videoCommentDeleted: "Comentario eliminado.",
  lessonBookmarkSave: "Guardar lección",
  lessonBookmarkSaved: "Lección guardada en tus marcadores.",
  lessonBookmarkRemoved: "Lección quitada de tus marcadores.",
  lessonBookmarkSavedLabel: "Guardada",
} as const;

/** Author id for comments created in public demo (local state only). */
export const DEMO_LESSON_COMMENT_AUTHOR_ID = "demo-local-author";

export const ADMIN_COURSE_PREVIEW_PAGE = {
  bannerTitle: "Vista previa de administrador",
  bannerDescription:
    "Así verán el curso los alumnos. No visible en el catálogo si está en borrador.",
  backToEditor: "Volver al editor",
} as const;

export const PUBLIC_DEMO_PAGE = {
  bannerTitle: "Demostración en vivo",
  bannerDescription:
    "Explorá el curso como lo verías en producción. Los quizzes no guardan intentos. Puede ser contenido de ejemplo.",
  backToHome: "Volver al inicio",
  waitlistCta: "Unirme a la lista",
} as const;

export const LESSON_TYPE_ICONS_LABEL: Record<LessonType, string> = {
  VIDEO: "Vídeo",
  TEXT: "Texto",
  QUIZ: "Quiz",
  DOWNLOAD: "Descarga",
};
