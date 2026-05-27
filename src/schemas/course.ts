import { CourseLevel, CourseStatus } from "@/generated/prisma/client";
import { z } from "zod";

export const courseSlugField = z
  .string()
  .trim()
  .min(1, "El slug es obligatorio.")
  .max(80)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Usa solo minúsculas, números y guiones.",
  );

export const syllabusModuleSchema = z.object({
  title: z.string().trim().min(1).max(200),
  lessons: z.array(z.string().trim().min(1).max(200)).min(1).max(12),
});

export const generatedSyllabusSchema = z.object({
  description: z.string().trim().min(1).max(5000),
  modules: z.array(syllabusModuleSchema).min(1).max(8),
});

export type GeneratedSyllabus = z.infer<typeof generatedSyllabusSchema>;

export const generateCourseSyllabusInputSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio.").max(120),
  categoryName: z.string().trim().min(1, "La categoría es obligatoria."),
  creativePrompt: z.string().trim().max(500).optional(),
});

export type GenerateCourseSyllabusInput = z.infer<
  typeof generateCourseSyllabusInputSchema
>;

export const createAiDraftCourseSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio.").max(120),
  categoryId: z.uuid("Selecciona una categoría válida."),
  level: z.nativeEnum(CourseLevel),
  priceCents: z.number().int().min(0, "El precio debe ser 0 o mayor."),
  description: z.string().trim().min(1).max(5000),
  offersCertificate: z.boolean(),
  modules: z.array(syllabusModuleSchema).min(1),
});

export type CreateAiDraftCourseInput = z.infer<
  typeof createAiDraftCourseSchema
>;

export const updateCourseSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1, "El título es obligatorio.").max(120),
  slug: courseSlugField,
  description: z.string().trim().max(5000),
  status: z.nativeEnum(CourseStatus),
  level: z.nativeEnum(CourseLevel),
  categoryId: z.uuid().nullable(),
  priceCents: z.number().int().min(0, "El precio debe ser 0 o mayor."),
  isFeatured: z.boolean(),
  offersCertificate: z.boolean(),
});

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

export const initCourseThumbnailUploadSchema = z.object({
  courseId: z.uuid(),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  contentLength: z.number().int().positive("El archivo no puede estar vacío."),
});

export const setCourseThumbnailSchema = z.object({
  courseId: z.uuid(),
  thumbnailUrl: z.url().nullable(),
});

export type InitCourseThumbnailUploadInput = z.infer<
  typeof initCourseThumbnailUploadSchema
>;
export type SetCourseThumbnailInput = z.infer<typeof setCourseThumbnailSchema>;

export const deleteCourseSchema = z.object({
  id: z.uuid("ID de curso inválido."),
});

export type DeleteCourseInput = z.infer<typeof deleteCourseSchema>;
