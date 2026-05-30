import { applySequentialLessonAccess } from "@/lib/course/sequential-lesson-access";
import { findNextAccessibleLesson } from "@/lib/course/course-page-view";
import type {
  CoursePageMode,
  CoursePageModule,
  CoursePageView,
} from "@/types/course-page.types";

function buildCompletedLessonIdSet(
  modules: CoursePageModule[],
  additionalLessonId?: string,
): Set<string> {
  const ids = new Set<string>();

  for (const module of modules) {
    for (const lesson of module.lessons) {
      if (lesson.isCompleted) {
        ids.add(lesson.id);
      }
    }
  }

  if (additionalLessonId) {
    ids.add(additionalLessonId);
  }

  return ids;
}

function buildBookmarkedLessonIdSet(modules: CoursePageModule[]): Set<string> {
  const ids = new Set<string>();

  for (const module of modules) {
    for (const lesson of module.lessons) {
      if (lesson.isBookmarked) {
        ids.add(lesson.id);
      }
    }
  }

  return ids;
}

export function computeNextLessonHref(options: {
  view: CoursePageView;
  mode: CoursePageMode;
  currentLessonSlug: string;
  pendingCompletedLessonId?: string;
  lessonBasePath: string;
  lessonHrefMode?: "path" | "query";
}): string | null {
  const completedIds = buildCompletedLessonIdSet(
    options.view.modules,
    options.pendingCompletedLessonId,
  );
  const enforceSequential = options.mode !== "adminPreview";
  const modules = applySequentialLessonAccess(options.view.modules, {
    hasFullAccess: options.view.hasFullAccess,
    completedLessonIds: completedIds,
    bookmarkedLessonIds: buildBookmarkedLessonIdSet(options.view.modules),
    enforceSequential,
  });
  const nextLesson = findNextAccessibleLesson(
    { ...options.view, modules },
    options.currentLessonSlug,
  );

  if (!nextLesson) {
    return null;
  }

  return options.lessonHrefMode === "query"
    ? `${options.lessonBasePath}?leccion=${encodeURIComponent(nextLesson.slug)}`
    : `${options.lessonBasePath}/${nextLesson.slug}`;
}
