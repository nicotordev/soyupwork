import { z } from "zod";

const optionalUuidSchema = z.uuid().optional();

export const quizOptionInputSchema = z.object({
  id: optionalUuidSchema,
  text: z.string().trim().min(1, "La opción no puede estar vacía.").max(500),
  isCorrect: z.boolean(),
});

export const quizQuestionInputSchema = z
  .object({
    id: optionalUuidSchema,
    question: z
      .string()
      .trim()
      .min(1, "La pregunta no puede estar vacía.")
      .max(1000),
    options: z
      .array(quizOptionInputSchema)
      .min(2, "Cada pregunta necesita al menos 2 opciones.")
      .max(6, "Máximo 6 opciones por pregunta."),
  })
  .refine(
    (data) => data.options.some((option) => option.isCorrect),
    "Cada pregunta debe tener al menos una respuesta correcta.",
  );

export const upsertLessonQuizSchema = z.object({
  lessonId: z.uuid(),
  courseId: z.uuid(),
  title: z
    .string()
    .trim()
    .min(1, "El título del quiz es obligatorio.")
    .max(200),
  description: z.string().trim().max(5000).optional(),
  passingScore: z
    .number()
    .int()
    .min(0, "La nota mínima debe ser 0 o mayor.")
    .max(100, "La nota mínima no puede superar 100."),
  questions: z
    .array(quizQuestionInputSchema)
    .min(1, "Añade al menos una pregunta.")
    .max(50, "Máximo 50 preguntas por quiz."),
});

export type UpsertLessonQuizInput = z.infer<typeof upsertLessonQuizSchema>;
