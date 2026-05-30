"use server";

import { resolveRoleForAllowlistedEmail } from "@/lib/auth/admin";
import { getJwtUserId } from "@/lib/auth/jwt-session";
import { getLinkAccountContext } from "@/lib/auth/link-account";
import { hashPassword } from "@/lib/auth/password";
import { buildUserDisplayName } from "@/lib/auth/user-profile";
import prisma from "@/lib/db/prisma";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import {
  linkAccountParamsSchema,
  magicLinkSignInSchema,
  registerUserSchema,
} from "@/schemas/auth";

const log = getServerLogger("auth.actions");

export type RegisterUserResult = { ok: true } | { ok: false; error: string };

export type ValidateMagicLinkSignInResult =
  | { ok: true }
  | { ok: false; error: string };

export type LinkAccountContextResult =
  | {
      ok: true;
      provider: "google" | "github";
      providerLabel: string;
      email: string;
      hasPassword: boolean;
      magicLinkEnabled: boolean;
      isCurrentUser: boolean;
      isSignedIn: boolean;
    }
  | { ok: false; error: string };

export async function getLinkAccountPageContext(
  input: unknown,
): Promise<LinkAccountContextResult> {
  const parsed = linkAccountParamsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const currentUserId = await getJwtUserId();
  return getLinkAccountContext(
    parsed.data.provider,
    parsed.data.email,
    currentUserId,
  );
}

export async function validateMagicLinkSignIn(
  input: unknown,
): Promise<ValidateMagicLinkSignInResult> {
  const parsed = magicLinkSignInSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const settings = await getPlatformSettings();

  if (settings.registrationsOpen) {
    return { ok: true };
  }

  const existing = await prisma.user.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
      deletedAt: null,
    },
    select: { id: true },
  });

  if (!existing) {
    return {
      ok: false,
      error:
        "El registro está cerrado. Solo usuarios existentes pueden iniciar sesión.",
    };
  }

  return { ok: true };
}

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
        role: resolveRoleForAllowlistedEmail(normalizedEmail),
      },
    });

    log.info({ email: normalizedEmail }, "User registered via credentials");

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to register user");
    return { ok: false, error: "No se pudo crear la cuenta." };
  }
}
