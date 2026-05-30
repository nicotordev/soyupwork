"use server";

import { UserRole } from "@/generated/prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { buildUserDisplayName } from "@/lib/auth/user-profile";
import {
  adminUserListSelect,
  adminUserListSelectLegacy,
  buildUsersWhere,
  mapDbUserToAdminUserRow,
  parseAdminUsersParams,
} from "@/lib/admin/users";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/db/prisma";
import { displayName } from "@/lib/user/display-name";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import {
  createAdminUserSchema,
  setUserActiveSchema,
  updateAdminUserProfileSchema,
  updateUserRoleSchema,
} from "@/schemas/user";
import type {
  AdminUsersPageData,
  AdminUsersStats,
  CreateAdminUserResult,
  SetUserActiveResult,
  UpdateAdminUserProfileResult,
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

    const statsPromise = getAdminUsersStats();
    let users;
    try {
      users = await prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: filters.pageSize,
        select: adminUserListSelect,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const isBioSelectMismatch =
        error instanceof Error &&
        message.includes(
          "Unknown field `bio` for select statement on model `User`",
        );

      if (!isBioSelectMismatch) throw error;

      log.warn(
        { error: serializeError(error) },
        "Falling back to legacy user select without bio",
      );

      users = await prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: filters.pageSize,
        select: adminUserListSelectLegacy,
      });
    }

    const stats = await statsPromise;

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

function actionErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "No se pudo completar la operación.";
}

export async function createAdminUser(
  input: unknown,
): Promise<CreateAdminUserResult> {
  try {
    await requireAdmin();

    const parsed = createAdminUserSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const { email, firstName, lastName, password, role } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);
    const name = buildUserDisplayName({
      firstName,
      lastName,
      email: normalizedEmail,
    });

    const existing = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
      select: { id: true, deletedAt: true },
    });

    if (existing && existing.deletedAt === null) {
      return {
        ok: false,
        error: "Ya existe un miembro activo con este correo.",
      };
    }

    const dbUser = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            email: normalizedEmail,
            firstName,
            lastName,
            name,
            passwordHash,
            role,
            emailVerified: new Date(),
            deletedAt: null,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        })
      : await prisma.user.create({
          data: {
            email: normalizedEmail,
            firstName,
            lastName,
            name,
            passwordHash,
            role,
            emailVerified: new Date(),
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        });

    revalidatePath("/admin/users");

    const userDisplayName = displayName(dbUser);

    log.info({ userId: dbUser.id, role }, "Admin created user");

    return { ok: true, userId: dbUser.id, displayName: userDisplayName };
  } catch (error) {
    log.error(serializeError(error), "Failed to create admin user");
    return { ok: false, error: actionErrorMessage(error) };
  }
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

export async function updateAdminUserProfile(
  input: unknown,
): Promise<UpdateAdminUserProfileResult> {
  try {
    const admin = await requireAdmin();

    const parsed = updateAdminUserProfileSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const { userId, firstName, lastName, imageUrl, bio, role, active } =
      parsed.data;
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        deletedAt: true,
      },
    });

    if (!existing) {
      return { ok: false, error: "El usuario no existe." };
    }

    if (userId === admin.id && role !== existing.role) {
      return { ok: false, error: "No puedes cambiar tu propio rol." };
    }

    if (userId === admin.id && !active) {
      return { ok: false, error: "No puedes desactivar tu propia cuenta." };
    }

    const wasActive = existing.deletedAt === null;
    const willBeActiveAdmin = active && role === UserRole.ADMIN;
    if (
      wasActive &&
      existing.role === UserRole.ADMIN &&
      !willBeActiveAdmin &&
      (await countActiveAdmins(userId)) === 0
    ) {
      return {
        ok: false,
        error: "Debe quedar al menos un administrador activo.",
      };
    }

    const name = buildUserDisplayName({ firstName, lastName });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        name,
        imageUrl,
        image: imageUrl,
        bio,
        role,
        deletedAt: active ? null : (existing.deletedAt ?? new Date()),
      },
      select: { firstName: true, lastName: true, email: true },
    });

    revalidatePath("/admin/users");
    const updatedDisplayName = displayName(updatedUser);

    log.info({ userId }, "Admin updated user profile");
    return { ok: true, displayName: updatedDisplayName };
  } catch (error) {
    log.error(serializeError(error), "Failed to update admin user profile");
    return { ok: false, error: actionErrorMessage(error) };
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
