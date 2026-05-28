import { PUBLIC_DEMO_PAGE } from "@/constants/course-page.constants";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export function CourseDemoBanner() {
  return (
    <div className="border-b-2 border-primary bg-primary/10 px-4 py-2.5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase text-primary">
            {PUBLIC_DEMO_PAGE.bannerTitle}
          </p>
          <p className="text-xs text-muted-foreground">
            {PUBLIC_DEMO_PAGE.bannerDescription}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/waitlist"
            className="font-mono text-[10px] font-bold uppercase text-primary underline-offset-4 hover:underline"
          >
            {PUBLIC_DEMO_PAGE.waitlistCta}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-foreground underline-offset-4 hover:underline"
          >
            <IconArrowLeft className="size-3.5" stroke={2.25} />
            {PUBLIC_DEMO_PAGE.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
