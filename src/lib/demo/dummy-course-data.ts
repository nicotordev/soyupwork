import {
  DEMO_DUMMY_COURSE_ID,
  MUX_PUBLIC_SAMPLE_PLAYBACK_ID,
} from "@/lib/demo/demo-constants";
import {
  applySequentialLessonAccess,
  findFirstAccessibleLessonSlug,
} from "@/lib/course/sequential-lesson-access";
import type {
  CoursePageData,
  CoursePageLesson,
  CoursePageLessonComment,
  CoursePageModule,
  CoursePageVideoAiInsight,
} from "@/types/course-page.types";

const DUMMY_LESSON_VIDEO = "bienvenida";
const DUMMY_LESSON_TEXT = "lectura-job";
const DUMMY_LESSON_VIDEO_2 = "estructura-propuesta";
const DUMMY_LESSON_CHECKLIST = "checklist-perfil";
const DUMMY_LESSON_QUIZ = "quiz-connects";

const DEMO_VIDEO_PLAYBACK_IDS = {
  welcome:
    process.env.DEMO_VIDEO_WELCOME_PLAYBACK_ID ??
    process.env.DEMO_VIDEO_PLAYBACK_ID ??
    MUX_PUBLIC_SAMPLE_PLAYBACK_ID,
  proposal:
    process.env.DEMO_VIDEO_PROPOSAL_STRUCTURE_PLAYBACK_ID ??
    process.env.DEMO_VIDEO_JOB_SELECTION_PLAYBACK_ID ??
    MUX_PUBLIC_SAMPLE_PLAYBACK_ID,
} as const;

type VideoKey = keyof typeof DEMO_VIDEO_PLAYBACK_IDS;

function videoStatusFor(playbackId: string | null): "READY" | null {
  return playbackId ? "READY" : null;
}

const DEMO_VIDEO_ENGAGEMENT: Record<
  VideoKey,
  {
    videoAiInsight: CoursePageVideoAiInsight;
    comments: CoursePageLessonComment[];
  }
> = {
  welcome: {
    videoAiInsight: {
      summary:
        "Recorrido rápido: verás vídeo, lectura, checklist y un test corto como en un curso real de soyup.work.",
      highlights: [
        "Cada lección desbloquea la siguiente.",
        "Los quizzes no guardan intentos en la demo.",
        "En producción tendrías progreso, certificado y más módulos.",
      ],
      suggestedPrompts: [
        "¿Qué incluye la versión completa del curso?",
        "Resume esta demo en 3 pasos.",
      ],
    },
    comments: [
      {
        id: "demo-comment-welcome-1",
        authorId: "demo-seed",
        authorName: "María G.",
        authorImageUrl: null,
        body: "¿La demo muestra cómo se ve el curso completo?",
        createdAt: "2026-05-27T14:20:00.000Z",
        parentId: null,
        replies: [],
      },
    ],
  },
  proposal: {
    videoAiInsight: {
      summary:
        "Una propuesta corta usa cinco bloques: contexto, diagnóstico, plan, evidencia y pregunta.",
      highlights: [
        "Demuestra que leíste el brief en la primera línea.",
        "Propón fases acotadas para reducir riesgo.",
        "Cierra con una pregunta que invite a responder.",
      ],
      suggestedPrompts: [
        "¿Cuántas líneas debería tener una propuesta?",
        "Dame un ejemplo de cierre con pregunta.",
      ],
    },
    comments: [],
  },
};

function makeVideoLesson(input: {
  id: string;
  slug: string;
  title: string;
  description: string;
  position: number;
  durationSec: number;
  isPreview?: boolean;
  videoKey: VideoKey;
  content?: string;
}): CoursePageLesson {
  const videoPlaybackId = DEMO_VIDEO_PLAYBACK_IDS[input.videoKey];
  const engagement = DEMO_VIDEO_ENGAGEMENT[input.videoKey];

  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    description: input.description,
    type: "VIDEO",
    position: input.position,
    isPreview: input.isPreview ?? false,
    durationSec: input.durationSec,
    videoPlaybackId,
    videoStatus: videoStatusFor(videoPlaybackId),
    content: input.content ?? "",
    quiz: null,
    isAccessible: true,
    isCompleted: false,
    isBookmarked: false,
    videoAiInsight: engagement.videoAiInsight,
    comments: engagement.comments,
    videoPublishedAt: "2026-05-20T12:00:00.000Z",
    videoAuthorName: "Equipo SoyUpwork",
  };
}

