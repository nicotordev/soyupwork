import "server-only";

import { DEFAULT_AUTHENTICATED_REDIRECT } from "@/lib/auth/guest-auth-routes";
import { resolveSafeAppRedirectPath } from "@/lib/auth/redirect-url";
import { getAuthSession } from "@/lib/auth/session";
import { isStaffSignInBypass } from "@/lib/platform/public-waitlist-mode";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import { redirect } from "next/navigation";

type SearchParamsReader = {
  get(name: string): string | null;
};

export async function getAuthenticatedAuthRedirectPath(): Promise<string> {
  const settings = await getPlatformSettings();
  const path = settings.afterSignInUrl?.trim();
  return path && path.startsWith("/") && !path.startsWith("//")
    ? path
    : DEFAULT_AUTHENTICATED_REDIRECT;
}

export function resolveAuthenticatedGuestAuthRedirect(
  searchParams: SearchParamsReader | undefined,
  fallback: string,
): string {
  if (searchParams && isStaffSignInBypass(searchParams)) {
    return resolveSafeAppRedirectPath(
      searchParams.get("redirect_url"),
      fallback,
    );
  }

  return fallback;
}

/** Redirect signed-in users away from sign-in, sign-up, and waitlist. */
export async function redirectIfAuthenticatedFromGuestAuthPage(
  searchParams?: SearchParamsReader,
): Promise<void> {
  const { isSignedIn } = await getAuthSession();
  if (!isSignedIn) return;

  const fallback = await getAuthenticatedAuthRedirectPath();
  redirect(resolveAuthenticatedGuestAuthRedirect(searchParams, fallback));
}
