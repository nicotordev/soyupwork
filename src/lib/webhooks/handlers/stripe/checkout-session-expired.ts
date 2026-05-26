import { OrderStatus } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { findOrderByCheckoutSession } from "@/lib/webhooks/handlers/stripe/find-order";
import { canTransitionOrderFromPending } from "@/lib/webhooks/idempotency";
import type Stripe from "stripe";

export async function handleCheckoutSessionExpired(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const order = await findOrderByCheckoutSession(session);
  if (!order) return;

  if (!canTransitionOrderFromPending(order.status)) {
    return;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.CANCELLED },
  });
}
