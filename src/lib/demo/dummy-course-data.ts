import { DEMO_DUMMY_COURSE_ID } from "@/lib/demo/demo-constants";
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
const DUMMY_LESSON_QUIZ = "quiz-connects";
const DUMMY_LESSON_QUIZ_RETAINERS = "mini-quiz-retainers";

const DEMO_VIDEO_PLAYBACK_IDS = {
  welcome:
    process.env.DEMO_VIDEO_WELCOME_PLAYBACK_ID ??
    process.env.DEMO_VIDEO_PLAYBACK_ID ??
    null,
  jobSelection: process.env.DEMO_VIDEO_JOB_SELECTION_PLAYBACK_ID ?? null,
  profileAudit: process.env.DEMO_VIDEO_PROFILE_AUDIT_PLAYBACK_ID ?? null,
  proposalStructure:
    process.env.DEMO_VIDEO_PROPOSAL_STRUCTURE_PLAYBACK_ID ?? null,
  interview: process.env.DEMO_VIDEO_INTERVIEW_PLAYBACK_ID ?? null,
  onboarding: process.env.DEMO_VIDEO_ONBOARDING_PLAYBACK_ID ?? null,
} as const;

type VideoKey = keyof typeof DEMO_VIDEO_PLAYBACK_IDS;

function videoStatusFor(playbackId: string | null): "READY" | null {
  return playbackId ? "READY" : null;
}

const DEMO_VIDEO_ENGAGEMENT: Record<
  VideoKey,
  {
    videoAiInsight: CoursePageVideoAiInsight;
    placeholderComments: CoursePageLessonComment[];
  }
