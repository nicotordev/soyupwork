import apiResponse from "@/lib/api/api-response";
import { getTurnstileDiagnostics } from "@/lib/turnstile/diagnostics";

export async function GET(request: Request) {
  const secret = process.env.INTERNAL_API_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return apiResponse.unauthorized();
  }

  const host = request.headers.get("host");
  const forwardedHost = request.headers.get("x-forwarded-host");

  const diagnostics = await getTurnstileDiagnostics(host, forwardedHost);

  return apiResponse.success(diagnostics, "Turnstile diagnostics", {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
