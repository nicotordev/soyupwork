export const GUEST_ONLY_AUTH_ROUTE_PREFIXES = [
  "/sign-in",
  "/sign-up",
  "/waitlist",
] as const;

/** Default when platform settings are unavailable (e.g. proxy edge). */
export const DEFAULT_AUTHENTICATED_REDIRECT = "/dashboard";

export function isGuestOnlyAuthPath(pathname: string): boolean {
  return GUEST_ONLY_AUTH_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isLinkAccountPath(pathname: string): boolean {
  return pathname === "/sign-in/link-account";
}
