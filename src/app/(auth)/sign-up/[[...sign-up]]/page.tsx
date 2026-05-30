import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { isPublicWaitlistMode } from "@/lib/platform/public-waitlist-mode";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Crear cuenta | SoyUpwork",
  description:
    "Regístrate en SoyUpwork para acceder a cursos, tu panel y el catálogo de la academia.",
};

export default async function SignUpPage() {
  if (isPublicWaitlistMode()) {
    redirect("/waitlist");
  }

  const settings = await getPlatformSettings();

  if (!settings.registrationsOpen) {
    redirect(settings.waitlistMode ? "/waitlist" : "/sign-in");
  }

  return (
    <AuthSplitLayout variant="sign-up">
      <SignUpForm
        allowOAuthSignIn={settings.allowOAuthSignIn}
        defaultCallbackUrl={settings.afterSignUpUrl}
      />
    </AuthSplitLayout>
  );
}
