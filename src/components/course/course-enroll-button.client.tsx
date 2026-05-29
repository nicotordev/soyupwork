"use client";

import {
  createCourseCheckout,
  enrollInFreeCourse,
} from "@/app/actions/checkout.actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type CourseEnrollButtonProps = {
  courseSlug: string;
  hasFullAccess: boolean;
  isFree: boolean;
  ctaLabel: string;
  fallbackHref: string | null;
  isSignedIn?: boolean;
  signInHref?: string;
  size?: "default" | "sm" | "lg";
  className?: string;
  useCheckoutFlow?: boolean;
};

export function CourseEnrollButton({
  courseSlug,
  hasFullAccess,
  isFree,
  ctaLabel,
  fallbackHref,
  isSignedIn = true,
  signInHref,
  size = "default",
  className,
  useCheckoutFlow = true,
}: CourseEnrollButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!useCheckoutFlow && fallbackHref) {
    return (
      <Button asChild size={size} className={className}>
        <Link href={fallbackHref}>{ctaLabel}</Link>
      </Button>
    );
  }

  if (hasFullAccess && fallbackHref) {
    return (
      <Button asChild size={size} className={className}>
        <Link href={fallbackHref}>{ctaLabel}</Link>
      </Button>
    );
  }

  if (!isSignedIn) {
    const href =
      signInHref ??
      `/sign-in?redirect_url=${encodeURIComponent(`/courses/${courseSlug}`)}`;
    return (
      <Button asChild size={size} className={className}>
        <Link href={href}>{ctaLabel}</Link>
      </Button>
    );
  }

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = isFree
        ? await enrollInFreeCourse(courseSlug)
        : await createCourseCheckout(courseSlug);

      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      if ("enrolled" in result && result.enrolled) {
        toast.success("¡Inscripción completada!");
        router.push(result.redirectUrl);
        router.refresh();
        return;
      }

      if ("checkoutUrl" in result) {
        window.location.href = result.checkoutUrl;
      }
    });
  };

  return (
    <div className="flex flex-col items-stretch gap-1">
      <Button
        type="button"
        size={size}
        className={className}
        disabled={isPending}
        onClick={handleClick}
      >
        {isPending ? "Procesando…" : ctaLabel}
      </Button>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
