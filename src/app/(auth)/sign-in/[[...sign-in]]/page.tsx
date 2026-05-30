import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { SignInForm } from "@/components/auth/sign-in-form";
import {
  isPublicWaitlistMode,
  isStaffSignInBypass,
} from "@/lib/platform/public-waitlist-mode";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Iniciar sesión | SoyUpwork",
  description:
    "Accede a tu cuenta de SoyUpwork para continuar con tus cursos y tu panel de estudiante.",
};

type SignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const query = {
    get(name: string) {
      const value = params[name];
      return typeof value === "string" ? value : null;
    },
  };

  if (isPublicWaitlistMode() && !isStaffSignInBypass(query)) {
    redirect("/waitlist");
  }

  const settings = await getPlatformSettings();

  return (
    <AuthSplitLayout variant="sign-in">
      <Suspense fallback={null}>
        <SignInForm
          allowOAuthSignIn={settings.allowOAuthSignIn}
          defaultCallbackUrl={settings.afterSignInUrl}
          signUpUrl={isPublicWaitlistMode() ? "/waitlist" : "/sign-up"}
        />
      </Suspense>
    </AuthSplitLayout>
  );
}
