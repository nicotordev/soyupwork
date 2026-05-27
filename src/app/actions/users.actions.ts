"use server";

import { UserRole } from "@/generated/prisma/client";
import {
  adminUserListSelect,
  buildUsersWhere,
  mapDbUserToAdminUserRow,
  parseAdminUsersParams,
} from "@/lib/admin/users";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { setUserActiveSchema, updateUserRoleSchema } from "@/schemas/user";
import type {
  AdminUsersPageData,
  AdminUsersStats,
  SetUserActiveResult,
  UpdateUserRoleResult,
} from "@/types/admin-user.types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const log = getServerLogger("users.actions");

const activeWhere = { deletedAt: null } as const;

export async function getAdminUsersStats(): Promise<AdminUsersStats> {
  const [total, students, instructors, admins] = await Promise.all([
    prisma.user.count({ where: activeWhere }),
    prisma.user.count({ where: { ...activeWhere, role: UserRole.STUDENT } }),
    prisma.user.count({
      where: { ...activeWhere, role: UserRole.INSTRUCTOR },
    }),
    prisma.user.count({ where: { ...activeWhere, role: UserRole.ADMIN } }),
  ]);

  return { total, students, instructors, admins };
}

export async function getAdminUsersPageData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<AdminUsersPageData> {
  let currentAdminUserId: string;

  try {
    const admin = await requireAdmin();
    currentAdminUserId = admin.id;
  } catch {
    redirect("/sign-in");
  }

  const filters = parseAdminUsersParams(searchParams);
  const where = buildUsersWhere(filters);

  log.debug(
    {
      page: filters.page,
      pageSize: filters.pageSize,
      role: filters.role,
      status: filters.status,
      hasQuery: filters.q.length > 0,
    },
    "Fetching admin users page",
  );

  try {
    const totalCount = await prisma.user.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalCount / filters.pageSize));
    const page = Math.min(Math.max(1, filters.page), totalPages);
    const skip = (page - 1) * filters.pageSize;

    const [users, stats] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: filters.pageSize,
        select: adminUserListSelect,
      }),
      getAdminUsersStats(),
    ]);

    log.info(
      {
        page,
        pageSize: filters.pageSize,
        returned: users.length,
        totalCount,
      },
      "Admin users page loaded",
    );

    return {
      users: users.map(mapDbUserToAdminUserRow),
      stats,
      filters: { ...filters, page },
      pagination: {
        page,
        pageSize: filters.pageSize,
        totalCount,
        totalPages,
      },
      currentAdminUserId,
    };
  } catch (error) {
    log.error(serializeError(error), "Failed to fetch admin users page");
    throw error;
  }
}

async function countActiveAdmins(excludeUserId?: string): Promise<number> {
  return prisma.user.count({
    where: {
      deletedAt: null,
      role: UserRole.ADMIN,
      ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
    },
  });
}

export async function updateUserRole(
  input: unknown,
): Promise<UpdateUserRoleResult> {
  try {
    const admin = await requireAdmin();

    const parsed = updateUserRoleSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const { userId, role } = parsed.data;

    if (userId === admin.id) {
      return { ok: false, error: "No puedes cambiar tu propio rol." };
    }

    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, deletedAt: true },
    });

    if (!existing) {
      return { ok: false, error: "El usuario no existe." };
    }

    if (existing.deletedAt) {
      return {
        ok: false,
        error: "No puedes cambiar el rol de un usuario inactivo.",
      };
    }

    if (
      existing.role === UserRole.ADMIN &&
      role !== UserRole.ADMIN &&
      (await countActiveAdmins(userId)) === 0
    ) {
      return {
        ok: false,
        error: "Debe quedar al menos un administrador activo.",
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin/users");

    log.info({ userId, role }, "User role updated");

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to update user role");
    return { ok: false, error: "No se pudo actualizar el rol." };
  }
}

export async function setUserActive(
  input: unknown,
): Promise<SetUserActiveResult> {
  try {
    const admin = await requireAdmin();

    const parsed = setUserActiveSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const { userId, active } = parsed.data;

    if (userId === admin.id) {
      return {
        ok: false,
        error: "No puedes desactivar tu propia cuenta.",
      };
    }

    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, deletedAt: true },
    });

    if (!existing) {
      return { ok: false, error: "El usuario no existe." };
    }

    if (!active && existing.deletedAt) {
      return { ok: false, error: "El usuario ya está inactivo." };
    }

    if (active && !existing.deletedAt) {
      return { ok: false, error: "El usuario ya está activo." };
    }

    if (
      !active &&
      existing.role === UserRole.ADMIN &&
      existing.deletedAt === null &&
      (await countActiveAdmins(userId)) === 0
    ) {
      return {
        ok: false,
        error: "Debe quedar al menos un administrador activo.",
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: active ? null : new Date() },
    });

    revalidatePath("/admin/users");

    log.info({ userId, active }, "User active status updated");

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to set user active status");
    return { ok: false, error: "No se pudo actualizar el estado." };
  }
}
