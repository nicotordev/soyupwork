const SITEVERIFY_ERROR_MESSAGES: Record<string, string> = {
  "missing-input-secret": "Falta TURNSTILE_SECRET_KEY en el servidor.",
  "invalid-input-secret":
    "TURNSTILE_SECRET_KEY inválida o no corresponde al site key.",
  "missing-input-response": "No se recibió token del widget.",
  "invalid-input-response":
    "Token inválido o expirado. Vuelve a completar el captcha.",
  "bad-request": "Petición de verificación mal formada.",
  "timeout-or-duplicate":
    "El token ya se usó o expiró. Recarga la página e intenta de nuevo.",
  "internal-error": "Error interno de Cloudflare Turnstile.",
};

const CLIENT_ERROR_MESSAGES: Record<string, string> = {
  "110100": "Site key inválida. Revisa NEXT_PUBLIC_TURNSTILE_SITE_KEY.",
  "110110": "Site key no encontrada en Cloudflare.",
  "110200":
    "Dominio no autorizado. Agrega el hostname exacto (con/sin www) en Turnstile → Hostname Management.",
  "110600": "El reto expiró. Intenta de nuevo.",
  "110620": "Tiempo de interacción agotado. Intenta de nuevo.",
  "200100":
    "Reloj del navegador desincronizado o caché intermedia. Prueba incógnito.",
  "200500":
    "No se pudo cargar el iframe de Turnstile. Revisa bloqueadores o firewall.",
  "400020": "Site key inválida en el widget.",
  "400070": "Site key deshabilitada en el dashboard de Cloudflare.",
  "300*": "Verificación fallida. Prueba incógnito o desactiva extensiones.",
  "600*": "Verificación fallida. Prueba incógnito o desactiva extensiones.",
};

export function mapSiteverifyErrorCodes(
  errorCodes: string[] | undefined,
): string {
  if (!errorCodes?.length) {
    return "No pudimos verificar que eres humano. Intenta de nuevo.";
  }

  for (const code of errorCodes) {
    const message = SITEVERIFY_ERROR_MESSAGES[code];
    if (message) return message;
  }

  return `Verificación fallida (${errorCodes.join(", ")}).`;
}

export function mapClientTurnstileErrorCode(errorCode: string): string {
  if (CLIENT_ERROR_MESSAGES[errorCode]) {
    return CLIENT_ERROR_MESSAGES[errorCode];
  }

  if (errorCode.startsWith("300")) {
    return CLIENT_ERROR_MESSAGES["300*"] ?? "Verificación fallida. Intenta de nuevo.";
  }

  if (errorCode.startsWith("600")) {
    return CLIENT_ERROR_MESSAGES["600*"] ?? "Verificación fallida. Intenta de nuevo.";
  }

  return `La verificación de seguridad falló (${errorCode}). Intenta de nuevo.`;
}

export function maskTurnstileKey(key: string | undefined): string | null {
  const trimmed = key?.trim();
  if (!trimmed) return null;
  if (trimmed.length <= 12) return `${trimmed.slice(0, 4)}…`;
  return `${trimmed.slice(0, 8)}…${trimmed.slice(-4)}`;
}
