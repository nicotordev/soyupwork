import { CourseStatus, type Prisma } from "@/generated/prisma/client";
import {
  DURATION_BUCKETS,
  courseHoursMatchesBucket,
} from "@/lib/catalog/filters";
import { mapDbCourseToCatalogCourse } from "@/lib/catalog/map-catalog-course";
import type { ParsedCatalogParams } from "@/lib/catalog/filters";
import prisma from "@/lib/db/prisma";
import type { Course } from "@/types/catalog-course";

const courseInclude = {
  category: { select: { name: true, slug: true } },
  instructor: { select: { firstName: true, lastName: true } },
  tags: {
    include: { tag: { select: { name: true } } },
  },
  reviews: { select: { rating: true } },
  modules: {
    orderBy: { position: "asc" as const },
    include: {
      lessons: {
        orderBy: { position: "asc" as const },
        select: { durationSec: true },
      },
    },
  },
  _count: {
    select: { enrollments: true },
  },
} satisfies Prisma.CourseInclude;

function buildWhere(params: ParsedCatalogParams): Prisma.CourseWhereInput {
  const where: Prisma.CourseWhereInput = {
    status: CourseStatus.PUBLISHED,
  };

  const q = params.q.trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      {
        tags: {
          some: {
            tag: {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { slug: { contains: q, mode: "insensitive" } },
              ],
            },
          },
        },
      },
    ];
  }

  if (params.categorySlugs.length > 0) {
    where.category = { slug: { in: params.categorySlugs } };
  }

  if (params.levelEnums.length > 0) {
    where.level = { in: params.levelEnums };
  }

  if (params.selectedAccess === "free") {
    where.priceCents = 0;
  } else if (params.selectedAccess === "paid") {
    where.priceCents = { gt: 0 };
  }

  if (params.selectedCertificate === "yes") {
    where.offersCertificate = true;
  } else if (params.selectedCertificate === "no") {
    where.offersCertificate = false;
  }

  return where;
}

function buildOrderBy(sortBy: string): Prisma.CourseOrderByWithRelationInput[] {
  switch (sortBy) {
    case "featured":
      return [{ isFeatured: "desc" }, { createdAt: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    case "rating":
    case "trending":
      return [{ reviews: { _count: "desc" } }, { createdAt: "desc" }];
    case "popular":
    default:
      return [{ enrollments: { _count: "desc" } }, { createdAt: "desc" }];
  }
}

function matchesDurationFilters(
  course: Course,
  selectedDurations: string[],
): boolean {
  if (selectedDurations.length === 0) return true;

  return selectedDurations.some((label) => {
    const durationObj = DURATION_BUCKETS.find((d) => d.label === label);
    if (!durationObj) return false;
    return courseHoursMatchesBucket(course.durationHours, durationObj);
  });
}

export async function getCatalogCourses(params: ParsedCatalogParams) {
  const selectedDurations = params.selectedDurations;

  const [dbCourses, featuredDbCourses] = await Promise.all([
    prisma.course.findMany({
      where: buildWhere(params),
      include: courseInclude,
      orderBy: buildOrderBy(params.sortBy),
    }),
    prisma.course.findMany({
      where: {
        status: CourseStatus.PUBLISHED,
        isFeatured: true,
      },
      include: courseInclude,
      orderBy: [{ enrollments: { _count: "desc" } }, { createdAt: "desc" }],
      take: 6,
    }),
  ]);

  let courses = dbCourses.map(mapDbCourseToCatalogCourse);

  if (selectedDurations.length > 0) {
    courses = courses.filter((course) =>
      matchesDurationFilters(course, selectedDurations),
    );
  }

  if (params.sortBy === "rating" || params.sortBy === "trending") {
    courses.sort(
      (a, b) => b.rating - a.rating || b.enrollmentCount - a.enrollmentCount,
    );
  }

  const featuredCourses = featuredDbCourses.map(mapDbCourseToCatalogCourse);

  return { courses, featuredCourses };
}
