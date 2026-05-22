import { handleStripeWebhook } from "@/lib/webhooks/handlers/stripe";
import {
  WebhookVerificationError,
  verifyStripeWebhook,
} from "@/lib/webhooks/verify-stripe";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  try {
    const event = verifyStripeWebhook(rawBody, signature);
    await handleStripeWebhook(event);
    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    if (err instanceof WebhookVerificationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[stripe webhook]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
