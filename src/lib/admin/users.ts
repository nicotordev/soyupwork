import {
  ADMIN_USERS_DEFAULT_PAGE,
  ADMIN_USERS_DEFAULT_PAGE_SIZE,
  ADMIN_USERS_FILTER_ALL,
  ADMIN_USERS_MAX_PAGE_SIZE,
  ADMIN_USERS_PAGE_SIZE_OPTIONS,
  ADMIN_USERS_STATUS_FILTER,
  type AdminUsersStatusFilter,
} from "@/constants/users.constants";
import { UserRole, Prisma } from "@/generated/prisma/client";
import { displayName } from "@/lib/user/display-name";
import type {
  AdminUserRow,
  ParsedAdminUsersParams,
} from "@/types/admin-user.types";

export const adminUserListSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  imageUrl: true,
  bio: true,
  role: true,
  deletedAt: true,
  createdAt: true,
  _count: {
    select: {
      enrollments: true,
      instructedCourses: true,
    },
  },
} satisfies Prisma.UserSelect;

export const adminUserListSelectLegacy = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  imageUrl: true,
  role: true,
  deletedAt: true,
  createdAt: true,
  _count: {
    select: {
      enrollments: true,
      instructedCourses: true,
    },
  },
} satisfies Prisma.UserSelect;

export type DbAdminUserListItem = Prisma.UserGetPayload<{
  select: typeof adminUserListSelect;
}>;

export type DbAdminUserListItemLegacy = Prisma.UserGetPayload<{
  select: typeof adminUserListSelectLegacy;
}>;

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
    ADMIN_USERS_DEFAULT_PAGE_SIZE,
    ADMIN_USERS_MAX_PAGE_SIZE,
  );
  const allowed = ADMIN_USERS_PAGE_SIZE_OPTIONS as readonly number[];
  if (allowed.includes(parsed)) return parsed;
  return ADMIN_USERS_DEFAULT_PAGE_SIZE;
}

function parseRole(raw: string | undefined): ParsedAdminUsersParams["role"] {
  if (!raw || raw === ADMIN_USERS_FILTER_ALL) return ADMIN_USERS_FILTER_ALL;
  if (Object.values(UserRole).includes(raw as UserRole)) {
    return raw as UserRole;
  }
  return ADMIN_USERS_FILTER_ALL;
}

function parseStatus(raw: string | undefined): AdminUsersStatusFilter {
  const values = Object.values(ADMIN_USERS_STATUS_FILTER);
  if (raw && values.includes(raw as AdminUsersStatusFilter)) {
    return raw as AdminUsersStatusFilter;
  }
  return ADMIN_USERS_STATUS_FILTER.ACTIVE;
}

export function parseAdminUsersParams(
  searchParams: Record<string, string | string[] | undefined>,
): ParsedAdminUsersParams {
  return {
    q: firstParam(searchParams.q)?.trim() ?? "",
    page: parsePositiveInt(
      firstParam(searchParams.page),
      ADMIN_USERS_DEFAULT_PAGE,
    ),
    pageSize: parsePageSize(firstParam(searchParams.pageSize)),
    role: parseRole(firstParam(searchParams.role)),
    status: parseStatus(firstParam(searchParams.status)),
  };
}

export function buildUsersWhere(
  filters: ParsedAdminUsersParams,
): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  if (filters.status === ADMIN_USERS_STATUS_FILTER.ACTIVE) {
    where.deletedAt = null;
  } else if (filters.status === ADMIN_USERS_STATUS_FILTER.INACTIVE) {
    where.deletedAt = { not: null };
  }

  if (filters.role !== ADMIN_USERS_FILTER_ALL) {
    where.role = filters.role;
  }

  const q = filters.q.trim();
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  return where;
}

export function mapDbUserToAdminUserRow(
  user: DbAdminUserListItem | DbAdminUserListItemLegacy,
): AdminUserRow {
  return {
    id: user.id,
    displayName: displayName(user),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    bio: "bio" in user ? user.bio : null,
    role: user.role,
    isActive: user.deletedAt === null,
    enrollmentCount: user._count.enrollments,
    instructedCourseCount: user._count.instructedCourses,
    createdAt: user.createdAt.toISOString(),
  };
}
