"use client";

import { DesktopNav } from "@/components/marketing-nav/desktop-nav";
import { MobileNav } from "@/components/marketing-nav/mobile-nav";
import { NavAuthButtons } from "@/components/marketing-nav/nav-auth-buttons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

type MarketingNavProps = {
  /** Resuelto en servidor con auth() para que los botones salgan en el HTML inicial. */
  isSignedIn: boolean;
};

export function MarketingNav({ isSignedIn }: MarketingNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b-2 border-foreground bg-background transition-all duration-200",
        scrolled && "shadow-[0_4px_0px_0px_var(--foreground)]",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 font-heading text-sm md:text-base font-extrabold tracking-tight border-2 border-foreground bg-secondary px-3 py-1 shadow-[2px_2px_0px_0px_var(--foreground)] rounded transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-y-[2px]"
        >
          SoyUpwork
        </Link>

        <div className="flex flex-1 justify-center">
          <DesktopNav />
        </div>

        <NavAuthButtons className="hidden lg:flex" isSignedIn={isSignedIn} />

        <MobileNav isSignedIn={isSignedIn} />
      </div>
    </header>
  );
}
