import { PLATFORM_SETTINGS_ID } from "@/lib/platform-settings/constants";
import type { PlatformSettings } from "@/generated/prisma/client";

export const DEFAULT_PLATFORM_SETTINGS = {
  id: PLATFORM_SETTINGS_ID,
  siteName: "SoyUpwork",
  siteTagline: "Cursos prácticos para freelancers de LATAM",
  supportEmail: null,
  maintenanceMode: false,
  maintenanceMessage: null,
  maintenanceAllowAdmins: true,
  waitlistMode: false,
  waitlistMessage: null,
  waitlistAllowCatalog: false,
  registrationsOpen: true,
  showAnnouncementBanner: false,
  announcementMessage: null,
} satisfies Omit<PlatformSettings, "createdAt" | "updatedAt">;
