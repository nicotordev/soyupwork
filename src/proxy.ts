import { shouldCheckPlatformGate } from "@/lib/platform/gate";
import {
  DEFAULT_AUTHENTICATED_REDIRECT,
  isGuestOnlyAuthPath,
  isLinkAccountPath,
} from "@/lib/auth/guest-auth-routes";
import { resolveSafeAppRedirectPath } from "@/lib/auth/redirect-url";
import {
  isPublicWaitlistMode,
  isStaffSignInBypass,
} from "@/lib/platform/public-waitlist-mode";
import type { PlatformGateAction } from "@/types/platform-settings.types";
import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const isPublicRoute = (pathname: string) =>
  pathname.startsWith("/api/webhooks") ||
  pathname.startsWith("/api/auth") ||
  pathname.startsWith("/sign-out") ||
  pathname.startsWith("/maintenance");

const isInternalApiRoute = (pathname: string) =>
  pathname.startsWith("/api/internal");

const isAdminRoute = (pathname: string) => pathname.startsWith("/admin");

const isCourseLessonRoute = (pathname: string) =>
  /^\/courses\/[^/]+\/lessons\/[^/]+/.test(pathname);

async function fetchPlatformGateAction(
  origin: string,
  pathname: string,
  userId: string | null,
): Promise<PlatformGateAction> {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return "none";

  const url = new URL("/api/internal/platform-gate", origin);
  url.searchParams.set("pathname", pathname);
  if (userId) {
    url.searchParams.set("userId", userId);
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

async function fetchIsAdmin(origin: string, userId: string): Promise<boolean> {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return false;

  const url = new URL("/api/internal/admin-access", origin);
  url.searchParams.set("userId", userId);

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

function buildSignInRedirect(reqUrl: URL, returnPath: string): URL {
  const signInUrl = new URL("/sign-in", reqUrl);
  signInUrl.searchParams.set("redirect_url", returnPath);
  return signInUrl;
}

async function handleProtectedRoutes(
  req: NextRequest,
  pathname: string,
  userId: string | null,
): Promise<NextResponse> {
  if (isAdminRoute(pathname)) {
    if (!userId) {
      if (isPublicWaitlistMode()) {
        return NextResponse.redirect(
          new URL("/sign-in?access=staff&redirect_url=/admin", req.url),
        );
      }

      return NextResponse.redirect(buildSignInRedirect(req.nextUrl, "/admin"));
    }

    const isAdmin = await fetchIsAdmin(req.nextUrl.origin, userId);
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isCourseLessonRoute(pathname) && !userId) {
    return NextResponse.redirect(buildSignInRedirect(req.nextUrl, pathname));
  }

  return NextResponse.next();
}

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;
  const userId = req.auth?.user?.id ?? null;

  if (isInternalApiRoute(pathname)) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (isGuestOnlyAuthPath(pathname)) {
    if (userId && !isLinkAccountPath(pathname)) {
      const authenticatedRedirect =
        pathname.startsWith("/sign-in") &&
        isStaffSignInBypass(req.nextUrl.searchParams)
          ? resolveSafeAppRedirectPath(
              req.nextUrl.searchParams.get("redirect_url"),
              DEFAULT_AUTHENTICATED_REDIRECT,
            )
          : DEFAULT_AUTHENTICATED_REDIRECT;

      return NextResponse.redirect(new URL(authenticatedRedirect, req.url));
    }

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

    return NextResponse.next();
  }

  if (shouldCheckPlatformGate(pathname)) {
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

  return handleProtectedRoutes(req, pathname, userId);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
