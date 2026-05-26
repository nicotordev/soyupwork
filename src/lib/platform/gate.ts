import "server-only";

import { isAdminByClerkId } from "@/lib/auth/admin";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import type { PlatformGateAction } from "@/types/platform-settings.types";

const GATE_EXEMPT_PREFIXES = [
  "/maintenance",
  "/waitlist",
  "/sign-in",
  "/sign-up",
  "/admin",
  "/api",
  "/__clerk",
] as const;

export function isPlatformGateExemptPath(pathname: string): boolean {
  return GATE_EXEMPT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function shouldCheckPlatformGate(pathname: string): boolean {
  if (isPlatformGateExemptPath(pathname)) return false;
  if (pathname.startsWith("/_next")) return false;
  if (pathname.includes(".")) return false;
  return true;
}

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
    if (
      settings.waitlistAllowCatalog &&
      (pathname.startsWith("/catalog") || pathname.startsWith("/category"))
    ) {
      return "none";
    }
    return "waitlist";
  }

  return "none";
}
