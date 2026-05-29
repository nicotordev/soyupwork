"use server";

import { CourseStatus, EnrollmentStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/admin";
import { requireStudent } from "@/lib/auth/student";
import {
  buildCoursePageData,
  coursePageInclude,
  fetchCompletedLessonIdsForCourse,
  userHasActiveEnrollment,
} from "@/lib/course/get-course-page-data";
import prisma from "@/lib/db/prisma";
import type { CoursePageData } from "@/types/course-page.types";
import { auth } from "@clerk/nextjs/server";

export async function getCoursePageForAdminPreview(
  courseId: string,
): Promise<CoursePageData | null> {
  await requireAdmin();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: coursePageInclude,
  });

  if (!course) return null;

  return buildCoursePageData(course, {
    mode: "adminPreview",
    hasFullAccess: true,
  });
}

/** Public marketing demo — published courses only, full access like admin preview. */
export async function getCoursePageForPublicDemo(
  courseSlug: string,
): Promise<CoursePageData | null> {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug, status: CourseStatus.PUBLISHED },
    include: coursePageInclude,
  });

  if (!course) return null;

  return buildCoursePageData(course, {
    mode: "publicDemo",
    hasFullAccess: true,
  });
}

export async function getCoursePageForPublicLanding(
  courseSlug: string,
  clerkUserId?: string | null,
): Promise<CoursePageData | null> {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug, status: CourseStatus.PUBLISHED },
    include: coursePageInclude,
  });

  if (!course) return null;

  const resolvedClerkUserId =
    clerkUserId !== undefined ? clerkUserId : (await auth()).userId;

  if (!resolvedClerkUserId) {
    return buildCoursePageData(course, {
      mode: "student",
      hasFullAccess: false,
    });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: resolvedClerkUserId },
    select: { id: true },
  });

  if (!user) {
    return buildCoursePageData(course, {
      mode: "student",
      hasFullAccess: false,
    });
  }

  const hasFullAccess = await userHasActiveEnrollment(user.id, course.id);
  const completedLessonIds = hasFullAccess
    ? await fetchCompletedLessonIdsForCourse(user.id, course.id)
    : new Set<string>();

  return buildCoursePageData(course, {
    mode: "student",
    hasFullAccess,
    completedLessonIds,
  });
}

export async function getCoursePageForStudent(
  courseSlug: string,
): Promise<CoursePageData | null> {
  const user = await requireStudent();

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug, status: CourseStatus.PUBLISHED },
    include: coursePageInclude,
  });

  if (!course) return null;

  const hasFullAccess = await userHasActiveEnrollment(user.id, course.id);
  const completedLessonIds = hasFullAccess
    ? await fetchCompletedLessonIdsForCourse(user.id, course.id)
    : new Set<string>();

  return buildCoursePageData(course, {
    mode: "student",
    hasFullAccess,
    completedLessonIds,
  });
}

export async function getStudentEnrolledCourses() {
  const user = await requireStudent();

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: {
        in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED],
      },
      course: { status: CourseStatus.PUBLISHED },
    },
    orderBy: { updatedAt: "desc" },
    select: {
      course: {
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          thumbnailUrl: true,
          level: true,
          priceCents: true,
        },
      },
    },
  });

  return enrollments.map((enrollment) => enrollment.course);
}
