"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CATEGORY_ICON_OPTIONS,
  resolveCategoryIcon,
  type CategoryIconName,
} from "@/constants/category-icons.constants";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { CreateCategoryInput } from "@/schemas/category";
import { IconCategory, IconSearch, IconX } from "@tabler/icons-react";
import { useMemo, useState } from "react";

type CategoryIconPickerProps = {
  value: CreateCategoryInput["icon"];
  onChange: (value: CreateCategoryInput["icon"]) => void;
  id?: string;
};

export function CategoryIconPicker({
  value,
  onChange,
  id,
}: CategoryIconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const SelectedIcon = resolveCategoryIcon(value) ?? IconCategory;
  const selectedLabel =
    CATEGORY_ICON_OPTIONS.find((option) => option.name === value)?.label ??
    null;

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return CATEGORY_ICON_OPTIONS;

    return CATEGORY_ICON_OPTIONS.filter(
      (option) =>
        option.label.toLowerCase().includes(normalized) ||
        option.name.toLowerCase().includes(normalized),
    );
  }, [query]);

  const handleSelect = (iconName: CategoryIconName) => {
    onChange(iconName);
    setOpen(false);
    setQuery("");
  };

  const handleClear = () => {
    onChange("");
    setOpen(false);
    setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            adminInputClass,
            "flex h-auto min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-muted/40",
          )}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded border-2 border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)]">
            <SelectedIcon
              className={cn(
                "size-4",
                value ? "text-primary" : "text-muted-foreground",
              )}
              stroke={2.25}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-xs font-bold uppercase">
              {selectedLabel ?? "Elegir icono"}
            </span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {value || "Opcional · se muestra en catálogo y filtros"}
            </span>
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className={cn(
          adminPanelClass,
          "w-[min(22rem,calc(100vw-2rem))] gap-0 overflow-hidden border-2 border-foreground bg-background p-0 shadow-[6px_6px_0px_0px_var(--foreground)]",
        )}
      >
        <div className="space-y-3 border-b-2 border-foreground p-3">
          <div className="relative">
            <IconSearch
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              stroke={2.25}
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar icono..."
              className={cn(adminInputClass, "h-9 pl-8 font-mono text-xs")}
            />
          </div>
          {value ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className={cn(adminBrutalButtonClass, "w-full")}
            >
              <IconX stroke={2.25} />
              Quitar icono
            </Button>
          ) : null}
        </div>

        <ScrollArea className="h-64">
          {filteredOptions.length === 0 ? (
            <p className="p-4 text-center text-xs text-muted-foreground">
              No hay iconos para esa búsqueda.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2 p-3">
              {filteredOptions.map((option) => {
                const Icon = resolveCategoryIcon(option.name) ?? IconCategory;
                const isSelected = value === option.name;

                return (
                  <button
                    key={option.name}
                    type="button"
                    title={option.label}
                    aria-label={option.label}
                    aria-pressed={isSelected}
                    onClick={() => handleSelect(option.name)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded border-2 px-1 py-2 transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-[2px_2px_0px_0px_var(--primary)]"
                        : "border-foreground/20 bg-background hover:border-foreground hover:bg-muted/40 hover:shadow-[2px_2px_0px_0px_var(--foreground)]",
                    )}
                  >
                    <Icon className="size-5 text-primary" stroke={2.25} />
                    <span className="line-clamp-2 text-center text-[9px] font-mono font-bold uppercase leading-tight text-wrap whitespace-normal max-w-full">
                      <span className="block">{option.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
