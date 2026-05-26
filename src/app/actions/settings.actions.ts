"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AdminAuthError, requireAdmin } from "@/lib/admin/require-admin";
import { getPlatformSettings } from "@/lib/platform-settings/get-platform-settings";
import { generalSettingsSchema } from "@/lib/platform-settings/general-settings-schema";
import {
  mapFormValuesToPlatformSettingsUpdate,
  mapPlatformSettingsToFormValues,
} from "@/lib/platform-settings/map-settings";
import { PLATFORM_SETTINGS_ID } from "@/lib/platform-settings/constants";
import { getServerLogger } from "@/lib/logger/server";
import prisma from "@/lib/prisma";
import type {
  GeneralSettingsFormValues,
  JoinWaitlistResult,
  UpdateGeneralSettingsResult,
} from "@/types/platform-settings.types";

const log = getServerLogger("settings.actions");

const joinWaitlistSchema = z.object({
  email: z.email("Correo inválido."),
  name: z.string().trim().max(80).optional(),
});

export async function getGeneralSettingsFormValues(): Promise<GeneralSettingsFormValues> {
  try {
    await requireAdmin();
  } catch {
    redirect("/sign-in");
  }

  const settings = await getPlatformSettings();
  return mapPlatformSettingsToFormValues(settings);
}

export async function updateGeneralSettings(
  values: GeneralSettingsFormValues,
): Promise<UpdateGeneralSettingsResult> {
  try {
    await requireAdmin();

    const parsed = generalSettingsSchema.safeParse(values);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return {
        ok: false,
        error: firstIssue?.message ?? "Datos inválidos.",
      };
    }

    const data = mapFormValuesToPlatformSettingsUpdate(parsed.data);

    await prisma.platformSettings.update({
      where: { id: PLATFORM_SETTINGS_ID },
      data,
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/settings/general");
    revalidatePath("/", "layout");

    log.info({ maintenanceMode: data.maintenanceMode, waitlistMode: data.waitlistMode }, "Platform settings updated");

    return { ok: true };
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return { ok: false, error: error.message };
    }

    log.error({ error }, "Failed to update platform settings");
    return { ok: false, error: "No se pudo guardar la configuración." };
  }
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
