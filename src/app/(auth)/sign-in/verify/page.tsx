import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { IconMail } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Revisá tu correo | SoyUpwork",
  description: "Te enviamos un enlace para iniciar sesión de forma segura.",
  robots: { index: false, follow: false },
};

type VerifySignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VerifySignInPage({
  searchParams,
}: VerifySignInPageProps) {
  const params = await searchParams;
  const email =
    typeof params.email === "string" ? params.email.trim() : undefined;

  return (
    <AuthSplitLayout variant="sign-in">
      <div
        className={cn(
          adminPanelClass,
          "space-y-6 border-2 border-foreground p-6 sm:p-8 text-center",
        )}
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-foreground bg-primary/10">
          <IconMail className="size-7 text-primary" stroke={2} aria-hidden />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Revisá tu correo
          </h2>
          <p className="text-sm text-muted-foreground">
            {email ? (
              <>
                Enviamos un enlace de acceso a{" "}
                <span className="font-semibold text-foreground">{email}</span>.
              </>
            ) : (
              "Te enviamos un enlace de acceso a tu correo."
            )}{" "}
            Hacé clic en el enlace para iniciar sesión. Expira en 1 hora.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          ¿No lo ves? Revisá spam o{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-foreground underline"
          >
            solicitá otro enlace
          </Link>
          .
        </p>
      </div>
    </AuthSplitLayout>
  );
}
