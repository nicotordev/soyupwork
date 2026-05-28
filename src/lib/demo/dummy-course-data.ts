import { DEMO_DUMMY_COURSE_ID } from "@/lib/demo/demo-constants";
import type { CoursePageData } from "@/types/course-page.types";

const DUMMY_LESSON_VIDEO = "bienvenida";
const DUMMY_LESSON_TEXT = "lectura-job";
const DUMMY_LESSON_QUIZ = "quiz-connects";
const DUMMY_LESSON_QUIZ_RETAINERS = "mini-quiz-retainers";

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
          content: `## Caso 1: Proyecto con alcance claro

**Contexto:** cliente con historial, brief detallado y presupuesto medio.

### Apertura sugerida

Hola, revisé que necesitas [resultado específico].
Ya implementé algo similar en [nicho/proyecto], y en 2 fases podemos tener una primera entrega en 72 horas.

### Qué funciona en esta propuesta

- Menciona el resultado, no tu bio.
- Propone un plan corto (fases + tiempos).
- Reduce incertidumbre con un siguiente paso claro.

### Error común

Hablar demasiado de "años de experiencia" sin conectarlo al problema actual.

---

## Caso 2: Proyecto urgente con poca info

**Contexto:** cliente necesita resolver hoy, pero el brief es ambiguo.

### Estrategia

1. Confirma el objetivo principal.
2. Pide 2 datos críticos para estimar.
3. Ofrece una versión inicial de alcance acotado.

### Plantilla rápida

Para no hacerte perder tiempo, te propongo resolver primero **[bloque crítico]** hoy, y luego iteramos sobre **[bloque secundario]**.

---

## Caso 3: Proyecto de largo plazo

**Contexto:** cliente busca soporte continuo y no solo una tarea.

### Enfoque recomendado

- Presenta un mini roadmap de 30 días.
- Define métricas de éxito (velocidad, calidad, impacto).
- Abre la conversación hacia retainer sin forzar cierre.

### Ejercicio

Toma un job real y escribe 3 versiones de apertura:

- una orientada a urgencia,
- una orientada a calidad,
- una orientada a continuidad.`,
          quiz: null,
          isAccessible: true,
        },
      ],
    },
    {
      id: "demo-mod-3",
      title: "Entrevistas y cierre",
      description: "",
      position: 2,
      lessons: [
        {
          id: "demo-lesson-interview-1",
          slug: "guion-entrevista",
          title: "Guion base para entrevistas",
          description:
            "Cómo conducir la llamada para vender sin sonar robótico.",
          type: "VIDEO" as const,
          position: 0,
          isPreview: false,
          durationSec: 720,
          videoPlaybackId: null,
          videoStatus: null,
          content: "",
          quiz: null,
          isAccessible: true,
        },
        {
          id: "demo-lesson-interview-2",
          slug: "objeciones-frecuentes",
          title: "Objeciones frecuentes y respuestas",
          description:
            "Responde dudas de precio, tiempos y experiencia con claridad.",
          type: "TEXT" as const,
          position: 1,
          isPreview: false,
          durationSec: null,
          videoPlaybackId: null,
          videoStatus: null,
          content: `## Objeciones frecuentes en entrevistas

Cuando un cliente objeta, normalmente no rechaza tu servicio: **está reduciendo riesgo**.

## 1) "Está fuera de presupuesto"

### Respuesta marco

Entiendo. Para mantener impacto sin comprometer calidad, podemos priorizar **[fase crítica]** ahora y mover **[fase opcional]** a una segunda etapa.

### Clave

- No regales precio de inmediato.
- Reencuadra por valor y alcance.

## 2) "No sé si eres el perfil correcto"

### Respuesta marco

Totalmente válido. Para que lo evalúes con evidencia, te propongo un primer entregable pequeño en 48h con criterios claros de éxito.

### Clave

- Usa prueba de trabajo.
- Acorta tiempo de decisión.

## 3) "Necesito pensarlo"

### Respuesta marco

Perfecto. Te dejo por escrito alcance, tiempos y riesgos para que compares con claridad.
Si te sirve, mañana revisamos 10 minutos solo para resolver dudas.

## Checklist antes de responder objeciones

- ¿Entendí la objeción real o solo la superficial?
- ¿Estoy defendiendo precio o explicando impacto?
- ¿Estoy dando una salida fácil al cliente?

## Mini práctica

Escribe 1 respuesta por cada objeción con tu nicho real y léelas en voz alta para mejorar naturalidad.`,
          quiz: null,
          isAccessible: true,
        },
        {
          id: "demo-lesson-interview-3",
          slug: "checklist-cierre",
          title: "Checklist de cierre y siguiente paso",
          description:
            "Plantilla para cerrar acuerdos y activar onboarding rápido.",
          type: "DOWNLOAD" as const,
          position: 2,
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
    {
      id: "demo-mod-4",
      title: "Entrega y retención",
      description: "",
      position: 3,
      lessons: [
        {
          id: "demo-lesson-retention-1",
          slug: "onboarding-cliente",
          title: "Onboarding del cliente en 15 minutos",
          description: "Define expectativas desde el primer mensaje.",
          type: "VIDEO" as const,
          position: 0,
          isPreview: false,
          durationSec: 540,
          videoPlaybackId: null,
          videoStatus: null,
          content: "",
          quiz: null,
          isAccessible: true,
        },
        {
          id: "demo-lesson-retention-2",
          slug: "sistema-seguimiento",
          title: "Sistema semanal de seguimiento",
          description:
            "Formato simple para avances, bloqueos y próximos pasos.",
          type: "TEXT" as const,
          position: 1,
          isPreview: false,
          durationSec: null,
          videoPlaybackId: null,
          videoStatus: null,
          content: `## Sistema semanal de seguimiento (simple y efectivo)

Objetivo: mantener al cliente alineado, reducir fricción y detectar oportunidades de expansión.

## Estructura recomendada (cada semana)

### 1. Avances

- Qué se completó.
- Qué impacto tuvo (métrica o evidencia).

### 2. Bloqueos

- Qué está frenando progreso.
- Qué decisión necesitas del cliente.

### 3. Próximos pasos

- 2 a 4 acciones concretas.
- Fechas y responsables.

### 4. Riesgos y mitigación

- Riesgo principal de la semana.
- Acción preventiva propuesta.

## Plantilla rápida para enviar

Hola [Nombre], te comparto update semanal:

- **Avances:** ...
- **Impacto observado:** ...
- **Bloqueos:** ...
- **Próximos pasos:** ...
- **Riesgo principal:** ...

Si estás de acuerdo, ejecuto este plan y te envío corte el [día].

## Señales de que ya puedes proponer retainer

- El cliente depende de tu continuidad.
- Hay backlog recurrente.
- Ya existe confianza por resultados medibles.

## Ejercicio aplicado

Prepara tu próximo update semanal con esta plantilla y añade una propuesta de mejora para la siguiente semana.`,
          quiz: null,
          isAccessible: true,
        },
        {
          id: "demo-lesson-retention-3",
          slug: DUMMY_LESSON_QUIZ_RETAINERS,
          title: "Mini quiz: pasar a retainers",
          description: "Evalúa cuándo y cómo ofrecer continuidad mensual.",
          type: "QUIZ" as const,
          position: 2,
          isPreview: false,
          durationSec: null,
          videoPlaybackId: null,
          videoStatus: null,
          content: "",
          quiz: {
            id: "demo-quiz-2",
            title: "Retainers y expansión de cuenta",
            passingScore: 70,
            questionCount: 4,
          },
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
        "Curso de demostración con lecciones de ejemplo: vídeo, texto y quiz interactivo.",
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
      estimatedDurationHours: 6,
      enrolledStudentCount: 124,
      reviewCount: 2,
      averageRating: 4.8,
      offersCertificate: true,
      hasFullAccess: true,
      modules,
      reviews: [
        {
          id: "demo-review-1",
          rating: 5,
          headline: "Subí mi tasa de respuesta en 3 semanas",
          comment:
            "Pasé de enviar propuestas genéricas a tener una estructura clara por nicho.",
          displayName: "Camila R.",
          niche: "Frontend",
          countryCode: "CL",
          metricBefore: "2% respuesta",
          metricAfter: "14% respuesta",
          createdAt: new Date().toISOString(),
        },
        {
          id: "demo-review-2",
          rating: 4,
          headline: "Más orden para vender mejor",
          comment:
            "El módulo de procesos me ayudó a dejar de improvisar y cerrar entrevistas.",
          displayName: "Javier M.",
          niche: "Video Editing",
          countryCode: "MX",
          metricBefore: "0 entrevistas",
          metricAfter: "3 entrevistas/mes",
          createdAt: new Date().toISOString(),
        },
      ],
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
    quizRetainers: "demo-lesson-retention-3",
  } as const;
}
