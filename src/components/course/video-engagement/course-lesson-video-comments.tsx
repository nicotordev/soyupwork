"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import { adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { CoursePageLessonComment } from "@/types/course-page.types";
import { IconMessageCircle } from "@tabler/icons-react";
import { formatLessonCommentDate } from "./format-lesson-comment-date";

type CourseLessonVideoCommentsProps = {
  comments: CoursePageLessonComment[];
};

export function CourseLessonVideoComments({
  comments,
}: CourseLessonVideoCommentsProps) {
  return (
    <section
      className={cn(adminPanelClass, "overflow-hidden")}
      aria-labelledby="video-comments-title"
    >
      <header className="flex items-center gap-2 border-b-2 border-foreground px-4 py-3">
        <IconMessageCircle
          className="size-4 shrink-0 text-primary"
          stroke={2.25}
          aria-hidden
        />
        <h2
          id="video-comments-title"
          className="text-xs font-extrabold uppercase tracking-wide text-foreground"
        >
          {COURSE_PAGE.videoCommentsTitle}
        </h2>
        {comments.length > 0 ? (
          <span className="ml-auto text-[10px] font-semibold tabular-nums text-muted-foreground">
            {comments.length}
          </span>
        ) : null}
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        {comments.length > 0 ? (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded border-2 border-foreground/15 bg-muted/15 px-3 py-2.5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                  <p className="text-xs font-bold text-foreground">
                    {comment.authorName}
                  </p>
                  <time
                    dateTime={comment.createdAt}
                    className="text-[10px] text-muted-foreground"
                  >
                    {formatLessonCommentDate(comment.createdAt)}
                  </time>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                  {comment.body}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            {COURSE_PAGE.videoCommentsEmpty}
          </p>
        )}

        <div className="space-y-2 border-t-2 border-dashed border-foreground/20 pt-4">
          <Textarea
            disabled
            placeholder={COURSE_PAGE.videoCommentsPlaceholder}
            className="min-h-20 text-sm"
            aria-label={COURSE_PAGE.videoCommentsPlaceholder}
          />
          <div className="flex justify-end">
            <Button type="button" size="sm" disabled>
              {COURSE_PAGE.videoCommentsSubmitSoon}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
