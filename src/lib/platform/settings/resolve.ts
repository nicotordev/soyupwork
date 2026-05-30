import type { PlatformSettings } from "@/generated/prisma/client";
import { getPlatformSettings } from "@/lib/platform/settings/store";

export async function getResolvedEmailFrom(): Promise<string | undefined> {
  const settings = await getPlatformSettings();
  return settings.emailFrom ?? process.env.EMAIL_FROM ?? undefined;
}

export async function getResolvedEmailSupport(): Promise<string | undefined> {
  const settings = await getPlatformSettings();
  return settings.emailSupport ?? process.env.EMAIL_SUPPORT ?? undefined;
}

export async function getResolvedStripeCurrency(): Promise<string> {
  const settings = await getPlatformSettings();
  return settings.stripeCurrency || process.env.STRIPE_CURRENCY || "usd";
}

export async function getResolvedStoragePublicUrl(): Promise<
  string | undefined
> {
  const settings = await getPlatformSettings();
  return settings.storagePublicUrl ?? process.env.R2_PUBLIC_URL ?? undefined;
}

export async function getResolvedUploadLimits(): Promise<{
  maxFileSizeMb: number;
  maxVideoSizeMb: number;
}> {
  const settings = await getPlatformSettings();
  return {
    maxFileSizeMb:
      settings.maxFileSizeMb || Number(process.env.MAX_FILE_SIZE_MB ?? 100),
    maxVideoSizeMb:
      settings.maxVideoSizeMb || Number(process.env.MAX_VIDEO_SIZE_MB ?? 5000),
  };
}

export async function getResolvedRateLimit(): Promise<{
  maxRequests: number;
  windowMs: number;
}> {
  const settings = await getPlatformSettings();
  return {
    maxRequests:
      settings.rateLimitMaxRequests ||
      Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 100),
    windowMs:
      settings.rateLimitWindowMs ||
      Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
  };
}

export function shouldSendPurchaseConfirmation(
  settings: PlatformSettings,
): boolean {
  return settings.sendPurchaseConfirmation;
}

export function shouldSendEnrollmentEmail(settings: PlatformSettings): boolean {
  return settings.sendEnrollmentEmail;
}

export function shouldNotifyStudentOnCertificate(
  settings: PlatformSettings,
): boolean {
  return settings.notifyStudentOnCertificate;
}
