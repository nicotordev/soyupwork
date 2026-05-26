import "server-only";

export class MuxConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MuxConfigError";
  }
}

export function getMuxConfig(): {
  tokenId: string;
  tokenSecret: string;
  corsOrigin: string;
} {
  const tokenId = process.env.MUX_TOKEN_ID?.trim();
  const tokenSecret = process.env.MUX_TOKEN_SECRET?.trim();
  const corsOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!tokenId || !tokenSecret) {
    throw new MuxConfigError(
      "MUX_TOKEN_ID y MUX_TOKEN_SECRET deben estar configurados.",
    );
  }

  if (!corsOrigin) {
    throw new MuxConfigError(
      "NEXT_PUBLIC_APP_URL debe estar configurado para subidas de vídeo.",
    );
  }

  return { tokenId, tokenSecret, corsOrigin };
}

export function isMuxConfigured(): boolean {
  return Boolean(
    process.env.MUX_TOKEN_ID?.trim() && process.env.MUX_TOKEN_SECRET?.trim(),
  );
}
