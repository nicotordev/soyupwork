"use client";

import type { NavItem } from "@/types/marketing-nav.types";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import Link from "next/link";

type NavDropdownContentProps = {
  items: readonly NavItem[];
};

export function NavDropdownContent({ items }: NavDropdownContentProps) {
  return (
    <ul className="grid gap-1.5 p-3 md:w-80 bg-card">
      {items.map((item) => (
        <li key={item.href}>
          <NavigationMenuLink asChild>
            <Link
              href={item.href}
              className="block rounded border-2 border-transparent p-2.5 transition-all hover:border-foreground hover:bg-secondary hover:shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-y-[-1px] group"
            >
              <span className="flex flex-col gap-1">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </span>
                {item.description ? (
                  <span className="text-[11px] leading-normal text-muted-foreground">
                    {item.description}
                  </span>
                ) : null}
              </span>
            </Link>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}
