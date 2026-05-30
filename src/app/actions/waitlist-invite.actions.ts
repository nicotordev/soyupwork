"use server";

import { WaitlistInviteStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/db/prisma";
import { sendWaitlistInviteEmail } from "@/lib/email/send-waitlist-invite";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import {
  buildWaitlistWhere,
  mapWaitlistEntryToRow,
  parseAdminWaitlistParams,
} from "@/lib/admin/waitlist";
import {
  clearWaitlistInviteSession,
  readWaitlistInviteSession,
  setWaitlistInviteSession,
} from "@/lib/waitlist/invite-session";
import {
  generateInviteToken,
  getWaitlistInviteExpiry,
  hashInviteToken,
} from "@/lib/waitlist/invite-token";
import { getInviteSessionIfValidForEmail } from "@/lib/waitlist/invite-access";
import { isPublicWaitlistMode } from "@/lib/platform/public-waitlist-mode";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import type {
  AcceptWaitlistInviteTokenResult,
  AdminWaitlistPageData,
  RevokeWaitlistInviteResult,
  SendWaitlistInviteResult,
  WaitlistInviteSignUpContext,
} from "@/types/admin-waitlist.types";
import { redirect } from "next/navigation";
import { z } from "zod";

const log = getServerLogger("waitlist-invite.actions");

const emailSchema = z.object({
  email: z.string().email("Correo inválido."),
});

async function revokePendingInvitesForEmail(email: string): Promise<void> {
  const now = new Date();
  await prisma.waitlistInvite.updateMany({
    where: {
      email: { equals: email, mode: "insensitive" },
      status: WaitlistInviteStatus.PENDING,
    },
    data: {
      status: WaitlistInviteStatus.REVOKED,
      revokedAt: now,
    },
  });
}

async function findWaitlistEntryIdForEmail(
  email: string,
): Promise<string | undefined> {
  const entry = await prisma.waitlistEntry.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });
  return entry?.id;
}

export async function getAdminWaitlistPageData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<AdminWaitlistPageData> {
  try {
    await requireAdmin();
  } catch {
    redirect("/sign-in");
  }

  const filters = parseAdminWaitlistParams(searchParams);
  const where = buildWaitlistWhere(filters);

  try {
    const totalCount = await prisma.waitlistEntry.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalCount / filters.pageSize));
    const page = Math.min(Math.max(1, filters.page), totalPages);
    const skip = (page - 1) * filters.pageSize;

    const [entries, statsAgg, pendingInvites, acceptedInvites, usersWithEmail] =
      await Promise.all([
        prisma.waitlistEntry.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: filters.pageSize,
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            source: true,
            createdAt: true,
            invites: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: {
                id: true,
                status: true,
                expiresAt: true,
                createdAt: true,
              },
            },
          },
        }),
        prisma.waitlistEntry.count(),
        prisma.waitlistInvite.count({
          where: {
            status: WaitlistInviteStatus.PENDING,
            expiresAt: { gt: new Date() },
          },
        }),
        prisma.waitlistInvite.count({
          where: { status: WaitlistInviteStatus.ACCEPTED },
        }),
        prisma.user.findMany({
          where: { deletedAt: null, email: { not: null } },
          select: { email: true },
        }),
      ]);

    const userEmails = new Set(
      usersWithEmail
        .map((u) => u.email?.trim().toLowerCase())
        .filter((e): e is string => Boolean(e)),
    );

    const withUserAccount = entries.filter((e) =>
      userEmails.has(e.email.trim().toLowerCase()),
    ).length;

    return {
      entries: entries.map((e) => mapWaitlistEntryToRow(e, userEmails)),
      stats: {
        totalEntries: statsAgg,
        pendingInvites,
        acceptedInvites,
        withUserAccount,
      },
      filters: { ...filters, page },
      pagination: {
        page,
        pageSize: filters.pageSize,
        totalCount,
        totalPages,
      },
    };
  } catch (error) {
    log.error(serializeError(error), "Failed to fetch admin waitlist page");
    throw error;
  }
}

export async function sendWaitlistInvite(
  input: unknown,
): Promise<SendWaitlistInviteResult> {
  try {
    const admin = await requireAdmin();
    const parsed = emailSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Correo inválido.",
      };
    }

    const email = parsed.data.email.trim().toLowerCase();

    const existingUser = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        deletedAt: null,
      },
      select: { id: true },
    });

    if (existingUser) {
      return {
        ok: false,
        error: "Ya existe una cuenta con este correo.",
      };
    }

    const acceptedInvite = await prisma.waitlistInvite.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        status: WaitlistInviteStatus.ACCEPTED,
      },
      select: { id: true },
    });

    if (acceptedInvite) {
      return {
        ok: false,
        error: "Este correo ya aceptó una invitación.",
      };
    }

    await revokePendingInvitesForEmail(email);

    const rawToken = generateInviteToken();
    const tokenHash = hashInviteToken(rawToken);
    const waitlistEntryId = await findWaitlistEntryIdForEmail(email);

    await prisma.waitlistInvite.create({
      data: {
        email,
        tokenHash,
        invitedById: admin.id,
        waitlistEntryId,
        expiresAt: getWaitlistInviteExpiry(),
      },
    });

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "http://localhost:3000";
    const inviteUrl = `${appUrl.replace(/\/$/, "")}/invite?token=${encodeURIComponent(rawToken)}`;

    await sendWaitlistInviteEmail({ to: email, inviteUrl });

    log.info({ email, invitedById: admin.id }, "Waitlist invite sent");

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to send waitlist invite");
    return {
      ok: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "No se pudo enviar la invitación.",
    };
  }
}

