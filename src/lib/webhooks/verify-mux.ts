import { WebhookVerificationError } from "@/lib/webhooks/shared";
import { createHmac, timingSafeEqual } from "node:crypto";

export { WebhookVerificationError };

const MUX_SIGNATURE_TOLERANCE_SEC = 300;

export function verifyMuxWebhook(
  rawBody: string,
  signatureHeader: string | null,
): unknown {
  const secret = process.env.MUX_WEBHOOK_SECRET;
  if (!secret) {
    throw new WebhookVerificationError("MUX_WEBHOOK_SECRET is not set");
  }
  if (!signatureHeader) {
    throw new WebhookVerificationError("Missing mux-signature header");
  }

  const parts = signatureHeader
    .split(",")
    .reduce<Record<string, string>>((acc, part) => {
      const [key, value] = part.split("=");
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    }, {});

  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature) {
    throw new WebhookVerificationError("Invalid mux-signature format");
  }

  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (Number.isNaN(age) || age > MUX_SIGNATURE_TOLERANCE_SEC) {
    throw new WebhookVerificationError(
      "Mux signature timestamp out of tolerance",
    );
  }

  const payload = `${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(signature, "hex");

  if (
    expectedBuf.length !== actualBuf.length ||
    !timingSafeEqual(expectedBuf, actualBuf)
  ) {
    throw new WebhookVerificationError("Invalid Mux signature");
  }

  return JSON.parse(rawBody) as unknown;
}
