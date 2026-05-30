import type {
  CoursePageLesson,
  CoursePageModule,
} from "@/types/course-page.types";

export type SequentialAccessOptions = {
  hasFullAccess: boolean;
  completedLessonIds: ReadonlySet<string>;
  bookmarkedLessonIds: ReadonlySet<string>;
  enforceSequential: boolean;
};

export function flattenCourseLessons(
  modules: CoursePageModule[],
): CoursePageLesson[] {
  return modules.flatMap((module) => module.lessons);
}

export function applySequentialLessonAccess(
  modules: CoursePageModule[],
  options: SequentialAccessOptions,
): CoursePageModule[] {
  const ordered = flattenCourseLessons(modules);
  const accessibilityById = new Map<string, boolean>();

  for (let index = 0; index < ordered.length; index++) {
    const lesson = ordered[index]!;
    const baseAccess = options.hasFullAccess || lesson.isPreview;

    let accessible = false;
    if (!baseAccess) {
      accessible = false;
    } else if (!options.enforceSequential) {
      accessible = true;
    } else {
      let previousRequired: CoursePageLesson | null = null;
      for (let prevIndex = index - 1; prevIndex >= 0; prevIndex--) {
        const candidate = ordered[prevIndex]!;
        if (options.hasFullAccess || candidate.isPreview) {
          previousRequired = candidate;
          break;
        }
      }

      accessible =
        previousRequired === null ||
        options.completedLessonIds.has(previousRequired.id);
    }

    accessibilityById.set(lesson.id, accessible);
  }

  return modules.map((module) => ({
    ...module,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      isAccessible: accessibilityById.get(lesson.id) ?? false,
      isCompleted: options.completedLessonIds.has(lesson.id),
      isBookmarked: options.bookmarkedLessonIds.has(lesson.id),
    })),
  }));
}

export function findFirstAccessibleLessonSlug(
  modules: CoursePageModule[],
): string | null {
  for (const module of modules) {
    const lesson = module.lessons.find((item) => item.isAccessible);
    if (lesson) return lesson.slug;
  }
  return null;
}
