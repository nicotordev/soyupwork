import { isAdminByUserId } from "@/lib/auth/admin";
import apiResponse from "@/lib/api/api-response";

export async function GET(request: Request) {
  const secret = process.env.INTERNAL_API_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return apiResponse.unauthorized();
  }

  const userId = new URL(request.url).searchParams.get("userId");

  if (!userId) {
    return apiResponse.badRequest(undefined, "userId is required");
  }

  const isAdmin = await isAdminByUserId(userId);

  return apiResponse.success({ isAdmin }, "Success", {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
