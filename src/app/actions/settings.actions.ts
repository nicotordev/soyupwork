"use server";

import { AdminAuthError, requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/db/prisma";
import { getServerLogger } from "@/lib/logger/server";
import {
  mapAuthFormValuesToUpdate,
  mapEmailFormValuesToUpdate,
  mapGeneralFormValuesToUpdate,
  mapNotificationsFormValuesToUpdate,
  mapPaymentsFormValuesToUpdate,
  mapPlatformSettingsToAuthFormValues,
  mapPlatformSettingsToEmailFormValues,
  mapPlatformSettingsToGeneralFormValues,
  mapPlatformSettingsToNotificationsFormValues,
  mapPlatformSettingsToPaymentsFormValues,
  mapPlatformSettingsToStorageFormValues,
  mapPlatformSettingsToVideoFormValues,
  mapStorageFormValuesToUpdate,
  mapVideoFormValuesToUpdate,
} from "@/lib/platform/settings/map";
import {
  authSettingsSchema,
  emailSettingsSchema,
  generalSettingsSchema,
  notificationsSettingsSchema,
  paymentsSettingsSchema,
  storageSettingsSchema,
  videoSettingsSchema,
} from "@/lib/platform/settings/schemas";
import {
  PLATFORM_SETTINGS_ID,
  getPlatformSettings,
} from "@/lib/platform/settings/store";
import type {
  AuthSettingsFormValues,
  ConfirmWaitlistVerificationResult,
  EmailSettingsFormValues,
  GeneralSettingsFormValues,
  JoinWaitlistResult,
  NotificationsSettingsFormValues,
  PaymentsSettingsFormValues,
  RequestWaitlistVerificationResult,
  StorageSettingsFormValues,
  UpdateSettingsResult,
  VideoSettingsFormValues,
} from "@/types/platform-settings.types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { syncEmailToClerkWaitlist } from "@/lib/clerk/waitlist";
import { sendWaitlistVerificationEmail } from "@/lib/email/send-waitlist-verification";
import { validateOptionalE164Phone } from "@/lib/phone/validate";
import { addEmailToResendWaitlistAudience } from "@/lib/resend/waitlist-audience";
import {
  generateWaitlistVerificationCode,
  getWaitlistVerificationExpiry,
  hasExceededWaitlistVerificationAttempts,
  hashWaitlistVerificationCode,
  isWaitlistVerificationExpired,
  verifyWaitlistCode,
} from "@/lib/waitlist/verification";
import { WAITLIST_VERIFICATION } from "@/lib/waitlist/verification.constants";
import { verifyTurnstileToken } from "@/lib/turnstile/verify";
import { z } from "zod";

const log = getServerLogger("settings.actions");

const SETTINGS_REVALIDATE_PATHS = [
  "/admin/settings",
  "/admin/settings/general",
  "/admin/settings/auth",
  "/admin/settings/payments",
  "/admin/settings/email",
  "/admin/settings/storage",
  "/admin/settings/video",
  "/admin/settings/notifications",
  "/,layout",
] as const;

const joinWaitlistSchema = z.object({
  email: z.email("Correo inválido."),
  name: z.string().trim().max(80).optional(),
  phone: z.string().trim().optional(),
});

async function updatePlatformSettingsSection<T>(
  values: T,
  schema: z.ZodType<T>,
  toUpdate: (parsed: T) => Record<string, unknown>,
  revalidatePaths: readonly string[],
  logContext: Record<string, unknown>,
): Promise<UpdateSettingsResult> {
  try {
    await requireAdmin();

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return {
        ok: false,
        error: firstIssue?.message ?? "Datos inválidos.",
      };
    }

    await prisma.platformSettings.update({
      where: { id: PLATFORM_SETTINGS_ID },
      data: toUpdate(parsed.data),
    });

    for (const path of revalidatePaths) {
      if (path.endsWith(",layout")) {
        revalidatePath(path.replace(",layout", ""), "layout");
      } else {
        revalidatePath(path);
      }
    }

    log.info(logContext, "Platform settings section updated");

    return { ok: true };
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return { ok: false, error: error.message };
    }

    log.error(
      { error, ...logContext },
      "Failed to update platform settings section",
    );
    return { ok: false, error: "No se pudo guardar la configuración." };
  }
}

async function requireAdminSettings<T>(
  loader: (settings: Awaited<ReturnType<typeof getPlatformSettings>>) => T,
): Promise<T> {
  try {
    await requireAdmin();
  } catch {
    redirect("/sign-in");
  }

  const settings = await getPlatformSettings();
  return loader(settings);
}

export async function getGeneralSettingsFormValues(): Promise<GeneralSettingsFormValues> {
  return requireAdminSettings(mapPlatformSettingsToGeneralFormValues);
}

