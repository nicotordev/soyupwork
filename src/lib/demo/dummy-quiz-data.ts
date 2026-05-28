import { getDummyDemoLessonIds } from "@/lib/demo/dummy-course-data";
import { isDummyDemoCourse } from "@/lib/demo/demo-constants";
import type {
  GetQuizPlayDataResult,
  GradeQuizAnswerResult,
  QuizAnswerInput,
  QuizPlayData,
  SubmitQuizAttemptResult,
} from "@/types/quiz-play.types";

export { isDummyDemoCourse };

const DUMMY_QUIZ: QuizPlayData = {
  quizId: "demo-quiz-1",
  title: "Priorizar proyectos en Upwork",
  description: "Elige la mejor respuesta según el criterio del curso.",
  passingScore: 70,
  questions: [
    {
      id: "demo-q-1",
      question: "¿Cuál es la mejor razón para NO aplicar a un proyecto?",
      position: 0,
      options: [
        {
          id: "demo-q-1-a",
          text: "El presupuesto es bajo pero el cliente tiene buenas reviews",
        },
        {
          id: "demo-q-1-b",
          text: "El job pide habilidades que no dominas y no puedes entregar a tiempo",
        },
        { id: "demo-q-1-c", text: "Solo quedan 2 horas para postular" },
        { id: "demo-q-1-d", text: "El cliente es nuevo en Upwork" },
      ],
    },
    {
      id: "demo-q-2",
      question: "¿Qué señal suele indicar mejor fit en un job post?",
      position: 1,
      options: [
        { id: "demo-q-2-a", text: "Brief vago sin entregables claros" },
        {
          id: "demo-q-2-b",
          text: "Stack y resultado esperado alineados con tu experiencia",
        },
        { id: "demo-q-2-c", text: "Más de 50 propuestas en la primera hora" },
        {
          id: "demo-q-2-d",
          text: "Cliente sin historial y presupuesto muy alto",
        },
      ],
    },
    {
      id: "demo-q-3",
      question: "Antes de gastar Connects, lo más útil es…",
      position: 2,
      options: [
        { id: "demo-q-3-a", text: "Copiar una plantilla genérica" },
        { id: "demo-q-3-b", text: "Aplicar a todos los jobs de tu categoría" },
        {
          id: "demo-q-3-c",
          text: "Escribir un opening específico en menos de 5 minutos",
        },
        { id: "demo-q-3-d", text: "Pujar siempre el máximo de Connects" },
      ],
    },
  ],
};

const DUMMY_RETAINERS_QUIZ: QuizPlayData = {
  quizId: "demo-quiz-2",
  title: "Retainers y expansion de cuenta",
  description:
    "Evalua como convertir proyectos puntuales en relacion recurrente.",
  passingScore: 70,
  questions: [
    {
      id: "demo-rq-1",
      question: "Cuando conviene ofrecer un retainer?",
      position: 0,
      options: [
        { id: "demo-rq-1-a", text: "Desde el primer mensaje, sin diagnostico" },
        {
          id: "demo-rq-1-b",
          text: "Cuando ya entregaste valor y detectas necesidad continua",
        },
        {
          id: "demo-rq-1-c",
          text: "Solo si el cliente lo pide explicitamente",
        },
        { id: "demo-rq-1-d", text: "Nunca, para no parecer agresivo" },
      ],
    },
    {
      id: "demo-rq-2",
      question: "Que debe incluir una propuesta de retainer?",
      position: 1,
      options: [
        { id: "demo-rq-2-a", text: "Horas ambiguas y tareas abiertas" },
        {
          id: "demo-rq-2-b",
          text: "Alcance, entregables, frecuencia y metricas de exito",
        },
        { id: "demo-rq-2-c", text: "Solo un precio mensual final" },
        { id: "demo-rq-2-d", text: "Promesas ilimitadas para cerrar rapido" },
      ],
    },
    {
      id: "demo-rq-3",
      question: "Mejor momento para hablar de expansion?",
      position: 2,
      options: [
        { id: "demo-rq-3-a", text: "Antes del kick-off, sin contexto" },
        { id: "demo-rq-3-b", text: "Cuando hay resultados parciales medibles" },
        { id: "demo-rq-3-c", text: "Solo al cerrar el contrato" },
        { id: "demo-rq-3-d", text: "En cada mensaje sin pausa" },
      ],
    },
    {
      id: "demo-rq-4",
      question: "Si el cliente duda por precio, que enfoque es mejor?",
      position: 3,
      options: [
        { id: "demo-rq-4-a", text: "Descontar fuerte sin explicacion" },
        {
          id: "demo-rq-4-b",
          text: "Comparar costo vs impacto y priorizar fases",
        },
        { id: "demo-rq-4-c", text: "Cerrar conversacion de inmediato" },
        { id: "demo-rq-4-d", text: "Ofrecer todo gratis una semana" },
      ],
    },
  ],
};

