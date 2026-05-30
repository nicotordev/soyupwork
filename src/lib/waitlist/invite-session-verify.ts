import {
  type WaitlistInviteSessionPayload,
  isWaitlistInviteSessionPayload,
} from "@/lib/waitlist/invite-session-payload";
import { WAITLIST_INVITE } from "@/lib/waitlist/invite.constants";
import { getWaitlistInviteSecretKey } from "@/lib/waitlist/invite-secret";
import { jwtVerify } from "jose";

export async function verifyWaitlistInviteSessionToken(
  token: string,
): Promise<WaitlistInviteSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getWaitlistInviteSecretKey(), {
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
