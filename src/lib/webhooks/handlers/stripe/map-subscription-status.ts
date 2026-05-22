import { SubscriptionStatus } from "@/generated/prisma/client";
import type Stripe from "stripe";

export function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status,
): SubscriptionStatus {
  switch (status) {
    case "active":
      return SubscriptionStatus.ACTIVE;
    case "trialing":
      return SubscriptionStatus.TRIALING;
    case "past_due":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
      return SubscriptionStatus.CANCELLED;
    case "unpaid":
      return SubscriptionStatus.UNPAID;
    case "incomplete":
    case "incomplete_expired":
    case "paused":
      return SubscriptionStatus.INCOMPLETE;
    default:
      return SubscriptionStatus.INCOMPLETE;
  }
}

export function subscriptionGrantsAccess(status: SubscriptionStatus): boolean {
  return (
    status === SubscriptionStatus.ACTIVE ||
    status === SubscriptionStatus.TRIALING
  );
}
