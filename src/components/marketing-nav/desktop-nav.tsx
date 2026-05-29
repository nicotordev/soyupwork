"use client";

import { CatalogDropdownContent } from "@/components/marketing-nav/catalog-dropdown-content";
import { NavDropdownContent } from "@/components/marketing-nav/nav-dropdown-content";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { navSections } from "@/data/nav-data";
import type { CatalogSection } from "@/types/marketing-nav.types";

type DesktopNavProps = {
  catalogSections: CatalogSection[];
  isLoadingCatalogSections?: boolean;
};

export function DesktopNav({
  catalogSections,
  isLoadingCatalogSections,
}: DesktopNavProps) {
  if (isLoadingCatalogSections) {
    return (
      <NavigationMenu className="hidden w-full max-w-none flex-1 lg:flex">
        <NavigationMenuList className="w-full">
          <NavigationMenuItem className="w-full flex-1">
            <NavigationMenuTrigger className="w-full justify-center font-mono text-xs font-bold uppercase tracking-wider border-2 border-transparent bg-transparent hover:border-foreground hover:bg-secondary px-3 py-1.5 transition-all rounded-md data-[state=open]:border-foreground data-[state=open]:bg-secondary data-[state=open]:shadow-[2px_2px_0px_0px_var(--foreground)]">
              <Skeleton className="w-24 h-4" />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[36rem] p-5">
                <div className="mb-5 max-w-md space-y-3.5">
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-4 w-72" />
                  <Skeleton className="h-8 w-40" />
                </div>
                <div className="grid grid-cols-3 gap-6 border-t-2 border-dashed border-foreground/35 pt-5">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="space-y-3">
                      <Skeleton className="h-5 w-24" />
                      <ul className="space-y-1">
                        {[...Array(4)].map((_, i2) => (
                          <li key={i2}>
                            <Skeleton className="h-6 w-28" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  const sections = navSections.map((section) =>
    section.label === "Catálogo"
      ? { ...section, items: catalogSections.flatMap((s) => s.items) }
      : section,
  );

  return (
    <NavigationMenu className="hidden w-full max-w-none flex-1 lg:flex">
      <NavigationMenuList className="w-full">
        {sections.map((section) => (
          <NavigationMenuItem key={section.label} className="w-full flex-1">
            <NavigationMenuTrigger className="w-full justify-center font-mono text-xs font-bold uppercase tracking-wider border-2 border-transparent bg-transparent hover:border-foreground hover:bg-secondary px-3 py-1.5 transition-all rounded-md data-[state=open]:border-foreground data-[state=open]:bg-secondary data-[state=open]:shadow-[2px_2px_0px_0px_var(--foreground)]">
              {section.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              {section.label === "Catálogo" ? (
                <CatalogDropdownContent catalogSections={catalogSections} />
              ) : (
                <NavDropdownContent items={section.items} />
              )}
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
