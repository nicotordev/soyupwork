import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { clerkSignUpAppearance } from "@/lib/clerk/appearance";
import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta | SoyUpwork",
  description:
    "Regístrate en SoyUpwork para acceder a cursos, tu panel y el catálogo de la academia.",
};

export default function SignUpPage() {
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
