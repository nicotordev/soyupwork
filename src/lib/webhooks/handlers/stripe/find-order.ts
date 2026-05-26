import prisma from "@/lib/db/prisma";
import type Stripe from "stripe";

export async function findOrderByCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  const bySessionId = await prisma.order.findUnique({
    where: { stripeCheckoutSessionId: session.id },
    include: { product: { include: { course: true } }, user: true },
  });

  if (bySessionId) return bySessionId;

  const orderId = session.metadata?.orderId ?? session.client_reference_id;
  if (!orderId) return null;

  return prisma.order.findUnique({
    where: { id: orderId },
    include: { product: { include: { course: true } }, user: true },
  });
}

export async function findOrderByPaymentIntent(paymentIntentId: string) {
  return prisma.order.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
    include: { product: { include: { course: true } }, user: true },
  });
}

export async function findOrderByPaymentIntentOrMetadata(
  paymentIntent: Stripe.PaymentIntent,
) {
  const byPi = await findOrderByPaymentIntent(paymentIntent.id);
  if (byPi) return byPi;

  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) return null;

  return prisma.order.findUnique({
    where: { id: orderId },
    include: { product: { include: { course: true } }, user: true },
  });
}

export function paymentIntentIdFromCharge(
  charge: Stripe.Charge,
): string | null {
  const pi = charge.payment_intent;
  if (!pi) return null;
  return typeof pi === "string" ? pi : pi.id;
}