> = {
  welcome: {
    videoAiInsight: {
      summary:
        "Esta lección presenta el mapa del curso: perfil, selección de jobs, propuestas, entrevistas y retención. El objetivo es que uses cada módulo como un sistema, no como vídeos aislados.",
      highlights: [
        "Recorre el curso en orden la primera vez; luego vuelve al módulo que más te cuesta.",
        "Cada bloque termina con ejercicios cortos para aplicar en Upwork.",
        "La meta no es ver todo, sino mejorar una métrica por semana (respuestas, entrevistas, cierres).",
      ],
      suggestedPrompts: [
        "¿Por dónde empiezo si ya tengo perfil pero no recibo respuestas?",
        "Resume el curso en 3 pasos accionables.",
      ],
    },
    placeholderComments: [
      {
        id: "demo-comment-welcome-1",
        authorName: "María G.",
        body: "¿Conviene ver todo el curso antes de aplicar o ir módulo por módulo?",
        createdAt: "2026-05-27T14:20:00.000Z",
      },
      {
        id: "demo-comment-welcome-2",
        authorName: "Diego R.",
        body: "Me ayudó entender que no es solo perfil: también jobs y propuestas.",
        createdAt: "2026-05-26T09:10:00.000Z",
      },
    ],
  },
  profileAudit: {
    videoAiInsight: {
      summary:
        "Aprendes a auditar título, primera línea, portfolio y prueba social antes de gastar Connects. La idea es alinear cada elemento con tu oferta concreta.",
      highlights: [
        "El título debe comunicar resultado, no solo rol técnico.",
        "La primera línea del overview debe reforzar el problema que resuelves.",
        "El portfolio debe mostrar evidencia del nicho que quieres vender.",
      ],
      suggestedPrompts: [
        "¿Qué revisar primero si mi perfil tiene muchas skills genéricas?",
        "Dame un checklist de 5 minutos antes de aplicar.",
      ],
    },
    placeholderComments: [
      {
        id: "demo-comment-profile-1",
        authorName: "Ana L.",
        body: "¿El título en inglés o español si busco clientes de EE.UU.?",
        createdAt: "2026-05-28T11:45:00.000Z",
      },
      {
        id: "demo-comment-profile-2",
        authorName: "Carlos M.",
        body: "Revisé mi overview con el checklist y ya se lee más claro.",
        createdAt: "2026-05-25T16:30:00.000Z",
      },
    ],
  },
  jobSelection: {
    videoAiInsight: {
      summary:
        "La matriz de priorización te ayuda a decidir cuándo aplicar, guardar o descartar un job según fit, cliente y timing. Evita gastar Connects en proyectos donde no puedes escribir una apertura específica en cinco minutos.",
      highlights: [
        "Puntúa fit, cliente y timing antes de aplicar.",
        "Menos de 5 propuestas puede ser oportunidad temprana si el fit es fuerte.",
        "Con 50+ propuestas necesitas prueba social muy alineada o invitación.",
      ],
      suggestedPrompts: [
        "¿Cuándo tiene sentido boostear un job?",
        "¿Cómo priorizo si tengo pocos Connects esta semana?",
      ],
    },
    placeholderComments: [
      {
        id: "demo-comment-jobs-1",
        authorName: "Lucía P.",
        body: "La regla de los 5 minutos para la apertura me ahorró varias aplicaciones malas.",
        createdAt: "2026-05-27T08:00:00.000Z",
      },
      {
        id: "demo-comment-jobs-2",
        authorName: "Tomás V.",
        body: "¿La matriz sirve también para trabajos por hora de largo plazo?",
        createdAt: "2026-05-24T19:15:00.000Z",
      },
    ],
  },
  proposalStructure: {
    videoAiInsight: {
      summary:
        "Una propuesta efectiva en Upwork usa cinco bloques: contexto, diagnóstico, plan, evidencia y pregunta. El vídeo muestra cómo mantenerla corta y orientada al siguiente paso.",
      highlights: [
        "Demuestra que leíste el brief en la primera línea.",
        "Propón fases o entregables acotados para reducir riesgo.",
        "Cierra con una pregunta que invite a responder, no solo a contratar.",
      ],
      suggestedPrompts: [
        "¿Cuántas líneas debería tener una propuesta corta?",
        "Dame un ejemplo de cierre con pregunta.",
      ],
    },
    placeholderComments: [
      {
        id: "demo-comment-proposal-1",
        authorName: "Sofía N.",
        body: "¿El bloque de evidencia puede ser un enlace al portfolio aunque no sea el mismo nicho?",
        createdAt: "2026-05-28T13:20:00.000Z",
      },
      {
        id: "demo-comment-proposal-2",
        authorName: "Javier H.",
        body: "Probé la estructura de 5 bloques y tuve dos respuestas en la misma semana.",
        createdAt: "2026-05-23T10:05:00.000Z",
      },
      {
        id: "demo-comment-proposal-3",
        authorName: "Paula S.",
        body: "¿Conviene adjuntar un Loom en la primera propuesta o esperar a que respondan?",
        createdAt: "2026-05-22T17:40:00.000Z",
      },
    ],
  },
  interview: {
    videoAiInsight: {
      summary:
        "El guion de entrevista te guía para conducir la llamada con claridad: entender el problema, validar alcance y proponer un siguiente paso sin sonar a script genérico.",
      highlights: [
        "Prepara 3 preguntas sobre resultado, riesgos y criterios de éxito.",
        "Responde objeciones reencuadrando valor y alcance, no solo precio.",
        "Cierra con acuerdos escritos: entregables, plazos y qué necesitas del cliente.",
      ],
      suggestedPrompts: [
        "¿Qué preguntar si el brief del job era muy vago?",
        "¿Cómo manejar 'está fuera de presupuesto' sin bajar tarifa de golpe?",
      ],
    },
    placeholderComments: [
      {
        id: "demo-comment-interview-1",
        authorName: "Renata C.",
        body: "¿Grabar la llamada está bien o suena poco profesional?",
        createdAt: "2026-05-27T15:55:00.000Z",
      },
      {
        id: "demo-comment-interview-2",
        authorName: "Mateo F.",
        body: "El cierre por escrito después de la call me salvó un malentendido de alcance.",
        createdAt: "2026-05-26T12:00:00.000Z",
      },
    ],
  },
  onboarding: {
    videoAiInsight: {
      summary:
        "El onboarding en 15 minutos define expectativas, canales y primer entregable desde el primer mensaje post-contrato. Reduce fricción y prepara el terreno para retención o retainer.",
      highlights: [
        "Confirma objetivo, entregables incluidos y excluidos por escrito.",
        "Pide accesos y materiales con plazos claros.",
        "Agenda un check-in corto para la primera semana.",
      ],
      suggestedPrompts: [
        "¿Qué incluir en el primer mensaje tras aceptar el contrato?",
        "¿Cómo proponer continuidad sin presionar?",
      ],
    },
    placeholderComments: [
      {
        id: "demo-comment-onboarding-1",
        authorName: "Valentina T.",
        body: "¿El mismo mensaje sirve para fixed price y por hora?",
        createdAt: "2026-05-28T09:30:00.000Z",
      },
      {
        id: "demo-comment-onboarding-2",
        authorName: "Andrés K.",
        body: "Implementé el check-in semanal y el cliente renovó el segundo mes.",
        createdAt: "2026-05-25T20:10:00.000Z",
      },
    ],
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
    videoAiInsight: engagement.videoAiInsight,
    placeholderComments: engagement.placeholderComments,
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
    content: input.content,
    quiz: null,
    isAccessible: true,
    isCompleted: false,
    videoAiInsight: null,
    placeholderComments: [],
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
    content: input.content,
    quiz: null,
    isAccessible: true,
    isCompleted: false,
    videoAiInsight: null,
    placeholderComments: [],
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
    content: "",
    quiz: input.quiz,
    isAccessible: true,
    isCompleted: false,
    videoAiInsight: null,
    placeholderComments: [],
  };
}

