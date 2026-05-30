import {
  type WaitlistInviteSessionPayload,
  isWaitlistInviteSessionPayload,
} from "@/lib/waitlist/invite-session-payload";
import { WAITLIST_INVITE } from "@/lib/waitlist/invite.constants";
import { jwtVerify } from "jose";

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

export async function verifyWaitlistInviteSessionToken(
  token: string,
): Promise<WaitlistInviteSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getInviteJwtSecret(), {
      algorithms: ["HS256"],
    });
    if (!isWaitlistInviteSessionPayload(payload)) return null;
    return {
      inviteId: payload.inviteId,
      email: payload.email.trim().toLowerCase(),
    };
  } catch {
    return null;
  }
}

export function getWaitlistInviteCookieName(): string {
  return WAITLIST_INVITE.sessionCookieName;
}
