"use client";

import { CatalogViewAllButton } from "@/components/marketing-nav/catalog-view-all-button";
import { SectionLabel } from "@/components/marketing-nav/section-label";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { catalogDescription } from "@/data/nav-data";
import type { CatalogSection, NavItem } from "@/types/marketing-nav.types";
import { IconSchool } from "@tabler/icons-react";
import Link from "next/link";

function CatalogNavLink({ item }: { item: NavItem }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={item.href}
        className="block rounded border border-transparent px-2.5 py-1 text-xs transition-all hover:border-foreground hover:bg-secondary hover:translate-x-[1px] hover:translate-y-[1px]"
      >
        {item.title}
      </Link>
    </NavigationMenuLink>
  );
}

type CatalogDropdownContentProps = {
  catalogSections: CatalogSection[];
};

export function CatalogDropdownContent({
  catalogSections,
}: CatalogDropdownContentProps) {
  return (
    <div className="w-[36rem] p-5">
      <div className="mb-5 max-w-md space-y-3.5">
        <h3 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded border-2 border-foreground bg-secondary">
            <IconSchool className="size-4 text-primary" stroke={2.5} />
          </span>
          Catálogo
        </h3>
        <p className="text-xs/relaxed text-muted-foreground">
          {catalogDescription}
        </p>
        <CatalogViewAllButton />
      </div>

      <div className="grid grid-cols-3 gap-6 border-t-2 border-dashed border-foreground/35 pt-5">
        {catalogSections.map((section) => (
          <div key={section.title} className="space-y-3">
            <SectionLabel icon={section.icon}>{section.title}</SectionLabel>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <CatalogNavLink item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
