import {
  IconChartBar,
  IconLayoutDashboard,
  IconList,
  IconReceipt,
  IconSchool,
  IconSettings,
  IconUsers,
  IconUsersGroup,
  IconMail,
} from "@tabler/icons-react";

import type { AdminNavItem } from "@/types/dashboard.types";

export const ADMIN_BASE_PATH = "/admin";

export const ADMIN_BRAND = {
  name: "SoyUpwork",
  shortName: "S",
  panelLabel: "Admin",
} as const;

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Resumen",
    href: "/admin",
    icon: IconLayoutDashboard,
    description: "Métricas y actividad reciente",
  },
  {
    label: "Cursos",
    href: "/admin/courses",
    icon: IconSchool,
    description: "Gestión de cursos y lecciones",
  },
  {
    label: "Categorías",
    href: "/admin/categories",
    icon: IconList,
    description: "Gestión de categorías",
  },
  {
    label: "Usuarios",
    href: "/admin/users",
    icon: IconUsers,
    description: "Estudiantes y permisos",
  },
  {
    label: "Lista de espera",
    href: "/admin/waitlist",
    icon: IconMail,
    description: "Registros e invitaciones de acceso",
  },
  {
    label: "Ventas",
    href: "/admin/sales",
    icon: IconReceipt,
    description: "Pedidos y suscripciones",
  },
  {
    label: "Cohortes",
    href: "/admin/cohorts",
    icon: IconUsersGroup,
    description: "Grupos y fechas de inicio",
  },
  {
    label: "Métricas",
    href: "/admin/metrics",
    icon: IconChartBar,
    description: "Analítica y conversión",
  },
  {
    label: "Configuración",
    href: "/admin/settings",
    icon: IconSettings,
    description: "Configuración de la plataforma",
  },
];

export const DASHBOARD_PAGE = {
  eyebrow: "Panel de administración",
  title: "Resumen general",
  description:
    "Supervisa ventas, inscripciones y el rendimiento de tus cursos en un solo lugar.",
} as const;

export const DASHBOARD_CHART_CONFIG = {
  revenue: {
    label: "Ingresos",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Pedidos",
    color: "var(--chart-3)",
  },
} as const;

export const ORDER_STATUS_LABELS = {
  completed: "Completado",
  pending: "Pendiente",
  refunded: "Reembolsado",
} as const;

export const ORDER_STATUS_VARIANTS = {
  completed: "default",
  pending: "secondary",
  refunded: "destructive",
} as const satisfies Record<
  keyof typeof ORDER_STATUS_LABELS,
  "default" | "secondary" | "destructive"
>;

export const ACTIVITY_TYPE_LABELS = {
  sale: "Venta",
  enrollment: "Inscripción",
  course: "Curso",
  refund: "Reembolso",
  user: "Usuario",
} as const;

export const ADMIN_FOOTER_LINKS = [
  { label: "Ver sitio", href: "/" },
  { label: "Catálogo", href: "/catalog" },
] as const;
