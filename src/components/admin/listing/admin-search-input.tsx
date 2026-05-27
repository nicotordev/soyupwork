"use client";

import type { AdminSearchConfig } from "@/types/admin-listing.types";
import { adminInputClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

type AdminSearchInputProps = AdminSearchConfig & {
  className?: string;
};

export function AdminSearchInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  className,
}: AdminSearchInputProps) {
  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(adminInputClass, "h-9 pl-8 font-mono text-xs")}
        aria-label={ariaLabel}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="Limpiar búsqueda"
        >
          <X className="size-4" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
