"use server";

import { EnrollmentStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { displayName } from "@/lib/user/display-name";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const log = getServerLogger("enrollments.actions");

const enrollUserSchema = z.object({
  userId: z.uuid(),
  courseId: z.uuid(),
});

const revokeEnrollmentSchema = z.object({
  userId: z.uuid(),
  courseId: z.uuid(),
});

export type AdminCourseEnrollmentRow = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string | null;
  status: EnrollmentStatus;
  completedAt: string | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminCourseEnrollmentsPageData = {
  course: {
    id: string;
    title: string;
    slug: string;
  };
  enrollments: AdminCourseEnrollmentRow[];
};

export type EnrollmentActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function getCourseEnrollmentsPageData(
  courseId: string,
): Promise<AdminCourseEnrollmentsPageData | null> {
  await requireAdmin();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, title: true, slug: true },
  });

  if (!course) {
    return null;
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { courseId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return {
    course,
    enrollments: enrollments.map((enrollment) => ({
      id: enrollment.id,
      userId: enrollment.userId,
      userName: displayName(enrollment.user),
      userEmail: enrollment.user.email,
      status: enrollment.status,
      completedAt: enrollment.completedAt?.toISOString() ?? null,
      source: enrollment.source,
      createdAt: enrollment.createdAt.toISOString(),
      updatedAt: enrollment.updatedAt.toISOString(),
    })),
  };
}

export async function searchUsersForEnrollment(
  query: string,
): Promise<Array<{ id: string; label: string; email: string | null }>> {
  await requireAdmin();

  const q = query.trim();
  if (q.length < 2) {
    return [];
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: q, mode: "insensitive" } },
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  return users.map((user) => ({
    id: user.id,
    label: displayName(user),
    email: user.email,
  }));
}

export async function adminEnrollUser(
  input: z.infer<typeof enrollUserSchema>,
): Promise<EnrollmentActionResult> {
  try {
    await requireAdmin();

    const parsed = enrollUserSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Datos inválidos." };
    }

    const [user, course] = await Promise.all([
      prisma.user.findUnique({
        where: { id: parsed.data.userId },
        select: { id: true },
      }),
      prisma.course.findUnique({
        where: { id: parsed.data.courseId },
        select: { id: true, slug: true },
      }),
    ]);

    if (!user) {
      return { ok: false, error: "Usuario no encontrado." };
    }

    if (!course) {
      return { ok: false, error: "Curso no encontrado." };
    }

    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: parsed.data.userId,
          courseId: parsed.data.courseId,
        },
      },
      create: {
        userId: parsed.data.userId,
        courseId: parsed.data.courseId,
        status: EnrollmentStatus.ACTIVE,
        source: "admin",
      },
      update: {
        status: EnrollmentStatus.ACTIVE,
        source: "admin",
      },
    });

    revalidatePath(`/admin/courses/${course.id}/enrollments`);
    revalidatePath(`/courses/${course.slug}`);

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Admin enroll failed");
    return { ok: false, error: "No se pudo inscribir al usuario." };
  }
}

export async function adminRevokeEnrollment(
  input: z.infer<typeof revokeEnrollmentSchema>,
): Promise<EnrollmentActionResult> {
  try {
    await requireAdmin();

    const parsed = revokeEnrollmentSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Datos inválidos." };
    }

    const course = await prisma.course.findUnique({
      where: { id: parsed.data.courseId },
      select: { slug: true },
    });

    const result = await prisma.enrollment.updateMany({
      where: {
        userId: parsed.data.userId,
        courseId: parsed.data.courseId,
      },
      data: {
        status: EnrollmentStatus.CANCELLED,
      },
    });

    if (result.count === 0) {
      return { ok: false, error: "Inscripción no encontrada." };
    }

    if (course) {
      revalidatePath(`/courses/${course.slug}`);
    }
    revalidatePath(`/admin/courses/${parsed.data.courseId}/enrollments`);

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Admin revoke enrollment failed");
    return { ok: false, error: "No se pudo revocar la inscripción." };
  }
}
