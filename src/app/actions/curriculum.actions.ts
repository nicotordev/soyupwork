"use server";

import { LessonVideoStatus } from "@/generated/prisma/client";
import {
  assertCourseExists,
  assertLessonBelongsToCourse,
  assertModuleBelongsToCourse,
  curriculumInclude,
  mapDbCourseToAdminCurriculum,
  normalizeLessonPositions,
  normalizeModulePositions,
  resolveLessonSlug,
  resolveUniqueLessonSlug,
} from "@/lib/admin/curriculum";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { MuxConfigError, isMuxConfigured } from "@/lib/mux/config";
import { createLessonDirectUpload } from "@/lib/mux/direct-upload";
import { getResolvedUploadLimits } from "@/lib/platform/settings/resolve";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import {
  createLessonSchema,
  createModuleSchema,
  deleteLessonSchema,
  deleteModuleSchema,
  initLessonVideoUploadSchema,
  lessonIdCourseSchema,
  reorderLessonSchema,
  reorderModuleSchema,
  updateLessonSchema,
  updateModuleSchema,
  type CreateLessonInput,
  type CreateModuleInput,
  type DeleteLessonInput,
  type DeleteModuleInput,
  type ReorderLessonInput,
  type ReorderModuleInput,
  type UpdateLessonInput,
  type UpdateModuleInput,
} from "@/schemas/curriculum";
import type {
  AdminCourseCurriculumData,
  InitLessonVideoUploadData,
  LessonVideoStatusData,
} from "@/types/admin-curriculum.types";
import { revalidatePath } from "next/cache";

const log = getServerLogger("curriculum.actions");

