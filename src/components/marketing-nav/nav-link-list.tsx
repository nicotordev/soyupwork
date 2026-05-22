import type { NavItem } from "@/types/marketing-nav.types";
import { cn } from "@/lib/utils";
import Link from "next/link";

type NavLinkListProps = {
  items: readonly NavItem[];
  className?: string;
  linkClassName?: string;
};

export function NavLinkList({
  items,
  className,
  linkClassName,
}: NavLinkListProps) {
  return (
    <ul className={cn("space-y-1.5", className)}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={cn(
              "block rounded border border-transparent px-2.5 py-1.5 text-xs transition-all hover:border-foreground hover:bg-secondary hover:translate-x-[1px] hover:translate-y-[1px]",
              linkClassName,
            )}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