export function getDummyCoursePageData(
  completedLessonIds: ReadonlySet<string> = new Set(),
): CoursePageData {
  const modules: CoursePageModule[] = [
    {
      id: "demo-mod-1",
      title: "Diagnóstico y posicionamiento",
      description:
        "Define un nicho vendible, ajusta tu promesa y evita aplicar a proyectos que no calzan.",
      position: 0,
      lessons: [
        makeVideoLesson({
          id: "demo-lesson-video",
          slug: DUMMY_LESSON_VIDEO,
          title: "Bienvenida y mapa del sistema",
          description:
            "Cómo usar el curso para mejorar perfil, selección de jobs, propuestas, entrevistas y retención.",
          position: 0,
          isPreview: true,
          durationSec: 420,
          videoKey: "welcome",
        }),
        makeTextLesson({
          id: "demo-lesson-positioning-1",
          slug: "nicho-y-oferta",
          title: "Elegir un nicho sin encerrarte",
          description:
            "Convierte habilidades generales en una oferta concreta que un cliente pueda comprar.",
          position: 1,
          isPreview: true,
          content: `## Un nicho vendible no es una etiqueta

En Upwork, "desarrollador frontend" o "editor de video" describe lo que haces, pero no explica por qué un cliente debería responderte. Un nicho útil combina:

- **Cliente objetivo:** SaaS B2B, coaches, e-commerce, agencias, creators, founders.
- **Problema caro:** landing que no convierte, backlog lento, videos sin retención, bugs en checkout.
- **Resultado medible:** más demos agendadas, menor tiempo de carga, entregas semanales, menos retrabajo.

### Fórmula práctica

Ayudo a **[tipo de cliente]** a lograr **[resultado]** mediante **[servicio]**, sin **[dolor que evitas]**.

Ejemplos:

- Ayudo a founders SaaS a lanzar landing pages de adquisición en 7 días con Next.js y analítica básica, sin depender de una agencia.
- Ayudo a creadores B2B a transformar webinars largos en clips de LinkedIn listos para publicar, sin perder el mensaje técnico.
- Ayudo a tiendas Shopify a reducir fricción en checkout con auditoría, fixes priorizados y QA documentado.

### Señales de una buena oferta

- Puedes explicar el valor en una frase.
- Puedes mostrar evidencia, aunque sea de proyectos propios o simulados.
- Puedes entregar una primera versión acotada en menos de dos semanas.

### Ejercicio

Escribe 3 versiones de tu oferta. Luego elimina toda palabra que no ayude al cliente a entender resultado, plazo o riesgo reducido.`,
        }),
        makeVideoLesson({
          id: "demo-lesson-profile-audit",
          slug: "auditoria-perfil",
          title: "Auditoría rápida del perfil",
          description:
            "Qué revisar en título, primera línea, portfolio y prueba social antes de aplicar.",
          position: 2,
          durationSec: 660,
          videoKey: "profileAudit",
        }),
        makeDownloadLesson({
          id: "demo-lesson-profile-checklist",
          slug: "checklist-perfil",
          title: "Checklist de perfil listo para vender",
          description:
            "Lista de verificación para dejar el perfil coherente con tu oferta.",
          position: 3,
          content: `## Checklist de perfil

### Título

- Incluye servicio y resultado, no solo rol.
- Evita claims genéricos como "rockstar", "passionate" o "hard worker".
- Usa términos que el cliente buscaría.

### Overview

- Primera línea: problema + resultado.
- Segundo bloque: evidencia o proceso.
- Tercer bloque: cómo empezar contigo.

### Portfolio

- Cada caso debe mostrar contexto, trabajo realizado y resultado.
- Si no tienes clientes previos, crea un caso demo con brief, decisiones y entregable.
- Prioriza 3 piezas relevantes sobre 12 piezas mezcladas.

### Antes de aplicar

- El perfil conversa con el tipo de job al que vas a postular.
- La propuesta no tiene que explicar desde cero quién eres.
- El cliente puede validar tu criterio en menos de 60 segundos.`,
        }),
      ],
    },
    {
      id: "demo-mod-2",
      title: "Selección de proyectos y uso de Connects",
      description:
        "Aprende a filtrar oportunidades por fit, probabilidad de respuesta y valor esperado.",
      position: 1,
      lessons: [
        makeTextLesson({
          id: "demo-lesson-text",
          slug: DUMMY_LESSON_TEXT,
          title: "Cómo leer un job post",
          description: "Señales verdes y rojas antes de gastar Connects.",
          position: 0,
          isPreview: true,
          content: `## Qué mirar antes de gastar Connects

La meta no es aplicar más. La meta es aplicar donde tu probabilidad de conversación justifica el costo.

### 1. Fit real

Pregúntate:

- ¿Puedo entregar el resultado principal sin aprender desde cero?
- ¿Tengo un ejemplo, proceso o criterio que reduzca riesgo?
- ¿El plazo y presupuesto permiten una entrega decente?

### 2. Calidad del cliente

Señales verdes:

- Historial de pagos verificado.
- Reviews que mencionan comunicación y continuidad.
- Brief con entregables o contexto de negocio.
- Cliente entrevista perfiles o invita freelancers.

Señales rojas:

- "Easy job" combinado con urgencia y bajo presupuesto.
- Alcance enorme con presupuesto fijo irreal.
- Brief copiado, contradictorio o sin objetivo.
- Muchas propuestas y cero entrevistas después de varias horas.

### 3. Competencia visible

No descartes un job solo por tener propuestas, pero entiende el contexto:

- Menos de 5 propuestas: oportunidad temprana si el fit es fuerte.
- 10 a 20 propuestas: aplica solo con ángulo específico.
- 50+ propuestas: normalmente exige prueba social muy alineada o invitación.

> Regla práctica: si no puedes escribir una apertura específica en 5 minutos, probablemente no es tu proyecto.

### Ejercicio

Abre 5 job posts de tu nicho y puntúalos de 1 a 5 en fit, cliente y timing. Aplica solo a los que sumen 11 o más.`,
        }),
        makeVideoLesson({
          id: "demo-lesson-job-selection",
          slug: "matriz-de-priorizacion",
          title: "Matriz de priorización de jobs",
          description:
            "Sistema simple para decidir cuándo aplicar, guardar o descartar.",
          position: 1,
          durationSec: 780,
          videoKey: "jobSelection",
        }),
        makeTextLesson({
          id: "demo-lesson-connects-budget",
          slug: "presupuesto-connects",
          title: "Presupuesto semanal de Connects",
          description:
            "Cómo distribuir Connects sin depender de impulsos o boosting automático.",
          position: 2,
          content: `## Connects como presupuesto de adquisición

Trata los Connects como inversión comercial. No se gastan para "probar suerte"; se asignan a experimentos con hipótesis.

### Modelo semanal simple

- **60% a jobs de alta alineación:** brief claro, cliente activo, evidencia de fit.
- **25% a jobs estratégicos:** ticket alto, largo plazo o nicho prioritario.
- **15% a exploración:** nuevos nichos, clientes sin historial pero buen brief, oportunidades tempranas.

### Cuándo boostear

Boostear tiene sentido si:

- El job es altamente relevante para tu posicionamiento.
- Tu primera línea es específica y fuerte.
- Tienes evidencia visible en perfil o portfolio.

No boostees para compensar una propuesta floja.

### Métricas mínimas

Registra cada semana:

- Jobs revisados.
- Propuestas enviadas.
- Respuestas recibidas.
- Entrevistas iniciadas.
- Contratos cerrados.
- Connects gastados por respuesta.

### Ejercicio

Define tu presupuesto de la próxima semana y decide antes de aplicar cuántas propuestas enviarás por cada categoría.`,
        }),
        makeQuizLesson({
          id: "demo-lesson-quiz",
          slug: DUMMY_LESSON_QUIZ,
          title: "Quiz: priorizar proyectos",
          description: "Valida criterios para elegir a qué jobs aplicar.",
          position: 3,
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
    {
      id: "demo-mod-3",
      title: "Propuestas que abren conversaciones",
      description:
        "Construye mensajes cortos, específicos y orientados al siguiente paso.",
      position: 2,
      lessons: [
        makeVideoLesson({
          id: "demo-lesson-locked-1",
          slug: "estructura-propuesta",
          title: "Estructura de propuesta corta",
          description:
            "Una propuesta en 5 bloques: contexto, diagnóstico, plan, evidencia y pregunta.",
          position: 0,
          durationSec: 690,
          videoKey: "proposalStructure",
        }),
        makeTextLesson({
          id: "demo-lesson-proposal-openings",
          slug: "primeras-lineas",
          title: "Primeras líneas que no suenan a plantilla",
          description:
            "Cómo demostrar que leíste el brief sin escribir párrafos largos.",
          position: 1,
          content: `## La primera línea decide si siguen leyendo

El cliente no necesita tu biografía al inicio. Necesita sentir que entendiste su problema.

### Mal inicio

"Hi, I am a full-stack developer with 5 years of experience..."

### Mejor inicio

"Veo que el problema no es solo crear la landing, sino dejarla lista para validar tráfico pagado sin depender del equipo interno."

### Tres patrones útiles

#### 1. Reencuadre

Parece que necesitas **[entregable]**, pero el riesgo principal es **[riesgo]**. Lo atacaría primero con **[acción]**.

#### 2. Prueba de criterio

Antes de estimar, revisaría **[factor crítico]** porque define si conviene **[opción A]** o **[opción B]**.

#### 3. Experiencia específica

En un proyecto similar, el cuello de botella fue **[problema]**. Para evitarlo, trabajaría en **[proceso]**.

### Ejercicio

Toma un job real y escribe 5 primeras líneas. Conserva solo la que mencione un riesgo o decisión concreta del proyecto.`,
        }),
        makeTextLesson({
          id: "demo-lesson-locked-2",
          slug: "casos-reales",
          title: "3 propuestas comentadas",
          description:
            "Ejemplos para proyectos claros, urgentes y de largo plazo.",
          position: 2,
          content: `## Caso 1: Proyecto con alcance claro

**Contexto:** cliente con historial, brief detallado y presupuesto medio.

### Apertura sugerida

Hola, revisé que necesitas dejar el dashboard listo para usuarios internos, no solo maquetar pantallas. Ya trabajé en flujos similares con permisos, tablas y estados vacíos; lo dividiría en una entrega funcional y una ronda de QA.

### Qué funciona

- Menciona el resultado, no tu bio.
- Propone fases cortas.
- Reduce incertidumbre con criterio técnico.

### Error común

Hablar de años de experiencia sin conectarlo al problema actual.

---

## Caso 2: Proyecto urgente con poca información

**Contexto:** cliente necesita resolver hoy, pero el brief es ambiguo.

### Estrategia

1. Confirma el objetivo principal.
2. Pide 2 datos críticos para estimar.
3. Ofrece una primera versión de alcance acotado.

### Plantilla rápida

Para no hacerte perder tiempo, propongo resolver primero **[bloque crítico]** hoy y dejar **[bloque secundario]** para una segunda etapa si confirmamos que hace falta.

---

## Caso 3: Proyecto de largo plazo

**Contexto:** cliente busca soporte continuo y no solo una tarea.

### Enfoque recomendado

- Presenta un mini roadmap de 30 días.
- Define métricas de éxito.
- Abre la conversación hacia continuidad sin forzar cierre.

### Ejercicio

Escribe 3 versiones de apertura para el mismo job: una orientada a urgencia, una a calidad y una a continuidad.`,
        }),
        makeDownloadLesson({
          id: "demo-lesson-proposal-template",
          slug: "plantilla-propuesta",
          title: "Plantilla editable de propuesta",
          description:
            "Estructura base para adaptar por nicho sin caer en mensajes genéricos.",
          position: 3,
          content: `## Plantilla base

Hola [Nombre],

Leí que necesitas [resultado específico]. El punto que cuidaría desde el inicio es [riesgo o decisión crítica], porque impacta directamente en [métrica, plazo o calidad].

Mi plan inicial sería:

1. Revisar [input principal].
2. Entregar [primer entregable] en [plazo].
3. Validar [criterio de éxito].
4. Ajustar [parte variable] según feedback.

Trabajo similar:

- [Caso o evidencia breve].
- [Resultado o aprendizaje relevante].

Para estimar bien, solo necesito confirmar:

- [Pregunta 1].
- [Pregunta 2].

Si te sirve, puedo empezar con [siguiente paso pequeño].`,
        }),
      ],
    },
    {
      id: "demo-mod-4",
      title: "Entrevistas, pricing y cierre",
      description:
        "Convierte respuestas en llamadas útiles y acuerdos con alcance claro.",
      position: 3,
      lessons: [
        makeVideoLesson({
          id: "demo-lesson-interview-1",
          slug: "guion-entrevista",
          title: "Guion base para entrevistas",
          description:
            "Cómo conducir la llamada para vender sin sonar robótico.",
          position: 0,
          durationSec: 720,
          videoKey: "interview",
        }),
        makeTextLesson({
          id: "demo-lesson-interview-2",
          slug: "objeciones-frecuentes",
          title: "Objeciones frecuentes y respuestas",
          description:
            "Responde dudas de precio, tiempos y experiencia con claridad.",
          position: 1,
          content: `## Objeciones frecuentes en entrevistas

Cuando un cliente objeta, normalmente no rechaza tu servicio: está reduciendo riesgo.

## 1. "Está fuera de presupuesto"

### Respuesta marco

Entiendo. Para mantener impacto sin comprometer calidad, podemos priorizar **[fase crítica]** ahora y mover **[fase opcional]** a una segunda etapa.

### Clave

- No regales precio de inmediato.
- Reencuadra por valor y alcance.
- Ofrece opciones, no descuentos silenciosos.

## 2. "No sé si eres el perfil correcto"

### Respuesta marco

Totalmente válido. Para que lo evalúes con evidencia, propongo un primer entregable pequeño en 48 horas con criterios claros de éxito.

### Clave

- Usa prueba de trabajo.
- Acorta tiempo de decisión.
- Define qué se considera una buena entrega.

## 3. "Necesito pensarlo"

### Respuesta marco

Perfecto. Te dejo por escrito alcance, tiempos y riesgos para que compares con claridad. Si te sirve, mañana revisamos 10 minutos solo para resolver dudas.

## Checklist antes de responder

- ¿Entendí la objeción real o solo la superficial?
- ¿Estoy defendiendo precio o explicando impacto?
- ¿Estoy dando una salida fácil al cliente?

## Mini práctica

Escribe 1 respuesta por cada objeción con tu nicho real y léelas en voz alta para mejorar naturalidad.`,
        }),
        makeTextLesson({
          id: "demo-lesson-pricing",
          slug: "pricing-por-alcance",
          title: "Pricing por alcance y riesgo",
          description:
            "Cómo cotizar sin depender solamente de tarifa por hora.",
          position: 2,
          content: `## El precio no sale solo del tiempo

Un proyecto se cotiza considerando tiempo, complejidad, urgencia, costo de error y valor del resultado.

### Tres formas comunes

#### Por hora

Útil cuando el alcance es incierto o el cliente necesita soporte flexible.

Riesgo: castiga eficiencia si lo usas para entregables cerrados.

#### Precio fijo

Útil cuando el entregable, criterios de aceptación y límites están claros.

Riesgo: scope creep si no defines exclusiones.

#### Retainer

Útil cuando hay trabajo recurrente, backlog y confianza previa.

Riesgo: se vuelve una bolsa infinita de tareas si no defines cadencia.

### Fórmula de precio fijo

Precio = tiempo estimado + margen de incertidumbre + valor de coordinación + urgencia.

### Ejercicio

Cotiza el mismo job de tres maneras: hourly, fixed price y retainer inicial. Escribe qué tendría que cambiar para justificar cada una.`,
        }),
        makeDownloadLesson({
          id: "demo-lesson-interview-3",
          slug: "checklist-cierre",
          title: "Checklist de cierre y siguiente paso",
          description:
            "Plantilla para cerrar acuerdos y activar onboarding rápido.",
          position: 3,
          content: `## Checklist de cierre

Antes de aceptar o enviar contrato, confirma:

- Resultado esperado.
- Entregables incluidos.
- Entregables excluidos.
- Fechas de revisión.
- Quién aprueba.
- Materiales necesarios.
- Criterios de éxito.
- Canal principal de comunicación.

### Mensaje de cierre

Perfecto, para dejarlo ordenado:

- **Objetivo:** [resultado].
- **Entregables:** [lista].
- **No incluido por ahora:** [límites].
- **Primera entrega:** [fecha].
- **Necesito de tu lado:** [inputs].

Si confirmas esto, acepto el contrato y arranco con el primer bloque.`,
        }),
      ],
    },
    {
      id: "demo-mod-5",
      title: "Entrega, retención y expansión",
      description:
        "Organiza el trabajo posterior al cierre para generar confianza y continuidad.",
      position: 4,
      lessons: [
        makeVideoLesson({
          id: "demo-lesson-retention-1",
          slug: "onboarding-cliente",
          title: "Onboarding del cliente en 15 minutos",
          description: "Define expectativas desde el primer mensaje.",
          position: 0,
          durationSec: 540,
          videoKey: "onboarding",
        }),
        makeTextLesson({
          id: "demo-lesson-retention-2",
          slug: "sistema-seguimiento",
          title: "Sistema semanal de seguimiento",
          description:
            "Formato simple para avances, bloqueos y próximos pasos.",
          position: 1,
          content: `## Sistema semanal de seguimiento

Objetivo: mantener al cliente alineado, reducir fricción y detectar oportunidades de expansión.

## Estructura recomendada

### 1. Avances

- Qué se completó.
- Qué impacto tuvo.
- Qué evidencia puede revisar el cliente.

### 2. Bloqueos

- Qué está frenando progreso.
- Qué decisión necesitas del cliente.
- Qué pasa si no se resuelve.

### 3. Próximos pasos

- 2 a 4 acciones concretas.
- Fechas y responsables.
- Qué se entrega al final de la semana.

### 4. Riesgos y mitigación

- Riesgo principal.
- Acción preventiva propuesta.

## Plantilla rápida

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
        }),
        makeTextLesson({
          id: "demo-lesson-retainer-offer",
          slug: "oferta-retainer",
          title: "Cómo presentar un retainer",
          description:
            "Convierte continuidad en una oferta concreta con alcance y métricas.",
          position: 2,
          content: `## Un retainer no es "contrátame todos los meses"

Un retainer útil vende continuidad, prioridad y reducción de fricción.

### Cuándo proponerlo

- Ya entregaste algo valioso.
- El cliente tiene backlog claro.
- La colaboración requiere contexto acumulado.
- Puedes definir cadencia semanal o mensual.

### Estructura recomendada

1. Resumen del resultado logrado.
2. Problema recurrente detectado.
3. Plan mensual con entregables.
4. Cadencia de comunicación.
5. Límites de alcance.
6. Métricas de éxito.

### Ejemplo

Como ya dejamos funcionando el primer flujo, veo dos riesgos para las próximas semanas: mantenimiento de bugs y velocidad para nuevas pantallas. Te propongo un retainer mensual con 1 sprint semanal, QA liviano y priorización cada lunes. Así mantenemos avance sin renegociar cada ajuste pequeño.

### Ejercicio

Escribe una propuesta de retainer para un cliente hipotético. Debe incluir entregables, frecuencia, límites y métrica principal.`,
        }),
        makeQuizLesson({
          id: "demo-lesson-retention-3",
          slug: DUMMY_LESSON_QUIZ_RETAINERS,
          title: "Mini quiz: pasar a retainers",
          description: "Evalúa cuándo y cómo ofrecer continuidad mensual.",
          position: 3,
          quiz: {
            id: "demo-quiz-2",
            title: "Retainers y expansión de cuenta",
            passingScore: 70,
            questionCount: 4,
          },
        }),
      ],
    },
  ];

  const lessonCount = modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );
  const estimatedDurationSeconds = modules.reduce(
    (total, module) =>
      total +
      module.lessons.reduce(
        (moduleTotal, lesson) => moduleTotal + (lesson.durationSec ?? 900),
        0,
      ),
    0,
  );
  const hasDemoVideoPlaybackIds = Object.values(DEMO_VIDEO_PLAYBACK_IDS).some(
    Boolean,
  );

  const sequentialModules = applySequentialLessonAccess(modules, {
    hasFullAccess: true,
    completedLessonIds,
    enforceSequential: true,
  });

  return {
    mode: "publicDemo",
    view: {
      id: DEMO_DUMMY_COURSE_ID,
      slug: "demo",
      title: "Sistema realista para conseguir clientes en Upwork",
      description:
        "Curso práctico para posicionarte, elegir mejores jobs, escribir propuestas específicas, cerrar entrevistas y convertir proyectos en relaciones recurrentes.",
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
      estimatedDurationHours: Math.ceil(estimatedDurationSeconds / 3600),
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
      muxConfigured: hasDemoVideoPlaybackIds,
      muxStreamingEnabled: hasDemoVideoPlaybackIds,
      firstLessonSlug:
        findFirstAccessibleLessonSlug(sequentialModules) ?? DUMMY_LESSON_VIDEO,
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
