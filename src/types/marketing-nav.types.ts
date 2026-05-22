import type { TablerIcon } from "@tabler/icons-react";

export type NavItem = {
  title: string;
  href: string;
  description?: string;
};

export type CatalogSection = {
  title: string;
  icon: TablerIcon;
  items: NavItem[];
};

export type NavSection = {
  label: string;
  items: readonly NavItem[];
};
