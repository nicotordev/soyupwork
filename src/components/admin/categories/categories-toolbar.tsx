"use client";

import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type {
  AdminCategoriesPagination,
  ParsedAdminCategoriesParams,
} from "@/types/admin-category.types";
import { IconSearch, IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CategoriesToolbarProps = {
  filters: ParsedAdminCategoriesParams;
  pagination: AdminCategoriesPagination;
};

export function CategoriesToolbar({
  filters,
  pagination,
}: CategoriesToolbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [localQuery, setLocalQuery] = useState(filters.q);

  useEffect(() => {
    setLocalQuery(filters.q);
  }, [filters.q]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = localQuery.trim();

      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      params.delete("page");

      const nextQuery = params.toString();
      if (nextQuery === searchParams.toString()) return;

      startTransition(() => {
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
          scroll: false,
        });
      });
    }, 350);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchParams omitted to avoid loops
  }, [localQuery, pathname, router]);

  const clearFilters = () => {
    setLocalQuery("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const hasActiveFilters = filters.q.length > 0;

  return (
    <section
      className={cn(adminPanelClass, "mb-6 p-4", isPending && "opacity-70")}
      aria-label="Filtros de categorías"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1">
          <IconSearch
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            stroke={2.25}
          />
          <Input
            type="search"
            value={localQuery}
            onChange={(event) => setLocalQuery(event.target.value)}
            placeholder="Buscar por nombre o slug..."
            className={cn(adminInputClass, "h-9 pl-8 font-mono text-xs")}
            aria-label="Buscar categorías"
          />
          {localQuery ? (
            <button
              type="button"
              onClick={() => setLocalQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Limpiar búsqueda"
            >
              <IconX className="size-4" stroke={2.25} />
            </button>
          ) : null}
        </div>

        {hasActiveFilters ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className={adminBrutalButtonClass}
          >
            Limpiar
          </Button>
        ) : null}
      </div>

      <p className="mt-3 font-mono text-[10px] font-bold uppercase text-muted-foreground">
        {pagination.totalCount === 1
          ? "1 categoría encontrada"
          : `${pagination.totalCount} categorías encontradas`}
        {pagination.totalPages > 1
          ? ` · página ${pagination.page} de ${pagination.totalPages}`
          : null}
      </p>
    </section>
  );
}
