import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { clerkSignUpAppearance } from "@/lib/clerk/appearance";
import { isPublicWaitlistMode } from "@/lib/platform/public-waitlist-mode";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import { SignUp } from "@clerk/nextjs";
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
      <SignUp
        appearance={clerkSignUpAppearance}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
      />
    </AuthSplitLayout>
  );
}
