"use server";

import { ADMIN_COURSES_FILTER_ALL } from "@/constants/courses.constants";
import {
  CourseStatus,
  type CourseLevel,
  type Prisma,
} from "@/generated/prisma/client";
import { adminCourseInclude } from "@/lib/admin/admin-course-include";
import { mapDbCourseToAdminCourseRow } from "@/lib/admin/map-admin-course";
import { parseAdminCoursesParams } from "@/lib/admin/parse-admin-courses-params";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import prisma from "@/lib/prisma";
import type {
  AdminCourseCategoryOption,
  AdminCoursesPageData,
  AdminCoursesStats,
  ParsedAdminCoursesParams,
} from "@/types/admin-course.types";

const log = getServerLogger("courses.actions");

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
  return prisma.courseCategory.findMany({
    orderBy: { position: "asc" },
    select: { slug: true, name: true },
  });
}

export async function getAdminCoursesPageData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<AdminCoursesPageData> {
  const filters = parseAdminCoursesParams(searchParams);

  log.debug(
    {
      page: filters.page,
      pageSize: filters.pageSize,
      status: filters.status,
      level: filters.level,
      hasQuery: filters.q.length > 0,
    },
    "Fetching admin courses page",
  );

  try {
    const where = buildWhere(filters);

    const totalCount = await prisma.course.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalCount / filters.pageSize));
    const page = Math.min(Math.max(1, filters.page), totalPages);
    const skip = (page - 1) * filters.pageSize;

    const [courses, stats, categories] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }],
        skip,
        take: filters.pageSize,
        include: adminCourseInclude,
      }),
      getAdminCoursesStats(),
      getAdminCourseCategories(),
    ]);

    log.info(
      {
        page,
        pageSize: filters.pageSize,
        returned: courses.length,
        totalCount,
      },
      "Admin courses page loaded",
    );

    return {
      courses: courses.map(mapDbCourseToAdminCourseRow),
      stats,
      categories,
      filters: { ...filters, page },
      pagination: {
        page,
        pageSize: filters.pageSize,
        totalCount,
        totalPages,
      },
    };
  } catch (error) {
    log.error(serializeError(error), "Failed to fetch admin courses page");
    throw error;
  }
}
