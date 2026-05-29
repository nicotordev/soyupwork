"use client";

import { Button } from "@/components/ui/button";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import { adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { IconLock } from "@tabler/icons-react";
import Link from "next/link";

type CourseLessonLockedViewProps = {
  currentLessonHref: string | null;
  courseLandingHref: string;
};

export function CourseLessonLockedView({
  currentLessonHref,
  courseLandingHref,
}: CourseLessonLockedViewProps) {
  return (
    <div
      className={cn(
        adminPanelClass,
        "mx-auto max-w-lg space-y-4 p-6 text-center sm:p-8",
      )}
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-full border-2 border-foreground bg-muted">
        <IconLock className="size-5" stroke={2.25} aria-hidden />
      </div>
      <div className="space-y-2">
        <h1 className="text-lg font-extrabold tracking-tight">
          {COURSE_PAGE.lockedLessonTitle}
        </h1>
        <p className="text-sm text-muted-foreground">
          {COURSE_PAGE.lockedLessonSequential}
        </p>
      </div>
      {currentLessonHref ? (
        <Button asChild size="sm">
          <Link href={currentLessonHref}>{COURSE_PAGE.lockedLessonBack}</Link>
        </Button>
      ) : (
        <Button asChild size="sm" variant="outline">
          <Link href={courseLandingHref}>{COURSE_PAGE.backToCourse}</Link>
        </Button>
      )}
    </div>
  );
}
