"use server";

import { requireAdmin } from "@/lib/admin/require-admin";
import { getServerLogger } from "@/lib/logger/server";
import { getPlatformSettings } from "@/lib/platform-settings/get-platform-settings";
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
} from "@/lib/platform-settings/map-settings";
import {
  authSettingsSchema,
  emailSettingsSchema,
  generalSettingsSchema,
  notificationsSettingsSchema,
  paymentsSettingsSchema,
  storageSettingsSchema,
  videoSettingsSchema,
} from "@/lib/platform-settings/settings-schemas";
import {
  SETTINGS_REVALIDATE_PATHS,
  updatePlatformSettingsSection,
} from "@/lib/platform-settings/update-settings-section";
import prisma from "@/lib/prisma";
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
import { redirect } from "next/navigation";
import { z } from "zod";

const log = getServerLogger("settings.actions");

const joinWaitlistSchema = z.object({
  email: z.email("Correo inválido."),
  name: z.string().trim().max(80).optional(),
});

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
    [...SETTINGS_REVALIDATE_PATHS],
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
    [...SETTINGS_REVALIDATE_PATHS],
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
    [...SETTINGS_REVALIDATE_PATHS],
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
    [...SETTINGS_REVALIDATE_PATHS],
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
    [...SETTINGS_REVALIDATE_PATHS],
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
    [...SETTINGS_REVALIDATE_PATHS],
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
    [...SETTINGS_REVALIDATE_PATHS],
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
