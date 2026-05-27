"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AdminCardGridProps = {
  children: ReactNode;
  className?: string;
  columns?: "default" | "compact" | "wide";
};

const columnClass: Record<NonNullable<AdminCardGridProps["columns"]>, string> = {
  default:
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  compact: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  wide: "grid-cols-1 md:grid-cols-2",
};

export function AdminCardGrid({
  children,
  className,
  columns = "default",
}: AdminCardGridProps) {
  return (
    <div
      className={cn("grid gap-4 md:gap-6", columnClass[columns], className)}
      role="list"
    >
      {children}
    </div>
  );
}
