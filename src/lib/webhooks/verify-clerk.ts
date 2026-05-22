import { WebhookVerificationError } from "@/lib/webhooks/errors";
import { Webhook } from "svix";

export { WebhookVerificationError };

export function verifyClerkWebhook(rawBody: string, headers: Headers): unknown {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    throw new WebhookVerificationError("CLERK_WEBHOOK_SECRET is not set");
  }

  const svixId = headers.get("svix-id");
  const svixTimestamp = headers.get("svix-timestamp");
  const svixSignature = headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new WebhookVerificationError("Missing Svix headers");
  }

  const wh = new Webhook(secret);
  return wh.verify(rawBody, {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": svixSignature,
  });
}
