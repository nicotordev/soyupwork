import "server-only";

import { headers } from "next/headers";
import { getServerLogger } from "@/lib/logger/server";
import { mapSiteverifyErrorCodes } from "@/lib/turnstile/error-codes";

const log = getServerLogger("turnstile");

type TurnstileSiteverifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

/** Server-side: siteverify only needs the secret key at runtime. */
export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}

export async function verifyTurnstileToken(
  token: string | undefined | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      log.warn("TURNSTILE_SECRET_KEY missing in production; skipping verify");
    } else {
      log.warn(
        "Turnstile secret missing; skipping verification in development",
      );
    }
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

    if (!res.ok) {
      log.warn({ status: res.status }, "Turnstile siteverify HTTP error");
      return {
        ok: false,
        error: "Error al contactar Cloudflare Turnstile. Intenta de nuevo.",
      };
    }

    const data = (await res.json()) as TurnstileSiteverifyResponse;

    if (!data.success) {
      const errorCodes = data["error-codes"] ?? [];
      log.warn({ errorCodes }, "Turnstile siteverify failed");
      return {
        ok: false,
        error: mapSiteverifyErrorCodes(errorCodes),
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
