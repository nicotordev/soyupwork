import type { PlatformSettings } from "@/generated/prisma/client";
import type {
  AuthSettingsFormValues,
  EmailSettingsFormValues,
  GeneralSettingsFormValues,
  NotificationsSettingsFormValues,
  PaymentsSettingsFormValues,
  StorageSettingsFormValues,
  VideoSettingsFormValues,
} from "@/types/platform-settings.types";

function nullIfEmpty(value: string): string | null {
  return value.trim() || null;
}

export function mapPlatformSettingsToGeneralFormValues(
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
    showAnnouncementBanner: settings.showAnnouncementBanner,
    announcementMessage: settings.announcementMessage ?? "",
  };
}

export function mapGeneralFormValuesToUpdate(
  values: GeneralSettingsFormValues,
) {
  return {
    siteName: values.siteName.trim(),
    siteTagline: nullIfEmpty(values.siteTagline),
    supportEmail: nullIfEmpty(values.supportEmail),
    maintenanceMode: values.maintenanceMode,
    maintenanceMessage: nullIfEmpty(values.maintenanceMessage),
    maintenanceAllowAdmins: values.maintenanceAllowAdmins,
    waitlistMode: values.waitlistMode,
    waitlistMessage: nullIfEmpty(values.waitlistMessage),
    waitlistAllowCatalog: values.waitlistAllowCatalog,
    showAnnouncementBanner: values.showAnnouncementBanner,
    announcementMessage: nullIfEmpty(values.announcementMessage),
  };
}

export function mapPlatformSettingsToAuthFormValues(
  settings: PlatformSettings,
): AuthSettingsFormValues {
  return {
    registrationsOpen: settings.registrationsOpen,
    afterSignInUrl: settings.afterSignInUrl,
    afterSignUpUrl: settings.afterSignUpUrl,
    requireVerifiedEmail: settings.requireVerifiedEmail,
    allowOAuthSignIn: settings.allowOAuthSignIn,
  };
}

export function mapAuthFormValuesToUpdate(values: AuthSettingsFormValues) {
  return {
    registrationsOpen: values.registrationsOpen,
    afterSignInUrl: values.afterSignInUrl.trim(),
    afterSignUpUrl: values.afterSignUpUrl.trim(),
    requireVerifiedEmail: values.requireVerifiedEmail,
    allowOAuthSignIn: values.allowOAuthSignIn,
  };
}

export function mapPlatformSettingsToPaymentsFormValues(
  settings: PlatformSettings,
): PaymentsSettingsFormValues {
  return {
    stripeCurrency: settings.stripeCurrency,
    enableStripeCheckout: settings.enableStripeCheckout,
    showTaxBreakdown: settings.showTaxBreakdown,
    refundPolicyDays: settings.refundPolicyDays,
  };
}

export function mapPaymentsFormValuesToUpdate(
  values: PaymentsSettingsFormValues,
) {
  return {
    stripeCurrency: values.stripeCurrency.trim().toLowerCase(),
    enableStripeCheckout: values.enableStripeCheckout,
    showTaxBreakdown: values.showTaxBreakdown,
    refundPolicyDays: values.refundPolicyDays,
  };
}

export function mapPlatformSettingsToEmailFormValues(
  settings: PlatformSettings,
): EmailSettingsFormValues {
  return {
    emailFrom: settings.emailFrom ?? "",
    emailSupport: settings.emailSupport ?? "",
    sendPurchaseConfirmation: settings.sendPurchaseConfirmation,
    sendEnrollmentEmail: settings.sendEnrollmentEmail,
  };
}

export function mapEmailFormValuesToUpdate(values: EmailSettingsFormValues) {
  return {
    emailFrom: nullIfEmpty(values.emailFrom),
    emailSupport: nullIfEmpty(values.emailSupport),
    sendPurchaseConfirmation: values.sendPurchaseConfirmation,
    sendEnrollmentEmail: values.sendEnrollmentEmail,
  };
}

export function mapPlatformSettingsToStorageFormValues(
  settings: PlatformSettings,
): StorageSettingsFormValues {
  return {
    maxFileSizeMb: settings.maxFileSizeMb,
    maxVideoSizeMb: settings.maxVideoSizeMb,
    storagePublicUrl: settings.storagePublicUrl ?? "",
  };
}

export function mapStorageFormValuesToUpdate(
  values: StorageSettingsFormValues,
) {
  return {
    maxFileSizeMb: values.maxFileSizeMb,
    maxVideoSizeMb: values.maxVideoSizeMb,
    storagePublicUrl: nullIfEmpty(values.storagePublicUrl),
  };
}

export function mapPlatformSettingsToVideoFormValues(
  settings: PlatformSettings,
): VideoSettingsFormValues {
  return {
    enableMuxStreaming: settings.enableMuxStreaming,
    videoSignedPlayback: settings.videoSignedPlayback,
    defaultVideoQuality:
      settings.defaultVideoQuality as VideoSettingsFormValues["defaultVideoQuality"],
  };
}

export function mapVideoFormValuesToUpdate(values: VideoSettingsFormValues) {
  return {
    enableMuxStreaming: values.enableMuxStreaming,
    videoSignedPlayback: values.videoSignedPlayback,
    defaultVideoQuality: values.defaultVideoQuality,
  };
}

export function mapPlatformSettingsToNotificationsFormValues(
  settings: PlatformSettings,
): NotificationsSettingsFormValues {
  return {
    notifyAdminOnPurchase: settings.notifyAdminOnPurchase,
    notifyAdminOnRefund: settings.notifyAdminOnRefund,
    notifyStudentOnEnrollment: settings.notifyStudentOnEnrollment,
    notifyStudentOnCertificate: settings.notifyStudentOnCertificate,
    enableInAppNotifications: settings.enableInAppNotifications,
    rateLimitMaxRequests: settings.rateLimitMaxRequests,
    rateLimitWindowMs: settings.rateLimitWindowMs,
    logLevel: settings.logLevel as NotificationsSettingsFormValues["logLevel"],
    analyticsRetentionDays: settings.analyticsRetentionDays,
  };
}

export function mapNotificationsFormValuesToUpdate(
  values: NotificationsSettingsFormValues,
) {
  return {
    notifyAdminOnPurchase: values.notifyAdminOnPurchase,
    notifyAdminOnRefund: values.notifyAdminOnRefund,
    notifyStudentOnEnrollment: values.notifyStudentOnEnrollment,
    notifyStudentOnCertificate: values.notifyStudentOnCertificate,
    enableInAppNotifications: values.enableInAppNotifications,
    rateLimitMaxRequests: values.rateLimitMaxRequests,
    rateLimitWindowMs: values.rateLimitWindowMs,
    logLevel: values.logLevel,
    analyticsRetentionDays: values.analyticsRetentionDays,
  };
}

/** @deprecated Use mapPlatformSettingsToGeneralFormValues */
export const mapPlatformSettingsToFormValues =
  mapPlatformSettingsToGeneralFormValues;

/** @deprecated Use mapGeneralFormValuesToUpdate */
export const mapFormValuesToPlatformSettingsUpdate =
  mapGeneralFormValuesToUpdate;
