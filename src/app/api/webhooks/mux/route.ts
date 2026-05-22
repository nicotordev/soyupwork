import { handleMuxWebhook } from "@/lib/webhooks/handlers/mux";
import {
  WebhookVerificationError,
  verifyMuxWebhook,
} from "@/lib/webhooks/verify-mux";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("mux-signature");

  try {
    const payload = verifyMuxWebhook(rawBody, signature);
    await handleMuxWebhook(payload);
    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    if (err instanceof WebhookVerificationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[mux webhook]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
