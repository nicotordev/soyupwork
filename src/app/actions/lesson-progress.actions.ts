"use server";

import { requireStudent } from "@/lib/auth/student";
import { userHasActiveEnrollment } from "@/lib/course/get-course-page-data";
import { handleCourseProgressUpdate } from "@/lib/course/handle-course-progress-update";
import { upsertLessonProgressComplete } from "@/lib/course/upsert-lesson-progress-complete";
import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

type MarkLessonCompleteInput = {
  courseSlug: string;
  lessonId: string;
};

export async function markLessonComplete(
  input: MarkLessonCompleteInput,
): Promise<
  | {
      ok: true;
      courseCompleted?: boolean;
      certificateIssued?: boolean;
      newlyIssuedCertificate?: boolean;
    }
  | { ok: false; error: string }
> {
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

  await upsertLessonProgressComplete(user.id, lesson.id, prisma, now);

  const progressUpdate = await handleCourseProgressUpdate({
    userId: user.id,
    courseId: lesson.module.courseId,
    courseSlug: input.courseSlug,
  });

  revalidatePath(`/courses/${input.courseSlug}`);
  revalidatePath(`/courses/${input.courseSlug}/lessons`);

  return {
    ok: true,
    courseCompleted: progressUpdate.courseCompleted,
    certificateIssued: progressUpdate.certificateIssued,
    newlyIssuedCertificate: progressUpdate.newlyIssuedCertificate,
  };
}
