import { AdminAuthError, requireAdmin } from "@/lib/admin/require-admin";
import { getServerLogger } from "@/lib/logger/server";
import { PLATFORM_SETTINGS_ID } from "@/lib/platform-settings/constants";
import prisma from "@/lib/prisma";
import type { UpdateSettingsResult } from "@/types/platform-settings.types";
import { revalidatePath } from "next/cache";
import type { z } from "zod";

const log = getServerLogger("settings.actions");

export async function updatePlatformSettingsSection<T>(
  values: T,
  schema: z.ZodType<T>,
  toUpdate: (parsed: T) => Record<string, unknown>,
  revalidatePaths: string[],
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

    const data = toUpdate(parsed.data);

    await prisma.platformSettings.update({
      where: { id: PLATFORM_SETTINGS_ID },
      data,
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

export const SETTINGS_REVALIDATE_PATHS = [
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
