import "server-only";

import { WaitlistInviteStatus } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { readWaitlistInviteSession } from "@/lib/waitlist/invite-session";

export async function hasAcceptedWaitlistInviteForUser(
  userId: string,
): Promise<boolean> {
  const invite = await prisma.waitlistInvite.findFirst({
    where: {
      status: WaitlistInviteStatus.ACCEPTED,
      acceptedUserId: userId,
    },
    select: { id: true },
  });
  if (invite) return true;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!user?.email) return false;

  const normalizedEmail = user.email.trim().toLowerCase();
  const byEmail = await prisma.waitlistInvite.findFirst({
    where: {
      email: { equals: normalizedEmail, mode: "insensitive" },
      status: WaitlistInviteStatus.ACCEPTED,
    },
    select: { id: true },
  });
  return Boolean(byEmail);
}

export async function hasValidInviteSessionForEmail(
  email: string,
): Promise<boolean> {
  const session = await readWaitlistInviteSession();
  if (!session) return false;
  return session.email === email.trim().toLowerCase();
}

export async function getInviteSessionIfValidForEmail(
  email: string,
): Promise<{ inviteId: string; email: string } | null> {
  const session = await readWaitlistInviteSession();
  if (!session) return null;
  const normalized = email.trim().toLowerCase();
  if (session.email !== normalized) return null;

  const invite = await prisma.waitlistInvite.findUnique({
    where: { id: session.inviteId },
    select: {
      status: true,
      expiresAt: true,
      email: true,
    },
  });

  if (
    !invite ||
    invite.status !== WaitlistInviteStatus.PENDING ||
    invite.expiresAt.getTime() <= Date.now() ||
    invite.email.trim().toLowerCase() !== normalized
  ) {
    return null;
  }

  return session;
}
