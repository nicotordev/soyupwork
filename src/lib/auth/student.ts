import prisma from "@/lib/db/prisma";
import { auth } from "@/auth";

export class StudentAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StudentAuthError";
  }
}

export async function requireStudent() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new StudentAuthError("Debes iniciar sesión para acceder al curso.");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true },
  });

  if (!user) {
    throw new StudentAuthError("Usuario no encontrado.");
  }

  return user;
}
