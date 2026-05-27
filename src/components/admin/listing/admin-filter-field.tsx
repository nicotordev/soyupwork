"use client";

import { adminInputClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AdminFilterFieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function AdminFilterField({
  label,
  children,
  className,
}: AdminFilterFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

export const adminFilterSelectTriggerClass = cn(
  adminInputClass,
  "h-9 w-full font-mono text-xs font-bold uppercase",
);
