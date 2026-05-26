import { OrderStatus } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { findOrderByPaymentIntentOrMetadata } from "@/lib/webhooks/handlers/stripe/find-order";
import { canTransitionOrderFromPending } from "@/lib/webhooks/idempotency";
import type Stripe from "stripe";

export async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent,
): Promise<void> {
  const order = await findOrderByPaymentIntentOrMetadata(paymentIntent);
  if (!order) {
    console.warn(
      "[stripe] payment_intent.payment_failed: order not found",
      paymentIntent.id,
    );
    return;
  }

  if (!canTransitionOrderFromPending(order.status)) {
    return;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: OrderStatus.FAILED,
      stripePaymentIntentId: paymentIntent.id,
    },
  });
}
