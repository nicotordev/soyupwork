import "server-only";

import { headers } from "next/headers";
import { getServerLogger } from "@/lib/logger/server";

const log = getServerLogger("turnstile");

type TurnstileSiteverifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

export function isTurnstileConfigured(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY?.trim() &&
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
  );
}

export async function verifyTurnstileToken(
  token: string | undefined | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  if (!secret || !siteKey) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        error: "La verificación de seguridad no está configurada.",
      };
    }
    log.warn("Turnstile keys missing; skipping verification in development");
    return { ok: true };
  }

  const response = token?.trim();
  if (!response) {
    return {
      ok: false,
      error: "Completa la verificación de seguridad antes de continuar.",
    };
  }

  const hdrs = await headers();
  const remoteip =
    hdrs.get("cf-connecting-ip") ??
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    undefined;

  const body = new URLSearchParams({
    secret,
    response,
  });
  if (remoteip) {
    body.set("remoteip", remoteip);
  }

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        cache: "no-store",
      },
    );

    const data = (await res.json()) as TurnstileSiteverifyResponse;

    if (!data.success) {
      log.warn(
        { errorCodes: data["error-codes"] },
        "Turnstile siteverify failed",
      );
      return {
        ok: false,
        error: "No pudimos verificar que eres humano. Intenta de nuevo.",
      };
    }

    return { ok: true };
  } catch (error) {
    log.error({ error }, "Turnstile siteverify request failed");
    return {
      ok: false,
      error: "Error al verificar la seguridad. Intenta de nuevo en un momento.",
    };
  }
}
