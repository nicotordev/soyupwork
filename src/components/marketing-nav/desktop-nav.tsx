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
import { navSections } from "@/data/nav-data";
import type { CatalogSection } from "@/types/marketing-nav.types";

type DesktopNavProps = {
  catalogSections: CatalogSection[];
};

export function DesktopNav({ catalogSections }: DesktopNavProps) {
  const sections = navSections.map((section) =>
    section.label === "Catálogo"
      ? { ...section, items: catalogSections.flatMap((s) => s.items) }
      : section,
  );

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {sections.map((section) => (
          <NavigationMenuItem key={section.label}>
            <NavigationMenuTrigger className="font-mono text-xs font-bold uppercase tracking-wider border-2 border-transparent bg-transparent hover:border-foreground hover:bg-secondary px-3 py-1.5 transition-all rounded-md data-[state=open]:border-foreground data-[state=open]:bg-secondary data-[state=open]:shadow-[2px_2px_0px_0px_var(--foreground)]">
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
