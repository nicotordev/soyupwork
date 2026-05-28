import { CourseDemoBanner } from "@/components/course/course-demo-banner";
import { CourseLandingHero } from "@/components/course/course-landing-hero";
import { ecosystemTools, faqItems } from "@/constants/course-landing.constants";
import { CourseLandingMarketingSections } from "@/components/course/course-landing-marketing-sections";
import { CourseLandingReviews } from "@/components/course/course-landing-reviews";
import { CourseLandingSyllabus } from "@/components/course/course-landing-syllabus";
import { CoursePreviewBanner } from "@/components/course/course-preview-banner";
import { Button } from "@/components/ui/button";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import { adminGridBackgroundClass } from "@/lib/admin/styles";
import {
  isAdminPreviewMode,
  isPreviewMode,
  isPublicDemoMode,
} from "@/lib/course/course-page-mode";
import type { CoursePageData } from "@/types/course-page.types";
import type { CatalogSection } from "@/types/marketing-nav.types";
import Link from "next/link";
import { MarketingFooter } from "../marketing-footer";
import { MarketingNav } from "../marketing-nav";
import { CourseMarketingBento } from "./course-marketing-bento";

type CourseLandingViewProps = {
  data: CoursePageData;
  buildLessonHref: (lessonSlug: string) => string;
  courseLandingHref: string;
  showModeBanner?: boolean;
  isSignedIn?: boolean;
  catalogSections?: CatalogSection[];
};

export function CourseLandingView({
  data,
  buildLessonHref,
  showModeBanner = true,
  isSignedIn = false,
  catalogSections = [],
}: CourseLandingViewProps) {
  const { view, mode } = data;
  const reviews = view.reviews ?? [];
  const averageRating = view.averageRating ?? null;
  const reviewCount = view.reviewCount ?? reviews.length;
  const enrolledStudentCount = view.enrolledStudentCount ?? 0;
  const estimatedDurationHours = view.estimatedDurationHours ?? null;
  const continueHref = view.firstLessonSlug
    ? buildLessonHref(view.firstLessonSlug)
    : null;
  const totalModuleLessons = view.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0,
  );
  const totalDurationSeconds = view.modules.reduce(
    (moduleAcc, module) =>
      moduleAcc +
      module.lessons.reduce(
        (lessonAcc, lesson) => lessonAcc + (lesson.durationSec ?? 0),
        0,
      ),
    0,
  );
  const estimatedHoursLabel =
    estimatedDurationHours && estimatedDurationHours > 0
      ? `${estimatedDurationHours} horas`
      : totalDurationSeconds > 0
        ? `${Math.max(1, Math.round(totalDurationSeconds / 3600))} horas`
        : "Duración por definir";
  const hasAnyLessons = totalModuleLessons > 0;
  const dynamicFeatureItems =
    view.modules
      .flatMap((module) => module.lessons)
      .slice(0, 4)
      .map((lesson) => lesson.title) ?? [];
  const ctaLabel =
    view.hasFullAccess || isPreviewMode(mode)
      ? COURSE_PAGE.continueLabel
      : "Inscribirme ahora";

  return (
    <>
      <MarketingNav isSignedIn={isSignedIn} catalogSections={catalogSections} />
      <div className="relative min-h-svh overflow-hidden bg-background pb-24 font-sans text-foreground antialiased">
        <div className={adminGridBackgroundClass} />
        <div className="pointer-events-none absolute -left-24 top-24 -z-20 size-104 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-72 -z-20 size-112 rounded-full bg-emerald-500/10 blur-3xl" />

        {isAdminPreviewMode(mode) ? (
          <CoursePreviewBanner courseId={view.id} />
        ) : null}
        {showModeBanner && isPublicDemoMode(mode) ? <CourseDemoBanner /> : null}

        <CourseLandingHero
          view={view}
          continueHref={continueHref}
          ctaLabel={ctaLabel}
          estimatedHoursLabel={estimatedHoursLabel}
          dynamicFeatureItems={dynamicFeatureItems}
          averageRating={averageRating}
          reviewCount={reviewCount}
          enrolledStudentCount={enrolledStudentCount}
        />

        <div className="mx-auto w-full max-w-7xl space-y-16 px-4 py-8 pt-8 sm:px-6 lg:px-8 lg:py-14 lg:pt-24">
          <CourseLandingSyllabus
            view={view}
            hasAnyLessons={hasAnyLessons}
            buildLessonHref={buildLessonHref}
          />
        </div>
      </div>

      <CourseLandingMarketingSections
        continueHref={continueHref}
        ctaLabel={ctaLabel}
        enrolledStudentCount={enrolledStudentCount}
        ecosystemTools={ecosystemTools}
        faqItems={faqItems}
      />

      <CourseMarketingBento />

      {continueHref ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/10 bg-background/95 p-3 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{view.title}</p>
              <p className="text-xs text-muted-foreground">
                {view.priceLabel} · pago seguro
              </p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href={continueHref}>{ctaLabel}</Link>
            </Button>
          </div>
        </div>
      ) : null}
      <MarketingFooter />
    </>
  );
}
