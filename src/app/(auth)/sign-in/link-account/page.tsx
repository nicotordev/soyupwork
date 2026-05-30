import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { LinkAccountView } from "@/components/auth/link-account-view.client";
import { isOAuthLinkProvider } from "@/lib/auth/oauth-providers";
import {
  isPublicWaitlistMode,
  isStaffSignInBypass,
} from "@/lib/platform/public-waitlist-mode";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import { linkAccountParamsSchema } from "@/schemas/auth";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Vincular cuenta | SoyUpwork",
  description:
    "Confirmá tu identidad para vincular Google o GitHub con tu cuenta existente.",
  robots: { index: false, follow: false },
};

type LinkAccountPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LinkAccountPage({
  searchParams,
}: LinkAccountPageProps) {
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

  const parsed = linkAccountParamsSchema.safeParse({
    provider: query.get("provider"),
    email: query.get("email"),
  });

  if (!parsed.success || !isOAuthLinkProvider(parsed.data.provider)) {
    return (
      <AuthSplitLayout variant="link-account">
        <div className="space-y-4 rounded-xl border-2 border-foreground bg-card p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Enlace inválido
          </h2>
          <p className="text-sm text-muted-foreground">
            No pudimos iniciar el proceso de vinculación. Volvé a intentar desde
            el inicio de sesión con Google o GitHub.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex min-h-11 items-center justify-center font-semibold underline"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </AuthSplitLayout>
    );
  }

  const settings = await getPlatformSettings();

  return (
    <AuthSplitLayout variant="link-account">
      <Suspense fallback={null}>
        <LinkAccountView
          provider={parsed.data.provider}
          email={parsed.data.email.trim().toLowerCase()}
          defaultCallbackUrl={settings.afterSignInUrl}
        />
      </Suspense>
    </AuthSplitLayout>
  );
}
