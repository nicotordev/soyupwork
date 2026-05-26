"use client";

import {
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import type { ReactNode } from "react";

type SettingsPanelProps = {
  icon: ReactNode;
  title: string;
  description: string;
  headerAction?: ReactNode;
  children: ReactNode;
};

export function SettingsPanel({
  icon,
  title,
  description,
  headerAction,
  children,
}: SettingsPanelProps) {
  return (
    <section className={adminPanelClass}>
      <div className={adminPanelHeaderClass}>
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <h2 className={adminPanelTitleClass}>{title}</h2>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {headerAction}
      </div>
      {children}
    </section>
  );
}
