import { handleClerkWebhook } from "@/lib/webhooks/handlers/clerk";
import {
  WebhookVerificationError,
  verifyClerkWebhook,
} from "@/lib/webhooks/verify-clerk";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const rawBody = await req.text();

  try {
    const payload = verifyClerkWebhook(rawBody, req.headers);
    await handleClerkWebhook(payload);
    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    if (err instanceof WebhookVerificationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[clerk webhook]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
