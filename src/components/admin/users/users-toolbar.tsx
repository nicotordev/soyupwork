"use client";

import {
  AdminFilterField,
  adminFilterSelectTriggerClass,
} from "@/components/admin/listing/admin-filter-field";
import { AdminToolbar } from "@/components/admin/listing/admin-toolbar";
import { UserCreationDialog } from "@/components/admin/users/user-creation-dialog";
import {
  ADMIN_USERS_FILTER_ALL,
  ADMIN_USERS_ROLE_FILTER_OPTIONS,
  ADMIN_USERS_STATUS_FILTER,
  ADMIN_USERS_STATUS_FILTER_OPTIONS,
} from "@/constants/users.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type {
  AdminUsersPagination,
  ParsedAdminUsersParams,
} from "@/types/admin-user.types";
import type { AdminActiveFilter } from "@/types/admin-listing.types";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UsersToolbarProps = {
  filters: ParsedAdminUsersParams;
  pagination: AdminUsersPagination;
};

export function UsersToolbar({ filters, pagination }: UsersToolbarProps) {
  const {
    localQuery,
    setLocalQuery,
    viewMode,
    setViewMode,
    setParam,
    clearParams,
    isPending,
  } = useAdminListingParams();

  const [createOpen, setCreateOpen] = useState(false);

  const hasActiveFilters =
    filters.q.length > 0 ||
    filters.role !== ADMIN_USERS_FILTER_ALL ||
    filters.status !== ADMIN_USERS_STATUS_FILTER.ACTIVE;

  const activeFiltersCount = [
    filters.role !== ADMIN_USERS_FILTER_ALL,
    filters.status !== ADMIN_USERS_STATUS_FILTER.ACTIVE,
  ].filter(Boolean).length;

  const roleLabel =
    ADMIN_USERS_ROLE_FILTER_OPTIONS.find((o) => o.value === filters.role)
      ?.label ?? filters.role;

  const statusLabel =
    ADMIN_USERS_STATUS_FILTER_OPTIONS.find((o) => o.value === filters.status)
      ?.label ?? filters.status;

  const activeFilterBadges = useMemo((): AdminActiveFilter[] => {
    const badges: AdminActiveFilter[] = [];

    if (filters.role !== ADMIN_USERS_FILTER_ALL) {
      badges.push({
        key: "role",
        label: "Rol",
        value: roleLabel,
        onRemove: () => setParam("role", null, ADMIN_USERS_FILTER_ALL),
      });
    }

    if (filters.status !== ADMIN_USERS_STATUS_FILTER.ACTIVE) {
      badges.push({
        key: "status",
        label: "Estado",
        value: statusLabel,
        onRemove: () =>
          setParam("status", null, ADMIN_USERS_STATUS_FILTER.ACTIVE),
      });
    }

    return badges;
  }, [filters.role, filters.status, roleLabel, statusLabel, setParam]);

  const resultSummary =
    pagination.totalCount === 1
      ? "1 miembro encontrado"
      : `${pagination.totalCount} miembros encontrados` +
        (pagination.totalPages > 1
          ? ` · página ${pagination.page} de ${pagination.totalPages}`
          : "");

  return (
    <>
      <AdminToolbar
        isPending={isPending}
        search={{
          value: localQuery,
          onChange: setLocalQuery,
          placeholder: "Buscar por nombre o correo...",
          ariaLabel: "Buscar miembros",
        }}
        filters={{
          activeCount: activeFiltersCount,
          hasActiveFilters,
          onClear: () =>
            clearParams(["role", "status", "q"]),
          title: "Filtros",
          children: (
            <>
              <AdminFilterField label="Rol">
                <Select
                  value={
                    filters.role === ADMIN_USERS_FILTER_ALL
                      ? ADMIN_USERS_FILTER_ALL
                      : filters.role
                  }
                  onValueChange={(value) =>
                    setParam("role", value, ADMIN_USERS_FILTER_ALL)
                  }
                >
                  <SelectTrigger className={adminFilterSelectTriggerClass}>
                    <SelectValue placeholder="Rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_USERS_ROLE_FILTER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AdminFilterField>

              <AdminFilterField label="Estado">
                <Select
                  value={filters.status}
                  onValueChange={(value) =>
                    setParam("status", value, ADMIN_USERS_STATUS_FILTER.ACTIVE)
                  }
                >
                  <SelectTrigger className={adminFilterSelectTriggerClass}>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_USERS_STATUS_FILTER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AdminFilterField>
            </>
          ),
        }}
        view={{ mode: viewMode, onChange: setViewMode }}
        activeFilterBadges={activeFilterBadges}
        resultSummary={resultSummary}
        actions={
          <Button
            type="button"
            onClick={() => setCreateOpen(true)}
            className={cn(adminBrutalButtonClass, "h-9 gap-1.5 font-mono text-xs font-bold uppercase")}
          >
            <Plus className="size-4" aria-hidden />
            <span className="hidden sm:inline">Crear</span>
          </Button>
        }
      />

      <UserCreationDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
