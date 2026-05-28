import { PUBLIC_DEMO_PAGE } from "@/constants/course-page.constants";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export function CourseDemoBanner() {
  return (
    <div className="border-b-2 border-primary bg-primary/10 px-4 py-3 font-sans">
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-primary leading-none">
            {PUBLIC_DEMO_PAGE.bannerTitle}
          </p>
          <p className="text-xs text-muted-foreground leading-normal">
            {PUBLIC_DEMO_PAGE.bannerDescription}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3.5 shrink-0">
          <Link
            href="/waitlist"
            className="text-[10px] font-semibold uppercase tracking-wide text-primary underline-offset-4 hover:underline"
          >
            {PUBLIC_DEMO_PAGE.waitlistCta}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-foreground underline-offset-4 hover:underline"
          >
            <IconArrowLeft className="size-3.5" stroke={2.25} />
            {PUBLIC_DEMO_PAGE.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
