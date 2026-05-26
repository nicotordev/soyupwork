import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { shouldCheckPlatformGate } from "@/lib/platform-settings/platform-gate-paths";
import type { PlatformGateAction } from "@/types/platform-settings.types";

const isPublicRoute = createRouteMatcher(["/api/webhooks(.*)"]);
const isInternalApiRoute = createRouteMatcher(["/api/internal(.*)"]);

async function fetchPlatformGateAction(
  origin: string,
  pathname: string,
  clerkUserId: string | null,
): Promise<PlatformGateAction> {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return "none";

  const url = new URL("/api/internal/platform-gate", origin);
  url.searchParams.set("pathname", pathname);
  if (clerkUserId) {
    url.searchParams.set("clerkUserId", clerkUserId);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: { authorization: `Bearer ${secret}` },
      cache: "no-store",
    });

    if (!response.ok) return "none";

    const data = (await response.json()) as { action?: PlatformGateAction };
    return data.action ?? "none";
  } catch {
    return "none";
  }
}

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req) || isInternalApiRoute(req)) {
    return;
  }

  const pathname = req.nextUrl.pathname;

  if (shouldCheckPlatformGate(pathname)) {
    const { userId } = await auth();
    const action = await fetchPlatformGateAction(
      req.nextUrl.origin,
      pathname,
      userId,
    );

    if (action === "maintenance") {
      return NextResponse.redirect(new URL("/maintenance", req.url));
    }

    if (action === "waitlist") {
      return NextResponse.redirect(new URL("/waitlist", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/(.*)",
    "/(api|trpc)(.*)",
  ],
};
