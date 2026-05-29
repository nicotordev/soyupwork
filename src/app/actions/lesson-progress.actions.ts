"use server";

import { requireStudent } from "@/lib/auth/student";
import { userHasActiveEnrollment } from "@/lib/course/get-course-page-data";
import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

type MarkLessonCompleteInput = {
  courseSlug: string;
  lessonId: string;
};

export async function markLessonComplete(
  input: MarkLessonCompleteInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireStudent();

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: input.lessonId,
      module: { course: { slug: input.courseSlug, status: "PUBLISHED" } },
    },
    select: {
      id: true,
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

  const now = new Date();

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId: user.id, lessonId: lesson.id },
    },
    create: {
      userId: user.id,
      lessonId: lesson.id,
      completed: true,
      completedAt: now,
      lastSeenAt: now,
    },
    update: {
      completed: true,
      completedAt: now,
      lastSeenAt: now,
    },
  });

  revalidatePath(`/dashboard/courses/${input.courseSlug}`);
  revalidatePath(`/dashboard/courses/${input.courseSlug}/lessons`);

  return { ok: true };
}
