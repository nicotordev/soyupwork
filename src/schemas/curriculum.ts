import { LessonType } from "@/generated/prisma/client";
import { courseSlugField } from "@/schemas/course";
import { z } from "zod";

export const lessonSlugField = courseSlugField;

export const curriculumLessonTypeSchema = z.enum([
  LessonType.VIDEO,
  LessonType.TEXT,
  LessonType.QUIZ,
]);

export const reorderDirectionSchema = z.enum(["up", "down"]);

export const createModuleSchema = z.object({
  courseId: z.uuid(),
  title: z.string().trim().min(1, "El título es obligatorio.").max(200),
  description: z.string().trim().max(5000).optional(),
});

export const updateModuleSchema = z.object({
  id: z.uuid(),
  courseId: z.uuid(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
});

export const deleteModuleSchema = z.object({
  id: z.uuid(),
  courseId: z.uuid(),
});

export const reorderModuleSchema = z.object({
  id: z.uuid(),
  courseId: z.uuid(),
  direction: reorderDirectionSchema,
});

export const createLessonSchema = z.object({
  moduleId: z.uuid(),
  courseId: z.uuid(),
  title: z.string().trim().min(1, "El título es obligatorio.").max(200),
  slug: lessonSlugField.optional(),
  type: curriculumLessonTypeSchema.default(LessonType.VIDEO),
});

export const updateLessonSchema = z.object({
  id: z.uuid(),
  courseId: z.uuid(),
  title: z.string().trim().min(1).max(200),
  slug: lessonSlugField,
  description: z.string().trim().max(5000).optional(),
  type: curriculumLessonTypeSchema,
  content: z.string().trim().max(50000).optional(),
  isPreview: z.boolean(),
  videoPublishedAt: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || !Number.isNaN(Date.parse(value)),
      "Fecha de publicación inválida.",
    ),
  videoAuthorName: z.string().trim().max(120).optional(),
});

export const deleteLessonSchema = z.object({
  id: z.uuid(),
  courseId: z.uuid(),
});

export const reorderLessonSchema = z.object({
  id: z.uuid(),
  courseId: z.uuid(),
  direction: reorderDirectionSchema,
});

export const initLessonVideoUploadSchema = z.object({
  lessonId: z.uuid(),
  courseId: z.uuid(),
});

export const lessonIdCourseSchema = z.object({
  lessonId: z.uuid(),
  courseId: z.uuid(),
});

export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;
export type DeleteModuleInput = z.infer<typeof deleteModuleSchema>;
export type ReorderModuleInput = z.infer<typeof reorderModuleSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type DeleteLessonInput = z.infer<typeof deleteLessonSchema>;
export type ReorderLessonInput = z.infer<typeof reorderLessonSchema>;
