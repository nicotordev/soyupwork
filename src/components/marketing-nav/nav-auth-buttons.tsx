"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
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
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)]">
        <UserButton />
      </div>
    </div>
  );
}

function SignedOutActions({ layout }: { layout: "row" | "column" }) {
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