function makeTextLesson(input: {
  id: string;
  slug: string;
  title: string;
  description: string;
  position: number;
  isPreview?: boolean;
  content: string;
}): CoursePageLesson {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    description: input.description,
    type: "TEXT",
    position: input.position,
    isPreview: input.isPreview ?? false,
    durationSec: null,
    videoPlaybackId: null,
    videoStatus: null,
    videoPublishedAt: null,
    videoAuthorName: null,
    content: input.content,
    quiz: null,
    isAccessible: true,
    isCompleted: false,
    isBookmarked: false,
    videoAiInsight: null,
    comments: [],
  };
}

function makeDownloadLesson(input: {
  id: string;
  slug: string;
  title: string;
  description: string;
  position: number;
  content: string;
}): CoursePageLesson {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    description: input.description,
    type: "DOWNLOAD",
    position: input.position,
    isPreview: false,
    durationSec: null,
    videoPlaybackId: null,
    videoStatus: null,
    videoPublishedAt: null,
    videoAuthorName: null,
    content: input.content,
    quiz: null,
    isAccessible: true,
    isCompleted: false,
    isBookmarked: false,
    videoAiInsight: null,
    comments: [],
  };
}

function makeQuizLesson(input: {
  id: string;
  slug: string;
  title: string;
  description: string;
  position: number;
  isPreview?: boolean;
  quiz: {
    id: string;
    title: string;
    passingScore: number;
    questionCount: number;
  };
}): CoursePageLesson {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    description: input.description,
    type: "QUIZ",
    position: input.position,
    isPreview: input.isPreview ?? false,
    durationSec: null,
    videoPlaybackId: null,
    videoStatus: null,
    videoPublishedAt: null,
    videoAuthorName: null,
    content: "",
    quiz: input.quiz,
    isAccessible: true,
    isCompleted: false,
    isBookmarked: false,
    videoAiInsight: null,
    comments: [],
  };
}

