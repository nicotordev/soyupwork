"use client";

import { MarkdownContent } from "@/components/common/markdown-content";
import { CourseLessonProgressFooter } from "@/components/course/course-lesson-progress-footer";
import { CourseLessonVideoEngagement } from "@/components/course/video-engagement/course-lesson-video-engagement";
import { CourseQuizPlayer } from "@/components/course/quiz/course-quiz-player";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import { adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type {
  CoursePageLesson,
  CoursePageMode,
  CoursePageView,
} from "@/types/course-page.types";
import MuxPlayer from "@mux/mux-player-react";
import type { ReactNode } from "react";

type CourseLessonContentProps = {
  view: CoursePageView;
  lesson: CoursePageLesson;
  mode: CoursePageMode;
  lessonBasePath: string;
  lessonHrefMode?: "path" | "query";
  onDemoLessonComplete?: (lessonId: string) => void;
};

export function CourseLessonContent({
  view,
  lesson,
  mode,
  lessonBasePath,
  lessonHrefMode = "path",
  onDemoLessonComplete,
}: CourseLessonContentProps) {
  const progressFooter = (
    <CourseLessonProgressFooter
      view={view}
      lesson={lesson}
      mode={mode}
      courseSlug={view.slug}
      lessonBasePath={lessonBasePath}
      lessonHrefMode={lessonHrefMode}
      onDemoLessonComplete={onDemoLessonComplete}
    />
  );

  const lessonHeader = (
    <div>
      <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
        {lesson.title}
      </h1>
      {lesson.description ? (
        <p className="mt-2 text-sm text-muted-foreground">
          {lesson.description}
        </p>
      ) : null}
    </div>
  );

  const wrapLesson = (body: ReactNode) => (
    <div className="space-y-6 font-sans">
      {lessonHeader}
      {body}
      {progressFooter}
    </div>
  );

  if (lesson.type === "VIDEO") {
    const canPlay =
      view.muxConfigured &&
      view.muxStreamingEnabled &&
      lesson.videoPlaybackId &&
      lesson.videoStatus === "READY";

    return wrapLesson(
      <>
        {canPlay ? (
          <div className="overflow-hidden rounded-lg border-2 border-foreground bg-black shadow-[4px_4px_0px_0px_var(--foreground)]">
            <MuxPlayer
              playbackId={lesson.videoPlaybackId!}
              className="aspect-video w-full"
              streamType="on-demand"
            />
          </div>
        ) : (
          <div
            className={cn(
              adminPanelClass,
              "flex aspect-video items-center justify-center border-2 border-dashed border-foreground/40 p-6 text-center",
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {!view.muxConfigured || !view.muxStreamingEnabled
                ? COURSE_PAGE.muxDisabled
                : lesson.videoStatus === "PENDING"
                  ? COURSE_PAGE.videoPending
                  : lesson.videoStatus === "ERRORED"
                    ? COURSE_PAGE.videoError
                    : COURSE_PAGE.videoUnavailable}
            </p>
          </div>
        )}

        <CourseLessonVideoEngagement lesson={lesson} mode={mode} />
      </>,
    );
  }

  if (lesson.type === "TEXT" || lesson.type === "DOWNLOAD") {
    return wrapLesson(
      <div
        className={cn(adminPanelClass, "border-2 border-foreground p-4 sm:p-6")}
      >
        <MarkdownContent content={lesson.content} />
      </div>,
    );
  }

  if (lesson.type === "QUIZ" && lesson.quiz) {
    return (
      <div className="space-y-6 font-sans">
        <CourseQuizPlayer
          lessonId={lesson.id}
          courseId={view.id}
          lessonTitle={lesson.title}
          mode={mode}
        />
        {progressFooter}
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="space-y-2">
        <h1 className="text-xl font-extrabold">{lesson.title}</h1>
        <p className="text-sm text-muted-foreground">
          Contenido no disponible para este tipo de lección.
        </p>
      </div>
      {progressFooter}
    </div>
  );
}
