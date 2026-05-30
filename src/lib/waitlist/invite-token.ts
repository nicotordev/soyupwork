import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { WAITLIST_INVITE } from "@/lib/waitlist/invite.constants";

function getInviteSecret(): string {
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

export function generateInviteToken(): string {
  return randomBytes(WAITLIST_INVITE.tokenBytes).toString("base64url");
}

export function hashInviteToken(token: string): string {
  return createHmac("sha256", getInviteSecret())
    .update(token)
    .digest("hex");
}

export function verifyInviteTokenHash(token: string, tokenHash: string): boolean {
  const expected = hashInviteToken(token);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(tokenHash, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function getWaitlistInviteExpiry(): Date {
  return new Date(
    Date.now() + WAITLIST_INVITE.ttlDays * 24 * 60 * 60 * 1000,
  );
}
