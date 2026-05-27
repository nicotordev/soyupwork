"use server";

import { OrderStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { displayName } from "@/lib/user/display-name";
import type { AdminSalesOrderRow, AdminSalesPageData } from "@/types/admin-sales.types";

const log = getServerLogger("sales.actions");

function mapOrderRow(order: {
  id: string;
  amountCents: number;
  currency: string;
  status: OrderStatus;
  createdAt: Date;
  user: { firstName: string | null; lastName: string | null; email: string | null };
  product: { name: string; course: { title: string } | null };
}): AdminSalesOrderRow {
  return {
    id: `ord_${order.id.slice(0, 8)}`,
    customer: displayName(order.user),
    course: order.product.course?.title ?? order.product.name,
    amount: Math.round(order.amountCents / 100),
    currency: order.currency,
    status: order.status,
    date: order.createdAt.toISOString(),
  };
}

export async function getAdminSalesPageData(): Promise<AdminSalesPageData> {
  await requireAdmin();

  try {
    const ordersRaw = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 250,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
        product: {
          select: {
            name: true,
            course: { select: { title: true } },
          },
        },
      },
    });

    const orders = ordersRaw.map(mapOrderRow);

    const totalRevenue = Math.round(
      ordersRaw
        .filter((order) => order.status === OrderStatus.PAID)
        .reduce((sum, order) => sum + order.amountCents, 0) / 100,
    );

    const processedOrders = ordersRaw.filter(
      (order) => order.status !== OrderStatus.PENDING,
    ).length;

    const failedOrRefundedOrders = ordersRaw.filter(
      (order) =>
        order.status === OrderStatus.REFUNDED ||
        order.status === OrderStatus.FAILED ||
        order.status === OrderStatus.CANCELLED,
    ).length;

    return {
      orders,
      stats: {
        totalRevenue,
        processedOrders,
        failedOrRefundedOrders,
      },
    };
  } catch (error) {
    log.error(serializeError(error), "Failed to load admin sales page data");
    throw error;
  }
}
