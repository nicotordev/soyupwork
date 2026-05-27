"use server";

import { OrderStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { displayName } from "@/lib/user/display-name";
import type {
  AdminSalesOrderRow,
  AdminSalesPageData,
} from "@/types/admin-sales.types";

const log = getServerLogger("sales.actions");
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const STATUS_FILTER_ALL = "ALL";

function mapOrderRow(order: {
  id: string;
  amountCents: number;
  currency: string;
  status: OrderStatus;
  createdAt: Date;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
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

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parsePositiveInt(
  raw: string | undefined,
  fallback: number,
  max?: number,
): number {
  const parsed = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  if (max !== undefined && parsed > max) return max;
  return parsed;
}

function parseStatus(raw: string | undefined): OrderStatus | "ALL" {
  if (!raw) return STATUS_FILTER_ALL;
  if (Object.values(OrderStatus).includes(raw as OrderStatus)) {
    return raw as OrderStatus;
  }
  return STATUS_FILTER_ALL;
}

export async function getAdminSalesPageData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<AdminSalesPageData> {
  await requireAdmin();

  try {
    const q = firstParam(searchParams.q)?.trim() ?? "";
    const status = parseStatus(firstParam(searchParams.status));
    const pageSize = parsePositiveInt(
      firstParam(searchParams.pageSize),
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    );

    const where = {
      ...(status !== STATUS_FILTER_ALL ? { status } : {}),
      ...(q
        ? {
            OR: [
              { id: { contains: q, mode: "insensitive" as const } },
              {
                user: {
                  is: {
                    OR: [
                      {
                        firstName: {
                          contains: q,
                          mode: "insensitive" as const,
                        },
                      },
                      {
                        lastName: { contains: q, mode: "insensitive" as const },
                      },
                      { email: { contains: q, mode: "insensitive" as const } },
                    ],
                  },
                },
              },
              {
                product: {
                  is: { name: { contains: q, mode: "insensitive" as const } },
                },
              },
              {
                product: {
                  is: {
                    course: {
                      is: {
                        title: { contains: q, mode: "insensitive" as const },
                      },
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const totalCount = await prisma.order.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const page = Math.min(
      Math.max(
        parsePositiveInt(firstParam(searchParams.page), DEFAULT_PAGE),
        1,
      ),
      totalPages,
    );
    const skip = (page - 1) * pageSize;

    const ordersRaw = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
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

    const [paidRevenueAgg, processedOrders, failedOrRefundedOrders] =
      await Promise.all([
        prisma.order.aggregate({
          _sum: { amountCents: true },
          where: { status: OrderStatus.PAID },
        }),
        prisma.order.count({
          where: { status: { not: OrderStatus.PENDING } },
        }),
        prisma.order.count({
          where: {
            status: {
              in: [
                OrderStatus.REFUNDED,
                OrderStatus.FAILED,
                OrderStatus.CANCELLED,
              ],
            },
          },
        }),
      ]);

    const totalRevenue = Math.round(
      (paidRevenueAgg._sum.amountCents ?? 0) / 100,
    );

    return {
      orders,
      stats: {
        totalRevenue,
        processedOrders,
        failedOrRefundedOrders,
      },
      filters: { q, status, page, pageSize },
      pagination: { page, pageSize, totalCount, totalPages },
    };
  } catch (error) {
    log.error(serializeError(error), "Failed to load admin sales page data");
    throw error;
  }
}
