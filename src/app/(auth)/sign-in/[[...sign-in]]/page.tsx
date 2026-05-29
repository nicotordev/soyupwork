import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { clerkSignInAppearance } from "@/lib/clerk/appearance";
import {
  isPublicWaitlistMode,
  isStaffSignInBypass,
} from "@/lib/platform/public-waitlist-mode";
import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

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

  return (
    <AuthSplitLayout variant="sign-in">
      <SignIn
        appearance={clerkSignInAppearance}
        routing="path"
        path="/sign-in"
        signUpUrl={isPublicWaitlistMode() ? "/waitlist" : "/sign-up"}
      />
    </AuthSplitLayout>
  );
}
