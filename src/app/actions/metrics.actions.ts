"use server";

import { EnrollmentStatus, OrderStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import type {
  AdminMetricsPageData,
  AdminMetricsStage,
} from "@/types/admin-metrics.types";

const log = getServerLogger("metrics.actions");

function safePct(base: number, value: number): number {
  if (base <= 0) return 0;
  return Number(((value / base) * 100).toFixed(2));
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function getAdminMetricsPageData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<AdminMetricsPageData> {
  await requireAdmin();

  try {
    const q = firstParam(searchParams.q)?.trim().toLowerCase() ?? "";
    const [
      activeUsersCount,
      enrolledUsersRaw,
      ordersCount,
      paidOrdersCount,
      paidOrdersRevenueAgg,
      paidCustomers,
      firstOrders,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.enrollment.findMany({
        where: {
          status: { in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED] },
        },
        distinct: ["userId"],
        select: { userId: true },
      }),
      prisma.order.count(),
      prisma.order.count({ where: { status: OrderStatus.PAID } }),
      prisma.order.aggregate({
        where: { status: OrderStatus.PAID },
        _sum: { amountCents: true },
      }),
      prisma.order.findMany({
        where: { status: OrderStatus.PAID },
        distinct: ["userId"],
        select: { userId: true },
      }),
      prisma.order.findMany({
        distinct: ["userId"],
        orderBy: [{ userId: "asc" }, { createdAt: "asc" }],
        select: {
          createdAt: true,
          user: {
            select: { createdAt: true },
          },
        },
      }),
    ]);

    const enrolledUsersCount = enrolledUsersRaw.length;
    const paidRevenue = Math.round(
      (paidOrdersRevenueAgg._sum.amountCents ?? 0) / 100,
    );
    const paidCustomersCount = paidCustomers.length;

    const avgHoursToFirstOrder =
      firstOrders.length === 0
        ? 0
        : Number(
            (
              firstOrders.reduce((total, order) => {
                const diffMs =
                  order.createdAt.getTime() - order.user.createdAt.getTime();
                return total + Math.max(diffMs, 0);
              }, 0) /
              firstOrders.length /
              1000 /
              60 /
              60
            ).toFixed(1),
          );

    const stagesBase = Math.max(activeUsersCount, 1);
    const stages: AdminMetricsStage[] = [
      {
        id: "registered_users",
        name: "Usuarios Activos",
        count: activeUsersCount,
        percentage: safePct(stagesBase, activeUsersCount),
        description: "Usuarios con cuenta activa en la plataforma.",
        color: "bg-primary",
      },
      {
        id: "enrolled_users",
        name: "Usuarios Inscritos",
        count: enrolledUsersCount,
        percentage: safePct(stagesBase, enrolledUsersCount),
        description: "Usuarios con al menos una inscripción activa/completada.",
        color: "bg-secondary",
      },
      {
        id: "checkout_started",
        name: "Pedidos Iniciados",
        count: ordersCount,
        percentage: safePct(stagesBase, ordersCount),
        description:
          "Pedidos creados en checkout, independiente de su estado final.",
        color: "bg-amber-400",
      },
      {
        id: "sales_completed",
        name: "Ventas Completadas",
        count: paidOrdersCount,
        percentage: safePct(stagesBase, paidOrdersCount),
        description: "Pedidos confirmados como pagados.",
        color: "bg-emerald-400",
      },
    ];

    const filteredStages = q
      ? stages.filter(
          (stage) =>
            stage.name.toLowerCase().includes(q) ||
            stage.description.toLowerCase().includes(q),
        )
      : stages;

    return {
      stats: {
        conversionRate: safePct(activeUsersCount, paidOrdersCount),
        checkoutRetention: safePct(ordersCount, paidOrdersCount),
        avgHoursToFirstOrder,
        studentLtv:
          paidCustomersCount === 0
            ? 0
            : Number((paidRevenue / paidCustomersCount).toFixed(2)),
      },
      stages: filteredStages,
      filters: { q },
    };
  } catch (error) {
    log.error(serializeError(error), "Failed to load admin metrics page data");
    throw error;
  }
}
