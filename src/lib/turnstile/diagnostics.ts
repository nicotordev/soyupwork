import "server-only";

import { maskTurnstileKey } from "@/lib/turnstile/error-codes";

type SiteverifyProbeResult =
  | { ok: true; note: string }
  | { ok: false; errorCodes: string[]; note: string };

type TurnstileDiagnostics = {
  configured: {
    siteKey: boolean;
    secretKey: boolean;
    siteKeyMasked: string | null;
  };
  runtime: {
    nodeEnv: string;
    appUrl: string | null;
    requestHost: string | null;
    forwardedHost: string | null;
  };
  secretProbe: SiteverifyProbeResult | null;
  checks: Array<{
    id: string;
    status: "pass" | "fail" | "warn" | "info";
    message: string;
  }>;
  pat401Note: string;
};

async function probeSecretKey(secret: string): Promise<SiteverifyProbeResult> {
  const body = new URLSearchParams({
    secret,
    response: "diagnostic-probe-token",
  });

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    },
  );

  const data = (await res.json()) as {
    success?: boolean;
    "error-codes"?: string[];
  };

  const errorCodes = data["error-codes"] ?? [];

  if (errorCodes.includes("invalid-input-secret")) {
    return {
      ok: false,
      errorCodes,
      note: "La secret key es inválida o no pertenece al mismo widget que el site key.",
    };
  }

  if (errorCodes.includes("missing-input-secret")) {
    return {
      ok: false,
      errorCodes,
      note: "Cloudflare no recibió secret key en la petición.",
    };
  }

  if (errorCodes.includes("invalid-input-response")) {
    return {
      ok: true,
      note: "Secret key aceptada por Cloudflare (token de prueba rechazado, como se espera).",
    };
  }

  return {
    ok: false,
    errorCodes,
    note: `Respuesta inesperada de siteverify: ${errorCodes.join(", ") || "sin códigos"}.`,
  };
}

export async function getTurnstileDiagnostics(
  requestHost?: string | null,
  forwardedHost?: string | null,
): Promise<TurnstileDiagnostics> {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim() ?? "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() ?? null;

  const checks: TurnstileDiagnostics["checks"] = [];

  if (!siteKey) {
    checks.push({
      id: "site-key",
      status: "fail",
      message:
        "NEXT_PUBLIC_TURNSTILE_SITE_KEY no está definida. En Docker debe pasarse como --build-arg al construir la imagen.",
    });
  } else {
    checks.push({
      id: "site-key",
      status: "pass",
      message: `Site key presente (${maskTurnstileKey(siteKey)}).`,
    });
  }

  if (!secretKey) {
    checks.push({
      id: "secret-key",
      status: "fail",
      message:
        "TURNSTILE_SECRET_KEY no está definida en runtime (--env-file / orchestrator).",
    });
  } else {
    checks.push({
      id: "secret-key",
      status: "pass",
      message: "Secret key presente en runtime.",
    });
  }

  const host = forwardedHost ?? requestHost;
  if (host) {
    checks.push({
      id: "hostname",
      status: "info",
      message: `Hostname de la petición: ${host}. Debe coincidir exactamente con uno autorizado en Turnstile (incluye www si aplica).`,
    });

    if (appUrl) {
      try {
        const appHostname = new URL(appUrl).hostname;
        if (appHostname !== host.replace(/:\d+$/, "")) {
          checks.push({
            id: "hostname-mismatch",
            status: "warn",
            message: `NEXT_PUBLIC_APP_URL usa ${appHostname} pero la petición llegó como ${host}. Revisa www vs apex y el proxy.`,
          });
        }
      } catch {
        checks.push({
          id: "app-url",
          status: "warn",
          message: "NEXT_PUBLIC_APP_URL no es una URL válida.",
        });
      }
    }
  }

  let secretProbe: SiteverifyProbeResult | null = null;
  if (secretKey) {
    secretProbe = await probeSecretKey(secretKey);
    checks.push({
      id: "secret-probe",
      status: secretProbe.ok ? "pass" : "fail",
      message: secretProbe.note,
    });
  }

  checks.push({
    id: "pat-401",
    status: "info",
    message:
      "Un 401 en .../challenge-platform/.../pat/... en la consola del navegador es normal cuando el navegador no soporta Private Access Token. No indica por sí solo un fallo de configuración.",
  });

  return {
    configured: {
      siteKey: Boolean(siteKey),
      secretKey: Boolean(secretKey),
      siteKeyMasked: maskTurnstileKey(siteKey),
    },
    runtime: {
      nodeEnv: process.env.NODE_ENV ?? "unknown",
      appUrl,
      requestHost: requestHost ?? null,
      forwardedHost: forwardedHost ?? null,
    },
    secretProbe,
    checks,
    pat401Note:
      "Si el widget muestra check verde y el formulario envía, puedes ignorar el 401 PAT. Si el widget falla o siteverify devuelve error-codes, revisa hostname exacto y que el site key esté embebido en el build de producción.",
  };
}
