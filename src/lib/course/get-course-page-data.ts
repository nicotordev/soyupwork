import type { Prisma } from "@/generated/prisma/client";
import { EnrollmentStatus } from "@/generated/prisma/client";
import { courseLevelLabel } from "@/lib/catalog/course-level";
import { formatPriceLabel } from "@/lib/format-price-label";
import prisma from "@/lib/db/prisma";
import { isMuxConfigured } from "@/lib/mux/config";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import {
  applySequentialLessonAccess,
  findFirstAccessibleLessonSlug,
} from "@/lib/course/sequential-lesson-access";
import type {
  CoursePageData,
  CoursePageLesson,
  CoursePageMode,
  CoursePageModule,
  CoursePageView,
} from "@/types/course-page.types";

export const coursePageInclude = {
  category: { select: { name: true, slug: true } },
  instructor: { select: { firstName: true, lastName: true } },
  _count: { select: { enrollments: true, reviews: true } },
  reviews: {
    where: { isPublished: true },
    orderBy: { createdAt: "desc" as const },
    take: 6,
    select: {
      id: true,
      rating: true,
      headline: true,
      comment: true,
      displayName: true,
      niche: true,
      countryCode: true,
      metricBefore: true,
      metricAfter: true,
      createdAt: true,
    },
  },
  modules: {
    orderBy: { position: "asc" as const },
    include: {
      lessons: {
        orderBy: { position: "asc" as const },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              passingScore: true,
              _count: { select: { questions: true } },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CourseInclude;

export type DbCoursePage = Prisma.CourseGetPayload<{
  include: typeof coursePageInclude;
}>;

function instructorDisplayName(instructor: DbCoursePage["instructor"]): string {
  if (!instructor) return "SoyUpwork";
  const name = [instructor.firstName, instructor.lastName]
    .filter(Boolean)
    .join(" ");
  return name || "SoyUpwork";
}

function mapLesson(
  lesson: DbCoursePage["modules"][0]["lessons"][0],
): CoursePageLesson {
  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description ?? "",
    type: lesson.type,
    position: lesson.position,
    isPreview: lesson.isPreview,
    durationSec: lesson.durationSec,
    videoPlaybackId: lesson.videoPlaybackId,
    videoStatus: lesson.videoStatus,
    videoPublishedAt: lesson.videoPublishedAt?.toISOString() ?? null,
    videoAuthorName: lesson.videoAuthorName ?? null,
    content: lesson.content ?? "",
    quiz: lesson.quiz
      ? {
          id: lesson.quiz.id,
          title: lesson.quiz.title,
          passingScore: lesson.quiz.passingScore,
          questionCount: lesson.quiz._count.questions,
        }
      : null,
    isAccessible: false,
    isCompleted: false,
    isBookmarked: false,
    videoAiInsight: null,
    comments: [],
  };
}

function mapModules(
  modules: DbCoursePage["modules"],
  options: {
    hasFullAccess: boolean;
    completedLessonIds: ReadonlySet<string>;
    bookmarkedLessonIds: ReadonlySet<string>;
    mode: CoursePageMode;
  },
): CoursePageModule[] {
  const mapped = modules.map((module) => ({
    id: module.id,
    title: module.title,
    description: module.description ?? "",
    position: module.position,
    lessons: module.lessons.map((lesson) => mapLesson(lesson)),
  }));

  return applySequentialLessonAccess(mapped, {
    hasFullAccess: options.hasFullAccess,
    completedLessonIds: options.completedLessonIds,
    bookmarkedLessonIds: options.bookmarkedLessonIds,
    enforceSequential: options.mode !== "adminPreview",
  });
}

export async function mapDbCourseToCoursePageView(
  dbCourse: DbCoursePage,
  options: {
    mode: CoursePageMode;
    hasFullAccess: boolean;
    completedLessonIds?: ReadonlySet<string>;
    bookmarkedLessonIds?: ReadonlySet<string>;
    muxConfigured: boolean;
    muxStreamingEnabled: boolean;
  },
): Promise<CoursePageView> {
  const averageRating =
    dbCourse.reviews.length > 0
      ? Number(
          (
            dbCourse.reviews.reduce((acc, review) => acc + review.rating, 0) /
            dbCourse.reviews.length
          ).toFixed(1),
        )
      : null;
  const modules = mapModules(dbCourse.modules, {
    hasFullAccess: options.hasFullAccess,
    completedLessonIds: options.completedLessonIds ?? new Set(),
    bookmarkedLessonIds: options.bookmarkedLessonIds ?? new Set(),
    mode: options.mode,
  });
  const lessonCount = modules.reduce(
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
    priceLabel: formatPriceLabel(dbCourse.priceCents, dbCourse.currency),
    priceCents: dbCourse.priceCents,
    isFree: dbCourse.priceCents === 0,
    categoryName: dbCourse.category?.name ?? null,
    instructorName: instructorDisplayName(dbCourse.instructor),
    moduleCount: modules.length,
    lessonCount,
    estimatedDurationHours: dbCourse.estimatedDurationHours,
    enrolledStudentCount: dbCourse._count.enrollments,
    reviewCount: dbCourse._count.reviews,
    averageRating,
    offersCertificate: dbCourse.offersCertificate,
    hasFullAccess: options.hasFullAccess,
    modules,
    reviews: dbCourse.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      headline: review.headline,
      comment: review.comment,
      displayName: review.displayName,
      niche: review.niche,
      countryCode: review.countryCode,
      metricBefore: review.metricBefore,
      metricAfter: review.metricAfter,
      createdAt: review.createdAt.toISOString(),
    })),
    muxConfigured: options.muxConfigured,
    muxStreamingEnabled: options.muxStreamingEnabled,
    firstLessonSlug: findFirstAccessibleLessonSlug(modules),
  };
}

export async function fetchCompletedLessonIdsForCourse(
  userId: string,
  courseId: string,
): Promise<Set<string>> {
  const rows = await prisma.lessonProgress.findMany({
    where: {
      userId,
      completed: true,
      lesson: { module: { courseId } },
    },
    select: { lessonId: true },
  });

  return new Set(rows.map((row) => row.lessonId));
}

export async function fetchBookmarkedLessonIdsForCourse(
  userId: string,
  courseId: string,
): Promise<Set<string>> {
  const rows = await prisma.lessonBookmark.findMany({
    where: {
      userId,
      lesson: { module: { courseId } },
    },
    select: { lessonId: true },
  });

  return new Set(rows.map((row) => row.lessonId));
}

export async function buildCoursePageData(
  dbCourse: DbCoursePage,
  options: {
    mode: CoursePageMode;
    hasFullAccess: boolean;
    completedLessonIds?: ReadonlySet<string>;
    bookmarkedLessonIds?: ReadonlySet<string>;
  },
): Promise<CoursePageData> {
  const settings = await getPlatformSettings();

  const view = await mapDbCourseToCoursePageView(dbCourse, {
    mode: options.mode,
    hasFullAccess: options.hasFullAccess,
    completedLessonIds: options.completedLessonIds,
    bookmarkedLessonIds: options.bookmarkedLessonIds,
    muxConfigured: isMuxConfigured(),
    muxStreamingEnabled: settings.enableMuxStreaming,
  });

  return { view, mode: options.mode };
}

export async function userHasActiveEnrollment(
  userId: string,
  courseId: string,
): Promise<boolean> {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
    select: { status: true },
  });

  return (
    enrollment?.status === EnrollmentStatus.ACTIVE ||
    enrollment?.status === EnrollmentStatus.COMPLETED
  );
}