export function getDummyCoursePageData(
  completedLessonIds: ReadonlySet<string> = new Set(),
): CoursePageData {
  const modules: CoursePageModule[] = [
    {
      id: "demo-mod-1",
      title: "Recorrido demo",
      description:
        "Cinco lecciones para ver cómo se siente un curso real: vídeo, texto, checklist y test.",
      position: 0,
      lessons: [
        makeVideoLesson({
          id: "demo-lesson-video",
          slug: DUMMY_LESSON_VIDEO,
          title: "Bienvenida: qué vas a ver",
          description:
            "Tour rápido de la plataforma y del flujo de aprendizaje en soyup.work.",
          position: 0,
          isPreview: true,
          durationSec: 300,
          videoKey: "welcome",
        }),
        makeTextLesson({
          id: "demo-lesson-text",
          slug: DUMMY_LESSON_TEXT,
          title: "Cómo leer un job post",
          description: "Señales verdes y rojas antes de gastar Connects.",
          position: 1,
          isPreview: true,
          content: `## Qué mirar en 3 minutos

La meta no es aplicar más. Es aplicar donde tu probabilidad de conversación justifica el costo.

### Fit real

- ¿Puedes entregar el resultado principal sin aprender desde cero?
- ¿Tienes un ejemplo o proceso que reduzca riesgo?
- ¿El plazo y presupuesto permiten una entrega decente?

### Señales verdes

- Historial de pagos verificado.
- Brief con entregables o contexto de negocio.
- Reviews que mencionan comunicación.

### Señales rojas

- Alcance enorme con presupuesto irreal.
- Brief copiado o sin objetivo claro.
- Muchas propuestas y cero entrevistas.

> Si no puedes escribir una apertura específica en 5 minutos, probablemente no es tu proyecto.`,
        }),
        makeVideoLesson({
          id: "demo-lesson-video-2",
          slug: DUMMY_LESSON_VIDEO_2,
          title: "Propuesta corta en 5 bloques",
          description:
            "Contexto, diagnóstico, plan, evidencia y pregunta — sin plantillas genéricas.",
          position: 2,
          durationSec: 360,
          videoKey: "proposal",
        }),
        makeDownloadLesson({
          id: "demo-lesson-checklist",
          slug: DUMMY_LESSON_CHECKLIST,
          title: "Checklist antes de aplicar",
          description:
            "Lista rápida para validar perfil, job y propuesta antes de gastar Connects.",
          position: 3,
          content: `## Checklist express

### Perfil

- [ ] El título comunica servicio + resultado.
- [ ] La primera línea del overview habla del problema del cliente.
- [ ] Tienes 2–3 piezas de portfolio alineadas al nicho.

### Job

- [ ] Fit claro con tu oferta.
- [ ] Cliente con señales de confianza o brief detallado.
- [ ] Puedes escribir una apertura específica en menos de 5 minutos.

### Propuesta

- [ ] Primera línea demuestra que leíste el brief.
- [ ] Plan en fases o entregables acotados.
- [ ] Cierre con pregunta que invite a responder.`,
        }),
        makeQuizLesson({
          id: "demo-lesson-quiz",
          slug: DUMMY_LESSON_QUIZ,
          title: "Test: priorizar proyectos",
          description: "Valida criterios para elegir a qué jobs aplicar.",
          position: 4,
          isPreview: true,
          quiz: {
            id: "demo-quiz-1",
            title: "Priorizar proyectos en Upwork",
            passingScore: 70,
            questionCount: 3,
          },
        }),
      ],
    },
  ];

  const lessonCount = modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );

  const sequentialModules = applySequentialLessonAccess(modules, {
    hasFullAccess: true,
    completedLessonIds,
    bookmarkedLessonIds: new Set(),
    enforceSequential: true,
  });

  return {
    mode: "publicDemo",
    view: {
      id: DEMO_DUMMY_COURSE_ID,
      slug: "demo",
      title: "Demo: aprende a vender en Upwork",
      description:
        "Recorrido corto con vídeo, lectura, checklist y test — así se ve un curso en soyup.work.",
      thumbnailUrl: "/img/home/hero.webp",
      status: "PUBLISHED",
      level: "INTERMEDIATE",
      levelLabel: "Intermedio",
      priceLabel: "$49 USD",
      priceCents: 4900,
      isFree: false,
      categoryName: "Upwork y ventas freelance",
      instructorName: "María González · Consultora freelance",
      moduleCount: modules.length,
      lessonCount,
      estimatedDurationHours: 1,
      enrolledStudentCount: 386,
      reviewCount: 4,
      averageRating: 4.8,
      offersCertificate: true,
      hasFullAccess: true,
      modules: sequentialModules,
      reviews: [
        {
          id: "demo-review-1",
          rating: 5,
          headline: "Subí mi tasa de respuesta en 3 semanas",
          comment:
            "Dejé de enviar propuestas genéricas y empecé a filtrar jobs con más criterio. El cambio más grande fue escribir primeras líneas específicas.",
          displayName: "Camila R.",
          niche: "Frontend",
          countryCode: "CL",
          metricBefore: "2% respuesta",
          metricAfter: "14% respuesta",
          createdAt: "2026-04-11T10:00:00.000Z",
        },
        {
          id: "demo-review-2",
          rating: 5,
          headline: "Cerré mi primer contrato de largo plazo",
          comment:
            "El módulo de entrevistas me ayudó a ordenar la llamada y proponer una primera fase sin regalar trabajo.",
          displayName: "Valentina P.",
          niche: "No-code Automation",
          countryCode: "AR",
          metricBefore: "1 contrato puntual",
          metricAfter: "retainer mensual",
          createdAt: "2026-04-24T10:00:00.000Z",
        },
        {
          id: "demo-review-3",
          rating: 4,
          headline: "Más orden para vender mejor",
          comment:
            "La matriz de priorización me ayudó a dejar de gastar Connects en jobs que no tenían buen fit.",
          displayName: "Javier M.",
          niche: "Video Editing",
          countryCode: "MX",
          metricBefore: "0 entrevistas",
          metricAfter: "3 entrevistas/mes",
          createdAt: "2026-05-03T10:00:00.000Z",
        },
        {
          id: "demo-review-4",
          rating: 5,
          headline: "Mejoré mi perfil y mis mensajes",
          comment:
            "Antes mi perfil era una lista de habilidades. Ahora comunica una oferta clara y las propuestas son más fáciles de escribir.",
          displayName: "Diego S.",
          niche: "Shopify",
          countryCode: "CO",
          metricBefore: "perfil genérico",
          metricAfter: "oferta por nicho",
          createdAt: "2026-05-18T10:00:00.000Z",
        },
      ],
      muxConfigured: true,
      muxStreamingEnabled: true,
      firstLessonSlug:
        findFirstAccessibleLessonSlug(sequentialModules) ?? DUMMY_LESSON_VIDEO,
    },
  };
}

export function getDummyDemoLessonIds() {
  return {
    video: "demo-lesson-video",
    text: "demo-lesson-text",
    video2: "demo-lesson-video-2",
    checklist: "demo-lesson-checklist",
    quiz: "demo-lesson-quiz",
  } as const;
}
