import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { clerkSignInAppearance } from "@/lib/clerk/appearance";
import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión | SoyUpwork",
  description:
    "Accede a tu cuenta de SoyUpwork para continuar con tus cursos y tu panel de estudiante.",
};

export default function SignInPage() {
  return (
    <AuthSplitLayout variant="sign-in">
      <SignIn
        appearance={clerkSignInAppearance}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
      />
    </AuthSplitLayout>
  );
}
