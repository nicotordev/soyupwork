import { auth } from "@clerk/nextjs/server";
import { UserRole } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export class AdminAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminAuthError";
  }
}

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    throw new AdminAuthError("Debes iniciar sesión para acceder al panel.");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true, clerkId: true, email: true },
  });

  if (!user || user.role !== UserRole.ADMIN) {
    throw new AdminAuthError("No tienes permisos de administrador.");
  }

  return user;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  return user?.role === UserRole.ADMIN;
}

export async function isAdminByClerkId(clerkId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { role: true },
  });

  return user?.role === UserRole.ADMIN;
}
