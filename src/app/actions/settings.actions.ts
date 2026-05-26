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
  EmailSettingsFormValues,
  GeneralSettingsFormValues,
  JoinWaitlistResult,
  NotificationsSettingsFormValues,
  PaymentsSettingsFormValues,
  StorageSettingsFormValues,
  UpdateSettingsResult,
  VideoSettingsFormValues,
} from "@/types/platform-settings.types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function joinWaitlist(input: {
  email: string;
  name?: string;
}): Promise<JoinWaitlistResult> {
  const parsed = joinWaitlistSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const settings = await getPlatformSettings();
  if (!settings.waitlistMode) {
    return { ok: false, error: "La lista de espera no está activa." };
  }

  try {
    await prisma.waitlistEntry.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      create: {
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name?.trim() || null,
        source: "waitlist-page",
      },
      update: {
        name: parsed.data.name?.trim() || null,
      },
    });

    return { ok: true };
  } catch (error) {
    log.error({ error }, "Failed to join waitlist");
    return { ok: false, error: "No se pudo registrar tu correo." };
  }
}
