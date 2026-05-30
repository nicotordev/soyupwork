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

const CORRECT_BY_QUESTION: Record<string, string[]> = {
  "demo-q-1": ["demo-q-1-b"],
  "demo-q-2": ["demo-q-2-b"],
  "demo-q-3": ["demo-q-3-c"],
};

const DUMMY_QUIZZES_BY_LESSON: Record<string, QuizPlayData> = {
  "demo-lesson-quiz": DUMMY_QUIZ,
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
  const { quiz } = getDummyDemoLessonIds();
  const dummyQuiz = DUMMY_QUIZZES_BY_LESSON[lessonId];
  if (lessonId !== quiz || !dummyQuiz) {
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
    DUMMY_QUIZ.questions.some((q) => q.options.some((o) => o.id === id)),
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
