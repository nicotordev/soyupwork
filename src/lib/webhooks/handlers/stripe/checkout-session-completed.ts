import { EnrollmentStatus, OrderStatus } from "@/generated/prisma/client";
import { sendPurchaseConfirmationEmail } from "@/lib/email/send-purchase-confirmation";
import prisma from "@/lib/prisma";
import { findOrderByCheckoutSession } from "@/lib/webhooks/handlers/stripe/find-order";
import { isOrderAlreadyPaid } from "@/lib/webhooks/idempotency";
import type Stripe from "stripe";

function paymentIntentId(session: Stripe.Checkout.Session): string | null {
  const pi = session.payment_intent;
  if (!pi) return null;
  return typeof pi === "string" ? pi : pi.id;
}

function customerId(session: Stripe.Checkout.Session): string | null {
  const customer = session.customer;
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id;
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const order = await findOrderByCheckoutSession(session);
  if (!order) {
    console.warn(
      "[stripe] checkout.session.completed: order not found",
      session.id,
    );
    return;
  }

  if (isOrderAlreadyPaid(order.status)) {
    return;
  }

  const stripePaymentIntentId = paymentIntentId(session);
  const stripeCustomerId = customerId(session);
  const courseId = order.product.courseId;

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.PAID,
        stripeCheckoutSessionId: session.id,
        ...(stripePaymentIntentId ? { stripePaymentIntentId } : {}),
      },
    });

    if (stripeCustomerId) {
      await tx.user.update({
        where: { id: order.userId },
        data: { stripeCustomerId },
      });
    }

    if (courseId) {
      await tx.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: order.userId,
            courseId,
          },
        },
        create: {
          userId: order.userId,
          courseId,
          status: EnrollmentStatus.ACTIVE,
        },
        update: {
          status: EnrollmentStatus.ACTIVE,
        },
      });
    }
  });

  if (order.user.email && order.product.course) {
    try {
      await sendPurchaseConfirmationEmail({
        to: order.user.email,
        userName: order.user.firstName ?? order.user.email,
        courseTitle: order.product.course.title,
        orderId: order.id,
      });
    } catch (err) {
      console.error("[stripe] purchase confirmation email failed", err);
    }
  }
}
