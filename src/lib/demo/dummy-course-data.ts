import { DEMO_DUMMY_COURSE_ID } from "@/lib/demo/demo-constants";
import type { CoursePageData } from "@/types/course-page.types";

const DUMMY_LESSON_VIDEO = "bienvenida";
const DUMMY_LESSON_TEXT = "lectura-job";
const DUMMY_LESSON_QUIZ = "quiz-connects";

export function getDummyCoursePageData(): CoursePageData {
  const modules = [
    {
      id: "demo-mod-1",
      title: "Fundamentos",
      description: "",
      position: 0,
      lessons: [
        {
          id: "demo-lesson-video",
          slug: DUMMY_LESSON_VIDEO,
          title: "Bienvenida al curso",
          description: "Qué vas a aprender y cómo está organizado el programa.",
          type: "VIDEO" as const,
          position: 0,
          isPreview: true,
          durationSec: 480,
          videoPlaybackId: null,
          videoStatus: "READY" as const,
          content: "",
          quiz: null,
          isAccessible: true,
        },
        {
          id: "demo-lesson-text",
          slug: DUMMY_LESSON_TEXT,
          title: "Cómo leer un job post",
          description: "Señales verdes y rojas antes de gastar Connects.",
          type: "TEXT" as const,
          position: 1,
          isPreview: true,
          durationSec: null,
          videoPlaybackId: null,
          videoStatus: null,
          content: `## Qué mirar antes de gastar Connects

1. **Fit real** — ¿Puedes entregar lo que piden en el plazo?
2. **Señales del cliente** — historial, presupuesto, claridad del brief.
3. **Competencia** — propuestas enviadas vs. entrevistas invitadas.

> Regla práctica: si no puedes escribir una propuesta específica en 5 minutos, probablemente no es tu proyecto.

### Ejercicio

Abre un job post de tu nicho y anota 3 señales verdes y 2 rojas antes de aplicar.`,
          quiz: null,
          isAccessible: true,
        },
        {
          id: "demo-lesson-quiz",
          slug: DUMMY_LESSON_QUIZ,
          title: "Quiz: priorizar proyectos",
          description: "Valida criterios para elegir a qué jobs aplicar.",
          type: "QUIZ" as const,
          position: 2,
          isPreview: true,
          durationSec: null,
          videoPlaybackId: null,
          videoStatus: null,
          content: "",
          quiz: {
            id: "demo-quiz-1",
            title: "Priorizar proyectos en Upwork",
            passingScore: 70,
            questionCount: 3,
          },
          isAccessible: true,
        },
      ],
    },
    {
      id: "demo-mod-2",
      title: "Propuestas",
      description: "",
      position: 1,
      lessons: [
        {
          id: "demo-lesson-locked-1",
          slug: "estructura-propuesta",
          title: "Estructura de propuesta corta",
          description: "",
          type: "VIDEO" as const,
          position: 0,
          isPreview: false,
          durationSec: 600,
          videoPlaybackId: null,
          videoStatus: null,
          content: "",
          quiz: null,
          isAccessible: true,
        },
        {
          id: "demo-lesson-locked-2",
          slug: "casos-reales",
          title: "3 propuestas comentadas",
          description: "",
          type: "TEXT" as const,
          position: 1,
          isPreview: false,
          durationSec: null,
          videoPlaybackId: null,
          videoStatus: null,
          content: "",
          quiz: null,
          isAccessible: true,
        },
      ],
    },
  ];

  const lessonCount = modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );

  return {
    mode: "publicDemo",
    view: {
      id: DEMO_DUMMY_COURSE_ID,
      slug: "demo",
      title: "Propuestas que convierten en Upwork",
      description:
        "Curso de demostración con lecciones de ejemplo: vídeo, texto y quiz interactivo. Así se ve soyup.work en producción.",
      thumbnailUrl: "/img/home/hero.webp",
      status: "PUBLISHED",
      level: "INTERMEDIATE",
      levelLabel: "Intermedio",
      priceLabel: "$49 USD",
      priceCents: 4900,
      isFree: false,
      categoryName: "Connects y propuestas",
      instructorName: "María G. · Freelancer",
      moduleCount: modules.length,
      lessonCount,
      offersCertificate: true,
      hasFullAccess: true,
      modules,
      muxConfigured: false,
      muxStreamingEnabled: false,
      firstLessonSlug: DUMMY_LESSON_VIDEO,
    },
  };
}

export function getDummyDemoLessonIds() {
  return {
    video: "demo-lesson-video",
    text: "demo-lesson-text",
    quiz: "demo-lesson-quiz",
  } as const;
}
