/** Pre-launch waitlist UI controlled by `NEXT_PUBLIC_WAITLIST_MODE=true`. */
export function isPublicWaitlistMode(): boolean {
  return process.env.NEXT_PUBLIC_WAITLIST_MODE === "true";
}

export function isStaffSignInBypass(searchParams: {
  get(name: string): string | null;
}): boolean {
  const redirectUrl = searchParams.get("redirect_url") ?? "";
  return (
    redirectUrl.includes("/admin") || searchParams.get("access") === "staff"
  );
}
