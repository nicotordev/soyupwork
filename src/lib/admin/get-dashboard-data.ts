import type { DashboardOverviewData } from "@/types/dashboard.types";

/** Demo data until Prisma-backed admin APIs are wired. */
export function getDashboardOverviewData(): DashboardOverviewData {
  const now = Date.now();

  return {
    stats: [
      {
        id: "revenue",
        label: "Ingresos del mes",
        value: "$12.480",
        helper: "vs. mes anterior",
        trend: "up",
        changeLabel: "+18.2%",
      },
      {
        id: "sales",
        label: "Ventas",
        value: "186",
        helper: "pedidos completados",
        trend: "up",
        changeLabel: "+9.4%",
      },
      {
        id: "students",
        label: "Estudiantes activos",
        value: "1.284",
        helper: "últimos 30 días",
        trend: "up",
        changeLabel: "+4.1%",
      },
      {
        id: "courses",
        label: "Cursos publicados",
        value: "24",
        helper: "3 en borrador",
        trend: "neutral",
        changeLabel: "—",
      },
    ],
    revenueSeries: [
      { month: "Oct", revenue: 6200, orders: 72 },
      { month: "Nov", revenue: 8100, orders: 94 },
      { month: "Dic", revenue: 9800, orders: 118 },
      { month: "Ene", revenue: 8900, orders: 102 },
      { month: "Feb", revenue: 10500, orders: 131 },
      { month: "Mar", revenue: 12480, orders: 186 },
    ],
    recentOrders: [
      {
        id: "ord_8f2a",
        customer: "María González",
        course: "Ventas B2B en Upwork",
        amount: 149,
        status: "completed",
        createdAt: new Date(now - 1000 * 60 * 12).toISOString(),
      },
      {
        id: "ord_7c91",
        customer: "Lucas Pérez",
        course: "Propuestas que convierten",
        amount: 89,
        status: "completed",
        createdAt: new Date(now - 1000 * 60 * 45).toISOString(),
      },
      {
        id: "ord_6b44",
        customer: "Ana Ruiz",
        course: "Freelance desde cero",
        amount: 199,
        status: "pending",
        createdAt: new Date(now - 1000 * 60 * 90).toISOString(),
      },
      {
        id: "ord_5a33",
        customer: "Diego Martín",
        course: "Portafolio para clientes",
        amount: 79,
        status: "completed",
        createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: "ord_4e22",
        customer: "Sofía Lima",
        course: "Ventas B2B en Upwork",
        amount: 149,
        status: "refunded",
        createdAt: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
      },
    ],
    recentActivity: [
      {
        id: "act_1",
        type: "sale",
        title: "Nueva venta",
        description: "María González compró Ventas B2B en Upwork",
        timestamp: new Date(now - 1000 * 60 * 12).toISOString(),
      },
      {
        id: "act_2",
        type: "enrollment",
        title: "Inscripción",
        description: "Lucas Pérez accedió a Propuestas que convierten",
        timestamp: new Date(now - 1000 * 60 * 38).toISOString(),
      },
      {
        id: "act_3",
        type: "course",
        title: "Curso actualizado",
        description: "Se publicó la lección 4 de Freelance desde cero",
        timestamp: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "act_4",
        type: "refund",
        title: "Reembolso procesado",
        description: "Pedido ord_4e22 reembolsado vía Stripe",
        timestamp: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
      },
      {
        id: "act_5",
        type: "user",
        title: "Nuevo registro",
        description: "carlos.dev se registró desde el catálogo",
        timestamp: new Date(now - 1000 * 60 * 60 * 14).toISOString(),
      },
    ],
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
}
