import apiResponse from "@/lib/api/api-response";
import { handleMuxWebhook } from "@/lib/webhooks/handlers/mux";
import {
  WebhookVerificationError,
  verifyMuxWebhook,
} from "@/lib/webhooks/verify-mux";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("mux-signature");

  try {
    const payload = verifyMuxWebhook(rawBody, signature);
    await handleMuxWebhook(payload);
    return apiResponse.success({ received: true });
  } catch (err: unknown) {
    if (err instanceof WebhookVerificationError) {
      return apiResponse.badRequest({ error: err.message }, err.message);
    }
    console.error("[mux webhook]", err);
    return apiResponse.internalServerError({ error: "Internal error" });
  }
}