export async function getAuthSettingsFormValues(): Promise<AuthSettingsFormValues> {
  return requireAdminSettings(mapPlatformSettingsToAuthFormValues);
}

export async function getPaymentsSettingsFormValues(): Promise<PaymentsSettingsFormValues> {
  return requireAdminSettings(mapPlatformSettingsToPaymentsFormValues);
}

export async function getEmailSettingsFormValues(): Promise<EmailSettingsFormValues> {
  return requireAdminSettings(mapPlatformSettingsToEmailFormValues);
}

export async function getStorageSettingsFormValues(): Promise<StorageSettingsFormValues> {
  return requireAdminSettings(mapPlatformSettingsToStorageFormValues);
}

export async function getVideoSettingsFormValues(): Promise<VideoSettingsFormValues> {
  return requireAdminSettings(mapPlatformSettingsToVideoFormValues);
}

export async function getNotificationsSettingsFormValues(): Promise<NotificationsSettingsFormValues> {
  return requireAdminSettings(mapPlatformSettingsToNotificationsFormValues);
}

export async function updateGeneralSettings(
  values: GeneralSettingsFormValues,
): Promise<UpdateSettingsResult> {
  return updatePlatformSettingsSection(
    values,
    generalSettingsSchema,
    mapGeneralFormValuesToUpdate,
    SETTINGS_REVALIDATE_PATHS,
    { section: "general" },
  );
}

export async function updateAuthSettings(
  values: AuthSettingsFormValues,
): Promise<UpdateSettingsResult> {
  return updatePlatformSettingsSection(
    values,
    authSettingsSchema,
    mapAuthFormValuesToUpdate,
    SETTINGS_REVALIDATE_PATHS,
    { section: "auth" },
  );
}

export async function updatePaymentsSettings(
  values: PaymentsSettingsFormValues,
): Promise<UpdateSettingsResult> {
  return updatePlatformSettingsSection(
    values,
    paymentsSettingsSchema,
    mapPaymentsFormValuesToUpdate,
    SETTINGS_REVALIDATE_PATHS,
    { section: "payments" },
  );
}

export async function updateEmailSettings(
  values: EmailSettingsFormValues,
): Promise<UpdateSettingsResult> {
  return updatePlatformSettingsSection(
    values,
    emailSettingsSchema,
    mapEmailFormValuesToUpdate,
    SETTINGS_REVALIDATE_PATHS,
    { section: "email" },
  );
}

export async function updateStorageSettings(
  values: StorageSettingsFormValues,
): Promise<UpdateSettingsResult> {
  return updatePlatformSettingsSection(
    values,
    storageSettingsSchema,
    mapStorageFormValuesToUpdate,
    SETTINGS_REVALIDATE_PATHS,
    { section: "storage" },
  );
}

export async function updateVideoSettings(
  values: VideoSettingsFormValues,
): Promise<UpdateSettingsResult> {
  return updatePlatformSettingsSection(
    values,
    videoSettingsSchema,
    mapVideoFormValuesToUpdate,
    SETTINGS_REVALIDATE_PATHS,
    { section: "video" },
  );
}

export async function updateNotificationsSettings(
  values: NotificationsSettingsFormValues,
): Promise<UpdateSettingsResult> {
  return updatePlatformSettingsSection(
    values,
    notificationsSettingsSchema,
    mapNotificationsFormValuesToUpdate,
    SETTINGS_REVALIDATE_PATHS,
    { section: "notifications" },
  );
}

async function assertWaitlistOpen(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const settings = await getPlatformSettings();
  if (!settings.waitlistMode) {
    return { ok: false, error: "La lista de espera no está activa." };
  }
  return { ok: true };
}

async function completeVerifiedWaitlistJoin(input: {
  email: string;
  name?: string;
  phone?: string | null;
}): Promise<JoinWaitlistResult> {
  const email = input.email.toLowerCase();

  try {
    await prisma.waitlistEntry.upsert({
      where: { email },
      create: {
        email,
        name: input.name?.trim() || null,
        phone: input.phone ?? null,
        source: "waitlist-page",
      },
      update: {
        name: input.name?.trim() || null,
        phone: input.phone ?? null,
      },
    });
  } catch (error) {
    log.error({ error, email }, "Failed to join waitlist in database");
    return { ok: false, error: "No se pudo registrar tu correo." };
  }

  const clerkSync = await syncEmailToClerkWaitlist(email);
  if (!clerkSync.ok) {
    log.warn(
      { email, error: clerkSync.error },
      "Waitlist saved in database; Clerk waitlist sync failed",
    );
  }

  const resendSync = await addEmailToResendWaitlistAudience({
    email,
    name: input.name,
  });
  if (!resendSync.ok) {
    log.warn(
      { email, error: resendSync.error },
      "Waitlist saved; Resend audience sync failed",
    );
  }

  return { ok: true };
}

