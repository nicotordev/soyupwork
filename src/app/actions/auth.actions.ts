"use server";

import { UserRole } from "@/generated/prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { buildUserDisplayName } from "@/lib/auth/user-profile";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { registerUserSchema } from "@/schemas/auth";

const log = getServerLogger("auth.actions");

export type RegisterUserResult = { ok: true } | { ok: false; error: string };

export async function registerUser(
  input: unknown,
): Promise<RegisterUserResult> {
  const parsed = registerUserSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const { email, firstName, lastName, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = await prisma.user.findFirst({
      where: {
        email: { equals: normalizedEmail, mode: "insensitive" },
        deletedAt: null,
      },
      select: { id: true },
    });

    if (existing) {
      return {
        ok: false,
        error: "Ya existe una cuenta con este correo.",
      };
    }

    const passwordHash = await hashPassword(password);
    const name = buildUserDisplayName({
      firstName,
      lastName,
      email: normalizedEmail,
    });

    await prisma.user.create({
      data: {
        email: normalizedEmail,
        emailVerified: new Date(),
        firstName,
        lastName,
        name,
        passwordHash,
        role: UserRole.STUDENT,
      },
    });

    log.info({ email: normalizedEmail }, "User registered via credentials");

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to register user");
    return { ok: false, error: "No se pudo crear la cuenta." };
  }
}
