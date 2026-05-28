"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/shared/error";
import { requireStudent } from "@/lib/auth/student";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { getResolvedUploadLimits } from "@/lib/platform/settings/resolve";
import {
  assertUserAvatarUrlAllowed,
  createUserAvatarUploadUrl,
  isR2Configured,
  StorageConfigError,
  type ImageUploadContentType,
} from "@/lib/storage/r2";
import {
  initStudentAvatarUploadSchema,
  setStudentAvatarSchema,
  updateStudentProfileSchema,
} from "@/schemas/profile";
import type {
  GetStudentProfileResult,
  InitStudentAvatarUploadResult,
  SetStudentAvatarResult,
  StudentProfile,
  UpdateStudentProfileResult,
} from "@/types/student-profile.types";
import { revalidatePath } from "next/cache";

const log = getServerLogger("profile.actions");

const profileSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  imageUrl: true,
  bio: true,
} as const;

function clerkErrorMessage(error: unknown): string {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "No se pudo actualizar el perfil.";
}

export async function getStudentProfile(): Promise<GetStudentProfileResult> {
  try {
    const student = await requireStudent();
    const [user, { maxFileSizeMb }] = await Promise.all([
      prisma.user.findUnique({
        where: { id: student.id },
        select: profileSelect,
      }),
      getResolvedUploadLimits(),
    ]);

    if (!user) {
      return { ok: false, error: "Usuario no encontrado." };
    }

    return {
      ok: true,
      profile: user,
      storageConfigured: isR2Configured(),
      maxAvatarSizeMb: Math.min(maxFileSizeMb, 5),
    };
  } catch (error) {
    log.error(serializeError(error), "Failed to load student profile");
    return { ok: false, error: "No se pudo cargar tu perfil." };
  }
}

export async function initStudentAvatarUpload(
  input: unknown,
): Promise<InitStudentAvatarUploadResult> {
  try {
    const student = await requireStudent();

    if (!isR2Configured()) {
      return {
        ok: false,
        error:
          "El almacenamiento de imágenes no está configurado. Contacta a soporte.",
      };
    }

    const parsed = initStudentAvatarUploadSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const { maxFileSizeMb } = await getResolvedUploadLimits();
    const maxBytes = Math.min(maxFileSizeMb, 5) * 1024 * 1024;

    if (parsed.data.contentLength > maxBytes) {
      return {
        ok: false,
        error: `La imagen no puede superar ${Math.min(maxFileSizeMb, 5)} MB.`,
      };
    }

    const { uploadUrl, imageUrl } = await createUserAvatarUploadUrl({
      userId: student.id,
      contentType: parsed.data.contentType as ImageUploadContentType,
      contentLength: parsed.data.contentLength,
    });

    return { ok: true, uploadUrl, imageUrl };
  } catch (error) {
    if (error instanceof StorageConfigError) {
      return { ok: false, error: error.message };
    }

    log.error(serializeError(error), "Failed to init student avatar upload");
    return { ok: false, error: "No se pudo iniciar la subida de la imagen." };
  }
}

export async function setStudentAvatar(
  input: unknown,
): Promise<SetStudentAvatarResult> {
  try {
    const student = await requireStudent();
    const parsed = setStudentAvatarSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    if (parsed.data.imageUrl) {
      await assertUserAvatarUrlAllowed(parsed.data.imageUrl, student.id);
    }

    const updated = await prisma.user.update({
      where: { id: student.id },
      data: { imageUrl: parsed.data.imageUrl },
      select: profileSelect,
    });

    revalidateStudentPaths();

    return { ok: true, imageUrl: updated.imageUrl };
  } catch (error) {
    if (error instanceof StorageConfigError) {
      return { ok: false, error: error.message };
    }

    log.error(serializeError(error), "Failed to set student avatar");
    return { ok: false, error: "No se pudo guardar la foto de perfil." };
  }
}

export async function updateStudentProfile(
  input: unknown,
): Promise<UpdateStudentProfileResult> {
  try {
    const student = await requireStudent();
    const parsed = updateStudentProfileSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const { firstName, lastName, bio } = parsed.data;

    const client = await clerkClient();
    await client.users.updateUser(student.clerkId, {
      firstName,
      lastName,
    });

    const updated = await prisma.user.update({
      where: { id: student.id },
      data: { firstName, lastName, bio },
      select: profileSelect,
    });

    revalidateStudentPaths();

    log.info({ userId: student.id }, "Student profile updated");

    return { ok: true, profile: updated };
  } catch (error) {
    log.error(serializeError(error), "Failed to update student profile");
    return { ok: false, error: clerkErrorMessage(error) };
  }
}

function revalidateStudentPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/progress");
  revalidatePath("/dashboard/certificates");
  revalidatePath("/dashboard/profile");
}