export async function revokeWaitlistInvite(input: {
  inviteId: string;
}): Promise<RevokeWaitlistInviteResult> {
  try {
    await requireAdmin();

    const invite = await prisma.waitlistInvite.findUnique({
      where: { id: input.inviteId },
      select: { id: true, status: true },
    });

    if (!invite) {
      return { ok: false, error: "Invitación no encontrada." };
    }

    if (invite.status !== WaitlistInviteStatus.PENDING) {
      return {
        ok: false,
        error: "Solo se pueden revocar invitaciones pendientes.",
      };
    }

    await prisma.waitlistInvite.update({
      where: { id: invite.id },
      data: {
        status: WaitlistInviteStatus.REVOKED,
        revokedAt: new Date(),
      },
    });

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to revoke waitlist invite");
    return { ok: false, error: "No se pudo revocar la invitación." };
  }
}

export async function acceptWaitlistInviteToken(
  token: string,
): Promise<AcceptWaitlistInviteTokenResult> {
  const trimmed = token.trim();
  if (!trimmed) {
    return { ok: false, error: "Token de invitación inválido." };
  }

  try {
    const tokenHash = hashInviteToken(trimmed);
    const invite = await prisma.waitlistInvite.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        email: true,
        status: true,
        expiresAt: true,
      },
    });

    if (!invite) {
      return {
        ok: false,
        error: "Invitación no encontrada o enlace inválido.",
      };
    }

    if (invite.status === WaitlistInviteStatus.ACCEPTED) {
      return { ok: false, error: "Esta invitación ya fue utilizada." };
    }

    if (
      invite.status === WaitlistInviteStatus.REVOKED ||
      invite.status === WaitlistInviteStatus.EXPIRED
    ) {
      return { ok: false, error: "Esta invitación ya no es válida." };
    }

    if (invite.expiresAt.getTime() <= Date.now()) {
      await prisma.waitlistInvite.update({
        where: { id: invite.id },
        data: { status: WaitlistInviteStatus.EXPIRED },
      });
      return { ok: false, error: "Esta invitación expiró." };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: { equals: invite.email, mode: "insensitive" },
        deletedAt: null,
      },
      select: { id: true },
    });

    if (existingUser) {
      return {
        ok: false,
        error: "Ya existe una cuenta con este correo.",
      };
    }

    await setWaitlistInviteSession({
      inviteId: invite.id,
      email: invite.email,
    });

    return { ok: true, email: invite.email };
  } catch (error) {
    log.error(serializeError(error), "Failed to accept waitlist invite token");
    return { ok: false, error: "No se pudo validar la invitación." };
  }
}

export async function getWaitlistInviteSignUpContext(): Promise<WaitlistInviteSignUpContext> {
  const session = await readWaitlistInviteSession();
  if (!session) {
    return { hasValidInvite: false, email: null };
  }

  const invite = await prisma.waitlistInvite.findUnique({
    where: { id: session.inviteId },
    select: {
      id: true,
      email: true,
      status: true,
      expiresAt: true,
    },
  });

  if (!invite) {
    await clearWaitlistInviteSession();
    return { hasValidInvite: false, email: null };
  }

  if (
    invite.status !== WaitlistInviteStatus.PENDING ||
    invite.expiresAt.getTime() <= Date.now() ||
    invite.email.trim().toLowerCase() !== session.email
  ) {
    await clearWaitlistInviteSession();
    return { hasValidInvite: false, email: null };
  }

  return { hasValidInvite: true, email: invite.email };
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

  if (consumed.count === 0) {
    const alreadyAccepted = await prisma.waitlistInvite.findFirst({
      where: {
        id: session.inviteId,
        status: WaitlistInviteStatus.ACCEPTED,
        acceptedUserId: userId,
        email: { equals: normalizedEmail, mode: "insensitive" },
      },
      select: { id: true },
    });
    if (!alreadyAccepted) {
      return;
    }
  }

  await clearWaitlistInviteSession();
}

export async function registrationRequiresWaitlistInvite(): Promise<boolean> {
  if (isPublicWaitlistMode()) return true;
  const settings = await getPlatformSettings();
  return !settings.registrationsOpen;
}

export async function assertRegistrationAllowedForEmail(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const requiresInvite = await registrationRequiresWaitlistInvite();
  if (!requiresInvite) {
    return { ok: true };
  }

  const hasInvite = await getInviteSessionIfValidForEmail(email);
  if (!hasInvite) {
    return {
      ok: false,
      error:
        "Necesitás una invitación válida para registrarte. Revisá tu correo o contactá al equipo.",
    };
  }

  return { ok: true };
}
