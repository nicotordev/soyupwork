"use server";

import { requireAdmin } from "@/lib/auth/admin";
import { requireStudent } from "@/lib/auth/student";
import { userHasActiveEnrollment } from "@/lib/course/get-course-page-data";
import prisma from "@/lib/db/prisma";
import {
  gradeQuizAnswerSchema,
  quizPlayLessonSchema,
  submitQuizAttemptSchema,
} from "@/schemas/quiz-play";
import type {
  GetQuizPlayDataResult,
  GradeQuizAnswerResult,
  QuizPlayData,
  SubmitQuizAttemptResult,
} from "@/types/quiz-play.types";

async function assertLessonQuizAccess(
  lessonId: string,
  courseId: string,
  options: { adminPreview: boolean },
) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      module: { courseId },
      type: "QUIZ",
    },
    select: {
      id: true,
      isPreview: true,
      quiz: {
        select: {
          id: true,
          title: true,
          description: true,
          passingScore: true,
          questions: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              question: true,
              position: true,
              options: {
                orderBy: { position: "asc" },
                select: { id: true, text: true },
              },
            },
          },
        },
      },
      module: { select: { courseId: true } },
    },
  });

  if (!lesson?.quiz) {
    return { ok: false as const, error: "Quiz no encontrado." };
  }

  if (options.adminPreview) {
    await requireAdmin();
    return { ok: true as const, lesson, saveAttempts: false };
  }

  const user = await requireStudent();
  const hasFullAccess = await userHasActiveEnrollment(
    user.id,
    lesson.module.courseId,
  );

  if (!hasFullAccess && !lesson.isPreview) {
    return { ok: false as const, error: "No tienes acceso a este quiz." };
  }

  return { ok: true as const, lesson, userId: user.id, saveAttempts: true };
}

type LessonWithQuiz = {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    passingScore: number;
    questions: {
      id: string;
      question: string;
      position: number;
      options: { id: string; text: string }[];
    }[];
  };
};

function mapQuizPlayData(quiz: LessonWithQuiz["quiz"]): QuizPlayData {
  return {
    quizId: quiz.id,
    title: quiz.title,
    description: quiz.description ?? "",
    passingScore: quiz.passingScore,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      question: question.question,
      position: question.position,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
      })),
    })),
  };
}

function gradeAnswer(correctIds: string[], selectedIds: string[]): boolean {
  const normalizedCorrect = [...correctIds].sort();
  const normalizedSelected = [...selectedIds].sort();

  return (
    normalizedCorrect.length === normalizedSelected.length &&
    normalizedCorrect.every((id, index) => id === normalizedSelected[index])
  );
}

export async function getQuizPlayData(
  lessonId: string,
  courseId: string,
  adminPreview = false,
): Promise<GetQuizPlayDataResult> {
  try {
    const parsed = quizPlayLessonSchema.safeParse({ lessonId, courseId });
    if (!parsed.success) {
      return { ok: false, error: "Datos inválidos." };
    }

    const access = await assertLessonQuizAccess(
      parsed.data.lessonId,
      parsed.data.courseId,
      { adminPreview },
    );

    if (!access.ok) {
      return { ok: false, error: access.error };
    }

    const quiz = access.lesson.quiz;
    if (!quiz) {
      return { ok: false, error: "Quiz no encontrado." };
    }

    let previousAttempt = null;

    if (access.saveAttempts && "userId" in access) {
      const attempt = await prisma.quizAttempt.findFirst({
        where: {
          userId: access.userId,
          quizId: quiz.id,
        },
        orderBy: { createdAt: "desc" },
        select: { score: true, passed: true, createdAt: true },
      });

      if (attempt) {
        previousAttempt = {
          score: attempt.score,
          passed: attempt.passed,
          createdAt: attempt.createdAt.toISOString(),
        };
      }
    }

    return {
      ok: true,
      quiz: mapQuizPlayData(quiz),
      previousAttempt,
      saveAttempts: access.saveAttempts,
    };
  } catch {
    return { ok: false, error: "No se pudo cargar el quiz." };
  }
}

