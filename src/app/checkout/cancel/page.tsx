import {
  CheckoutCancelView,
  type CheckoutCancelCourse,
} from "@/components/checkout/checkout-cancel-view";
import { CourseStatus } from "@/generated/prisma/client";
import { formatPriceLabel } from "@/lib/format-price-label";
import prisma from "@/lib/db/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pago cancelado",
  description:
    "Saliste del checkout sin completar el pago. No se realizó ningún cargo.",
};

type PageProps = {
  searchParams: Promise<{ course?: string }>;
};

async function getCancelCourse(
  courseSlug: string | undefined,
): Promise<CheckoutCancelCourse | null> {
  if (!courseSlug) return null;

  const course = await prisma.course.findFirst({
    where: { slug: courseSlug, status: CourseStatus.PUBLISHED },
    select: {
      title: true,
      slug: true,
      thumbnailUrl: true,
      priceCents: true,
      currency: true,
      description: true,
    },
  });

  if (!course) return null;

  return {
    title: course.title,
    slug: course.slug,
    thumbnailUrl: course.thumbnailUrl,
    priceLabel: formatPriceLabel(course.priceCents, course.currency),
    description: course.description,
  };
}

export default async function CheckoutCancelPage({ searchParams }: PageProps) {
  const { course: rawCourseSlug } = await searchParams;
  const courseSlug = rawCourseSlug
    ? decodeURIComponent(rawCourseSlug)
    : undefined;
  const course = await getCancelCourse(courseSlug);
  const courseHref = course?.slug
    ? `/courses/${course.slug}`
    : courseSlug
      ? `/courses/${courseSlug}`
      : "/catalog";

  return <CheckoutCancelView course={course} courseHref={courseHref} />;
}
