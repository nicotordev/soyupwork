"use server";

import { CourseStatus } from "@/generated/prisma/client";
import {
  getDummyQuizPlayData,
  gradeDummyQuizAnswer,
  isDummyDemoCourse,
  submitDummyQuizAttempt,
} from "@/lib/demo/dummy-quiz-data";
import { requireAdmin } from "@/lib/auth/admin";
import { requireStudent } from "@/lib/auth/student";
import { userHasActiveEnrollment } from "@/lib/course/get-course-page-data";
import { handleCourseProgressUpdate } from "@/lib/course/handle-course-progress-update";
import { upsertLessonProgressComplete } from "@/lib/course/upsert-lesson-progress-complete";
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

type QuizPlayAccessOptions = {
  adminPreview?: boolean;
  publicDemo?: boolean;
};

async function assertLessonQuizAccess(
  lessonId: string,
  courseId: string,
  options: QuizPlayAccessOptions,
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

  if (options.publicDemo) {
    const published = await prisma.course.findFirst({
      where: { id: courseId, status: CourseStatus.PUBLISHED },
      select: { id: true },
    });
    if (!published) {
      return { ok: false as const, error: "Curso no disponible en la demo." };
    }
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
  preview: QuizPlayAccessOptions = {},
): Promise<GetQuizPlayDataResult> {
  try {
    if (preview.publicDemo && isDummyDemoCourse(courseId)) {
      if (!lessonId) {
        return { ok: false, error: "Datos inválidos." };
      }
      return getDummyQuizPlayData(lessonId);
    }

    const parsed = quizPlayLessonSchema.safeParse({ lessonId, courseId });
    if (!parsed.success) {
      return { ok: false, error: "Datos inválidos." };
    }

    const access = await assertLessonQuizAccess(
      parsed.data.lessonId,
      parsed.data.courseId,
      preview,
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
  publicDemo?: boolean;
}): Promise<GradeQuizAnswerResult> {
  try {
    if (input.publicDemo && isDummyDemoCourse(input.courseId)) {
      if (!input.questionId || !Array.isArray(input.optionIds)) {
        return { ok: false, error: "Datos inválidos." };
      }

      return gradeDummyQuizAnswer({
        questionId: input.questionId,
        optionIds: input.optionIds,
        timedOut: input.timedOut,
      });
    }

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
      {
        adminPreview: input.adminPreview ?? false,
        publicDemo: input.publicDemo ?? false,
      },
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
  publicDemo?: boolean;
}): Promise<SubmitQuizAttemptResult> {
  try {
    if (input.publicDemo && isDummyDemoCourse(input.courseId)) {
      if (!input.lessonId || !Array.isArray(input.answers)) {
        return { ok: false, error: "Datos inválidos." };
      }

      return submitDummyQuizAttempt(input.lessonId, input.answers);
    }

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
      {
        adminPreview: input.adminPreview ?? false,
        publicDemo: input.publicDemo ?? false,
      },
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

    let progressUpdate = {
      courseCompleted: false,
      certificateIssued: false,
      newlyIssuedCertificate: false,
    };

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

      if (passed) {
        await upsertLessonProgressComplete(access.userId, parsed.data.lessonId);

        const course = await prisma.course.findUnique({
          where: { id: parsed.data.courseId },
          select: { slug: true },
        });

        if (course) {
          progressUpdate = await handleCourseProgressUpdate({
            userId: access.userId,
            courseId: parsed.data.courseId,
            courseSlug: course.slug,
          });
        }
      }
    }

    return {
      ok: true,
      score,
      passed,
      correctCount,
      totalQuestions,
      courseCompleted: progressUpdate.courseCompleted,
      certificateIssued: progressUpdate.certificateIssued,
      newlyIssuedCertificate: progressUpdate.newlyIssuedCertificate,
    };
  } catch {
    return { ok: false, error: "No se pudo guardar el intento." };
  }
}
