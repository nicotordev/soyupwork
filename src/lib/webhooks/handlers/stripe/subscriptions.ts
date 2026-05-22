import {
  EnrollmentStatus,
  SubscriptionStatus,
} from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import {
  mapStripeSubscriptionStatus,
  subscriptionGrantsAccess,
} from "@/lib/webhooks/handlers/stripe/map-subscription-status";
import type Stripe from "stripe";

async function findProductForSubscription(subscription: Stripe.Subscription) {
  const priceId =
    typeof subscription.items.data[0]?.price === "string"
      ? subscription.items.data[0]?.price
      : subscription.items.data[0]?.price?.id;

  if (!priceId) return null;

  return prisma.product.findUnique({
    where: { stripePriceId: priceId },
    include: { course: true },
  });
}

async function findUserForSubscription(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  if (!customerId) return null;

  return prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });
}

async function syncEnrollmentForSubscription(
  userId: string,
  courseId: string | null | undefined,
  status: SubscriptionStatus,
): Promise<void> {
  if (!courseId) return;

  const enrollmentStatus = subscriptionGrantsAccess(status)
    ? EnrollmentStatus.ACTIVE
    : status === SubscriptionStatus.CANCELLED
      ? EnrollmentStatus.CANCELLED
      : EnrollmentStatus.EXPIRED;

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId, courseId },
    },
    create: {
      userId,
      courseId,
      status: enrollmentStatus,
    },
    update: {
      status: enrollmentStatus,
    },
  });
}

function periodDates(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  return {
    currentPeriodStart: item?.current_period_start
      ? new Date(item.current_period_start * 1000)
      : null,
    currentPeriodEnd: item?.current_period_end
      ? new Date(item.current_period_end * 1000)
      : null,
  };
}

export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
): Promise<void> {
  const [user, product] = await Promise.all([
    findUserForSubscription(subscription),
    findProductForSubscription(subscription),
  ]);

  if (!user || !product) {
    console.warn(
      "[stripe] subscription.created: user or product not found",
      subscription.id,
    );
    return;
  }

  const status = mapStripeSubscriptionStatus(subscription.status);
  const { currentPeriodStart, currentPeriodEnd } = periodDates(subscription);

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      userId: user.id,
      productId: product.id,
      stripeSubscriptionId: subscription.id,
      status,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      status,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  if (subscriptionGrantsAccess(status)) {
    await syncEnrollmentForSubscription(user.id, product.courseId, status);
  }
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
): Promise<void> {
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
    include: { product: true, user: true },
  });

  if (!existing) {
    await handleSubscriptionCreated(subscription);
    return;
  }

  const status = mapStripeSubscriptionStatus(subscription.status);
  const { currentPeriodStart, currentPeriodEnd } = periodDates(subscription);

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  await syncEnrollmentForSubscription(
    existing.userId,
    existing.product.courseId,
    status,
  );
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
): Promise<void> {
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
    include: { product: true },
  });

  if (!existing) return;

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: SubscriptionStatus.CANCELLED },
  });

  await syncEnrollmentForSubscription(
    existing.userId,
    existing.product.courseId,
    SubscriptionStatus.CANCELLED,
  );
}

function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const sub = invoice.parent?.subscription_details?.subscription;
  if (!sub) return null;
  return typeof sub === "string" ? sub : sub.id;
}

export async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
): Promise<void> {
  const subscriptionId = subscriptionIdFromInvoice(invoice);
  if (!subscriptionId) return;

  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    include: { product: true },
  });

  if (!existing) return;

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: SubscriptionStatus.ACTIVE },
  });

  await syncEnrollmentForSubscription(
    existing.userId,
    existing.product.courseId,
    SubscriptionStatus.ACTIVE,
  );
}

export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
): Promise<void> {
  const subscriptionId = subscriptionIdFromInvoice(invoice);
  if (!subscriptionId) return;

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: SubscriptionStatus.PAST_DUE },
  });
}
