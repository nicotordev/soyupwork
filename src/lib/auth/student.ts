import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";

export class StudentAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StudentAuthError";
  }
}

export async function requireStudent() {
  const { userId } = await auth();

  if (!userId) {
    throw new StudentAuthError("Debes iniciar sesión para acceder al curso.");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, clerkId: true, email: true },
  });

  if (!user) {
    throw new StudentAuthError("Usuario no encontrado.");
  }

  return user;
}
