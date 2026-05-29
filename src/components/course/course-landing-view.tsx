import { NeobrutalistPageDecoration } from "@/components/common/neobrutalist-page-decoration.client";
import { CourseDemoBanner } from "@/components/course/course-demo-banner";
import { CourseLandingHero } from "@/components/course/course-landing-hero";
import { CourseLandingMobileStickyCta } from "@/components/course/course-landing-mobile-sticky-cta.client";
import { ecosystemTools, faqItems } from "@/constants/course-landing.constants";
import { CourseLandingMarketingSections } from "@/components/course/course-landing-marketing-sections";
import { CourseLandingSyllabus } from "@/components/course/course-landing-syllabus";
import { CoursePreviewBanner } from "@/components/course/course-preview-banner";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import {
  adminEyebrowClass,
  adminGridBackgroundClass,
} from "@/lib/admin/styles";
import {
  isAdminPreviewMode,
  isPreviewMode,
  isPublicDemoMode,
} from "@/lib/course/course-page-mode";
import type { CoursePageData } from "@/types/course-page.types";
import type { CatalogSection } from "@/types/marketing-nav.types";
import { CreditCard, ShieldCheck, Zap } from "lucide-react";
import { CourseMarketingBento } from "./course-marketing-bento";

type CourseLandingViewProps = {
  data: CoursePageData;
  buildLessonHref: (lessonSlug: string) => string;
  courseLandingHref: string;
  showModeBanner?: boolean;
  isSignedIn?: boolean;
  catalogSections?: CatalogSection[];
  useCheckoutFlow?: boolean;
};

function decorationSeedFromSlug(slug: string): number {
  return slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Pago seguro con Stripe Checkout" },
  { icon: CreditCard, label: "Inscripción automática al confirmar" },
  { icon: Zap, label: "Acceso inmediato al temario" },
] as const;

export function CourseLandingView({
  data,
  buildLessonHref,
  showModeBanner = true,
  isSignedIn = false,
  useCheckoutFlow = false,
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
  const shouldUseCheckoutFlow =
    useCheckoutFlow || (mode === "student" && !view.hasFullAccess);
  const isMarketingSurface = mode === "student" && !view.hasFullAccess;
  const showStickyCta =
    (continueHref || shouldUseCheckoutFlow) && !isPreviewMode(mode);

  return (
    <>
      <div className="relative min-h-svh overflow-x-hidden bg-background pb-28 font-sans text-foreground antialiased md:pb-0">
        <div className={adminGridBackgroundClass} />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,var(--primary),transparent)] opacity-10 md:opacity-15" />

        {isMarketingSurface ? (
          <NeobrutalistPageDecoration
            shapeCount={6}
            seed={decorationSeedFromSlug(view.slug)}
            showRadialGlow={false}
          />
        ) : null}

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
          isSignedIn={isSignedIn}
          useCheckoutFlow={shouldUseCheckoutFlow}
        />

        {isMarketingSurface ? (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul className="flex flex-col items-center gap-2 py-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2">
              {TRUST_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.label}
                    className="flex min-h-11 items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground sm:text-[10px]"
                  >
                    <Icon
                      className="size-4 shrink-0 text-primary"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <section className="border-y-2 border-foreground bg-background">
          <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="space-y-3">
              <span className={adminEyebrowClass}>Temario del curso</span>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Revisa el contenido antes de inscribirte. Las lecciones marcadas
                como preview están disponibles sin pago.
              </p>
            </div>
            <CourseLandingSyllabus
              view={view}
              hasAnyLessons={hasAnyLessons}
              buildLessonHref={buildLessonHref}
            />
          </div>
        </section>
      </div>

      <CourseLandingMarketingSections
        continueHref={continueHref}
        ctaLabel={ctaLabel}
        enrolledStudentCount={enrolledStudentCount}
        ecosystemTools={ecosystemTools}
        faqItems={faqItems}
      />

      <CourseMarketingBento />

      {showStickyCta ? (
        <CourseLandingMobileStickyCta
          courseSlug={view.slug}
          courseTitle={view.title}
          priceLabel={view.priceLabel}
          ctaLabel={ctaLabel}
          hasFullAccess={view.hasFullAccess}
          isFree={view.isFree}
          fallbackHref={continueHref}
          isSignedIn={isSignedIn}
          useCheckoutFlow={shouldUseCheckoutFlow}
        />
      ) : null}
    </>
  );
}
