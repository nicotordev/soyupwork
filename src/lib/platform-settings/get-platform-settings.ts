import { cache } from "react";
import type { PlatformSettings } from "@/generated/prisma/client";
import { DEFAULT_PLATFORM_SETTINGS } from "@/lib/platform-settings/defaults";
import { PLATFORM_SETTINGS_ID } from "@/lib/platform-settings/constants";
import prisma from "@/lib/prisma";

export const getPlatformSettings = cache(
  async (): Promise<PlatformSettings> => {
    return prisma.platformSettings.upsert({
      where: { id: PLATFORM_SETTINGS_ID },
      create: DEFAULT_PLATFORM_SETTINGS,
      update: {},
    });
  },
);
