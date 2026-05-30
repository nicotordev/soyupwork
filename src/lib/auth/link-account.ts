import "server-only";

import {
  getOAuthProviderMeta,
  isOAuthLinkProvider,
  type OAuthLinkProvider,
} from "@/lib/auth/oauth-providers";
import prisma from "@/lib/db/prisma";
import { cookies } from "next/headers";

export type LinkAccountRedirectParams = {
  provider: OAuthLinkProvider;
  email: string;
  redirectUrl?: string | null;
};

export function buildLinkAccountPath({
  provider,
  email,
  redirectUrl,
}: LinkAccountRedirectParams): string {
  const params = new URLSearchParams({
    provider,
    email: email.trim().toLowerCase(),
  });

  if (redirectUrl?.trim()) {
    params.set("redirect_url", redirectUrl.trim());
  }

  return `/sign-in/link-account?${params.toString()}`;
}

export async function getPendingOAuthCallbackPath(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw =
    cookieStore.get("authjs.callback-url")?.value ??
    cookieStore.get("__Secure-authjs.callback-url")?.value;

  if (!raw) {
    return null;
  }

  try {
    const url = new URL(raw);
    if (!url.pathname.startsWith("/") || url.pathname.startsWith("//")) {
      return null;
    }
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

export async function resolveOAuthLinkRedirect(
  provider: string,
  email: string,
  currentUserId: string | null,
  redirectUrl?: string | null,
): Promise<string | true> {
  if (!isOAuthLinkProvider(provider)) {
    return true;
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return true;
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: { equals: normalizedEmail, mode: "insensitive" },
      deletedAt: null,
    },
    select: {
      id: true,
      accounts: {
        select: { provider: true },
      },
    },
  });

  if (!existingUser) {
    return true;
  }

  const alreadyLinked = existingUser.accounts.some(
    (account) => account.provider === provider,
  );

  if (alreadyLinked) {
    return true;
  }

  if (currentUserId === existingUser.id) {
    return true;
  }

  return buildLinkAccountPath({
    provider,
    email: normalizedEmail,
    redirectUrl,
  });
}

export async function getLinkAccountContext(
  provider: string,
  email: string,
  currentUserId: string | null,
) {
  if (!isOAuthLinkProvider(provider)) {
    return { ok: false as const, error: "Proveedor inválido." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const providerMeta = getOAuthProviderMeta(provider);

  const user = await prisma.user.findFirst({
    where: {
      email: { equals: normalizedEmail, mode: "insensitive" },
      deletedAt: null,
    },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      accounts: {
        select: { provider: true },
      },
    },
  });

  if (!user) {
    return {
      ok: false as const,
      error: "No encontramos una cuenta con ese correo.",
    };
  }

  const alreadyLinked = user.accounts.some(
    (account) => account.provider === provider,
  );

  if (alreadyLinked) {
    return {
      ok: false as const,
      error: `Tu cuenta ya está vinculada con ${providerMeta.label}.`,
    };
  }

  const isCurrentUser = currentUserId === user.id;
  const hasPassword = user.passwordHash != null;
  const magicLinkEnabled = Boolean(
    process.env.AUTH_RESEND_KEY?.trim() || process.env.RESEND_API_KEY?.trim(),
  );

  return {
    ok: true as const,
    provider,
    providerLabel: providerMeta.label,
    email: user.email ?? normalizedEmail,
    hasPassword,
    magicLinkEnabled,
    isCurrentUser,
    isSignedIn: currentUserId != null,
  };
}

export async function getConnectedOAuthAccounts(userId: string) {
  const accounts = await prisma.account.findMany({
    where: {
      userId,
      provider: { in: ["google", "github"] },
    },
    select: { provider: true },
  });

  return {
    google: accounts.some((account) => account.provider === "google"),
    github: accounts.some((account) => account.provider === "github"),
  };
}
