import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { SignOutView } from "@/components/auth/sign-out-view.client";
import { getClerkSession } from "@/lib/clerk/session";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Cerrar sesión | SoyUpwork",
  description:
    "Cierra tu sesión de SoyUpwork de forma segura. Tu progreso queda guardado.",
  robots: { index: false, follow: false },
};

type SignOutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function resolveRedirectUrl(candidate: string): string | null {
  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return null;
  }

  return candidate;
}

function getDefaultAfterSignOutUrl(): string {
  return process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL ?? "/";
}

export default async function SignOutPage({ searchParams }: SignOutPageProps) {
  const params = await searchParams;
  const explicitRedirect =
    typeof params.redirect_url === "string"
      ? resolveRedirectUrl(params.redirect_url)
      : null;
  const { isSignedIn } = await getClerkSession();

  if (!isSignedIn) {
    redirect(explicitRedirect ?? getDefaultAfterSignOutUrl());
  }

  return (
    <AuthSplitLayout variant="sign-out">
      <SignOutView redirectUrl={explicitRedirect ?? undefined} />
    </AuthSplitLayout>
  );
}
