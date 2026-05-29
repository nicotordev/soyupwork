"use server";

import {
  CourseStatus,
  EnrollmentStatus,
  OrderStatus,
} from "@/generated/prisma/client";
import { StudentAuthError, requireStudent } from "@/lib/auth/student";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import { userHasActiveEnrollment } from "@/lib/course/get-course-page-data";
import { createStripeCheckoutSession } from "@/lib/stripe/create-checkout-session";
import { getAppUrl } from "@/lib/stripe/app-url";

const log = getServerLogger("checkout.actions");

export type CheckoutActionResult =
  | { ok: true; checkoutUrl: string }
  | { ok: true; redirectUrl: string; enrolled: true }
  | { ok: false; error: string };

async function resolvePublishedCourse(slug: string) {
  return prisma.course.findFirst({
    where: { slug, status: CourseStatus.PUBLISHED },
    select: {
      id: true,
      slug: true,
      title: true,
      priceCents: true,
      products: {
        where: { active: true },
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: {
          id: true,
          stripePriceId: true,
          type: true,
          trialDays: true,
          priceCents: true,
          currency: true,
          course: { select: { slug: true } },
        },
      },
    },
  });
}

export async function enrollInFreeCourse(
  courseSlug: string,
): Promise<CheckoutActionResult> {
  try {
    const student = await requireStudent();
    const course = await resolvePublishedCourse(courseSlug);

    if (!course) {
      return { ok: false, error: "Curso no encontrado o no publicado." };
    }

    if (course.priceCents > 0) {
      return { ok: false, error: "Este curso requiere pago." };
    }

    if (await userHasActiveEnrollment(student.id, course.id)) {
      return {
        ok: true,
        redirectUrl: `${getAppUrl()}/courses/${course.slug}`,
        enrolled: true,
      };
    }

    await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId: student.id, courseId: course.id },
      },
      create: {
        userId: student.id,
        courseId: course.id,
        status: EnrollmentStatus.ACTIVE,
        source: "free",
      },
      update: {
        status: EnrollmentStatus.ACTIVE,
        source: "free",
      },
    });

    return {
      ok: true,
      redirectUrl: `${getAppUrl()}/courses/${course.slug}`,
      enrolled: true,
    };
  } catch (error) {
    if (error instanceof StudentAuthError) {
      return { ok: false, error: error.message };
    }
    log.error(serializeError(error), "Free enrollment failed");
    return { ok: false, error: "No se pudo completar la inscripción." };
  }
}

export async function createCourseCheckout(
  courseSlug: string,
): Promise<CheckoutActionResult> {
  try {
    const student = await requireStudent();
    const settings = await getPlatformSettings();

    if (!settings.enableStripeCheckout) {
      return {
        ok: false,
        error: "Las compras están temporalmente deshabilitadas.",
      };
    }

    const course = await resolvePublishedCourse(courseSlug);

    if (!course) {
      return { ok: false, error: "Curso no encontrado o no publicado." };
    }

    if (course.priceCents === 0) {
      return enrollInFreeCourse(courseSlug);
    }

    if (await userHasActiveEnrollment(student.id, course.id)) {
      return {
        ok: false,
        error: "Ya tienes acceso a este curso.",
      };
    }

    const product = course.products[0];
    if (!product) {
      return {
        ok: false,
        error:
          "Este curso aún no tiene un producto de pago configurado. Contacta al administrador.",
      };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: student.id },
      select: {
        email: true,
        stripeCustomerId: true,
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: student.id,
        productId: product.id,
        status: OrderStatus.PENDING,
        amountCents: product.priceCents,
        currency: product.currency,
      },
    });

    const { checkoutUrl } = await createStripeCheckoutSession({
      orderId: order.id,
      userId: student.id,
      userEmail: dbUser?.email ?? student.email ?? null,
      stripeCustomerId: dbUser?.stripeCustomerId ?? null,
      product,
    });

    return { ok: true, checkoutUrl };
  } catch (error) {
    if (error instanceof StudentAuthError) {
      return { ok: false, error: error.message };
    }
    log.error(serializeError(error), "Checkout session creation failed");
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo iniciar el checkout.",
    };
  }
}

export async function getCheckoutSuccessDetails(sessionId: string) {
  const student = await requireStudent();
  const { getStripeClient } = await import("@/lib/stripe");
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  const orderId =
    session.metadata?.orderId ?? session.client_reference_id ?? null;

  if (!orderId) {
    return null;
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: student.id,
    },
    include: {
      product: {
        include: {
          course: { select: { title: true, slug: true } },
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  const hasEnrollment = order.product.courseId
    ? await userHasActiveEnrollment(student.id, order.product.courseId)
    : false;

  return {
    orderStatus: order.status,
    courseTitle: order.product.course?.title ?? order.product.name,
    courseSlug: order.product.course?.slug ?? null,
    amountCents: order.amountCents,
    currency: order.currency,
    hasEnrollment,
  };
}
