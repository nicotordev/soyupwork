"use server";

import {
  CourseStatus,
  EnrollmentStatus,
  OrderStatus,
} from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { displayName } from "@/lib/user/display-name";
import type { DashboardOverviewData } from "@/types/dashboard.types";

const log = getServerLogger("dashboard.actions");

type DashboardRange = "7d" | "30d" | "12m" | "all";

type DateBucket = {
  label: string;
  start: Date;
  end: Date;
};

const DASHBOARD_RANGES: readonly DashboardRange[] = ["7d", "30d", "12m", "all"];

function parseRange(input?: string): DashboardRange {
  if (input && DASHBOARD_RANGES.includes(input as DashboardRange)) {
    return input as DashboardRange;
  }
  return "30d";
}

function compactOrderId(id: string): string {
  return `ord_${id.slice(0, 8)}`;
}

function formatPctChange(
  current: number,
  previous: number,
): {
  changeLabel: string;
  trend: "up" | "down" | "neutral";
} {
  if (previous === 0 && current === 0) {
    return { changeLabel: "—", trend: "neutral" };
  }
  if (previous === 0) {
    return { changeLabel: "+100.0%", trend: "up" };
  }
  const raw = ((current - previous) / previous) * 100;
  const trend = raw > 0 ? "up" : raw < 0 ? "down" : "neutral";
  const sign = raw > 0 ? "+" : "";
  return { changeLabel: `${sign}${raw.toFixed(1)}%`, trend };
}

function toCurrencyLabel(amountUsd: number): string {
  return `$${Math.round(amountUsd).toLocaleString("es-CL")}`;
}

function monthLabel(date: Date): string {
  const raw = new Intl.DateTimeFormat("es-CL", { month: "short" }).format(date);
  return raw.replace(".", "").replace(/^./, (char) => char.toUpperCase());
}

