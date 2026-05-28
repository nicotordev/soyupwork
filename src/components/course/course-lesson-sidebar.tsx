"use client";

import {
  COURSE_PAGE,
  LESSON_TYPE_ICONS_LABEL,
} from "@/constants/course-page.constants";
import { cn } from "@/lib/utils";
import type {
  CoursePageLesson,
  CoursePageView,
} from "@/types/course-page.types";
import {
  IconBook,
  IconClipboardList,
  IconLock,
  IconVideo,
} from "@tabler/icons-react";
import Link from "next/link";

type CourseLessonSidebarProps = {
  view: CoursePageView;
  activeLessonSlug: string;
  lessonBasePath: string;
  courseLandingHref: string;
  lessonHrefMode?: "path" | "query";
};

function LessonTypeIcon({ type }: { type: CoursePageLesson["type"] }) {
  switch (type) {
    case "VIDEO":
      return <IconVideo className="size-3.5 shrink-0" stroke={2.25} />;
    case "QUIZ":
      return <IconClipboardList className="size-3.5 shrink-0" stroke={2.25} />;
    default:
      return <IconBook className="size-3.5 shrink-0" stroke={2.25} />;
  }
}

export function CourseLessonSidebar({
  view,
  activeLessonSlug,
  lessonBasePath,
  courseLandingHref,
  lessonHrefMode = "path",
}: CourseLessonSidebarProps) {
  const lessonHref = (slug: string) =>
    lessonHrefMode === "query"
      ? `${lessonBasePath}?leccion=${encodeURIComponent(slug)}`
      : `${lessonBasePath}/${slug}`;
  return (
    <aside className="flex h-full flex-col border-foreground bg-muted/20 font-sans lg:border-r-2">
      <div className="border-b-2 border-foreground px-3 py-3">
        <Link
          href={courseLandingHref}
          className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
        >
          ← {view.title}
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {view.modules.map((module, moduleIndex) => (
          <div key={module.id} className="mb-3">
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Módulo {moduleIndex + 1}: {module.title}
            </p>
            <ul className="space-y-0.5">
              {module.lessons.map((lesson, lessonIndex) => {
                const isActive = lesson.slug === activeLessonSlug;
                const isLocked = !lesson.isAccessible;

                const itemClass = cn(
                  "flex items-start gap-2 rounded border px-2 py-2 text-left text-xs transition-colors",
                  isActive
                    ? "border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)]"
                    : isLocked
                      ? "border-transparent text-muted-foreground/60"
                      : "border-transparent hover:border-foreground/30 hover:bg-background",
                );

                const content = (
                  <>
                    <span className="text-[10px] font-medium opacity-70">
                      {lessonIndex + 1}.
                    </span>
                    <LessonTypeIcon type={lesson.type} />
                    <span className="min-w-0 flex-1 leading-snug">
                      {lesson.title}
                    </span>
                    {lesson.isPreview && !view.hasFullAccess ? (
                      <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide">
                        {COURSE_PAGE.previewLessonBadge}
                      </span>
                    ) : null}
                    {isLocked ? (
                      <IconLock className="size-3 shrink-0" stroke={2.25} />
                    ) : null}
                  </>
                );

                if (isLocked) {
                  return (
                    <li
                      key={lesson.id}
                      className={itemClass}
                      title={COURSE_PAGE.lockedLessonLabel}
                    >
                      {content}
                    </li>
                  );
                }

                return (
                  <li key={lesson.id}>
                    <Link href={lessonHref(lesson.slug)} className={itemClass}>
                      {content}
                      <span className="sr-only">
                        {LESSON_TYPE_ICONS_LABEL[lesson.type]}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
