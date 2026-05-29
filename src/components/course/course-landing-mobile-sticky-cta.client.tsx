"use client";

import { CourseEnrollButton } from "@/components/course/course-enroll-button.client";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type CourseLandingMobileStickyCtaProps = {
  courseSlug: string;
  courseTitle: string;
  priceLabel: string;
  ctaLabel: string;
  hasFullAccess: boolean;
  isFree: boolean;
  fallbackHref: string | null;
  isSignedIn: boolean;
  useCheckoutFlow: boolean;
};

export function CourseLandingMobileStickyCta({
  courseSlug,
  courseTitle,
  priceLabel,
  ctaLabel,
  hasFullAccess,
  isFree,
  fallbackHref,
  isSignedIn,
  useCheckoutFlow,
}: CourseLandingMobileStickyCtaProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      role="region"
      aria-label="Inscripción al curso"
      className="fixed inset-x-0 bottom-0 z-[100] border-t-2 border-foreground bg-background pb-safe md:hidden"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-xs font-extrabold leading-snug text-foreground">
            {courseTitle}
          </p>
          <p className="mt-0.5 flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            <ShieldCheck className="size-3 shrink-0 text-primary" aria-hidden />
            {priceLabel} · Stripe Checkout
          </p>
        </div>
        <CourseEnrollButton
          courseSlug={courseSlug}
          hasFullAccess={hasFullAccess}
          isFree={isFree}
          ctaLabel={ctaLabel}
          fallbackHref={fallbackHref}
          isSignedIn={isSignedIn}
          useCheckoutFlow={useCheckoutFlow}
          size="default"
          className="h-11 min-h-11 shrink-0 px-4 active:opacity-80"
        />
      </div>
    </div>,
    document.body,
  );
}
