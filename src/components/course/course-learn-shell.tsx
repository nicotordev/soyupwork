import { CourseLessonContent } from "@/components/course/course-lesson-content";
import { CourseLessonSidebar } from "@/components/course/course-lesson-sidebar";
import { CourseDemoBanner } from "@/components/course/course-demo-banner";
import { CoursePreviewBanner } from "@/components/course/course-preview-banner";
import { findLessonInView } from "@/lib/course/get-course-page-data";
import {
  isAdminPreviewMode,
  isPublicDemoMode,
} from "@/lib/course/course-page-mode";
import type { CoursePageData } from "@/types/course-page.types";

type CourseLearnShellProps = {
  data: CoursePageData;
  lessonSlug: string;
  lessonBasePath: string;
  courseLandingHref: string;
  lessonHrefMode?: "path" | "query";
  showModeBanner?: boolean;
};

export function CourseLearnShell({
  data,
  lessonSlug,
  lessonBasePath,
  courseLandingHref,
  lessonHrefMode = "path",
  showModeBanner = true,
}: CourseLearnShellProps) {
  const { view, mode } = data;
  const lesson = findLessonInView(view, lessonSlug);

  if (!lesson || (!lesson.isAccessible && mode === "student")) {
    return null;
  }

  return (
    <div className="flex min-h-svh flex-col">
      {isAdminPreviewMode(mode) ? (
        <CoursePreviewBanner courseId={view.id} />
      ) : null}
      {showModeBanner && isPublicDemoMode(mode) ? <CourseDemoBanner /> : null}

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="w-full shrink-0 lg:w-72 lg:max-w-[18rem]">
          <CourseLessonSidebar
            view={view}
            activeLessonSlug={lessonSlug}
            lessonBasePath={lessonBasePath}
            courseLandingHref={courseLandingHref}
            lessonHrefMode={lessonHrefMode}
          />
        </div>
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <CourseLessonContent view={view} lesson={lesson} mode={mode} />
        </main>
      </div>
    </div>
  );
}
