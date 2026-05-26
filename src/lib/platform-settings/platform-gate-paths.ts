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
