import type { PlatformSettings } from "@/generated/prisma/client";

export type PlatformSettingsPublic = Pick<
  PlatformSettings,
  | "siteName"
  | "siteTagline"
  | "supportEmail"
  | "maintenanceMode"
  | "maintenanceMessage"
  | "waitlistMode"
  | "waitlistMessage"
  | "waitlistAllowCatalog"
  | "registrationsOpen"
  | "showAnnouncementBanner"
  | "announcementMessage"
>;

export type GeneralSettingsFormValues = {
  siteName: string;
  siteTagline: string;
  supportEmail: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceAllowAdmins: boolean;
  waitlistMode: boolean;
  waitlistMessage: string;
  waitlistAllowCatalog: boolean;
  registrationsOpen: boolean;
  showAnnouncementBanner: boolean;
  announcementMessage: string;
};

export type UpdateGeneralSettingsResult =
  | { ok: true }
  | { ok: false; error: string };

export type JoinWaitlistResult =
  | { ok: true }
  | { ok: false; error: string };

export type PlatformGateAction = "none" | "maintenance" | "waitlist";
