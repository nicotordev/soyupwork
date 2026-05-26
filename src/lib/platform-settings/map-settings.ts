import type { PlatformSettings } from "@/generated/prisma/client";
import type { GeneralSettingsFormValues } from "@/types/platform-settings.types";

export function mapPlatformSettingsToFormValues(
  settings: PlatformSettings,
): GeneralSettingsFormValues {
  return {
    siteName: settings.siteName,
    siteTagline: settings.siteTagline ?? "",
    supportEmail: settings.supportEmail ?? "",
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage ?? "",
    maintenanceAllowAdmins: settings.maintenanceAllowAdmins,
    waitlistMode: settings.waitlistMode,
    waitlistMessage: settings.waitlistMessage ?? "",
    waitlistAllowCatalog: settings.waitlistAllowCatalog,
    registrationsOpen: settings.registrationsOpen,
    showAnnouncementBanner: settings.showAnnouncementBanner,
    announcementMessage: settings.announcementMessage ?? "",
  };
}

export function mapFormValuesToPlatformSettingsUpdate(
  values: GeneralSettingsFormValues,
) {
  return {
    siteName: values.siteName.trim(),
    siteTagline: values.siteTagline.trim() || null,
    supportEmail: values.supportEmail.trim() || null,
    maintenanceMode: values.maintenanceMode,
    maintenanceMessage: values.maintenanceMessage.trim() || null,
    maintenanceAllowAdmins: values.maintenanceAllowAdmins,
    waitlistMode: values.waitlistMode,
    waitlistMessage: values.waitlistMessage.trim() || null,
    waitlistAllowCatalog: values.waitlistAllowCatalog,
    registrationsOpen: values.registrationsOpen,
    showAnnouncementBanner: values.showAnnouncementBanner,
    announcementMessage: values.announcementMessage.trim() || null,
  };
}
