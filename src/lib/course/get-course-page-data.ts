import type { Prisma } from "@/generated/prisma/client";
import { EnrollmentStatus } from "@/generated/prisma/client";
import { courseLevelLabel } from "@/lib/catalog/course-level";
import prisma from "@/lib/db/prisma";
import { isMuxConfigured } from "@/lib/mux/config";
import { getPlatformSettings } from "@/lib/platform/settings/store";
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

function formatPriceLabel(priceCents: number, currency: string): string {
  if (priceCents === 0) return "Gratis";
  const amount = priceCents / 100;
  const code = currency.toUpperCase();
  if (code === "USD") {
    return `$${amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2)} USD`;
  }
  return `${amount.toFixed(2)} ${code}`;
}

function instructorDisplayName(instructor: DbCoursePage["instructor"]): string {
  if (!instructor) return "SoyUpwork";
  const name = [instructor.firstName, instructor.lastName]
    .filter(Boolean)
    .join(" ");
  return name || "SoyUpwork";
}

function mapLesson(
  lesson: DbCoursePage["modules"][0]["lessons"][0],
  hasFullAccess: boolean,
): CoursePageLesson {
  const isAccessible = hasFullAccess || lesson.isPreview;

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
    content: lesson.content ?? "",
    quiz: lesson.quiz
      ? {
          id: lesson.quiz.id,
          title: lesson.quiz.title,
          passingScore: lesson.quiz.passingScore,
          questionCount: lesson.quiz._count.questions,
        }
      : null,
    isAccessible,
  };
}

function mapModules(
  modules: DbCoursePage["modules"],
  hasFullAccess: boolean,
): CoursePageModule[] {
  return modules.map((module) => ({
    id: module.id,
    title: module.title,
    description: module.description ?? "",
    position: module.position,
    lessons: module.lessons.map((lesson) => mapLesson(lesson, hasFullAccess)),
  }));
}

function findFirstAccessibleLessonSlug(
  modules: CoursePageModule[],
): string | null {
  for (const module of modules) {
    const lesson = module.lessons.find((item) => item.isAccessible);
    if (lesson) return lesson.slug;
  }
  return null;
}

export function findLessonInView(
  view: CoursePageView,
  lessonSlug: string,
): CoursePageLesson | null {
  for (const module of view.modules) {
    const lesson = module.lessons.find((item) => item.slug === lessonSlug);
    if (lesson) return lesson;
  }
  return null;
}

export async function mapDbCourseToCoursePageView(
  dbCourse: DbCoursePage,
  options: {
    mode: CoursePageMode;
    hasFullAccess: boolean;
    muxConfigured: boolean;
    muxStreamingEnabled: boolean;
  },
): Promise<CoursePageView> {
  const modules = mapModules(dbCourse.modules, options.hasFullAccess);
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
    offersCertificate: dbCourse.offersCertificate,
    hasFullAccess: options.hasFullAccess,
    modules,
    muxConfigured: options.muxConfigured,
    muxStreamingEnabled: options.muxStreamingEnabled,
    firstLessonSlug: findFirstAccessibleLessonSlug(modules),
  };
}

export async function buildCoursePageData(
  dbCourse: DbCoursePage,
  options: {
    mode: CoursePageMode;
    hasFullAccess: boolean;
  },
): Promise<CoursePageData> {
  const settings = await getPlatformSettings();

  const view = await mapDbCourseToCoursePageView(dbCourse, {
    mode: options.mode,
    hasFullAccess: options.hasFullAccess,
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
