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
