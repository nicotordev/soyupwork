import { resolvePlatformGateAction } from "@/lib/platform-settings/platform-gate";
import type { PlatformGateAction } from "@/types/platform-settings.types";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  const secret = process.env.INTERNAL_API_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get("pathname") ?? "/";
  const clerkUserId = searchParams.get("clerkUserId");

  const action: PlatformGateAction = await resolvePlatformGateAction(
    pathname,
    clerkUserId,
  );

  return Response.json(
    { action },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
