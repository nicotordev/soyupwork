import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { toSlug } from "@/lib/slug";
import type {
  AdminCourseCurriculumData,
  AdminCurriculumLesson,
  AdminCurriculumModule,
} from "@/types/admin-curriculum.types";

export const curriculumInclude = {
  modules: {
    orderBy: { position: "asc" as const },
    include: {
      lessons: {
        orderBy: { position: "asc" as const },
      },
    },
  },
} satisfies Prisma.CourseInclude;

export type DbCourseCurriculum = Prisma.CourseGetPayload<{
  include: typeof curriculumInclude;
}>;

export function resolveLessonSlug(title: string, position: number): string {
  const base = toSlug(title) || `leccion-${position + 1}`;
  return base;
}

export async function resolveUniqueLessonSlug(
  moduleId: string,
  baseSlug: string,
  excludeLessonId?: string,
): Promise<string> {
  const normalized = toSlug(baseSlug) || "leccion";
  let candidate = normalized;
  let suffix = 2;

  while (true) {
    const existing = await prisma.lesson.findFirst({
      where: {
        moduleId,
        slug: candidate,
        ...(excludeLessonId ? { id: { not: excludeLessonId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) return candidate;

    candidate = `${normalized}-${suffix}`;
    suffix += 1;
  }
}

function mapLesson(
  lesson: DbCourseCurriculum["modules"][0]["lessons"][0],
): AdminCurriculumLesson {
  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description ?? "",
    type: lesson.type,
    position: lesson.position,
    isPreview: lesson.isPreview,
    content: lesson.content ?? "",
    videoStatus: lesson.videoStatus,
    videoPlaybackId: lesson.videoPlaybackId,
    durationSec: lesson.durationSec,
  };
}

function mapModule(
  module: DbCourseCurriculum["modules"][0],
): AdminCurriculumModule {
  return {
    id: module.id,
    title: module.title,
    description: module.description ?? "",
    position: module.position,
    lessons: module.lessons.map(mapLesson),
  };
}

export function mapDbCourseToAdminCurriculum(
  dbCourse: DbCourseCurriculum,
  options: {
    muxConfigured: boolean;
    muxStreamingEnabled: boolean;
    maxVideoSizeMb: number;
  },
): AdminCourseCurriculumData {
  const modules = dbCourse.modules.map(mapModule);
  const lessonCount = modules.reduce(
    (total, mod) => total + mod.lessons.length,
    0,
  );

  return {
    course: {
      id: dbCourse.id,
      title: dbCourse.title,
      slug: dbCourse.slug,
      status: dbCourse.status,
      moduleCount: modules.length,
      lessonCount,
    },
    modules,
    muxConfigured: options.muxConfigured,
    muxStreamingEnabled: options.muxStreamingEnabled,
    maxVideoSizeMb: options.maxVideoSizeMb,
  };
}

export async function assertCourseExists(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });

  if (!course) {
    throw new Error("Curso no encontrado.");
  }
}

export async function assertModuleBelongsToCourse(
  moduleId: string,
  courseId: string,
) {
  const module = await prisma.courseModule.findFirst({
    where: { id: moduleId, courseId },
    select: { id: true },
  });

  if (!module) {
    throw new Error("Módulo no encontrado en este curso.");
  }
}

export async function assertLessonBelongsToCourse(
  lessonId: string,
  courseId: string,
) {
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, module: { courseId } },
    select: { id: true, moduleId: true },
  });

  if (!lesson) {
    throw new Error("Lección no encontrada en este curso.");
  }

  return lesson;
}

export async function normalizeModulePositions(courseId: string) {
  const modules = await prisma.courseModule.findMany({
    where: { courseId },
    orderBy: { position: "asc" },
    select: { id: true, position: true },
  });

  await prisma.$transaction(
    modules.map((mod, index) =>
      prisma.courseModule.update({
        where: { id: mod.id },
        data: { position: index },
      }),
    ),
  );
}

export async function normalizeLessonPositions(moduleId: string) {
  const lessons = await prisma.lesson.findMany({
    where: { moduleId },
    orderBy: { position: "asc" },
    select: { id: true, position: true },
  });

  await prisma.$transaction(
    lessons.map((lesson, index) =>
      prisma.lesson.update({
        where: { id: lesson.id },
        data: { position: index },
      }),
    ),
  );
}
