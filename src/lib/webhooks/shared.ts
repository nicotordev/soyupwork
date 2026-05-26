export class WebhookVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebhookVerificationError";
  }
}

export function anonymizedEmail(userId: string): string {
  return `deleted+${userId}@anonymized.soyup.work`;
}

export function muxPlaybackUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

export function getPrimaryEmail(
  emailAddresses: { email_address: string }[] | undefined,
): string | null {
  return emailAddresses?.[0]?.email_address ?? null;
}
