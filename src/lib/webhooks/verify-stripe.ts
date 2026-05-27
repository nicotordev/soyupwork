import { getStripeClient } from "@/lib/stripe";
import { WebhookVerificationError } from "@/lib/webhooks/shared";
import type Stripe from "stripe";

export { WebhookVerificationError };

export function verifyStripeWebhook(
  rawBody: string,
  signature: string | null,
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new WebhookVerificationError("STRIPE_WEBHOOK_SECRET is not set");
  }
  if (!signature) {
    throw new WebhookVerificationError("Missing stripe-signature header");
  }

  try {
    return getStripeClient().webhooks.constructEvent(
      rawBody,
      signature,
      secret,
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Invalid Stripe signature";
    throw new WebhookVerificationError(message);
  }
}
