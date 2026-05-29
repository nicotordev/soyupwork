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

function resolveRedirectUrl(
  params: Record<string, string | string[] | undefined>,
): string {
  const value = params.redirect_url;
  const candidate = typeof value === "string" ? value : "/";

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/";
  }

  return candidate;
}

export default async function SignOutPage({ searchParams }: SignOutPageProps) {
  const params = await searchParams;
  const redirectUrl = resolveRedirectUrl(params);
  const { isSignedIn } = await getClerkSession();

  if (!isSignedIn) {
    redirect(redirectUrl);
  }

  return (
    <AuthSplitLayout variant="sign-out">
      <SignOutView redirectUrl={redirectUrl} />
    </AuthSplitLayout>
  );
}
