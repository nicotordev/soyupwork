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
  const modules = applySequentialLessonAccess(data.view.modules, {
    hasFullAccess: data.view.hasFullAccess,
    completedLessonIds,
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
