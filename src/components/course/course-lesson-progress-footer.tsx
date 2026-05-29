"use client";

import { markLessonComplete } from "@/app/actions/lesson-progress.actions";
import { Button } from "@/components/ui/button";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import { adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import {
  isAdminPreviewMode,
  isPublicDemoMode,
} from "@/lib/course/course-page-mode";
import type {
  CoursePageLesson,
  CoursePageMode,
} from "@/types/course-page.types";
import { IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "@/lib/toast";

type CourseLessonProgressFooterProps = {
  lesson: CoursePageLesson;
  mode: CoursePageMode;
  courseSlug: string;
  nextLessonHref: string | null;
  onDemoLessonComplete?: (lessonId: string) => void;
};

export function CourseLessonProgressFooter({
  lesson,
  mode,
  courseSlug,
  nextLessonHref,
  onDemoLessonComplete,
}: CourseLessonProgressFooterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localCompleted, setLocalCompleted] = useState(false);
  const isCompleted = lesson.isCompleted || localCompleted;
  const isPreviewMode = isAdminPreviewMode(mode) || isPublicDemoMode(mode);

  if (isAdminPreviewMode(mode)) {
    return null;
  }

  const handleComplete = () => {
    if (isCompleted) return;

    if (isPublicDemoMode(mode)) {
      onDemoLessonComplete?.(lesson.id);
      setLocalCompleted(true);
      toast.success(COURSE_PAGE.lessonCompleted);
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
            : isPreviewMode
              ? COURSE_PAGE.markLessonComplete
              : COURSE_PAGE.markLessonComplete}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {!isCompleted ? (
          <Button
            type="button"
            size="sm"
            onClick={handleComplete}
            disabled={isPending}
          >
            {COURSE_PAGE.markLessonComplete}
          </Button>
        ) : null}
        {isCompleted && nextLessonHref ? (
          <Button asChild size="sm" variant="outline">
            <Link href={nextLessonHref}>
              {COURSE_PAGE.lessonCompleteContinue}
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
