"use client";

import { MarkdownContent } from "@/components/common/markdown-content";
import { CourseLessonBookmarkButton } from "@/components/course/course-lesson-bookmark-button";
import { CourseLessonProgressFooter } from "@/components/course/course-lesson-progress-footer";
import { CourseQuizPlayer } from "@/components/course/quiz/course-quiz-player";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import { adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { formatLessonPublishedDate } from "@/lib/course/format-lesson-published-date";
import {
  isAdminPreviewMode,
  isPublicDemoMode,
} from "@/lib/course/course-page-mode";
import type {
  CoursePageLesson,
  CoursePageLessonComment,
  CoursePageMode,
  CoursePageView,
} from "@/types/course-page.types";
import MuxPlayer from "@mux/mux-player-react";
import { useState, type ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CourseLessonVideoAiPanel } from "@/components/course/video-engagement/course-lesson-video-ai-panel";
import { CourseLessonVideoComments } from "@/components/course/video-engagement/course-lesson-video-comments";
import { IconSparkles, IconShare, IconCheck } from "@tabler/icons-react";
import { toast as sonnerToast } from "sonner";

type CourseLessonContentProps = {
  view: CoursePageView;
  lesson: CoursePageLesson;
  mode: CoursePageMode;
  lessonBasePath: string;
  lessonHrefMode?: "path" | "query";
  onDemoLessonComplete?: (lessonId: string) => void;
  lessonComments?: CoursePageLessonComment[];
  currentUserId?: string | null;
};

export function CourseLessonContent({
  view,
  lesson,
  mode,
  lessonBasePath,
  lessonHrefMode = "path",
  onDemoLessonComplete,
  lessonComments,
  currentUserId,
}: CourseLessonContentProps) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const comments = lessonComments ?? lesson.comments;
  const isDemo = isPublicDemoMode(mode);
  const canComment =
    isDemo || (!isAdminPreviewMode(mode) && view.hasFullAccess);
  const canBookmark =
    !isDemo && !isAdminPreviewMode(mode) && view.hasFullAccess;

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

    const videoAuthorName =
      lesson.videoAuthorName?.trim() || view.instructorName;
    const videoPublishedLabel =
      formatLessonPublishedDate(lesson.videoPublishedAt) ??
      COURSE_PAGE.videoPublishedRecently;

    const initials = videoAuthorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const videoPlayer = canPlay ? (
      <div className="overflow-hidden rounded-xl border-2 border-foreground bg-black shadow-[6px_6px_0px_0px_var(--foreground)]">
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
          "flex aspect-video items-center justify-center border-2 border-dashed border-foreground/40 p-6 text-center shadow-[6px_6px_0px_0px_var(--foreground)]",
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground font-mono">
          {!view.muxConfigured || !view.muxStreamingEnabled
            ? COURSE_PAGE.muxDisabled
            : lesson.videoStatus === "PENDING"
              ? COURSE_PAGE.videoPending
              : lesson.videoStatus === "ERRORED"
                ? COURSE_PAGE.videoError
                : COURSE_PAGE.videoUnavailable}
        </p>
      </div>
    );

    return (
      <div className="space-y-6 font-sans">
        {/* Immersive Video Player */}
        {videoPlayer}

        {/* Video Info: Title */}
        <div className="space-y-3">
          <h1 className="text-xl font-extrabold sm:text-2xl tracking-tight leading-snug">
            {lesson.title}
          </h1>

          {/* Channel/Creator Info & Action Toolbar */}
          <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between border-y border-foreground/10 pb-4">
            {/* Left Column: Creator / Enrolled Status */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full border-2 border-foreground bg-amber-300 text-foreground flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_var(--foreground)] shrink-0 select-none">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-foreground truncate leading-tight">
                  {videoAuthorName}
                </p>
                <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wide truncate">
                  {view.title}
                </p>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1 bg-muted/40 text-muted-foreground border-2 border-foreground/20 px-3.5 py-1.5 rounded-full text-xs font-black select-none pointer-events-none ml-2">
                <IconCheck className="size-3.5" stroke={3} />
                <span>Inscrito</span>
              </div>
            </div>

            {/* Right Column: Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* IA Assistant toggles Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white font-extrabold shadow-[2px_2px_0px_0px_var(--foreground)] border-2 border-foreground px-4 py-2 rounded-full text-xs transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none animate-pulse hover:animate-none"
                  >
                    <IconSparkles className="size-4 shrink-0" stroke={2.5} />
                    <span>Resumen IA</span>
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="p-0 w-96 max-w-[90vw] border-l-2 border-foreground bg-background shadow-[-6px_0px_0px_0px_var(--foreground)]"
                  showCloseButton={true}
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>{COURSE_PAGE.videoAiPanelTitle}</SheetTitle>
                  </SheetHeader>
                  <div className="h-full pt-10">
                    <CourseLessonVideoAiPanel
                      insight={lesson.videoAiInsight}
                      mode={mode}
                      isSheet={true}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Share/Compartir */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                    sonnerToast.success("¡Enlace copiado al portapapeles!");
                  }
                }}
                className="flex items-center gap-1.5 bg-background hover:bg-muted/40 text-foreground font-extrabold shadow-[2px_2px_0px_0px_var(--foreground)] border-2 border-foreground px-4 py-2 rounded-full text-xs transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <IconShare className="size-4 shrink-0" stroke={2.5} />
                <span>Compartir</span>
              </button>

              {canBookmark ? (
                <CourseLessonBookmarkButton
                  courseSlug={view.slug}
                  lessonId={lesson.id}
                  initialBookmarked={lesson.isBookmarked}
                />
              ) : null}
            </div>
          </div>
        </div>

        {/* YouTube-style Collapsible Description Box */}
        <div
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          className="rounded-xl border-2 border-foreground bg-muted/15 hover:bg-muted/25 transition-all p-4 cursor-pointer text-sm leading-relaxed shadow-[2px_2px_0px_0px_var(--foreground)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--foreground)]"
        >
          <div className="flex flex-wrap items-baseline justify-between font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 select-none gap-x-2">
            <div className="flex items-center gap-2">
              <span>{videoPublishedLabel}</span>
              {lesson.durationSec ? (
                <>
                  <span>•</span>
                  <span>
                    {Math.round(lesson.durationSec / 60)} min de duración
                  </span>
                </>
              ) : null}
            </div>
            <span className="text-primary font-black hover:underline">
              {isDescExpanded ? "Mostrar menos ▲" : "Mostrar más ▼"}
            </span>
          </div>
          <div
            className={cn(
              "text-foreground font-sans font-medium whitespace-pre-wrap",
              !isDescExpanded && "line-clamp-2",
            )}
          >
            {lesson.description ||
              "Esta lección no incluye una descripción escrita, pero puedes consultar los puntos clave y resumen completo usando el Asistente de IA."}
          </div>
        </div>

        {/* Youtube-style Comments Section */}
        <CourseLessonVideoComments
          courseSlug={view.slug}
          lessonId={lesson.id}
          comments={comments}
          canComment={canComment}
          isDemo={isDemo}
          currentUserId={currentUserId}
        />

        {/* Footer Progress Controls */}
        {progressFooter}
      </div>
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
