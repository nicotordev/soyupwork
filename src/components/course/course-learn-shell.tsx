"use client";

import { CourseLessonContent } from "@/components/course/course-lesson-content";
import { CourseLessonLockedView } from "@/components/course/course-lesson-locked-view";
import { CourseLessonSidebar } from "@/components/course/course-lesson-sidebar";
import { CourseDemoBanner } from "@/components/course/course-demo-banner";
import { CoursePreviewBanner } from "@/components/course/course-preview-banner";
import { findFirstAccessibleLessonSlug } from "@/lib/course/sequential-lesson-access";
import { findLessonInView } from "@/lib/course/course-page-view";
import {
  isAdminPreviewMode,
  isPublicDemoMode,
} from "@/lib/course/course-page-mode";
import type { CoursePageData } from "@/types/course-page.types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { IconMenu2 } from "@tabler/icons-react";

type CourseLearnShellProps = {
  data: CoursePageData;
  lessonSlug: string;
  lessonBasePath: string;
  courseLandingHref: string;
  lessonHrefMode?: "path" | "query";
  showModeBanner?: boolean;
  onDemoLessonComplete?: (lessonId: string) => void;
};

export function CourseLearnShell({
  data,
  lessonSlug,
  lessonBasePath,
  courseLandingHref,
  lessonHrefMode = "path",
  showModeBanner = true,
  onDemoLessonComplete,
}: CourseLearnShellProps) {
  const { view, mode } = data;
  const lesson = findLessonInView(view, lessonSlug);

  const lessonHref = (slug: string) =>
    lessonHrefMode === "query"
      ? `${lessonBasePath}?leccion=${encodeURIComponent(slug)}`
      : `${lessonBasePath}/${slug}`;

  const firstAccessibleSlug = findFirstAccessibleLessonSlug(view.modules);
  const currentLessonHref = firstAccessibleSlug
    ? lessonHref(firstAccessibleSlug)
    : null;

  if (!lesson) {
    return null;
  }

  if (!lesson.isAccessible && !isAdminPreviewMode(mode)) {
    return (
      <div className="flex min-h-svh flex-col font-sans">
        {showModeBanner && isPublicDemoMode(mode) ? <CourseDemoBanner /> : null}
        <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
          <CourseLessonLockedView
            currentLessonHref={currentLessonHref}
            courseLandingHref={courseLandingHref}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col font-sans">
      {isAdminPreviewMode(mode) ? (
        <CoursePreviewBanner courseId={view.id} />
      ) : null}
      {showModeBanner && isPublicDemoMode(mode) ? <CourseDemoBanner /> : null}

      {/* Mobile Learning Header */}
      <div className="flex items-center justify-between border-b-2 border-foreground bg-muted/20 px-4 py-2.5 lg:hidden shrink-0">
        <div className="min-w-0 flex-1 pr-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground truncate leading-none">
            {view.title}
          </p>
          <h2 className="text-xs font-extrabold text-foreground truncate mt-1 leading-none">
            {lesson.title}
          </h2>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="text-[10px]">
              <IconMenu2 className="size-3.5 mr-1.5 shrink-0" stroke={2.25} />
              Temario
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-80 max-w-[85vw] border-r-2 border-foreground bg-background"
          >
            <div className="h-full overflow-y-auto">
              <CourseLessonSidebar
                view={view}
                activeLessonSlug={lessonSlug}
                lessonBasePath={lessonBasePath}
                courseLandingHref={courseLandingHref}
                lessonHrefMode={lessonHrefMode}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="hidden lg:block lg:w-72 lg:max-w-[18rem] lg:shrink-0">
          <CourseLessonSidebar
            view={view}
            activeLessonSlug={lessonSlug}
            lessonBasePath={lessonBasePath}
            courseLandingHref={courseLandingHref}
            lessonHrefMode={lessonHrefMode}
          />
        </div>
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <CourseLessonContent
            view={view}
            lesson={lesson}
            mode={mode}
            lessonBasePath={lessonBasePath}
            lessonHrefMode={lessonHrefMode}
            onDemoLessonComplete={onDemoLessonComplete}
          />
        </main>
      </div>
    </div>
  );
}
