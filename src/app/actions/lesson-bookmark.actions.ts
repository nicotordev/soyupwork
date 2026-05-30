"use server";

import { requireStudent } from "@/lib/auth/student";
import { userHasActiveEnrollment } from "@/lib/course/get-course-page-data";
import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const toggleLessonBookmarkSchema = z.object({
  courseSlug: z.string().min(1),
  lessonId: z.string().uuid(),
});

export type ToggleLessonBookmarkInput = z.infer<
  typeof toggleLessonBookmarkSchema
>;

export async function toggleLessonBookmark(
  input: ToggleLessonBookmarkInput,
): Promise<{ ok: true; bookmarked: boolean } | { ok: false; error: string }> {
  const parsed = toggleLessonBookmarkSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const { courseSlug, lessonId } = parsed.data;
  const user = await requireStudent();

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      module: { course: { slug: courseSlug, status: "PUBLISHED" } },
    },
    select: {
      id: true,
      slug: true,
      module: { select: { courseId: true } },
    },
  });

  if (!lesson) {
    return { ok: false, error: "Lección no encontrada." };
  }

  const hasAccess = await userHasActiveEnrollment(
    user.id,
    lesson.module.courseId,
  );

  if (!hasAccess) {
    return { ok: false, error: "No tienes acceso a este curso." };
  }

  const existing = await prisma.lessonBookmark.findUnique({
    where: {
      userId_lessonId: { userId: user.id, lessonId: lesson.id },
    },
    select: { id: true },
  });

  if (existing) {
    await prisma.lessonBookmark.delete({ where: { id: existing.id } });
    revalidatePath(`/courses/${courseSlug}`);
    revalidatePath(`/courses/${courseSlug}/lessons/${lesson.slug}`);
    revalidatePath("/dashboard");
    return { ok: true, bookmarked: false };
  }

  await prisma.lessonBookmark.create({
    data: {
      userId: user.id,
      lessonId: lesson.id,
    },
  });

  revalidatePath(`/courses/${courseSlug}`);
  revalidatePath(`/courses/${courseSlug}/lessons/${lesson.slug}`);
  revalidatePath("/dashboard");

  return { ok: true, bookmarked: true };
}
