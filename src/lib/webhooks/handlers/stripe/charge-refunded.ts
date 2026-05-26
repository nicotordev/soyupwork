import { EnrollmentStatus, OrderStatus } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import {
  findOrderByPaymentIntent,
  paymentIntentIdFromCharge,
} from "@/lib/webhooks/handlers/stripe/find-order";
import type Stripe from "stripe";

export async function handleChargeRefunded(
  charge: Stripe.Charge,
): Promise<void> {
  const paymentIntentId = paymentIntentIdFromCharge(charge);
  if (!paymentIntentId) {
    console.warn("[stripe] charge.refunded: no payment_intent", charge.id);
    return;
  }

  const order = await findOrderByPaymentIntent(paymentIntentId);
  if (!order) {
    console.warn("[stripe] charge.refunded: order not found", paymentIntentId);
    return;
  }

  const courseId = order.product.courseId;

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.REFUNDED },
    });

    if (courseId) {
      await tx.enrollment.updateMany({
        where: {
          userId: order.userId,
          courseId,
        },
        data: { status: EnrollmentStatus.CANCELLED },
      });
    }
  });
}
