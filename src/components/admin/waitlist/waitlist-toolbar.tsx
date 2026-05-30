"use client";

import {
  AdminFilterField,
  adminFilterSelectTriggerClass,
} from "@/components/admin/listing/admin-filter-field";
import { AdminToolbar } from "@/components/admin/listing/admin-toolbar";
import { WaitlistInviteDialog } from "@/components/admin/waitlist/waitlist-invite-dialog";
import {
  ADMIN_WAITLIST_INVITE_STATUS_FILTER,
  ADMIN_WAITLIST_INVITE_STATUS_FILTER_OPTIONS,
} from "@/constants/waitlist-admin.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type {
  AdminWaitlistPagination,
  ParsedAdminWaitlistParams,
} from "@/types/admin-waitlist.types";
import type { AdminActiveFilter } from "@/types/admin-listing.types";
import { MailPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type WaitlistToolbarProps = {
  filters: ParsedAdminWaitlistParams;
  pagination: AdminWaitlistPagination;
};

export function WaitlistToolbar({ filters, pagination }: WaitlistToolbarProps) {
  const {
    localQuery,
    setLocalQuery,
    viewMode,
    setViewMode,
    setParam,
    clearParams,
    isPending,
  } = useAdminListingParams();

  const [inviteOpen, setInviteOpen] = useState(false);

  const hasActiveFilters =
    filters.q.length > 0 ||
    filters.inviteStatus !== ADMIN_WAITLIST_INVITE_STATUS_FILTER.ALL;

  const activeFiltersCount = [
    filters.inviteStatus !== ADMIN_WAITLIST_INVITE_STATUS_FILTER.ALL,
  ].filter(Boolean).length;

  const inviteStatusLabel =
    ADMIN_WAITLIST_INVITE_STATUS_FILTER_OPTIONS.find(
      (o) => o.value === filters.inviteStatus,
    )?.label ?? filters.inviteStatus;

  const activeFilterBadges = useMemo((): AdminActiveFilter[] => {
    const badges: AdminActiveFilter[] = [];

    if (filters.inviteStatus !== ADMIN_WAITLIST_INVITE_STATUS_FILTER.ALL) {
      badges.push({
        key: "inviteStatus",
        label: "Invitación",
        value: inviteStatusLabel,
        onRemove: () =>
          setParam("inviteStatus", null, ADMIN_WAITLIST_INVITE_STATUS_FILTER.ALL),
      });
    }

    return badges;
  }, [filters.inviteStatus, inviteStatusLabel, setParam]);

  const resultSummary =
    pagination.totalCount === 1
      ? "1 registro encontrado"
      : `${pagination.totalCount} registros encontrados` +
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
          placeholder: "Buscar por correo, nombre o teléfono…",
          ariaLabel: "Buscar en lista de espera",
        }}
        filters={{
          activeCount: activeFiltersCount,
          hasActiveFilters,
          onClear: () => clearParams(["inviteStatus", "q"]),
          title: "Filtros",
          children: (
            <AdminFilterField label="Estado invitación">
              <Select
                value={filters.inviteStatus}
                onValueChange={(value) => setParam("inviteStatus", value)}
              >
                <SelectTrigger className={adminFilterSelectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_WAITLIST_INVITE_STATUS_FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AdminFilterField>
          ),
        }}
        view={{ mode: viewMode, onChange: setViewMode }}
        activeFilterBadges={activeFilterBadges}
        resultSummary={resultSummary}
        actions={
          <Button
            type="button"
            onClick={() => setInviteOpen(true)}
            className={cn(
              adminBrutalButtonClass,
              "h-9 gap-1.5 font-mono text-xs font-bold uppercase",
            )}
          >
            <MailPlus className="size-4" aria-hidden />
            <span className="hidden sm:inline">Invitar</span>
          </Button>
        }
      />

      <WaitlistInviteDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}
