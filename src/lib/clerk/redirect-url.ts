const DEFAULT_AFTER_SIGN_OUT_URL = "/";

export function resolveSafeAppRedirectPath(
  candidate: string | undefined | null,
  fallback = DEFAULT_AFTER_SIGN_OUT_URL,
): string {
  if (!candidate) return fallback;

  const trimmed = candidate.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  return trimmed;
}

export function getAfterSignOutUrl(): string {
  return resolveSafeAppRedirectPath(
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL,
    DEFAULT_AFTER_SIGN_OUT_URL,
  );
}
