import { CourseLessonContent } from "@/components/course/course-lesson-content";
import { CourseLessonSidebar } from "@/components/course/course-lesson-sidebar";
import { CoursePreviewBanner } from "@/components/course/course-preview-banner";
import { findLessonInView } from "@/lib/course/get-course-page-data";
import type { CoursePageData } from "@/types/course-page.types";

type CourseLearnShellProps = {
  data: CoursePageData;
  lessonSlug: string;
  lessonBasePath: string;
  courseLandingHref: string;
};

export function CourseLearnShell({
  data,
  lessonSlug,
  lessonBasePath,
  courseLandingHref,
}: CourseLearnShellProps) {
  const { view, mode } = data;
  const lesson = findLessonInView(view, lessonSlug);

  if (!lesson || (!lesson.isAccessible && mode === "student")) {
    return null;
  }

  return (
    <div className="flex min-h-svh flex-col">
      {mode === "adminPreview" ? (
        <CoursePreviewBanner courseId={view.id} />
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="w-full shrink-0 lg:w-72 lg:max-w-[18rem]">
          <CourseLessonSidebar
            view={view}
            activeLessonSlug={lessonSlug}
            lessonBasePath={lessonBasePath}
            courseLandingHref={courseLandingHref}
          />
        </div>
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <CourseLessonContent view={view} lesson={lesson} mode={mode} />
        </main>
      </div>
    </div>
  );
}
