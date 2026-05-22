"use client";

import { CatalogMobileSection } from "@/components/marketing-nav/catalog-mobile-section";
import { NavAuthButtons } from "@/components/marketing-nav/nav-auth-buttons";
import { NavLinkList } from "@/components/marketing-nav/nav-link-list";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navSections } from "@/data/nav-data";
import { IconMenu2 } from "@tabler/icons-react";

type MobileNavProps = {
  isSignedIn: boolean;
};

export function MobileNav({ isSignedIn }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="border-2 border-foreground bg-background text-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-y-[2px] transition-all size-9 flex items-center justify-center"
        >
          <IconMenu2 className="size-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-sm border-l-2 border-foreground bg-background shadow-[-4px_0px_0px_0px_var(--foreground)] p-6"
      >
        <SheetHeader className="p-0 pb-4 border-b-2 border-foreground">
          <SheetTitle className="font-heading text-lg font-bold tracking-tight">SoyUpwork</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-6">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-3">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">{section.label}</p>
              {section.label === "Catálogo" ? (
                <CatalogMobileSection />
              ) : (
                <NavLinkList items={section.items} />
              )}
            </div>
          ))}
          <NavAuthButtons
            layout="column"
            className="border-t-2 border-dashed border-foreground/35 pt-5"
            isSignedIn={isSignedIn}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