const CORRECT_BY_QUESTION: Record<string, string[]> = {
  "demo-q-1": ["demo-q-1-b"],
  "demo-q-2": ["demo-q-2-b"],
  "demo-q-3": ["demo-q-3-c"],
  "demo-rq-1": ["demo-rq-1-b"],
  "demo-rq-2": ["demo-rq-2-b"],
  "demo-rq-3": ["demo-rq-3-b"],
  "demo-rq-4": ["demo-rq-4-b"],
};

const DUMMY_QUIZZES_BY_LESSON: Record<string, QuizPlayData> = {
  "demo-lesson-quiz": DUMMY_QUIZ,
  "demo-lesson-retention-3": DUMMY_RETAINERS_QUIZ,
};

function gradeAnswer(
  correctOptionIds: string[],
  selectedOptionIds: string[],
): boolean {
  const normalizedCorrect = [...correctOptionIds].sort();
  const normalizedSelected = [...selectedOptionIds].sort();
  return (
    normalizedCorrect.length === normalizedSelected.length &&
    normalizedCorrect.every((id, index) => id === normalizedSelected[index])
  );
}

export function getDummyQuizPlayData(lessonId: string): GetQuizPlayDataResult {
  const { quiz, quizRetainers } = getDummyDemoLessonIds();
  const dummyQuiz = DUMMY_QUIZZES_BY_LESSON[lessonId];
  const isKnownQuizLesson = lessonId === quiz || lessonId === quizRetainers;
  if (!isKnownQuizLesson || !dummyQuiz) {
    return { ok: false, error: "Quiz no encontrado." };
  }

  return {
    ok: true,
    quiz: dummyQuiz,
    previousAttempt: null,
    saveAttempts: false,
  };
}

export function gradeDummyQuizAnswer(input: {
  questionId: string;
  optionIds: string[];
  timedOut?: boolean;
}): GradeQuizAnswerResult {
  const correctOptionIds = CORRECT_BY_QUESTION[input.questionId];
  if (!correctOptionIds) {
    return { ok: false, error: "Pregunta no encontrada." };
  }

  if (input.optionIds.length === 0 && !input.timedOut) {
    return { ok: false, error: "Selecciona al menos una opción." };
  }

  const validSelected = input.optionIds.every((id) =>
    [...DUMMY_QUIZ.questions, ...DUMMY_RETAINERS_QUIZ.questions].some((q) =>
      q.options.some((o) => o.id === id),
    ),
  );
  if (!validSelected && input.optionIds.length > 0) {
    return { ok: false, error: "Opción inválida." };
  }

  const correct =
    input.optionIds.length === 0
      ? false
      : gradeAnswer(correctOptionIds, input.optionIds);

  return { ok: true, correct, correctOptionIds };
}

export function submitDummyQuizAttempt(
  lessonId: string,
  answers: QuizAnswerInput[],
): SubmitQuizAttemptResult {
  const dummyQuiz = DUMMY_QUIZZES_BY_LESSON[lessonId];
  if (!dummyQuiz) {
    return { ok: false, error: "Quiz no encontrado." };
  }

  const totalQuestions = dummyQuiz.questions.length;

  if (answers.length !== totalQuestions) {
    return { ok: false, error: "Debes responder todas las preguntas." };
  }

  let correctCount = 0;

  for (const question of dummyQuiz.questions) {
    const answer = answers.find((item) => item.questionId === question.id);
    if (!answer) {
      return { ok: false, error: "Faltan respuestas." };
    }

    const correctIds = CORRECT_BY_QUESTION[question.id] ?? [];
    if (answer.optionIds.length === 0) continue;
    if (gradeAnswer(correctIds, answer.optionIds)) {
      correctCount += 1;
    }
  }

  const score =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = score >= dummyQuiz.passingScore;

  return {
    ok: true,
    score,
    passed,
    correctCount,
    totalQuestions,
  };
}
