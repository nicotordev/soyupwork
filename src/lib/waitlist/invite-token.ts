import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { WAITLIST_INVITE } from "@/lib/waitlist/invite.constants";
import { getWaitlistInviteSecret } from "@/lib/waitlist/invite-secret";

export function generateInviteToken(): string {
  return randomBytes(WAITLIST_INVITE.tokenBytes).toString("base64url");
}

export function hashInviteToken(token: string): string {
  return createHmac("sha256", getWaitlistInviteSecret())
    .update(token)
    .digest("hex");
}

export function verifyInviteTokenHash(
  token: string,
  tokenHash: string,
): boolean {
  const expected = hashInviteToken(token);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(tokenHash, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function getWaitlistInviteExpiry(): Date {
  return new Date(Date.now() + WAITLIST_INVITE.ttlDays * 24 * 60 * 60 * 1000);
}
