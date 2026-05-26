import "server-only";

import type { PlatformGateAction } from "@/types/platform-settings.types";
import { isAdminByClerkId } from "@/lib/admin/require-admin";
import { getPlatformSettings } from "@/lib/platform-settings/get-platform-settings";
import { shouldCheckPlatformGate } from "@/lib/platform-settings/platform-gate-paths";

export { isPlatformGateExemptPath, shouldCheckPlatformGate } from "@/lib/platform-settings/platform-gate-paths";

export async function resolvePlatformGateAction(
  pathname: string,
  clerkUserId?: string | null,
): Promise<PlatformGateAction> {
  if (!shouldCheckPlatformGate(pathname)) {
    return "none";
  }

  const settings = await getPlatformSettings();
  const isAdmin = clerkUserId ? await isAdminByClerkId(clerkUserId) : false;

  if (isAdmin && settings.maintenanceAllowAdmins) {
    return "none";
  }

  if (settings.maintenanceMode) {
    return "maintenance";
  }

  if (settings.waitlistMode) {
    if (settings.waitlistAllowCatalog && pathname.startsWith("/catalog")) {
      return "none";
    }
    return "waitlist";
  }

  return "none";
}
