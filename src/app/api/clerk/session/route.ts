import { getClerkSession } from "@/lib/clerk/session";
import { NextResponse } from "next/server";

/** Para clientes que necesitan fetch (extensiones, scripts). En layouts/RSC usa getClerkSession() directo. */
export async function GET() {
  const { userId, sessionId, isSignedIn } = await getClerkSession();

  if (!isSignedIn) {
    return NextResponse.json({ isSignedIn: false }, { status: 401 });
  }

  return NextResponse.json({ isSignedIn: true, userId, sessionId });
}
