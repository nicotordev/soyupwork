import {
  IconBell,
  IconBrandStripe,
  IconCloud,
  IconMail,
  IconMovie,
  IconShield,
  IconWorld,
  type Icon,
} from "@tabler/icons-react";

export const ADMIN_SETTINGS_PAGE = {
  eyebrow: "Plataforma",
  title: "Configuración",
  description:
    "Administra integraciones, marca, comunicaciones y preferencias operativas de SoyUpwork.",
} as const;

export const ADMIN_SETTINGS_GENERAL_PAGE = {
  eyebrow: "Configuración",
  title: "General",
  description:
    "Marca pública, modo mantenimiento, waitlist y anuncios del sitio.",
} as const;

export const ADMIN_SETTINGS_AUTH_PAGE = {
  eyebrow: "Configuración",
  title: "Autenticación",
  description: "Registro, OAuth, verificación y redirecciones con Clerk.",
} as const;

export const ADMIN_SETTINGS_PAYMENTS_PAGE = {
  eyebrow: "Configuración",
  title: "Pagos",
  description: "Moneda, checkout y política de reembolsos con Stripe.",
} as const;

export const ADMIN_SETTINGS_EMAIL_PAGE = {
  eyebrow: "Configuración",
  title: "Correo transaccional",
  description: "Remitentes y envíos automáticos con Resend.",
} as const;

export const ADMIN_SETTINGS_STORAGE_PAGE = {
  eyebrow: "Configuración",
  title: "Almacenamiento",
  description: "Límites de subida y URL pública de Cloudflare R2.",
} as const;

export const ADMIN_SETTINGS_VIDEO_PAGE = {
  eyebrow: "Configuración",
  title: "Video",
  description: "Streaming de lecciones y calidad con Mux.",
} as const;

export const ADMIN_SETTINGS_NOTIFICATIONS_PAGE = {
  eyebrow: "Configuración",
  title: "Notificaciones",
  description: "Alertas, rate limiting, logs y retención de analytics.",
} as const;

export type AdminSettingsSectionStatus = "available" | "coming_soon";

export type AdminSettingsSection = {
  id: string;
  label: string;
  description: string;
  icon: Icon;
  status: AdminSettingsSectionStatus;
  href?: string;
};

export const ADMIN_SETTINGS_SECTIONS: AdminSettingsSection[] = [
  {
    id: "general",
    label: "General",
    description: "Marca, mantenimiento, waitlist y anuncios.",
    icon: IconWorld,
    status: "available",
    href: "/admin/settings/general",
  },
  {
    id: "auth",
    label: "Autenticación",
    description: "Inicio de sesión, registro y flujos post-login con Clerk.",
    icon: IconShield,
    status: "available",
    href: "/admin/settings/auth",
  },
  {
    id: "payments",
    label: "Pagos",
    description: "Moneda, checkout y webhooks de Stripe.",
    icon: IconBrandStripe,
    status: "available",
    href: "/admin/settings/payments",
  },
  {
    id: "email",
    label: "Correo transaccional",
    description: "Remitente, plantillas y entregabilidad con Resend.",
    icon: IconMail,
    status: "available",
    href: "/admin/settings/email",
  },
  {
    id: "storage",
    label: "Almacenamiento",
    description: "Archivos, miniaturas y assets en Cloudflare R2.",
    icon: IconCloud,
    status: "available",
    href: "/admin/settings/storage",
  },
  {
    id: "video",
    label: "Video",
    description: "Streaming de lecciones y webhooks con Mux.",
    icon: IconMovie,
    status: "available",
    href: "/admin/settings/video",
  },
  {
    id: "notifications",
    label: "Notificaciones",
    description: "Alertas internas, rate limits y observabilidad.",
    icon: IconBell,
    status: "available",
    href: "/admin/settings/notifications",
  },
];

export const ADMIN_SETTINGS_INTEGRATIONS = [
  {
    id: "clerk",
    label: "Clerk",
    description: "Autenticación y gestión de usuarios",
  },
  {
    id: "stripe",
    label: "Stripe",
    description: "Pagos y suscripciones",
  },
  {
    id: "resend",
    label: "Resend",
    description: "Correo transaccional",
  },
  {
    id: "r2",
    label: "Cloudflare R2",
    description: "Almacenamiento de archivos",
  },
  {
    id: "mux",
    label: "Mux",
    description: "Video bajo demanda",
  },
  {
    id: "inngest",
    label: "Inngest",
    description: "Jobs y automatizaciones en background",
  },
] as const;
