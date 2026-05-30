"use client";

import { toggleLessonBookmark } from "@/app/actions/lesson-bookmark.actions";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import { cn } from "@/lib/utils";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast as sonnerToast } from "sonner";

type CourseLessonBookmarkButtonProps = {
  courseSlug: string;
  lessonId: string;
  initialBookmarked: boolean;
};

export function CourseLessonBookmarkButton({
  courseSlug,
  lessonId,
  initialBookmarked,
}: CourseLessonBookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const mutation = useMutation({
    mutationFn: () => toggleLessonBookmark({ courseSlug, lessonId }),
    onSuccess: (result) => {
      if (!result.ok) {
        sonnerToast.error(result.error);
        return;
      }

      setIsBookmarked(result.bookmarked);
      sonnerToast.success(
        result.bookmarked
          ? COURSE_PAGE.lessonBookmarkSaved
          : COURSE_PAGE.lessonBookmarkRemoved,
      );
    },
    onError: () => {
      sonnerToast.error("No se pudo actualizar el marcador. Intenta de nuevo.");
    },
  });

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={cn(
        "flex items-center justify-center size-9 bg-background hover:bg-muted/40 text-foreground font-extrabold shadow-[2px_2px_0px_0px_var(--foreground)] border-2 border-foreground rounded-full transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50",
        isBookmarked && "bg-primary/15 border-primary text-primary",
      )}
      aria-label={
        isBookmarked
          ? COURSE_PAGE.lessonBookmarkSavedLabel
          : COURSE_PAGE.lessonBookmarkSave
      }
      aria-pressed={isBookmarked}
    >
      {isBookmarked ? (
        <IconBookmarkFilled className="size-4 shrink-0" stroke={2.5} />
      ) : (
        <IconBookmark className="size-4 shrink-0" stroke={2.5} />
      )}
    </button>
  );
}
