"use client";

import { DesktopNav } from "@/components/marketing-nav/desktop-nav";
import { MobileNav } from "@/components/marketing-nav/mobile-nav";
import { NavAuthButtons } from "@/components/marketing-nav/nav-auth-buttons";
import { cn } from "@/lib/utils";
import type { CatalogSection } from "@/types/marketing-nav.types";
import Link from "next/link";

type MarketingNavProps = {
  /** Resuelto en servidor con auth() para que los botones salgan en el HTML inicial. */
  isSignedIn: boolean;
  catalogSections: CatalogSection[];
  isLoadingCatalogSections?: boolean;
};

export function MarketingNav({
  isSignedIn,
  catalogSections,
  isLoadingCatalogSections = false,
}: MarketingNavProps) {
  return (
    <header
      className={cn(
        "sticky top-0 w-full z-50 border-b-2 border-foreground bg-background transition-all duration-200",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-4 sm:px-6 lg:gap-3 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center justify-start">
          <Link
            href="/"
            className="shrink-0 font-heading text-sm md:text-base font-extrabold tracking-tight border-2 border-foreground bg-secondary px-3 py-1 shadow-[2px_2px_0px_0px_var(--foreground)] rounded transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-y-[2px]"
          >
            SoyUpwork
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center">
          <DesktopNav
            catalogSections={catalogSections}
            isLoadingCatalogSections={isLoadingCatalogSections}
          />
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <NavAuthButtons className="hidden lg:flex" isSignedIn={isSignedIn} />
          <MobileNav
            className="lg:hidden"
            isSignedIn={isSignedIn}
            catalogSections={catalogSections}
            isLoadingCatalogSections={isLoadingCatalogSections}
          />
        </div>
      </div>
    </header>
  );
}
