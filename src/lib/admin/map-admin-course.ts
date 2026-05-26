import type { DbAdminCourse } from "@/lib/admin/admin-course-include";
import { formatAdminCoursePrice } from "@/lib/admin/format-course";
import { courseLevelLabel } from "@/lib/catalog/course-level";
import type { AdminCourseRow } from "@/types/admin-course.types";

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
