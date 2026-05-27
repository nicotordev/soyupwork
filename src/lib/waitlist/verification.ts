import "server-only";

import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { WAITLIST_VERIFICATION } from "@/lib/waitlist/verification.constants";

const CODE_LENGTH = WAITLIST_VERIFICATION.codeLength;
const CODE_TTL_MS = WAITLIST_VERIFICATION.ttlMinutes * 60 * 1000;
const MAX_ATTEMPTS = WAITLIST_VERIFICATION.maxAttempts;

function getVerificationSecret(): string {
  const secret =
    process.env.WAITLIST_VERIFICATION_SECRET?.trim() ??
    process.env.CLERK_SECRET_KEY?.trim();
  if (!secret) {
    throw new Error(
      "WAITLIST_VERIFICATION_SECRET or CLERK_SECRET_KEY must be set",
    );
  }
  return secret;
}

export function generateWaitlistVerificationCode(): string {
  return String(randomInt(0, 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, "0");
}

export function getWaitlistVerificationExpiry(): Date {
  return new Date(Date.now() + CODE_TTL_MS);
}

export function hashWaitlistVerificationCode(
  email: string,
  code: string,
): string {
  return createHmac("sha256", getVerificationSecret())
    .update(`${email.toLowerCase()}:${code}`)
    .digest("hex");
}

export function verifyWaitlistCode(
  email: string,
  code: string,
  codeHash: string,
): boolean {
  const normalizedCode = code.replace(/\D/g, "");
  if (normalizedCode.length !== CODE_LENGTH) return false;

  const expected = hashWaitlistVerificationCode(email, normalizedCode);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(codeHash, "hex");
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

export function isWaitlistVerificationExpired(expiresAt: Date): boolean {
  return expiresAt.getTime() <= Date.now();
}

export function hasExceededWaitlistVerificationAttempts(
  attempts: number,
): boolean {
  return attempts >= MAX_ATTEMPTS;
}
