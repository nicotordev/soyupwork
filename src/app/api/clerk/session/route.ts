import apiResponse from "@/lib/api/api-response";
import { getClerkSession } from "@/lib/clerk/session";

/** Para clientes que necesitan fetch (extensiones, scripts). En layouts/RSC usa getClerkSession() directo. */
export async function GET() {
  const { userId, sessionId, isSignedIn } = await getClerkSession();

  if (!isSignedIn) {
    return apiResponse.unauthorized({ isSignedIn: false });
  }

  return apiResponse.success({ isSignedIn: true, userId, sessionId });
}
