import { ADMIN_COURSES_FILTER_ALL } from "@/constants/courses.constants";
import {
  CourseStatus,
  type CourseLevel,
  type Prisma,
} from "@/generated/prisma/client";
import { adminCourseInclude } from "@/lib/admin/admin-course-include";
import { mapDbCourseToAdminCourseRow } from "@/lib/admin/map-admin-course";
import { parseAdminCoursesParams } from "@/lib/admin/parse-admin-courses-params";
import prisma from "@/lib/prisma";
import type {
  AdminCourseCategoryOption,
  AdminCoursesPageData,
  AdminCoursesStats,
  ParsedAdminCoursesParams,
} from "@/types/admin-course.types";

function buildWhere(params: ParsedAdminCoursesParams): Prisma.CourseWhereInput {
  const where: Prisma.CourseWhereInput = {};

  const q = params.q.trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }

  if (params.status !== ADMIN_COURSES_FILTER_ALL) {
    where.status = params.status;
  }

  if (params.level !== ADMIN_COURSES_FILTER_ALL) {
    where.level = params.level as CourseLevel;
  }

  if (params.categorySlug !== ADMIN_COURSES_FILTER_ALL) {
    where.category = { slug: params.categorySlug };
  }

  return where;
}

export async function getAdminCoursesStats(): Promise<AdminCoursesStats> {
  const [total, published, draft, archived] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { status: CourseStatus.PUBLISHED } }),
    prisma.course.count({ where: { status: CourseStatus.DRAFT } }),
    prisma.course.count({ where: { status: CourseStatus.ARCHIVED } }),
  ]);

  return { total, published, draft, archived };
}

async function getAdminCourseCategories(): Promise<
  AdminCourseCategoryOption[]
> {
  const categories = await prisma.courseCategory.findMany({
    orderBy: { position: "asc" },
    select: { slug: true, name: true },
  });
  return categories;
}

export async function getAdminCoursesPageData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<AdminCoursesPageData> {
  const filters = parseAdminCoursesParams(searchParams);
  const where = buildWhere(filters);

  const [courses, stats, categories] = await Promise.all([
    prisma.course.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      include: adminCourseInclude,
    }),
    getAdminCoursesStats(),
    getAdminCourseCategories(),
  ]);

  return {
    courses: courses.map(mapDbCourseToAdminCourseRow),
    stats,
    categories,
    filters,
  };
}