function dayLabel(date: Date): string {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function buildBuckets(range: DashboardRange, now = new Date()): DateBucket[] {
  const buckets: DateBucket[] = [];
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (range === "7d") {
    for (let i = 6; i >= 0; i -= 1) {
      const start = new Date(end);
      start.setDate(end.getDate() - i);
      start.setHours(0, 0, 0, 0);
      const bucketEnd = new Date(start);
      bucketEnd.setHours(23, 59, 59, 999);
      buckets.push({ label: dayLabel(start), start, end: bucketEnd });
    }
    return buckets;
  }

  if (range === "30d") {
    for (let i = 5; i >= 0; i -= 1) {
      const start = new Date(end);
      start.setDate(end.getDate() - i * 5 - 4);
      start.setHours(0, 0, 0, 0);
      const bucketEnd = new Date(start);
      bucketEnd.setDate(start.getDate() + 4);
      bucketEnd.setHours(23, 59, 59, 999);
      buckets.push({ label: `${dayLabel(start)}`, start, end: bucketEnd });
    }
    return buckets;
  }

  const months = range === "12m" ? 12 : 24;
  for (let i = months - 1; i >= 0; i -= 1) {
    const start = new Date(end.getFullYear(), end.getMonth() - i, 1);
    const bucketEnd = new Date(end.getFullYear(), end.getMonth() - i + 1, 0);
    bucketEnd.setHours(23, 59, 59, 999);
    buckets.push({ label: monthLabel(start), start, end: bucketEnd });
  }

  return buckets;
}

function rangeWindow(
  range: DashboardRange,
  now = new Date(),
): {
  start: Date | null;
  previousStart: Date | null;
  previousEnd: Date | null;
  label: string;
} {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (range === "all") {
    return {
      start: null,
      previousStart: null,
      previousEnd: null,
      label: "histórico",
    };
  }

  const start = new Date(end);
  const previousEnd = new Date(start);
  previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1);
  const previousStart = new Date(previousEnd);

  if (range === "7d") {
    start.setDate(end.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    previousStart.setDate(previousEnd.getDate() - 6);
    previousStart.setHours(0, 0, 0, 0);
    return { start, previousStart, previousEnd, label: "7 días" };
  }

  if (range === "30d") {
    start.setDate(end.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    previousStart.setDate(previousEnd.getDate() - 29);
    previousStart.setHours(0, 0, 0, 0);
    return { start, previousStart, previousEnd, label: "30 días" };
  }

  start.setMonth(end.getMonth() - 11);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  previousStart.setMonth(previousEnd.getMonth() - 11);
  previousStart.setDate(1);
  previousStart.setHours(0, 0, 0, 0);
  return { start, previousStart, previousEnd, label: "12 meses" };
}

export async function getDashboardOverviewData(
  rawRange?: string,
): Promise<DashboardOverviewData> {
  await requireAdmin();
  const range = parseRange(rawRange);
  const { start, previousStart, previousEnd, label } = rangeWindow(range);

  try {
    log.debug({ range }, "Building dashboard overview (db)");

    const [
      paidCurrentAgg,
      paidPreviousAgg,
      paidCurrentCount,
      paidPreviousCount,
      activeStudents,
      currentEnrollments,
      previousEnrollments,
      publishedCourses,
      draftCourses,
      chartOrders,
      recentOrdersRaw,
      recentEnrollmentsRaw,
      recentCoursesRaw,
      recentUsersRaw,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          status: OrderStatus.PAID,
          ...(start ? { createdAt: { gte: start } } : {}),
        },
        _sum: { amountCents: true },
      }),
      start && previousStart && previousEnd
        ? prisma.order.aggregate({
            where: {
              status: OrderStatus.PAID,
              createdAt: { gte: previousStart, lte: previousEnd },
            },
            _sum: { amountCents: true },
          })
        : Promise.resolve({ _sum: { amountCents: 0 } }),
      prisma.order.count({
        where: {
          status: OrderStatus.PAID,
          ...(start ? { createdAt: { gte: start } } : {}),
        },
      }),
      start && previousStart && previousEnd
        ? prisma.order.count({
            where: {
              status: OrderStatus.PAID,
              createdAt: { gte: previousStart, lte: previousEnd },
            },
          })
        : Promise.resolve(0),
      prisma.enrollment.count({
        where: {
          status: { in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED] },
        },
      }),
      prisma.enrollment.count({
        where: {
          status: { in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED] },
          ...(start ? { createdAt: { gte: start } } : {}),
        },
      }),
      start && previousStart && previousEnd
        ? prisma.enrollment.count({
            where: {
              status: {
                in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED],
              },
              createdAt: { gte: previousStart, lte: previousEnd },
            },
          })
        : Promise.resolve(0),
      prisma.course.count({ where: { status: CourseStatus.PUBLISHED } }),
      prisma.course.count({ where: { status: CourseStatus.DRAFT } }),
      prisma.order.findMany({
        where: {
          status: OrderStatus.PAID,
          ...(start ? { createdAt: { gte: start } } : {}),
        },
        select: { createdAt: true, amountCents: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
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
      }),
      prisma.enrollment.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          course: { select: { title: true } },
        },
      }),
      prisma.course.findMany({
        take: 6,
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, updatedAt: true },
      }),
      prisma.user.findMany({
        where: { deletedAt: null },
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
        },
      }),
    ]);

    const revenueCurrentUsd = Math.round(
      (paidCurrentAgg._sum.amountCents ?? 0) / 100,
    );
    const revenuePreviousUsd = Math.round(
      (paidPreviousAgg._sum.amountCents ?? 0) / 100,
    );

    const revenueDelta = start
      ? formatPctChange(revenueCurrentUsd, revenuePreviousUsd)
      : { changeLabel: "—", trend: "neutral" as const };
    const salesDelta = start
      ? formatPctChange(paidCurrentCount, paidPreviousCount)
      : { changeLabel: "—", trend: "neutral" as const };
    const studentsDelta = start
      ? formatPctChange(currentEnrollments, previousEnrollments)
      : { changeLabel: "—", trend: "neutral" as const };

    const buckets = buildBuckets(range);
    const revenueSeries = buckets.map((bucket) => {
      const inBucket = chartOrders.filter(
        (order) =>
          order.createdAt >= bucket.start && order.createdAt <= bucket.end,
      );

      const cents = inBucket.reduce((sum, order) => sum + order.amountCents, 0);
      return {
        month: bucket.label,
        revenue: Math.round(cents / 100),
        orders: inBucket.length,
      };
    });

    const recentOrders = recentOrdersRaw.map((order) => ({
      id: compactOrderId(order.id),
      customer: displayName(order.user),
      course: order.product.course?.title ?? order.product.name,
      amount: Math.round(order.amountCents / 100),
      status:
        order.status === OrderStatus.PAID
          ? ("completed" as const)
          : order.status === OrderStatus.REFUNDED
            ? ("refunded" as const)
            : ("pending" as const),
      createdAt: order.createdAt.toISOString(),
    }));

    const recentActivity = [
      ...recentOrdersRaw.map((order) => {
        const customerName = displayName(order.user);
        const courseTitle = order.product.course?.title ?? order.product.name;
        const isRefund = order.status === OrderStatus.REFUNDED;
        return {
          id: `order_${order.id}`,
          type: isRefund ? ("refund" as const) : ("sale" as const),
          title: isRefund ? "Reembolso procesado" : "Nueva venta",
          description: isRefund
            ? `${customerName} recibió reembolso en ${courseTitle}`
            : `${customerName} compró ${courseTitle}`,
          timestamp: order.createdAt.toISOString(),
        };
      }),
      ...recentEnrollmentsRaw.map((enrollment) => ({
        id: `enrollment_${enrollment.id}`,
        type: "enrollment" as const,
        title: "Nueva inscripción",
        description: `${displayName(enrollment.user)} se inscribió en ${enrollment.course.title}`,
        timestamp: enrollment.createdAt.toISOString(),
      })),
      ...recentCoursesRaw.map((course) => ({
        id: `course_${course.id}`,
        type: "course" as const,
        title: "Curso actualizado",
        description: `Se actualizó ${course.title}`,
        timestamp: course.updatedAt.toISOString(),
      })),
      ...recentUsersRaw.map((user) => ({
        id: `user_${user.id}`,
        type: "user" as const,
        title: "Nuevo registro",
        description: `${displayName(user)} creó una cuenta`,
        timestamp: user.createdAt.toISOString(),
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 10);

    const data: DashboardOverviewData = {
      stats: [
        {
          id: "revenue",
          label: "Ingresos",
          value: toCurrencyLabel(revenueCurrentUsd),
          helper: start ? `vs. período anterior (${label})` : "histórico",
          trend: revenueDelta.trend,
          changeLabel: revenueDelta.changeLabel,
        },
        {
          id: "sales",
          label: "Ventas",
          value: String(paidCurrentCount),
          helper: start
            ? `pedidos pagados (${label})`
            : "pedidos pagados históricos",
          trend: salesDelta.trend,
          changeLabel: salesDelta.changeLabel,
        },
        {
          id: "students",
          label: "Estudiantes activos",
          value: activeStudents.toLocaleString("es-CL"),
          helper: `${currentEnrollments} nuevas inscripciones (${label})`,
          trend: studentsDelta.trend,
          changeLabel: studentsDelta.changeLabel,
        },
        {
          id: "courses",
          label: "Cursos publicados",
          value: publishedCourses.toLocaleString("es-CL"),
          helper: `${draftCourses} en borrador`,
          trend: "neutral",
          changeLabel: "—",
        },
      ],
      revenueSeries,
      recentOrders,
      recentActivity,
      quickActions: [
        {
          id: "new-course",
          label: "Nuevo curso",
          description: "Crear curso, módulos y lecciones",
          href: "/admin/courses",
        },
        {
          id: "view-sales",
          label: "Ver ventas",
          description: "Pedidos, suscripciones y cupones",
          href: "/admin/sales",
        },
        {
          id: "invite-user",
          label: "Gestionar usuarios",
          description: "Roles, accesos y cohortes",
          href: "/admin/users",
        },
        {
          id: "export",
          label: "Métricas",
          description: "Conversión y embudo de ventas",
          href: "/admin/metrics",
        },
      ],
    };

    log.info(
      {
        range,
        orders: recentOrders.length,
        activity: recentActivity.length,
      },
      "Dashboard overview ready",
    );
    return data;
  } catch (error) {
    log.error(serializeError(error), "Failed to build dashboard overview");
    throw error;
  }
}