export async function gradeQuizAnswer(input: {
  lessonId: string;
  courseId: string;
  questionId: string;
  optionIds: string[];
  timedOut?: boolean;
  adminPreview?: boolean;
}): Promise<GradeQuizAnswerResult> {
  try {
    const parsed = gradeQuizAnswerSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const access = await assertLessonQuizAccess(
      parsed.data.lessonId,
      parsed.data.courseId,
      { adminPreview: input.adminPreview ?? false },
    );

    if (!access.ok) {
      return { ok: false, error: access.error };
    }

    const quiz = access.lesson.quiz;
    if (!quiz) {
      return { ok: false, error: "Quiz no encontrado." };
    }

    const question = quiz.questions.find(
      (item) => item.id === parsed.data.questionId,
    );

    if (!question) {
      return { ok: false, error: "Pregunta no encontrada." };
    }

    const options = await prisma.quizOption.findMany({
      where: { questionId: parsed.data.questionId },
      select: { id: true, isCorrect: true },
    });

    const correctOptionIds = options
      .filter((option) => option.isCorrect)
      .map((option) => option.id);

    if (parsed.data.optionIds.length === 0 && !parsed.data.timedOut) {
      return { ok: false, error: "Selecciona al menos una opción." };
    }

    const validSelected = parsed.data.optionIds.every((id) =>
      options.some((option) => option.id === id),
    );

    if (!validSelected) {
      return { ok: false, error: "Opción inválida." };
    }

    const correct =
      parsed.data.optionIds.length === 0
        ? false
        : gradeAnswer(correctOptionIds, parsed.data.optionIds);

    return { ok: true, correct, correctOptionIds };
  } catch {
    return { ok: false, error: "No se pudo validar la respuesta." };
  }
}

export async function submitQuizAttempt(input: {
  lessonId: string;
  courseId: string;
  answers: { questionId: string; optionIds: string[] }[];
  adminPreview?: boolean;
}): Promise<SubmitQuizAttemptResult> {
  try {
    const parsed = submitQuizAttemptSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const access = await assertLessonQuizAccess(
      parsed.data.lessonId,
      parsed.data.courseId,
      { adminPreview: input.adminPreview ?? false },
    );

    if (!access.ok) {
      return { ok: false, error: access.error };
    }

    const quiz = access.lesson.quiz;
    if (!quiz) {
      return { ok: false, error: "Quiz no encontrado." };
    }

    const questions = quiz.questions;
    const totalQuestions = questions.length;

    if (parsed.data.answers.length !== totalQuestions) {
      return { ok: false, error: "Debes responder todas las preguntas." };
    }

    let correctCount = 0;
    const answersPayload: {
      questionId: string;
      optionIds: string[];
      correct: boolean;
    }[] = [];

    for (const question of questions) {
      const answer = parsed.data.answers.find(
        (item) => item.questionId === question.id,
      );

      if (!answer) {
        return { ok: false, error: "Faltan respuestas." };
      }

      if (answer.optionIds.length === 0) {
        answersPayload.push({
          questionId: question.id,
          optionIds: [],
          correct: false,
        });
        continue;
      }

      const options = await prisma.quizOption.findMany({
        where: { questionId: question.id },
        select: { id: true, isCorrect: true },
      });

      const correctOptionIds = options
        .filter((option) => option.isCorrect)
        .map((option) => option.id);

      const correct = gradeAnswer(correctOptionIds, answer.optionIds);

      if (correct) correctCount += 1;

      answersPayload.push({
        questionId: question.id,
        optionIds: answer.optionIds,
        correct,
      });
    }

    const score =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;
    const passed = score >= quiz.passingScore;

    if (access.saveAttempts && "userId" in access && access.userId) {
      await prisma.quizAttempt.create({
        data: {
          userId: access.userId,
          quizId: quiz.id,
          score,
          passed,
          answers: answersPayload,
        },
      });
    }

    return {
      ok: true,
      score,
      passed,
      correctCount,
      totalQuestions,
    };
  } catch {
    return { ok: false, error: "No se pudo guardar el intento." };
  }
}
