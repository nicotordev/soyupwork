import "server-only";

import type { WaitlistInviteSessionPayload } from "@/lib/waitlist/invite-session-payload";
import { WAITLIST_INVITE } from "@/lib/waitlist/invite.constants";
import { getWaitlistInviteSecretKey } from "@/lib/waitlist/invite-secret";
import { verifyWaitlistInviteSessionToken } from "@/lib/waitlist/invite-session-verify";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function createWaitlistInviteSessionToken(
  payload: WaitlistInviteSessionPayload,
): Promise<string> {
  const email = payload.email.trim().toLowerCase();
  return new SignJWT({ inviteId: payload.inviteId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${WAITLIST_INVITE.sessionMaxAgeSeconds}s`)
    .sign(getWaitlistInviteSecretKey());
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
