import { markLessonComplete } from "@/app/actions/lesson-progress.actions";
import { Button } from "@/components/ui/button";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import { adminPanelClass } from "@/lib/admin/styles";
import { computeNextLessonHref } from "@/lib/course/compute-next-lesson-href";
import { cn } from "@/lib/utils";
import {
  isAdminPreviewMode,
  isPublicDemoMode,
} from "@/lib/course/course-page-mode";
import type {
  CoursePageLesson,
  CoursePageMode,
  CoursePageView,
} from "@/types/course-page.types";
import { IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "@/lib/toast";

type CourseLessonProgressFooterProps = {
  view: CoursePageView;
  lesson: CoursePageLesson;
  mode: CoursePageMode;
  courseSlug: string;
  lessonBasePath: string;
  lessonHrefMode?: "path" | "query";
  nextLessonHref: string | null;
  onDemoLessonComplete?: (lessonId: string) => void;
};

export function CourseLessonProgressFooter({
  view,
  lesson,
  mode,
  courseSlug,
  lessonBasePath,
  lessonHrefMode = "path",
  nextLessonHref,
  onDemoLessonComplete,
}: CourseLessonProgressFooterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localCompleted, setLocalCompleted] = useState(false);
  const isCompleted = lesson.isCompleted || localCompleted;
  const isPreviewMode = isAdminPreviewMode(mode) || isPublicDemoMode(mode);

  useEffect(() => {
    setLocalCompleted(false);
  }, [lesson.id]);

  const effectiveNextLessonHref = useMemo(() => {
    if (!localCompleted || lesson.isCompleted) {
      return nextLessonHref;
    }

    return computeNextLessonHref({
      view,
      mode,
      currentLessonSlug: lesson.slug,
      pendingCompletedLessonId: lesson.id,
      lessonBasePath,
      lessonHrefMode,
    });
  }, [
    localCompleted,
    lesson.isCompleted,
    lesson.id,
    lesson.slug,
    nextLessonHref,
    view,
    mode,
    lessonBasePath,
    lessonHrefMode,
  ]);

  if (isAdminPreviewMode(mode)) {
    return null;
  }

  const handleComplete = () => {
    if (isCompleted) return;

    if (isPublicDemoMode(mode)) {
      onDemoLessonComplete?.(lesson.id);
      setLocalCompleted(true);
      toast.success(COURSE_PAGE.lessonCompleted);

      const href = computeNextLessonHref({
        view,
        mode,
        currentLessonSlug: lesson.slug,
        pendingCompletedLessonId: lesson.id,
        lessonBasePath,
        lessonHrefMode,
      });

      if (href) {
        router.push(href);
      }
      return;
    }

    startTransition(async () => {
      const result = await markLessonComplete({
        courseSlug,
        lessonId: lesson.id,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setLocalCompleted(true);
      toast.success(COURSE_PAGE.lessonCompleted);
      router.refresh();
    });
  };

  return (
    <div
      className={cn(
        adminPanelClass,
        "flex flex-col gap-3 border-2 border-foreground p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-0">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <IconCheck
              className="size-4 shrink-0 text-emerald-600"
              stroke={2.5}
              aria-hidden
            />
          ) : null}
          <p className="text-sm font-semibold text-foreground">
            {isCompleted
              ? COURSE_PAGE.lessonCompleted
              : COURSE_PAGE.markLessonComplete}
          </p>
        </div>
        {!isCompleted && isPreviewMode ? (
          <p className="text-xs text-muted-foreground sm:pl-6">
            En la demo, marcá la lección como completada para desbloquear la
            siguiente.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {!isCompleted ? (
          <Button
            type="button"
            size="sm"
            className="min-h-11"
            onClick={handleComplete}
            disabled={isPending}
          >
            {COURSE_PAGE.markLessonComplete}
          </Button>
        ) : null}
        {isCompleted && effectiveNextLessonHref ? (
          <Button asChild size="sm" variant="outline" className="min-h-11">
            <Link href={effectiveNextLessonHref}>
              {COURSE_PAGE.lessonCompleteContinue}
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
