import { handleChargeRefunded } from "@/lib/webhooks/handlers/stripe/charge-refunded";
import { handleCheckoutSessionCompleted } from "@/lib/webhooks/handlers/stripe/checkout-session-completed";
import { handleCheckoutSessionExpired } from "@/lib/webhooks/handlers/stripe/checkout-session-expired";
import { handlePaymentIntentFailed } from "@/lib/webhooks/handlers/stripe/payment-intent-failed";
import {
  handleInvoicePaymentFailed,
  handleInvoicePaymentSucceeded,
  handleSubscriptionCreated,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
} from "@/lib/webhooks/handlers/stripe/subscriptions";
import type Stripe from "stripe";

export async function handleStripeWebhook(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    case "checkout.session.expired":
      await handleCheckoutSessionExpired(event.data.object);
      break;
    case "payment_intent.payment_failed":
      await handlePaymentIntentFailed(event.data.object);
      break;
    case "charge.refunded":
      await handleChargeRefunded(event.data.object);
      break;
    case "customer.subscription.created":
      await handleSubscriptionCreated(event.data.object);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object);
      break;
    case "invoice.payment_succeeded":
      await handleInvoicePaymentSucceeded(event.data.object);
      break;
    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event.data.object);
      break;
    default:
      break;
  }
}
