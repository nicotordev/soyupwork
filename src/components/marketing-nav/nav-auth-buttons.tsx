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
        layout === "column" ? "flex flex-col gap-2.5 w-full" : "flex items-center gap-3",
      )}
    >
      <Button
        asChild
        variant="outline"
        className="w-full border-2 border-foreground bg-background text-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-y-[2px] transition-all font-mono text-xs font-bold uppercase tracking-wider"
      >
        <Link href="/dashboard">Panel</Link>
      </Button>
      <div className="flex items-center justify-center h-9 w-9 rounded-full border-2 border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)] overflow-hidden shrink-0">
        <UserButton />
      </div>
    </div>
  );
}

function SignedOutActions({ layout }: { layout: "row" | "column" }) {
  return (
    <div
      className={cn(
        layout === "column" ? "flex flex-col gap-2.5 w-full" : "flex items-center gap-3",
      )}
    >
      <Button
        variant="outline"
        asChild
        className="w-full border-2 border-foreground bg-background text-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-y-[2px] transition-all font-mono text-xs font-bold uppercase tracking-wider"
      >
        <Link href="/sign-in">Iniciar sesión</Link>
      </Button>
      <Button
        asChild
        className="w-full border-2 border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-y-[2px] transition-all font-mono text-xs font-bold uppercase tracking-wider"
      >
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
    layout === "column" ? "flex flex-col gap-2" : "flex items-center gap-2",
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