/** Step 1: validate signup data and email a verification code (Resend). */
export async function requestWaitlistVerification(input: {
  email: string;
  name?: string;
  phone?: string;
  turnstileToken?: string;
}): Promise<RequestWaitlistVerificationResult> {
  const gate = await assertWaitlistOpen();
  if (!gate.ok) return gate;

  const turnstile = await verifyTurnstileToken(input.turnstileToken);
  if (!turnstile.ok) {
    return { ok: false, error: turnstile.error };
  }

  const parsed = joinWaitlistSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const phoneResult = validateOptionalE164Phone(parsed.data.phone);
  if (!phoneResult.ok) {
    return { ok: false, error: phoneResult.error };
  }

  const email = parsed.data.email.toLowerCase();
  const name = parsed.data.name?.trim() || null;
  const phone = phoneResult.e164 ?? null;

  const existingMember = await prisma.waitlistEntry.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingMember) {
    return {
      ok: false,
      error: "Este correo ya está en la lista de espera.",
    };
  }

  const code = generateWaitlistVerificationCode();
  const codeHash = hashWaitlistVerificationCode(email, code);
  const expiresAt = getWaitlistVerificationExpiry();

  try {
    await prisma.waitlistVerification.upsert({
      where: { email },
      create: {
        email,
        codeHash,
        name,
        phone,
        expiresAt,
        attempts: 0,
      },
      update: {
        codeHash,
        name,
        phone,
        expiresAt,
        attempts: 0,
      },
    });
  } catch (error) {
    log.error({ error, email }, "Failed to store waitlist verification");
    return { ok: false, error: "No se pudo iniciar la verificación." };
  }

  try {
    await sendWaitlistVerificationEmail({ to: email, code });
  } catch (error) {
    log.error({ error, email }, "Failed to send waitlist verification email");
    await prisma.waitlistVerification.deleteMany({ where: { email } });
    return {
      ok: false,
      error:
        "No pudimos enviar el correo de verificación. Revisa que Resend esté configurado.",
    };
  }

  return { ok: true };
}

/** Step 2: confirm OTP, then register in DB, Clerk and Resend audience. */
export async function confirmWaitlistVerification(input: {
  email: string;
  code: string;
}): Promise<ConfirmWaitlistVerificationResult> {
  const gate = await assertWaitlistOpen();
  if (!gate.ok) return gate;

  const email = input.email.trim().toLowerCase();
  const code = input.code.replace(/\D/g, "");

  if (code.length !== WAITLIST_VERIFICATION.codeLength) {
    return { ok: false, error: "El código debe tener 6 dígitos." };
  }

  const pending = await prisma.waitlistVerification.findUnique({
    where: { email },
  });

  if (!pending) {
    return {
      ok: false,
      error: "No hay una verificación pendiente. Solicita un código nuevo.",
    };
  }

  if (isWaitlistVerificationExpired(pending.expiresAt)) {
    await prisma.waitlistVerification.delete({ where: { email } });
    return {
      ok: false,
      error: "El código expiró. Solicita uno nuevo.",
    };
  }

  if (hasExceededWaitlistVerificationAttempts(pending.attempts)) {
    await prisma.waitlistVerification.delete({ where: { email } });
    return {
      ok: false,
      error: "Demasiados intentos. Solicita un código nuevo.",
    };
  }

  const valid = verifyWaitlistCode(email, code, pending.codeHash);

  if (!valid) {
    const attempts = pending.attempts + 1;
    if (attempts >= WAITLIST_VERIFICATION.maxAttempts) {
      await prisma.waitlistVerification.delete({ where: { email } });
      return {
        ok: false,
        error: "Demasiados intentos. Solicita un código nuevo.",
      };
    }

    await prisma.waitlistVerification.update({
      where: { email },
      data: { attempts },
    });

    return { ok: false, error: "Código incorrecto." };
  }

  const joinResult = await completeVerifiedWaitlistJoin({
    email,
    name: pending.name ?? undefined,
    phone: pending.phone,
  });

  if (!joinResult.ok) {
    return joinResult;
  }

  await prisma.waitlistVerification
    .delete({ where: { email } })
    .catch((error: unknown) => {
      log.warn(
        { error, email },
        "Waitlist joined but pending verification cleanup failed",
      );
    });

  return { ok: true };
}

/** @deprecated Use requestWaitlistVerification + confirmWaitlistVerification */
export async function joinWaitlist(input: {
  email: string;
  name?: string;
  phone?: string;
}): Promise<JoinWaitlistResult> {
  const request = await requestWaitlistVerification(input);
  if (!request.ok) return request;

  return {
    ok: false,
    error:
      "Debes verificar tu correo con el código enviado antes de unirte a la lista.",
  };
}
