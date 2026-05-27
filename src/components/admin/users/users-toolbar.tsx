"use client";

import {
  ADMIN_USERS_FILTER_ALL,
  ADMIN_USERS_ROLE_FILTER_OPTIONS,
  ADMIN_USERS_STATUS_FILTER,
  ADMIN_USERS_STATUS_FILTER_OPTIONS,
} from "@/constants/users.constants";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type {
  AdminUsersPagination,
  ParsedAdminUsersParams,
} from "@/types/admin-user.types";
import { IconSearch, IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UsersToolbarProps = {
  filters: ParsedAdminUsersParams;
  pagination: AdminUsersPagination;
};

export function UsersToolbar({ filters, pagination }: UsersToolbarProps) {
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

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (
      value === ADMIN_USERS_FILTER_ALL ||
      (key === "status" && value === ADMIN_USERS_STATUS_FILTER.ACTIVE)
    ) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    startTransition(() => {
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    });
  };

  const clearFilters = () => {
    setLocalQuery("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const hasActiveFilters =
    filters.q.length > 0 ||
    filters.role !== ADMIN_USERS_FILTER_ALL ||
    filters.status !== ADMIN_USERS_STATUS_FILTER.ACTIVE;

  const currentRole =
    filters.role === ADMIN_USERS_FILTER_ALL
      ? ADMIN_USERS_FILTER_ALL
      : filters.role;

  return (
    <section
      className={cn(adminPanelClass, "mb-6 p-4", isPending && "opacity-70")}
      aria-label="Filtros de miembros"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1">
            <IconSearch
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              stroke={2.25}
            />
            <Input
              type="search"
              value={localQuery}
              onChange={(event) => setLocalQuery(event.target.value)}
              placeholder="Buscar por nombre o correo..."
              className={cn(adminInputClass, "h-9 pl-8 font-mono text-xs")}
              aria-label="Buscar miembros"
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

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
              Rol
            </span>
            {ADMIN_USERS_ROLE_FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFilter("role", option.value)}
                className={cn(
                  "rounded border-2 border-foreground px-3 py-1 font-mono text-[10px] font-extrabold uppercase shadow-[2px_2px_0px_0px_var(--foreground)] transition-all active:translate-y-px",
                  currentRole === option.value
                    ? "bg-secondary text-foreground"
                    : "bg-background text-muted-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
              Estado
            </span>
            {ADMIN_USERS_STATUS_FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFilter("status", option.value)}
                className={cn(
                  "rounded border-2 border-foreground px-3 py-1 font-mono text-[10px] font-extrabold uppercase shadow-[2px_2px_0px_0px_var(--foreground)] transition-all active:translate-y-px",
                  filters.status === option.value
                    ? "bg-secondary text-foreground"
                    : "bg-background text-muted-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 font-mono text-[10px] font-bold uppercase text-muted-foreground">
        {pagination.totalCount === 1
          ? "1 miembro encontrado"
          : `${pagination.totalCount} miembros encontrados`}
        {pagination.totalPages > 1
          ? ` · página ${pagination.page} de ${pagination.totalPages}`
          : null}
      </p>
    </section>
  );
}
