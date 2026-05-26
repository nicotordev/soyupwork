import { isAdminByClerkId } from "@/lib/admin/require-admin";
import apiResponse from "@/lib/api/api-response";

export async function GET(request: Request) {
  const secret = process.env.INTERNAL_API_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return apiResponse.unauthorized();
  }

  const clerkUserId = new URL(request.url).searchParams.get("clerkUserId");

  if (!clerkUserId) {
    return apiResponse.badRequest(undefined, "clerkUserId is required");
  }

  const isAdmin = await isAdminByClerkId(clerkUserId);

  return apiResponse.success({ isAdmin }, "Success", {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
