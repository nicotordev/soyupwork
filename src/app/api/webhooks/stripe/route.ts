import apiResponse from "@/lib/api/api-response";
import { handleStripeWebhook } from "@/lib/webhooks/handlers/stripe";
import {
  WebhookVerificationError,
  verifyStripeWebhook,
} from "@/lib/webhooks/verify-stripe";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  try {
    const event = verifyStripeWebhook(rawBody, signature);
    await handleStripeWebhook(event);
    return apiResponse.success({ received: true });
  } catch (err: unknown) {
    if (err instanceof WebhookVerificationError) {
      return apiResponse.badRequest({ error: err.message }, err.message);
    }
    console.error("[stripe webhook]", err);
    return apiResponse.internalServerError({ error: "Internal error" });
  }
}
