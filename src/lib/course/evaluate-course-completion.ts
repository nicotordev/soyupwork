import type { Prisma } from "@/generated/prisma/client";
import { LessonType } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";

type PrismaDb = typeof prisma | Prisma.TransactionClient;

export type CourseCompletionEvaluation = {
  courseId: string;
  offersCertificate: boolean;
  minCompletionPercent: number;
  requiredCount: number;
  completedCount: number;
  percent: number;
  isComplete: boolean;
};

export async function evaluateCourseCompletion(
  userId: string,
  courseId: string,
  db: PrismaDb = prisma,
): Promise<CourseCompletionEvaluation | null> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      offersCertificate: true,
      minCompletionPercent: true,
      modules: {
        select: {
          lessons: {
            where: { isPreview: false },
            select: {
              id: true,
              type: true,
              quiz: { select: { id: true } },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return null;
  }

  const requiredLessons = course.modules.flatMap((module) => module.lessons);
  const requiredCount = requiredLessons.length;

  if (requiredCount === 0) {
    return {
      courseId: course.id,
      offersCertificate: course.offersCertificate,
      minCompletionPercent: course.minCompletionPercent,
      requiredCount: 0,
      completedCount: 0,
      percent: 0,
      isComplete: false,
    };
  }

  const lessonIds = requiredLessons.map((lesson) => lesson.id);
  const quizIds = requiredLessons
    .filter((lesson) => lesson.type === LessonType.QUIZ && lesson.quiz)
    .map((lesson) => lesson.quiz!.id);

  const [progressRows, passedAttempts] = await Promise.all([
    db.lessonProgress.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds },
        completed: true,
      },
      select: { lessonId: true },
    }),
    quizIds.length > 0
      ? db.quizAttempt.findMany({
          where: {
            userId,
            quizId: { in: quizIds },
            passed: true,
          },
          select: { quizId: true },
        })
      : Promise.resolve([]),
  ]);

  const completedLessonIds = new Set(progressRows.map((row) => row.lessonId));
  const passedQuizIds = new Set(
    passedAttempts.map((attempt) => attempt.quizId),
  );

  let completedCount = 0;
  for (const lesson of requiredLessons) {
    if (!completedLessonIds.has(lesson.id)) {
      continue;
    }

    if (lesson.type === LessonType.QUIZ && lesson.quiz) {
      if (!passedQuizIds.has(lesson.quiz.id)) {
        continue;
      }
    }

    completedCount += 1;
  }

  const percent = Math.round((completedCount / requiredCount) * 100);
  const isComplete = percent >= course.minCompletionPercent;

  return {
    courseId: course.id,
    offersCertificate: course.offersCertificate,
    minCompletionPercent: course.minCompletionPercent,
    requiredCount,
    completedCount,
    percent,
    isComplete,
  };
}
