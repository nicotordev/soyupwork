export function resolvePricingCtaHref(
  href: string,
  waitlistMode: boolean,
): string {
  if (waitlistMode) {
    return "/waitlist";
  }
  return href;
}
