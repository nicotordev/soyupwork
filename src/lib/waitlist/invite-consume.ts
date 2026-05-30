import "server-only";

import { WaitlistInviteStatus } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import {
  clearWaitlistInviteSession,
  readWaitlistInviteSession,
  setWaitlistInviteSession,
} from "@/lib/waitlist/invite-session";

type InviteRecord = {
  status: WaitlistInviteStatus;
  expiresAt: Date;
  email: string;
  acceptedUserId: string | null;
};

function isInviteExpired(invite: InviteRecord): boolean {
  return (
    invite.status === WaitlistInviteStatus.EXPIRED ||
    (invite.status === WaitlistInviteStatus.PENDING &&
      invite.expiresAt.getTime() <= Date.now())
  );
}

function shouldClearInviteSessionAfterFailedConsume(
  invite: InviteRecord | null,
  normalizedEmail: string,
  userId: string,
): boolean {
  if (!invite) return true;

  if (invite.email.trim().toLowerCase() !== normalizedEmail) {
    return true;
  }

  if (
    invite.status === WaitlistInviteStatus.ACCEPTED &&
    invite.acceptedUserId === userId
  ) {
    return true;
  }

  if (invite.status === WaitlistInviteStatus.REVOKED) {
    return true;
  }

  if (isInviteExpired(invite)) {
    return true;
  }

  if (
    invite.status === WaitlistInviteStatus.ACCEPTED &&
    invite.acceptedUserId !== userId
  ) {
    return true;
  }

  // Still pending and valid — keep session so registration can retry.
  return false;
}

export async function consumeWaitlistInviteForEmail(
  email: string,
  userId: string,
): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const session = await readWaitlistInviteSession();

  if (!session || session.email !== normalizedEmail) {
    return;
  }

  const consumed = await prisma.waitlistInvite.updateMany({
    where: {
      id: session.inviteId,
      status: WaitlistInviteStatus.PENDING,
      expiresAt: { gt: new Date() },
      email: { equals: normalizedEmail, mode: "insensitive" },
    },
    data: {
      status: WaitlistInviteStatus.ACCEPTED,
      acceptedAt: new Date(),
      acceptedUserId: userId,
    },
  });

  if (consumed.count > 0) {
    await clearWaitlistInviteSession();
    return;
  }

  const invite = await prisma.waitlistInvite.findUnique({
    where: { id: session.inviteId },
    select: {
      status: true,
      expiresAt: true,
      email: true,
      acceptedUserId: true,
    },
  });

  if (
    shouldClearInviteSessionAfterFailedConsume(invite, normalizedEmail, userId)
  ) {
    await clearWaitlistInviteSession();
  }
}

export async function refreshWaitlistInviteSessionIfValid(): Promise<boolean> {
  const session = await readWaitlistInviteSession();
  if (!session) return false;

  const invite = await prisma.waitlistInvite.findUnique({
    where: { id: session.inviteId },
    select: {
      id: true,
      email: true,
      status: true,
      expiresAt: true,
    },
  });

  if (
    !invite ||
    invite.status !== WaitlistInviteStatus.PENDING ||
    invite.expiresAt.getTime() <= Date.now() ||
    invite.email.trim().toLowerCase() !== session.email
  ) {
    return false;
  }

  await setWaitlistInviteSession({
    inviteId: invite.id,
    email: invite.email,
  });
  return true;
}

export async function hasValidWaitlistInviteAccessForEmail(
  email?: string | null,
): Promise<boolean> {
  const session = await readWaitlistInviteSession();
  if (!session) return false;

  const invite = await prisma.waitlistInvite.findUnique({
    where: { id: session.inviteId },
    select: {
      email: true,
      status: true,
      expiresAt: true,
    },
  });

  if (
    !invite ||
    invite.status !== WaitlistInviteStatus.PENDING ||
    invite.expiresAt.getTime() <= Date.now()
  ) {
    return false;
  }

  const inviteEmail = invite.email.trim().toLowerCase();
  if (email?.trim()) {
    return inviteEmail === email.trim().toLowerCase();
  }

  return inviteEmail === session.email;
}
