import "server-only";

import type { WaitlistInviteSessionPayload } from "@/lib/waitlist/invite-session-payload";
import { WAITLIST_INVITE } from "@/lib/waitlist/invite.constants";
import { verifyWaitlistInviteSessionToken } from "@/lib/waitlist/invite-session-verify";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

function getInviteJwtSecret(): Uint8Array {
  const secret =
    process.env.WAITLIST_INVITE_SECRET?.trim() ??
    process.env.WAITLIST_VERIFICATION_SECRET?.trim() ??
    process.env.AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error("Missing secret for waitlist invite session JWT");
  }
  return new TextEncoder().encode(secret);
}

export async function createWaitlistInviteSessionToken(
  payload: WaitlistInviteSessionPayload,
): Promise<string> {
  const email = payload.email.trim().toLowerCase();
  return new SignJWT({ inviteId: payload.inviteId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${WAITLIST_INVITE.sessionMaxAgeSeconds}s`)
    .sign(getInviteJwtSecret());
}

export async function setWaitlistInviteSession(
  payload: WaitlistInviteSessionPayload,
): Promise<void> {
  const token = await createWaitlistInviteSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(WAITLIST_INVITE.sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: WAITLIST_INVITE.sessionMaxAgeSeconds,
  });
}

export async function readWaitlistInviteSession(): Promise<WaitlistInviteSessionPayload | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(WAITLIST_INVITE.sessionCookieName)?.value;
  if (!raw) return null;
  return verifyWaitlistInviteSessionToken(raw);
}

export async function clearWaitlistInviteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(WAITLIST_INVITE.sessionCookieName);
}
