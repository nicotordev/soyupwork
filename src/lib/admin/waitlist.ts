import {
  ADMIN_WAITLIST_DEFAULT_PAGE,
  ADMIN_WAITLIST_DEFAULT_PAGE_SIZE,
  ADMIN_WAITLIST_INVITE_STATUS_FILTER,
  ADMIN_WAITLIST_MAX_PAGE_SIZE,
  ADMIN_WAITLIST_PAGE_SIZE_OPTIONS,
  type AdminWaitlistInviteStatusFilter,
} from "@/constants/waitlist-admin.constants";
import { Prisma, WaitlistInviteStatus } from "@/generated/prisma/client";
import type {
  AdminWaitlistEntryRow,
  ParsedAdminWaitlistParams,
} from "@/types/admin-waitlist.types";

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parsePositiveInt(
  raw: string | undefined,
  fallback: number,
  max?: number,
): number {
  const parsed = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  if (max !== undefined && parsed > max) return max;
  return parsed;
}

function parsePageSize(raw: string | undefined): number {
  const parsed = parsePositiveInt(
    raw,
    ADMIN_WAITLIST_DEFAULT_PAGE_SIZE,
    ADMIN_WAITLIST_MAX_PAGE_SIZE,
  );
  const allowed = ADMIN_WAITLIST_PAGE_SIZE_OPTIONS as readonly number[];
  if (allowed.includes(parsed)) return parsed;
  return ADMIN_WAITLIST_DEFAULT_PAGE_SIZE;
}

function parseInviteStatus(
  raw: string | undefined,
): AdminWaitlistInviteStatusFilter {
  const values = Object.values(ADMIN_WAITLIST_INVITE_STATUS_FILTER);
  if (raw && values.includes(raw as AdminWaitlistInviteStatusFilter)) {
    return raw as AdminWaitlistInviteStatusFilter;
  }
  return ADMIN_WAITLIST_INVITE_STATUS_FILTER.ALL;
}

export function parseAdminWaitlistParams(
  searchParams: Record<string, string | string[] | undefined>,
): ParsedAdminWaitlistParams {
  return {
    page: parsePositiveInt(firstParam(searchParams.page), ADMIN_WAITLIST_DEFAULT_PAGE),
    pageSize: parsePageSize(firstParam(searchParams.pageSize)),
    q: (firstParam(searchParams.q) ?? "").trim(),
    inviteStatus: parseInviteStatus(firstParam(searchParams.inviteStatus)),
  };
}

export function buildWaitlistWhere(
  filters: ParsedAdminWaitlistParams,
): Prisma.WaitlistEntryWhereInput {
  const where: Prisma.WaitlistEntryWhereInput = {};

  if (filters.q.length > 0) {
    where.OR = [
      { email: { contains: filters.q, mode: "insensitive" } },
      { name: { contains: filters.q, mode: "insensitive" } },
      { phone: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  const now = new Date();

  switch (filters.inviteStatus) {
    case ADMIN_WAITLIST_INVITE_STATUS_FILTER.NONE:
      where.invites = { none: {} };
      break;
    case ADMIN_WAITLIST_INVITE_STATUS_FILTER.PENDING:
      where.invites = {
        some: {
          status: WaitlistInviteStatus.PENDING,
          expiresAt: { gt: now },
        },
      };
      break;
    case ADMIN_WAITLIST_INVITE_STATUS_FILTER.ACCEPTED:
      where.invites = { some: { status: WaitlistInviteStatus.ACCEPTED } };
      break;
    case ADMIN_WAITLIST_INVITE_STATUS_FILTER.REVOKED:
      where.invites = { some: { status: WaitlistInviteStatus.REVOKED } };
      break;
    case ADMIN_WAITLIST_INVITE_STATUS_FILTER.EXPIRED:
      where.invites = {
        some: {
          OR: [
            { status: WaitlistInviteStatus.EXPIRED },
            {
              status: WaitlistInviteStatus.PENDING,
              expiresAt: { lte: now },
            },
          ],
        },
      };
      break;
    default:
      break;
  }

  return where;
}

type DbWaitlistEntryWithInvites = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string | null;
  createdAt: Date;
  invites: {
    id: string;
    status: WaitlistInviteStatus;
    expiresAt: Date;
    createdAt: Date;
  }[];
};

export function mapWaitlistEntryToRow(
  entry: DbWaitlistEntryWithInvites,
  userEmails: Set<string>,
): AdminWaitlistEntryRow {
  const normalizedEmail = entry.email.trim().toLowerCase();
  const latestInvite = entry.invites[0] ?? null;

  return {
    id: entry.id,
    email: entry.email,
    name: entry.name,
    phone: entry.phone,
    source: entry.source,
    createdAt: entry.createdAt.toISOString(),
    hasUserAccount: userEmails.has(normalizedEmail),
    latestInvite: latestInvite
      ? {
          id: latestInvite.id,
          status: latestInvite.status,
          expiresAt: latestInvite.expiresAt.toISOString(),
          createdAt: latestInvite.createdAt.toISOString(),
        }
      : null,
  };
}
