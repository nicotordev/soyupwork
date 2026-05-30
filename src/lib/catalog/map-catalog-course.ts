import type {
  CourseCategory,
  CourseModule,
  CourseReview,
  CourseTag,
  Course as DbCourse,
  Lesson,
  Tag,
  User,
} from "@/generated/prisma/client";
import { courseLevelLabel } from "@/lib/catalog/course-level";
import { formatPriceLabel } from "@/lib/format-price-label";
import type { Course } from "@/types/catalog-course";

type DbCourseWithRelations = DbCourse & {
  category: Pick<CourseCategory, "name" | "slug"> | null;
  instructor: Pick<User, "firstName" | "lastName"> | null;
  tags: (CourseTag & { tag: Pick<Tag, "name"> })[];
  reviews: Pick<CourseReview, "rating">[];
  modules: (CourseModule & { lessons: Pick<Lesson, "durationSec">[] })[];
  _count: { enrollments: number };
};

function sumDurationSec(modules: DbCourseWithRelations["modules"]): number {
  return modules.reduce(
    (total, module) =>
      total +
      module.lessons.reduce(
        (lessonTotal, lesson) => lessonTotal + (lesson.durationSec ?? 0),
        0,
      ),
    0,
  );
}

function countLessons(modules: DbCourseWithRelations["modules"]): number {
  return modules.reduce((total, module) => total + module.lessons.length, 0);
}

function formatDurationLabel(hours: number): string {
  if (hours <= 0) return "—";
  if (hours < 1) {
    const minutes = Math.max(1, Math.round(hours * 60));
    return `${minutes} min`;
  }
  if (Number.isInteger(hours)) return `${hours} horas`;
  return `${hours.toFixed(1)} horas`;
}

function instructorDisplayName(
  instructor: DbCourseWithRelations["instructor"],
): string {
  if (!instructor) return "SoyUpwork";
  const name = [instructor.firstName, instructor.lastName]
    .filter(Boolean)
    .join(" ");
  return name || "SoyUpwork";
}

function averageRating(reviews: Pick<CourseReview, "rating">[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function mapDbCourseToCatalogCourse(
  dbCourse: DbCourseWithRelations,
): Course {
  const durationHours = sumDurationSec(dbCourse.modules) / 3600;
  const lessonCount = countLessons(dbCourse.modules);
  const isFree = dbCourse.priceCents === 0;

  return {
    title: dbCourse.title,
    slug: dbCourse.slug,
    description: dbCourse.description ?? "",
    category: dbCourse.category?.name ?? "General",
    categorySlug: dbCourse.category?.slug ?? "general",
    level: courseLevelLabel(dbCourse.level),
    duration: formatDurationLabel(durationHours),
    durationHours,
    lessonCount,
    priceLabel: formatPriceLabel(dbCourse.priceCents, dbCourse.currency),
    isFree,
    isFeatured: dbCourse.isFeatured,
    tags: dbCourse.tags.map((courseTag) => courseTag.tag.name),
    instructorName: instructorDisplayName(dbCourse.instructor),
    rating: averageRating(dbCourse.reviews),
    enrollmentCount: dbCourse._count.enrollments,
    hasCertificate: dbCourse.offersCertificate,
  };
}
