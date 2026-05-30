"use server";

import { requireStudent } from "@/lib/auth/student";
import { userHasActiveEnrollment } from "@/lib/course/get-course-page-data";
import {
  mapDiscussionRow,
  type DiscussionRow,
} from "@/lib/course/lesson-discussion-tree";
import prisma from "@/lib/db/prisma";
import type { CoursePageLessonComment } from "@/types/course-page.types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createLessonDiscussionSchema = z.object({
  courseSlug: z.string().min(1),
  lessonId: z.string().uuid(),
  body: z
    .string()
    .trim()
    .min(1, "El comentario no puede estar vacío.")
    .max(2000, "El comentario es demasiado largo."),
  parentId: z.string().uuid().optional(),
});

export type CreateLessonDiscussionInput = z.infer<
  typeof createLessonDiscussionSchema
>;

export async function createLessonDiscussion(
  input: CreateLessonDiscussionInput,
): Promise<
  { ok: true; comment: CoursePageLessonComment } | { ok: false; error: string }
> {
  const parsed = createLessonDiscussionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const { courseSlug, lessonId, body, parentId } = parsed.data;
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

  if (parentId) {
    const parent = await prisma.courseDiscussion.findFirst({
      where: {
        id: parentId,
        courseId: lesson.module.courseId,
        lessonId: lesson.id,
      },
      select: { id: true, lessonId: true },
    });

    if (!parent || !parent.lessonId) {
      return { ok: false, error: "No se puede responder a este comentario." };
    }
  }

  const created = await prisma.courseDiscussion.create({
    data: {
      courseId: lesson.module.courseId,
      userId: user.id,
      lessonId: lesson.id,
      body,
      parentId: parentId ?? null,
    },
    select: {
      id: true,
      parentId: true,
      body: true,
      createdAt: true,
      userId: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  revalidatePath(`/courses/${courseSlug}/lessons/${lesson.slug}`);

  return {
    ok: true,
    comment: mapDiscussionRow(created as DiscussionRow),
  };
}

const deleteLessonDiscussionSchema = z.object({
  courseSlug: z.string().min(1),
  lessonId: z.string().uuid(),
  discussionId: z.string().uuid(),
});

export type DeleteLessonDiscussionInput = z.infer<
  typeof deleteLessonDiscussionSchema
>;

export async function deleteLessonDiscussion(
  input: DeleteLessonDiscussionInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = deleteLessonDiscussionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const { courseSlug, lessonId, discussionId } = parsed.data;
  const user = await requireStudent();

  const discussion = await prisma.courseDiscussion.findFirst({
    where: {
      id: discussionId,
      lessonId,
      lesson: {
        id: lessonId,
        module: { course: { slug: courseSlug, status: "PUBLISHED" } },
      },
    },
    select: {
      id: true,
      userId: true,
      lesson: {
        select: { slug: true, module: { select: { courseId: true } } },
      },
    },
  });

  if (!discussion?.lesson) {
    return { ok: false, error: "Comentario no encontrado." };
  }

  if (discussion.userId !== user.id) {
    return { ok: false, error: "No puedes eliminar este comentario." };
  }

  const hasAccess = await userHasActiveEnrollment(
    user.id,
    discussion.lesson.module.courseId,
  );

  if (!hasAccess) {
    return { ok: false, error: "No tienes acceso a este curso." };
  }

  await prisma.courseDiscussion.delete({
    where: { id: discussionId },
  });

  revalidatePath(`/courses/${courseSlug}/lessons/${discussion.lesson.slug}`);

  return { ok: true };
}
