import { CourseStatus } from "@/generated/prisma/client";
import { getCatalogCategories } from "@/lib/catalog/categories";
import { courseLevelLabel } from "@/lib/catalog/course-level";
import {
  courseHoursMatchesBucket,
  DURATION_BUCKETS,
} from "@/lib/catalog/filters";
import prisma from "@/lib/db/prisma";
import type { CatalogFilterOptions } from "@/types/catalog-filters";

function sumCourseDurationHours(
  modules: { lessons: { durationSec: number | null }[] }[],
): number {
  const totalSec = modules.reduce(
    (moduleTotal, module) =>
      moduleTotal +
      module.lessons.reduce(
        (lessonTotal, lesson) => lessonTotal + (lesson.durationSec ?? 0),
        0,
      ),
    0,
  );
  return totalSec / 3600;
}

export async function getCatalogFilterOptions(): Promise<CatalogFilterOptions> {
  const [categories, levelGroups, publishedCourses] = await Promise.all([
    getCatalogCategories(),
    prisma.course.groupBy({
      by: ["level"],
      where: { status: CourseStatus.PUBLISHED },
      orderBy: { level: "asc" },
    }),
    prisma.course.findMany({
      where: { status: CourseStatus.PUBLISHED },
      select: {
        modules: {
          select: {
            lessons: { select: { durationSec: true } },
          },
        },
      },
    }),
  ]);

  const levels = levelGroups.map((group) => ({
    label: courseLevelLabel(group.level),
  }));

  const courseHours = publishedCourses.map((course) =>
    sumCourseDurationHours(course.modules),
  );

  const durations =
    publishedCourses.length === 0
      ? DURATION_BUCKETS
      : DURATION_BUCKETS.filter((bucket) =>
          courseHours.some((hours) => courseHoursMatchesBucket(hours, bucket)),
        );

  return { categories, levels, durations };
}
