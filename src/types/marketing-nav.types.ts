export type NavItem = {
  title: string;
  href: string;
  description?: string;
};

/** Serializable icon id for catalog nav sections (resolved in client UI). */
export type CatalogNavIconKey = "topics" | "free" | "trending";

export type CatalogSection = {
  title: string;
  iconKey: CatalogNavIconKey;
  items: NavItem[];
};

export type NavSection = {
  label: string;
  items: readonly NavItem[];
};
