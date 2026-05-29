import { shouldCheckPlatformGate } from "@/lib/platform/gate";
import {
  isPublicWaitlistMode,
  isStaffSignInBypass,
} from "@/lib/platform/public-waitlist-mode";
import type { PlatformGateAction } from "@/types/platform-settings.types";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/api/webhooks(.*)"]);
const isInternalApiRoute = createRouteMatcher(["/api/internal(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isCourseLessonRoute = createRouteMatcher([
  "/courses/:courseSlug/lessons/:lessonSlug(.*)",
]);

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

    const body = (await response.json()) as {
      data?: { action?: PlatformGateAction };
    };
    return body.data?.action ?? "none";
  } catch {
    return "none";
  }
}

async function fetchIsAdmin(
  origin: string,
  clerkUserId: string,
): Promise<boolean> {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return false;

  const url = new URL("/api/internal/admin-access", origin);
  url.searchParams.set("clerkUserId", clerkUserId);

  try {
    const response = await fetch(url.toString(), {
      headers: { authorization: `Bearer ${secret}` },
      cache: "no-store",
    });

    if (!response.ok) return false;

    const body = (await response.json()) as {
      data?: { isAdmin?: boolean };
    };
    return body.data?.isAdmin ?? false;
  } catch {
    return false;
  }
}

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req) || isInternalApiRoute(req)) {
    return;
  }

  const pathname = req.nextUrl.pathname;

  if (isPublicWaitlistMode()) {
    if (pathname.startsWith("/sign-up")) {
      return NextResponse.redirect(new URL("/waitlist", req.url));
    }

    if (
      pathname.startsWith("/sign-in") &&
      !isStaffSignInBypass(req.nextUrl.searchParams)
    ) {
      return NextResponse.redirect(new URL("/waitlist", req.url));
    }
  }

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

  if (isAdminRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = isPublicWaitlistMode()
        ? "/sign-in?access=staff&redirect_url=/admin"
        : "/sign-in";
      return NextResponse.redirect(new URL(signInUrl, req.url));
    }

    const isAdmin = await fetchIsAdmin(req.nextUrl.origin, userId);
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isCourseLessonRoute(req)) {
    await auth.protect();
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
