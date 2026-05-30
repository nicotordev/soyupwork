import apiResponse from "@/lib/api/api-response";
import { resolvePlatformGateAction } from "@/lib/platform/gate";
import type { PlatformGateAction } from "@/types/platform-settings.types";

export async function GET(request: Request) {
  const secret = process.env.INTERNAL_API_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return apiResponse.unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get("pathname") ?? "/";
  const userId = searchParams.get("userId");

  const action: PlatformGateAction = await resolvePlatformGateAction(
    pathname,
    userId,
  );

  return apiResponse.success({ action }, "Success", {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
