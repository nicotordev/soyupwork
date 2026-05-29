import { ProductType } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { getAppUrl } from "@/lib/stripe/app-url";
import { getStripeClient } from "@/lib/stripe";
import type Stripe from "stripe";

type CreateCheckoutSessionInput = {
  orderId: string;
  userId: string;
  userEmail: string | null;
  stripeCustomerId: string | null;
  product: {
    id: string;
    stripePriceId: string;
    type: ProductType;
    trialDays: number | null;
    course: { slug: string } | null;
  };
};

export async function createStripeCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<{ checkoutUrl: string; sessionId: string }> {
  const stripe = getStripeClient();
  const appUrl = getAppUrl();
  const courseSlug = input.product.course?.slug ?? "";

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode:
      input.product.type === ProductType.SUBSCRIPTION
        ? "subscription"
        : "payment",
    line_items: [
      {
        price: input.product.stripePriceId,
        quantity: 1,
      },
    ],
    client_reference_id: input.orderId,
    metadata: {
      orderId: input.orderId,
      userId: input.userId,
      productId: input.product.id,
    },
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel?course=${encodeURIComponent(courseSlug)}`,
  };

  if (input.stripeCustomerId) {
    sessionParams.customer = input.stripeCustomerId;
  } else if (input.userEmail) {
    sessionParams.customer_email = input.userEmail;
  }

  if (
    input.product.type === ProductType.SUBSCRIPTION &&
    input.product.trialDays &&
    input.product.trialDays > 0
  ) {
    sessionParams.subscription_data = {
      trial_period_days: input.product.trialDays,
      metadata: {
        orderId: input.orderId,
        userId: input.userId,
        productId: input.product.id,
      },
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.url) {
    throw new Error("Stripe no devolvió URL de checkout.");
  }

  await prisma.order.update({
    where: { id: input.orderId },
    data: { stripeCheckoutSessionId: session.id },
  });

  return { checkoutUrl: session.url, sessionId: session.id };
}
