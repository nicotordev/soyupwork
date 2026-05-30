"use client";

import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/user-menu";
import { MARKETING_PAGE } from "@/constants/marketing.constants";
import { isPublicWaitlistMode } from "@/lib/platform/public-waitlist-mode";
import { cn } from "@/lib/utils";
import Link from "next/link";

type NavAuthButtonsProps = {
  className?: string;
  layout?: "row" | "column";
  isSignedIn: boolean;
};

function SignedInActions({ layout }: { layout: "row" | "column" }) {
  return (
    <div
      className={cn(
        layout === "column"
          ? "flex w-full flex-col gap-2.5"
          : "flex items-center gap-3",
      )}
    >
      <Button
        asChild
        variant="outline"
        className={layout === "column" ? "w-full" : undefined}
      >
        <Link href="/dashboard">Panel</Link>
      </Button>
      <UserMenu />
    </div>
  );
}

function WaitlistActions({ layout }: { layout: "row" | "column" }) {
  return (
    <div
      className={cn(
        layout === "column"
          ? "flex w-full flex-col gap-2.5"
          : "flex items-center gap-3",
      )}
    >
      <Button asChild className={layout === "column" ? "w-full" : undefined}>
        <Link href="/waitlist">{MARKETING_PAGE.hero.ctaPrimary}</Link>
      </Button>
    </div>
  );
}

function SignedOutActions({ layout }: { layout: "row" | "column" }) {
  if (isPublicWaitlistMode()) {
    return <WaitlistActions layout={layout} />;
  }

  return (
    <div
      className={cn(
        layout === "column"
          ? "flex w-full flex-col gap-2.5"
          : "flex items-center gap-3",
      )}
    >
      <Button
        variant="outline"
        asChild
        className={layout === "column" ? "w-full" : undefined}
      >
        <Link href="/sign-in">Iniciar sesión</Link>
      </Button>
      <Button asChild className={layout === "column" ? "w-full" : undefined}>
        <Link href="/sign-up">Registrarse</Link>
      </Button>
    </div>
  );
}

export function NavAuthButtons({
  className,
  layout = "row",
  isSignedIn,
}: NavAuthButtonsProps) {
  const shellClass = cn(
    layout === "column"
      ? "flex w-full flex-col gap-2"
      : "flex items-center gap-2",
    className,
  );

  return (
    <div className={shellClass}>
      {isSignedIn ? (
        <SignedInActions layout={layout} />
      ) : (
        <SignedOutActions layout={layout} />
      )}
    </div>
  );
}
