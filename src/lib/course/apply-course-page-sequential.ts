import {
  applySequentialLessonAccess,
  findFirstAccessibleLessonSlug,
} from "@/lib/course/sequential-lesson-access";
import type { CoursePageData } from "@/types/course-page.types";

export function applyCoursePageSequentialAccess(
  data: CoursePageData,
  completedLessonIds: ReadonlySet<string>,
): CoursePageData {
  const enforceSequential = data.mode !== "adminPreview";
  const bookmarkedLessonIds = new Set(
    data.view.modules.flatMap((module) =>
      module.lessons
        .filter((lesson) => lesson.isBookmarked)
        .map((lesson) => lesson.id),
    ),
  );

  const modules = applySequentialLessonAccess(data.view.modules, {
    hasFullAccess: data.view.hasFullAccess,
    completedLessonIds,
    bookmarkedLessonIds,
    enforceSequential,
  });

  return {
    ...data,
    view: {
      ...data.view,
      modules,
      firstLessonSlug: findFirstAccessibleLessonSlug(modules),
    },
  };
}
