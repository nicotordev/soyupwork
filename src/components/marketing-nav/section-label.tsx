import type { CatalogNavIconKey } from "@/types/marketing-nav.types";
import {
  IconGift,
  IconLayoutGrid,
  IconTrendingUp,
  type TablerIcon,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

const CATALOG_NAV_ICONS: Record<CatalogNavIconKey, TablerIcon> = {
  topics: IconLayoutGrid,
  free: IconGift,
  trending: IconTrendingUp,
};

type SectionLabelProps = {
  iconKey: CatalogNavIconKey;
  children: ReactNode;
};

export function SectionLabel({ iconKey, children }: SectionLabelProps) {
  const Icon = CATALOG_NAV_ICONS[iconKey];
  return (
    <h4 className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
      <Icon className="size-3.5 shrink-0 text-foreground" stroke={2} />
      {children}
    </h4>
  );
}
