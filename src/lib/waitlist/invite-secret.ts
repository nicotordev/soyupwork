/** Shared secret resolution for waitlist invite tokens and session JWTs. */
export function getWaitlistInviteSecret(): string {
  const secret =
    process.env.WAITLIST_INVITE_SECRET?.trim() ??
    process.env.WAITLIST_VERIFICATION_SECRET?.trim();
  if (!secret) {
    throw new Error(
      "WAITLIST_VERIFICATION_SECRET or WAITLIST_INVITE_SECRET must be set",
    );
  }
  return secret;
}

export function getWaitlistInviteSecretKey(): Uint8Array {
  return new TextEncoder().encode(getWaitlistInviteSecret());
}
