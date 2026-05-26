import { UserRole } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";

export class AdminAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminAuthError";
  }
}

const adminUserSelect = {
  id: true,
  role: true,
  clerkId: true,
  email: true,
} as const;

type AdminUser = {
  id: string;
  role: UserRole;
  clerkId: string;
  email: string | null;
};

function parseAdminAllowlist(): { emails: Set<string>; domains: Set<string> } {
  const entries =
    process.env.ADMIN_EMAILS?.split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean) ?? [];

  const emails = new Set<string>();
  const domains = new Set<string>();

  for (const entry of entries) {
    if (entry.startsWith("@")) {
      const domain = entry.slice(1);
      if (domain) domains.add(domain);
    } else {
      emails.add(entry);
    }
  }

  return { emails, domains };
}

function isEmailInAdminAllowlist(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const { emails, domains } = parseAdminAllowlist();

  if (emails.has(normalized)) return true;

  const domain = normalized.split("@").at(1);
  return domain !== undefined && domains.has(domain);
}

/** Promotes allowlisted users to ADMIN when role is out of sync. */
async function ensureAdminRole(user: AdminUser): Promise<AdminUser | null> {
  const isAllowlisted =
    user.email !== null && isEmailInAdminAllowlist(user.email);

  if (!isAllowlisted) {
    return user.role === UserRole.ADMIN ? user : null;
  }

  if (user.role === UserRole.ADMIN) {
    return user;
  }

  return prisma.user.update({
    where: { id: user.id },
    data: { role: UserRole.ADMIN },
    select: adminUserSelect,
  });
}

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    throw new AdminAuthError("Debes iniciar sesión para acceder al panel.");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: adminUserSelect,
  });

  if (!user) {
    throw new AdminAuthError("No tienes permisos de administrador.");
  }

  const adminUser = await ensureAdminRole(user);

  if (!adminUser) {
    throw new AdminAuthError("No tienes permisos de administrador.");
  }

  return adminUser;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: adminUserSelect,
  });

  if (!user) return false;

  return (await ensureAdminRole(user)) !== null;
}

export async function isAdminByClerkId(clerkId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: adminUserSelect,
  });

  if (!user) return false;

  return (await ensureAdminRole(user)) !== null;
}
