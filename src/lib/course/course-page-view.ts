import { flattenCourseLessons } from "@/lib/course/sequential-lesson-access";
import type {
  CoursePageLesson,
  CoursePageView,
} from "@/types/course-page.types";

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

export function findNextAccessibleLesson(
  view: CoursePageView,
  currentLessonSlug: string,
): CoursePageLesson | null {
  const ordered = flattenCourseLessons(view.modules);
  const currentIndex = ordered.findIndex(
    (lesson) => lesson.slug === currentLessonSlug,
  );

  if (currentIndex === -1) return null;

  for (let index = currentIndex + 1; index < ordered.length; index++) {
    const lesson = ordered[index]!;
    if (lesson.isAccessible) return lesson;
  }

  return null;
}
