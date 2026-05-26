import { ADMIN_COURSES_FILTER_ALL } from "@/constants/courses.constants";
import { CourseLevel, CourseStatus } from "@/generated/prisma/client";
import type { ParsedAdminCoursesParams } from "@/types/admin-course.types";

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseStatus(
  raw: string | undefined,
): ParsedAdminCoursesParams["status"] {
  if (!raw || raw === ADMIN_COURSES_FILTER_ALL) return ADMIN_COURSES_FILTER_ALL;
  if (Object.values(CourseStatus).includes(raw as CourseStatus)) {
    return raw as CourseStatus;
  }
  return ADMIN_COURSES_FILTER_ALL;
}

function parseLevel(
  raw: string | undefined,
): ParsedAdminCoursesParams["level"] {
  if (!raw || raw === ADMIN_COURSES_FILTER_ALL) return ADMIN_COURSES_FILTER_ALL;
  if (Object.values(CourseLevel).includes(raw as CourseLevel)) {
    return raw as CourseLevel;
  }
  return ADMIN_COURSES_FILTER_ALL;
}

export function parseAdminCoursesParams(
  searchParams: Record<string, string | string[] | undefined>,
): ParsedAdminCoursesParams {
  const q = firstParam(searchParams.q)?.trim() ?? "";
  const status = parseStatus(firstParam(searchParams.status));
  const level = parseLevel(firstParam(searchParams.level));
  const categoryRaw = firstParam(searchParams.category);
  const categorySlug =
    categoryRaw && categoryRaw !== ADMIN_COURSES_FILTER_ALL
      ? categoryRaw
      : ADMIN_COURSES_FILTER_ALL;

  return { q, status, level, categorySlug };
}
