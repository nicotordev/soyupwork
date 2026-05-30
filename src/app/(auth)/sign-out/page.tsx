import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { SignOutView } from "@/components/auth/sign-out-view.client";
import {
  getAfterSignOutUrl,
  resolveSafeAppRedirectPath,
} from "@/lib/auth/redirect-url";
import { getAuthSession } from "@/lib/auth/session";
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

export default async function SignOutPage({ searchParams }: SignOutPageProps) {
  const params = await searchParams;
  const explicitRedirect =
    typeof params.redirect_url === "string"
      ? resolveSafeAppRedirectPath(params.redirect_url, getAfterSignOutUrl())
      : null;
  const { isSignedIn } = await getAuthSession();

  if (!isSignedIn) {
    redirect(explicitRedirect ?? getAfterSignOutUrl());
  }

  return (
    <AuthSplitLayout variant="sign-out">
      <SignOutView redirectUrl={explicitRedirect ?? undefined} />
    </AuthSplitLayout>
  );
}