function revalidateCurriculumPaths(courseId: string) {
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}/curriculum`);
  revalidatePath("/catalog");
}

type ActionError = { ok: false; error: string };
type ActionOk = { ok: true };

function validationError(
  message: string | undefined,
  fallback = "Datos inválidos.",
): ActionError {
  return { ok: false, error: message ?? fallback };
}

export async function getAdminCourseCurriculum(
  courseId: string,
): Promise<AdminCourseCurriculumData | null> {
  await requireAdmin();

  const [course, settings, uploadLimits] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      include: curriculumInclude,
    }),
    getPlatformSettings(),
    getResolvedUploadLimits(),
  ]);

  if (!course) return null;

  return mapDbCourseToAdminCurriculum(course, {
    muxConfigured: isMuxConfigured(),
    muxStreamingEnabled: settings.enableMuxStreaming,
    maxVideoSizeMb: uploadLimits.maxVideoSizeMb,
  });
}

export async function createModule(
  input: CreateModuleInput,
): Promise<ActionOk | ActionError> {
  try {
    await requireAdmin();

    const parsed = createModuleSchema.safeParse(input);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0]?.message);
    }

    await assertCourseExists(parsed.data.courseId);

    const maxPosition = await prisma.courseModule.aggregate({
      where: { courseId: parsed.data.courseId },
      _max: { position: true },
    });

    const created = await prisma.courseModule.create({
      data: {
        courseId: parsed.data.courseId,
        title: parsed.data.title,
        description: parsed.data.description?.trim() || null,
        position: (maxPosition._max.position ?? -1) + 1,
      },
      select: { id: true },
    });

    revalidateCurriculumPaths(parsed.data.courseId);
    log.info({ moduleId: created.id }, "Module created");

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to create module");
    return { ok: false, error: "No se pudo crear el módulo." };
  }
}

export async function updateModule(
  input: UpdateModuleInput,
): Promise<ActionOk | ActionError> {
  try {
    await requireAdmin();

    const parsed = updateModuleSchema.safeParse(input);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0]?.message);
    }

    await assertModuleBelongsToCourse(parsed.data.id, parsed.data.courseId);

    await prisma.courseModule.update({
      where: { id: parsed.data.id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description?.trim() || null,
      },
    });

    revalidateCurriculumPaths(parsed.data.courseId);
    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to update module");
    return { ok: false, error: "No se pudo actualizar el módulo." };
  }
}

export async function deleteModule(
  input: DeleteModuleInput,
): Promise<ActionOk | ActionError> {
  try {
    await requireAdmin();

    const parsed = deleteModuleSchema.safeParse(input);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0]?.message);
    }

    await assertModuleBelongsToCourse(parsed.data.id, parsed.data.courseId);

    await prisma.courseModule.delete({ where: { id: parsed.data.id } });
    await normalizeModulePositions(parsed.data.courseId);

    revalidateCurriculumPaths(parsed.data.courseId);
    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to delete module");
    return { ok: false, error: "No se pudo eliminar el módulo." };
  }
}

export async function reorderModule(
  input: ReorderModuleInput,
): Promise<ActionOk | ActionError> {
  try {
    await requireAdmin();

    const parsed = reorderModuleSchema.safeParse(input);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0]?.message);
    }

    const modules = await prisma.courseModule.findMany({
      where: { courseId: parsed.data.courseId },
      orderBy: { position: "asc" },
      select: { id: true, position: true },
    });

    const index = modules.findIndex((mod) => mod.id === parsed.data.id);
    if (index === -1) {
      return { ok: false, error: "Módulo no encontrado." };
    }

    const swapIndex = parsed.data.direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= modules.length) {
      return { ok: true };
    }

    const current = modules[index];
    const neighbor = modules[swapIndex];

    await prisma.$transaction([
      prisma.courseModule.update({
        where: { id: current.id },
        data: { position: neighbor.position },
      }),
      prisma.courseModule.update({
        where: { id: neighbor.id },
        data: { position: current.position },
      }),
    ]);

    revalidateCurriculumPaths(parsed.data.courseId);
    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to reorder module");
    return { ok: false, error: "No se pudo reordenar el módulo." };
  }
}

export async function createLesson(
  input: CreateLessonInput,
): Promise<ActionOk | ActionError> {
  try {
    await requireAdmin();

    const parsed = createLessonSchema.safeParse(input);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0]?.message);
    }

    await assertModuleBelongsToCourse(
      parsed.data.moduleId,
      parsed.data.courseId,
    );

    const maxPosition = await prisma.lesson.aggregate({
      where: { moduleId: parsed.data.moduleId },
      _max: { position: true },
    });

    const position = (maxPosition._max.position ?? -1) + 1;
    const baseSlug =
      parsed.data.slug?.trim() ||
      resolveLessonSlug(parsed.data.title, position);
    const slug = await resolveUniqueLessonSlug(parsed.data.moduleId, baseSlug);

    const created = await prisma.lesson.create({
      data: {
        moduleId: parsed.data.moduleId,
        title: parsed.data.title,
        slug,
        type: parsed.data.type,
        position,
      },
      select: { id: true },
    });

    revalidateCurriculumPaths(parsed.data.courseId);
    log.info({ lessonId: created.id }, "Lesson created");

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to create lesson");
    return { ok: false, error: "No se pudo crear la lección." };
  }
}

export async function updateLesson(
  input: UpdateLessonInput,
): Promise<ActionOk | ActionError> {
  try {
    await requireAdmin();

    const parsed = updateLessonSchema.safeParse(input);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0]?.message);
    }

    const lesson = await assertLessonBelongsToCourse(
      parsed.data.id,
      parsed.data.courseId,
    );

    const slugConflict = await prisma.lesson.findFirst({
      where: {
        moduleId: lesson.moduleId,
        slug: parsed.data.slug,
        id: { not: parsed.data.id },
      },
      select: { id: true },
    });

    if (slugConflict) {
      return { ok: false, error: "Ese slug ya está en uso en el módulo." };
    }

    await prisma.lesson.update({
      where: { id: parsed.data.id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description?.trim() || null,
        type: parsed.data.type,
        content:
          parsed.data.type === "TEXT"
            ? (parsed.data.content?.trim() ?? "")
            : null,
        isPreview: parsed.data.isPreview,
      },
    });

    revalidateCurriculumPaths(parsed.data.courseId);
    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to update lesson");
    return { ok: false, error: "No se pudo actualizar la lección." };
  }
}

export async function deleteLesson(
  input: DeleteLessonInput,
): Promise<ActionOk | ActionError> {
  try {
    await requireAdmin();

    const parsed = deleteLessonSchema.safeParse(input);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0]?.message);
    }

    const lesson = await assertLessonBelongsToCourse(
      parsed.data.id,
      parsed.data.courseId,
    );

    await prisma.lesson.delete({ where: { id: parsed.data.id } });
    await normalizeLessonPositions(lesson.moduleId);

    revalidateCurriculumPaths(parsed.data.courseId);
    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to delete lesson");
    return { ok: false, error: "No se pudo eliminar la lección." };
  }
}

export async function reorderLesson(
  input: ReorderLessonInput,
): Promise<ActionOk | ActionError> {
  try {
    await requireAdmin();

    const parsed = reorderLessonSchema.safeParse(input);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0]?.message);
    }

    const lesson = await assertLessonBelongsToCourse(
      parsed.data.id,
      parsed.data.courseId,
    );

    const lessons = await prisma.lesson.findMany({
      where: { moduleId: lesson.moduleId },
      orderBy: { position: "asc" },
      select: { id: true, position: true },
    });

    const index = lessons.findIndex((item) => item.id === parsed.data.id);
    if (index === -1) {
      return { ok: false, error: "Lección no encontrada." };
    }

    const swapIndex = parsed.data.direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= lessons.length) {
      return { ok: true };
    }

    const current = lessons[index];
    const neighbor = lessons[swapIndex];

    await prisma.$transaction([
      prisma.lesson.update({
        where: { id: current.id },
        data: { position: neighbor.position },
      }),
      prisma.lesson.update({
        where: { id: neighbor.id },
        data: { position: current.position },
      }),
    ]);

    revalidateCurriculumPaths(parsed.data.courseId);
    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to reorder lesson");
    return { ok: false, error: "No se pudo reordenar la lección." };
  }
}

export async function initLessonVideoUpload(input: {
  lessonId: string;
  courseId: string;
}): Promise<({ ok: true } & InitLessonVideoUploadData) | ActionError> {
  try {
    await requireAdmin();

    const parsed = initLessonVideoUploadSchema.safeParse(input);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0]?.message);
    }

    await assertLessonBelongsToCourse(
      parsed.data.lessonId,
      parsed.data.courseId,
    );

    const settings = await getPlatformSettings();
    if (!settings.enableMuxStreaming) {
      return {
        ok: false,
        error: "El streaming Mux está deshabilitado en ajustes.",
      };
    }

    if (!isMuxConfigured()) {
      return {
        ok: false,
        error:
          "Mux no está configurado. Revisa MUX_TOKEN_ID y MUX_TOKEN_SECRET.",
      };
    }

    const { uploadId, uploadUrl } = await createLessonDirectUpload();

    await prisma.lesson.update({
      where: { id: parsed.data.lessonId },
      data: {
        type: "VIDEO",
        videoProvider: "mux",
        videoAssetId: uploadId,
        videoStatus: LessonVideoStatus.PENDING,
        videoPlaybackId: null,
        videoUrl: null,
      },
    });

    revalidateCurriculumPaths(parsed.data.courseId);

    return { ok: true, uploadId, uploadUrl };
  } catch (error) {
    if (error instanceof MuxConfigError) {
      return { ok: false, error: error.message };
    }

    log.error(serializeError(error), "Failed to init lesson video upload");
    return { ok: false, error: "No se pudo iniciar la subida de vídeo." };
  }
}

export async function clearLessonVideo(input: {
  lessonId: string;
  courseId: string;
}): Promise<ActionOk | ActionError> {
  try {
    await requireAdmin();

    const parsed = lessonIdCourseSchema.safeParse(input);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0]?.message);
    }

    await assertLessonBelongsToCourse(
      parsed.data.lessonId,
      parsed.data.courseId,
    );

    await prisma.lesson.update({
      where: { id: parsed.data.lessonId },
      data: {
        videoProvider: null,
        videoAssetId: null,
        videoPlaybackId: null,
        videoUrl: null,
        videoStatus: null,
      },
    });

    revalidateCurriculumPaths(parsed.data.courseId);
    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to clear lesson video");
    return { ok: false, error: "No se pudo quitar el vídeo." };
  }
}

export async function getLessonVideoStatus(input: {
  lessonId: string;
  courseId: string;
}): Promise<({ ok: true } & LessonVideoStatusData) | ActionError> {
  try {
    await requireAdmin();

    const parsed = lessonIdCourseSchema.safeParse(input);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0]?.message);
    }

    await assertLessonBelongsToCourse(
      parsed.data.lessonId,
      parsed.data.courseId,
    );

    const lesson = await prisma.lesson.findUnique({
      where: { id: parsed.data.lessonId },
      select: { videoStatus: true, videoPlaybackId: true },
    });

    if (!lesson) {
      return { ok: false, error: "Lección no encontrada." };
    }

    return {
      ok: true,
      videoStatus: lesson.videoStatus,
      videoPlaybackId: lesson.videoPlaybackId,
    };
  } catch (error) {
    log.error(serializeError(error), "Failed to get lesson video status");
    return { ok: false, error: "No se pudo obtener el estado del vídeo." };
  }
}
