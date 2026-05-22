"use client";

import { CatalogDropdownContent } from "@/components/marketing-nav/catalog-dropdown-content";
import { navSections } from "@/data/nav-data";
import { NavDropdownContent } from "@/components/marketing-nav/nav-dropdown-content";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function DesktopNav() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {navSections.map((section) => (
          <NavigationMenuItem key={section.label}>
            <NavigationMenuTrigger className="font-mono text-xs font-bold uppercase tracking-wider border-2 border-transparent bg-transparent hover:border-foreground hover:bg-secondary px-3 py-1.5 transition-all rounded-md data-[state=open]:border-foreground data-[state=open]:bg-secondary data-[state=open]:shadow-[2px_2px_0px_0px_var(--foreground)]">
              {section.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              {section.label === "Catálogo" ? (
                <CatalogDropdownContent />
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
