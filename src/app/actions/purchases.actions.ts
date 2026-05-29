"use server";

import { OrderStatus, SubscriptionStatus } from "@/generated/prisma/client";
import { requireStudent } from "@/lib/auth/student";
import prisma from "@/lib/db/prisma";

export type StudentPurchaseRow = {
  id: string;
  type: "order";
  courseTitle: string;
  courseSlug: string | null;
  amountCents: number;
  currency: string;
  status: OrderStatus;
  date: string;
};

export type StudentSubscriptionRow = {
  id: string;
  type: "subscription";
  courseTitle: string;
  courseSlug: string | null;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  date: string;
};

export type StudentPurchasesData = {
  orders: StudentPurchaseRow[];
  subscriptions: StudentSubscriptionRow[];
};

const ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.PAID,
  OrderStatus.REFUNDED,
  OrderStatus.PENDING,
  OrderStatus.FAILED,
  OrderStatus.CANCELLED,
];

const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
  SubscriptionStatus.PAST_DUE,
  SubscriptionStatus.CANCELLED,
  SubscriptionStatus.UNPAID,
  SubscriptionStatus.INCOMPLETE,
];

export async function getStudentPurchasesData(): Promise<StudentPurchasesData> {
  const student = await requireStudent();

  const [orders, subscriptions] = await Promise.all([
    prisma.order.findMany({
      where: {
        userId: student.id,
        status: { in: ORDER_STATUSES },
      },
      include: {
        product: {
          include: {
            course: { select: { title: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.subscription.findMany({
      where: {
        userId: student.id,
        status: { in: SUBSCRIPTION_STATUSES },
      },
      include: {
        product: {
          include: {
            course: { select: { title: true, slug: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return {
    orders: orders.map((order) => ({
      id: order.id,
      type: "order" as const,
      courseTitle: order.product.course?.title ?? order.product.name,
      courseSlug: order.product.course?.slug ?? null,
      amountCents: order.amountCents,
      currency: order.currency,
      status: order.status,
      date: order.createdAt.toISOString(),
    })),
    subscriptions: subscriptions.map((subscription) => ({
      id: subscription.id,
      type: "subscription" as const,
      courseTitle:
        subscription.product.course?.title ?? subscription.product.name,
      courseSlug: subscription.product.course?.slug ?? null,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      date: subscription.createdAt.toISOString(),
    })),
  };
}
