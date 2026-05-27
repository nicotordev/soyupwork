import { ADMIN_COURSE_PREVIEW_PAGE } from "@/constants/course-page.constants";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

type CoursePreviewBannerProps = {
  courseId: string;
};

export function CoursePreviewBanner({ courseId }: CoursePreviewBannerProps) {
  return (
    <div className="border-b-2 border-amber-500 bg-amber-500/15 px-4 py-2.5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase text-amber-800 dark:text-amber-200">
            {ADMIN_COURSE_PREVIEW_PAGE.bannerTitle}
          </p>
          <p className="text-xs text-muted-foreground">
            {ADMIN_COURSE_PREVIEW_PAGE.bannerDescription}
          </p>
        </div>
        <Link
          href={`/admin/courses/${courseId}/curriculum`}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-foreground underline-offset-4 hover:underline"
        >
          <IconArrowLeft className="size-3.5" stroke={2.25} />
          {ADMIN_COURSE_PREVIEW_PAGE.backToEditor}
        </Link>
      </div>
    </div>
  );
}
