"use server";

import { CourseStatus, EnrollmentStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { displayName } from "@/lib/user/display-name";
import type {
  AdminCohortRow,
  AdminCohortsStatusFilter,
  AdminCohortsPageData,
} from "@/types/admin-cohorts.types";

const log = getServerLogger("cohorts.actions");
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const STATUS_FILTER_ALL = "ALL";

function mapCourseStatusToCohortStatus(
  status: CourseStatus,
): AdminCohortRow["status"] {
  if (status === CourseStatus.PUBLISHED) return "OPEN";
  if (status === CourseStatus.DRAFT) return "CLOSED";
  return "FINISHED";
}

function capacityFor(studentsCount: number): number {
  return Math.max(25, Math.ceil(studentsCount / 5) * 5);
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
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

function parseStatus(raw: string | undefined): AdminCohortsStatusFilter {
  if (!raw) return STATUS_FILTER_ALL;
  if (raw === "OPEN" || raw === "CLOSED" || raw === "FINISHED") return raw;
  return STATUS_FILTER_ALL;
}

function mapFilterToCourseStatus(
  status: AdminCohortsStatusFilter,
): CourseStatus[] {
  if (status === "OPEN") return [CourseStatus.PUBLISHED];
  if (status === "CLOSED") return [CourseStatus.DRAFT];
  if (status === "FINISHED") return [CourseStatus.ARCHIVED];
  return [CourseStatus.PUBLISHED, CourseStatus.DRAFT, CourseStatus.ARCHIVED];
}

export async function getAdminCohortsPageData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<AdminCohortsPageData> {
  await requireAdmin();

  try {
    const q = firstParam(searchParams.q)?.trim() ?? "";
    const status = parseStatus(firstParam(searchParams.status));
    const pageSize = parsePositiveInt(
      firstParam(searchParams.pageSize),
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    );

    const where = {
      status: { in: mapFilterToCourseStatus(status) },
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              {
                instructor: {
                  is: {
                    OR: [
                      {
                        firstName: {
                          contains: q,
                          mode: "insensitive" as const,
                        },
                      },
                      {
                        lastName: { contains: q, mode: "insensitive" as const },
                      },
                      { email: { contains: q, mode: "insensitive" as const } },
                    ],
                  },
                },
              },
            ],
          }
        : {}),
    };

    const totalCount = await prisma.course.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const page = Math.min(
      Math.max(
        parsePositiveInt(firstParam(searchParams.page), DEFAULT_PAGE),
        1,
      ),
      totalPages,
    );
    const skip = (page - 1) * pageSize;

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        instructor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            enrollments: {
              where: {
                status: {
                  in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED],
                },
              },
            },
          },
        },
      },
    });

    const cohorts: AdminCohortRow[] = courses.map((course) => {
      const studentsCount = course._count.enrollments;
      return {
        id: `coh_${course.id.slice(0, 8)}`,
        name: `Grupo ${course.title}`,
        startDate: course.createdAt.toISOString(),
        studentsCount,
        maxStudents: capacityFor(studentsCount),
        status: mapCourseStatusToCohortStatus(course.status),
        instructor: course.instructor
          ? displayName(course.instructor)
          : "Sin instructor",
      };
    });

    return {
      cohorts,
      filters: { q, status, page, pageSize },
      pagination: { page, pageSize, totalCount, totalPages },
    };
  } catch (error) {
    log.error(serializeError(error), "Failed to load admin cohorts page data");
    throw error;
  }
}
