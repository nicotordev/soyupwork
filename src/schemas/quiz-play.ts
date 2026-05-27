import { z } from "zod";

export const quizPlayLessonSchema = z.object({
  lessonId: z.uuid(),
  courseId: z.uuid(),
});

export const gradeQuizAnswerSchema = z.object({
  lessonId: z.uuid(),
  courseId: z.uuid(),
  questionId: z.uuid(),
  optionIds: z.array(z.uuid()),
  timedOut: z.boolean().optional(),
});

export const submitQuizAttemptSchema = z.object({
  lessonId: z.uuid(),
  courseId: z.uuid(),
  answers: z.array(
    z.object({
      questionId: z.uuid(),
      optionIds: z.array(z.uuid()),
    }),
  ),
});
