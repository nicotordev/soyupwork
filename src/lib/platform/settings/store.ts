import type { PlatformSettings } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { cache } from "react";

export const PLATFORM_SETTINGS_ID = "default" as const;

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
  afterSignInUrl: "/dashboard",
  afterSignUpUrl: "/onboarding",
  requireVerifiedEmail: false,
  allowOAuthSignIn: true,
  stripeCurrency: "usd",
  enableStripeCheckout: true,
  showTaxBreakdown: false,
  refundPolicyDays: 7,
  emailFrom: null,
  emailSupport: null,
  sendPurchaseConfirmation: true,
  sendEnrollmentEmail: true,
  maxFileSizeMb: 100,
  maxVideoSizeMb: 5000,
  storagePublicUrl: null,
  enableMuxStreaming: true,
  videoSignedPlayback: true,
  defaultVideoQuality: "auto",
  notifyAdminOnPurchase: true,
  notifyAdminOnRefund: true,
  notifyStudentOnEnrollment: true,
  notifyStudentOnCertificate: true,
  enableInAppNotifications: true,
  rateLimitMaxRequests: 100,
  rateLimitWindowMs: 60_000,
  logLevel: "info",
  analyticsRetentionDays: 365,
} satisfies Omit<PlatformSettings, "createdAt" | "updatedAt">;

function buildTimePlatformSettings(): PlatformSettings {
  const now = new Date();
  return {
    ...DEFAULT_PLATFORM_SETTINGS,
    createdAt: now,
    updatedAt: now,
  };
}

export const getPlatformSettings = cache(
  async (): Promise<PlatformSettings> => {
    // Docker/CI builds have no database during `next build` static generation.
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return buildTimePlatformSettings();
    }

    return prisma.platformSettings.upsert({
      where: { id: PLATFORM_SETTINGS_ID },
      create: DEFAULT_PLATFORM_SETTINGS,
      update: {},
    });
  },
);
