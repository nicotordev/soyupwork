import {
  BillingInterval,
  CourseStatus,
  ProductType,
} from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { getResolvedStripeCurrency } from "@/lib/platform/settings/resolve";
import { getStripeClient } from "@/lib/stripe";
import type Stripe from "stripe";

export type CourseCommerceOptions = {
  productType: ProductType;
  billingInterval?: BillingInterval | null;
  trialDays?: number | null;
};

export type SyncCourseProductInput = {
  courseId: string;
  title: string;
  description: string | null;
  priceCents: number;
  currency?: string;
  status: CourseStatus;
  commerce: CourseCommerceOptions;
};

function stripeRecurringInterval(
  interval: BillingInterval,
): Stripe.PriceCreateParams.Recurring.Interval {
  return interval === BillingInterval.MONTH ? "month" : "year";
}

function priceNeedsUpdate(
  existing: {
    priceCents: number;
    currency: string;
    type: ProductType;
    billingInterval: BillingInterval | null;
    stripePriceId: string;
  },
  input: {
    priceCents: number;
    currency: string;
    productType: ProductType;
    billingInterval: BillingInterval | null;
  },
): boolean {
  return (
    existing.priceCents !== input.priceCents ||
    existing.currency !== input.currency ||
    existing.type !== input.productType ||
    existing.billingInterval !== input.billingInterval
  );
}

async function deactivateCourseProducts(courseId: string): Promise<void> {
  const stripe = getStripeClient();
  const products = await prisma.product.findMany({
    where: { courseId, active: true },
  });

  for (const product of products) {
    try {
      await stripe.prices.update(product.stripePriceId, { active: false });
    } catch (err) {
      console.warn(
        "[stripe] failed to archive price",
        product.stripePriceId,
        err,
      );
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { active: false },
    });
  }
}

async function createStripePrice(
  stripeProductId: string,
  input: {
    priceCents: number;
    currency: string;
    productType: ProductType;
    billingInterval: BillingInterval | null;
  },
): Promise<string> {
  const stripe = getStripeClient();

  const params: Stripe.PriceCreateParams = {
    product: stripeProductId,
    unit_amount: input.priceCents,
    currency: input.currency,
  };

  if (input.productType === ProductType.SUBSCRIPTION && input.billingInterval) {
    params.recurring = {
      interval: stripeRecurringInterval(input.billingInterval),
    };
  }

  const price = await stripe.prices.create(params);
  return price.id;
}

export async function syncCourseProduct(
  input: SyncCourseProductInput,
): Promise<void> {
  const currency = input.currency ?? (await getResolvedStripeCurrency());
  const isPublished = input.status === CourseStatus.PUBLISHED;
  const isFree = input.priceCents === 0;

  if (!isPublished || isFree) {
    await deactivateCourseProducts(input.courseId);
    return;
  }

  if (
    input.commerce.productType === ProductType.SUBSCRIPTION &&
    !input.commerce.billingInterval
  ) {
    throw new Error(
      "Los cursos de suscripción requieren un intervalo de facturación.",
    );
  }

  const stripe = getStripeClient();
  const billingInterval =
    input.commerce.productType === ProductType.SUBSCRIPTION
      ? (input.commerce.billingInterval ?? null)
      : null;

  const existing = await prisma.product.findFirst({
    where: { courseId: input.courseId },
    orderBy: { updatedAt: "desc" },
  });

  let stripeProductId = existing?.stripeProductId;

  if (stripeProductId) {
    await stripe.products.update(stripeProductId, {
      name: input.title,
      description: input.description?.slice(0, 500) ?? undefined,
      active: true,
      metadata: { courseId: input.courseId },
    });
  } else {
    const stripeProduct = await stripe.products.create({
      name: input.title,
      description: input.description?.slice(0, 500) ?? undefined,
      metadata: { courseId: input.courseId },
    });
    stripeProductId = stripeProduct.id;
  }

  const priceInput = {
    priceCents: input.priceCents,
    currency,
    productType: input.commerce.productType,
    billingInterval,
  };

  let stripePriceId = existing?.stripePriceId;

  if (!existing || !stripePriceId || priceNeedsUpdate(existing, priceInput)) {
    if (existing?.stripePriceId) {
      try {
        await stripe.prices.update(existing.stripePriceId, { active: false });
      } catch (err) {
        console.warn(
          "[stripe] failed to archive old price",
          existing.stripePriceId,
          err,
        );
      }
    }

    stripePriceId = await createStripePrice(stripeProductId, priceInput);
  }

  const productData = {
    courseId: input.courseId,
    stripeProductId,
    stripePriceId,
    name: input.title,
    description: input.description,
    priceCents: input.priceCents,
    currency,
    active: true,
    type: input.commerce.productType,
    billingInterval,
    trialDays: input.commerce.trialDays ?? null,
    isLifetime: input.commerce.productType === ProductType.ONE_TIME,
    isBundle: false,
  };

  if (existing) {
    await prisma.product.update({
      where: { id: existing.id },
      data: productData,
    });
  } else {
    await prisma.product.create({ data: productData });
  }
}
