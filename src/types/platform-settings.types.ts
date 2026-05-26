import type { PlatformSettings } from "@/generated/prisma/client";
import type {
  authSettingsSchema,
  emailSettingsSchema,
  generalSettingsSchema,
  notificationsSettingsSchema,
  paymentsSettingsSchema,
  storageSettingsSchema,
  videoSettingsSchema,
} from "@/lib/platform/settings/schemas";
import type { z } from "zod";

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

export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;
export type AuthSettingsFormValues = z.infer<typeof authSettingsSchema>;
export type PaymentsSettingsFormValues = z.infer<typeof paymentsSettingsSchema>;
export type EmailSettingsFormValues = z.infer<typeof emailSettingsSchema>;
export type StorageSettingsFormValues = z.infer<typeof storageSettingsSchema>;
export type VideoSettingsFormValues = z.infer<typeof videoSettingsSchema>;
export type NotificationsSettingsFormValues = z.infer<
  typeof notificationsSettingsSchema
>;

export type UpdateSettingsResult = { ok: true } | { ok: false; error: string };

/** @deprecated Use UpdateSettingsResult */
export type UpdateGeneralSettingsResult = UpdateSettingsResult;

export type JoinWaitlistResult = { ok: true } | { ok: false; error: string };

export type PlatformGateAction = "none" | "maintenance" | "waitlist";
