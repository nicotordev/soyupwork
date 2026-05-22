import type { TablerIcon } from "@tabler/icons-react";
import type { ReactNode } from "react";

type SectionLabelProps = {
  icon: TablerIcon;
  children: ReactNode;
};

export function SectionLabel({ icon: Icon, children }: SectionLabelProps) {
  return (
    <h4 className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
      <Icon className="size-3.5 shrink-0 text-foreground" stroke={2} />
      {children}
    </h4>
  );
}
