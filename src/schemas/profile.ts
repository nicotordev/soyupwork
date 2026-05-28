import { IMAGE_UPLOAD_CONTENT_TYPES } from "@/lib/storage/image-upload.constants";
import { z } from "zod";

const nullableTrimmedString = (max: number) =>
  z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }, z.string().max(max).nullable());

export const initStudentAvatarUploadSchema = z.object({
  contentType: z.enum(IMAGE_UPLOAD_CONTENT_TYPES),
  contentLength: z.number().int().positive(),
});

export const setStudentAvatarSchema = z.object({
  imageUrl: z
    .string()
    .url("La URL de la imagen no es válida.")
    .max(500, "La URL de la imagen es demasiado larga.")
    .nullable(),
});

export const updateStudentProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(80, "El nombre es demasiado largo."),
  lastName: z
    .string()
    .trim()
    .min(1, "El apellido es obligatorio.")
    .max(80, "El apellido es demasiado largo."),
  bio: nullableTrimmedString(300),
});

export type InitStudentAvatarUploadInput = z.infer<
  typeof initStudentAvatarUploadSchema
>;
export type SetStudentAvatarInput = z.infer<typeof setStudentAvatarSchema>;
export type UpdateStudentProfileInput = z.infer<
  typeof updateStudentProfileSchema
>;
