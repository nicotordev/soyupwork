import {
  ADMIN_COURSES_DEFAULT_PAGE,
  ADMIN_COURSES_DEFAULT_PAGE_SIZE,
  ADMIN_COURSES_FILTER_ALL,
  ADMIN_COURSES_MAX_PAGE_SIZE,
  ADMIN_COURSES_PAGE_SIZE_OPTIONS,
} from "@/constants/courses.constants";
import { CourseStatus, type Prisma } from "@/generated/prisma/client";
import { formatAdminCoursePrice } from "@/lib/admin/formatters";
import {
  courseLevelLabel,
  isCourseLevelValue,
  type CourseLevelValue,
} from "@/lib/catalog/course-level";
import type {
  AdminCourseRow,
  ParsedAdminCoursesParams,
} from "@/types/admin-course.types";

export const adminCourseInclude = {
  category: { select: { name: true, slug: true } },
  instructor: { select: { firstName: true, lastName: true } },
  modules: {
    orderBy: { position: "asc" as const },
    select: {
      id: true,
      lessons: { select: { id: true } },
    },
  },
  _count: { select: { enrollments: true } },
} satisfies Prisma.CourseInclude;

export type DbAdminCourse = Prisma.CourseGetPayload<{
  include: typeof adminCourseInclude;
}>;

function instructorDisplayName(
  instructor: DbAdminCourse["instructor"],
): string {
  if (!instructor) return "Sin asignar";
  const name = [instructor.firstName, instructor.lastName]
    .filter(Boolean)
    .join(" ");
  return name || "Sin asignar";
}

export function mapDbCourseToAdminCourseRow(
  dbCourse: DbAdminCourse,
): AdminCourseRow {
  const lessonCount = dbCourse.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );

  return {
    id: dbCourse.id,
    slug: dbCourse.slug,
    title: dbCourse.title,
    description: dbCourse.description ?? "",
    thumbnailUrl: dbCourse.thumbnailUrl,
    status: dbCourse.status,
    level: dbCourse.level,
    levelLabel: courseLevelLabel(dbCourse.level),
    categoryName: dbCourse.category?.name ?? null,
    categorySlug: dbCourse.category?.slug ?? null,
    priceLabel: formatAdminCoursePrice(dbCourse.priceCents, dbCourse.currency),
    priceCents: dbCourse.priceCents,
    isFree: dbCourse.priceCents === 0,
    isFeatured: dbCourse.isFeatured,
    offersCertificate: dbCourse.offersCertificate,
    enrollmentCount: dbCourse._count.enrollments,
    moduleCount: dbCourse.modules.length,
    lessonCount,
    instructorName: instructorDisplayName(dbCourse.instructor),
    updatedAt: dbCourse.updatedAt.toISOString(),
  };
}

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
  if (isCourseLevelValue(raw)) {
    return raw as CourseLevelValue;
  }
  return ADMIN_COURSES_FILTER_ALL;
}

function parsePositiveInt(
  raw: string | undefined,
  fallback: number,
  max?: number,
): number {
  const parsed = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  if (max !== undefined && parsed > max) return max;
  return parsed;
}

function parsePageSize(raw: string | undefined): number {
  const parsed = parsePositiveInt(
    raw,
    ADMIN_COURSES_DEFAULT_PAGE_SIZE,
    ADMIN_COURSES_MAX_PAGE_SIZE,
  );
  const allowed = ADMIN_COURSES_PAGE_SIZE_OPTIONS as readonly number[];
  if (allowed.includes(parsed)) return parsed;
  return ADMIN_COURSES_DEFAULT_PAGE_SIZE;
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

  const page = parsePositiveInt(
    firstParam(searchParams.page),
    ADMIN_COURSES_DEFAULT_PAGE,
  );
  const pageSize = parsePageSize(firstParam(searchParams.pageSize));

  return { q, status, level, categorySlug, page, pageSize };
}
