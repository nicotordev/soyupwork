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

export type AdminSettingsSectionStatus = "available" | "coming_soon";

export type AdminSettingsSection = {
  id: string;
  label: string;
  description: string;
  icon: Icon;
  status: AdminSettingsSectionStatus;
};

export const ADMIN_SETTINGS_SECTIONS: AdminSettingsSection[] = [
  {
    id: "general",
    label: "General",
    description: "Nombre del sitio, URL pública y preferencias regionales.",
    icon: IconWorld,
    status: "coming_soon",
  },
  {
    id: "auth",
    label: "Autenticación",
    description: "Inicio de sesión, registro y flujos post-login con Clerk.",
    icon: IconShield,
    status: "coming_soon",
  },
  {
    id: "payments",
    label: "Pagos",
    description: "Moneda, checkout y webhooks de Stripe.",
    icon: IconBrandStripe,
    status: "coming_soon",
  },
  {
    id: "email",
    label: "Correo transaccional",
    description: "Remitente, plantillas y entregabilidad con Resend.",
    icon: IconMail,
    status: "coming_soon",
  },
  {
    id: "storage",
    label: "Almacenamiento",
    description: "Archivos, miniaturas y assets en Cloudflare R2.",
    icon: IconCloud,
    status: "coming_soon",
  },
  {
    id: "video",
    label: "Video",
    description: "Streaming de lecciones y webhooks con Mux.",
    icon: IconMovie,
    status: "coming_soon",
  },
  {
    id: "notifications",
    label: "Notificaciones",
    description: "Alertas internas y avisos a estudiantes.",
    icon: IconBell,
    status: "coming_soon",
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
