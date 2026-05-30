"use client";

import { EmptyState } from "@/components/admin/listing/empty-state";
import { WaitlistPageHeader } from "@/components/admin/waitlist/waitlist-page-header";
import { WaitlistPagination } from "@/components/admin/waitlist/waitlist-pagination";
import { WaitlistStatsGrid } from "@/components/admin/waitlist/waitlist-stats-grid";
import { WaitlistTable } from "@/components/admin/waitlist/waitlist-table";
import { WaitlistToolbar } from "@/components/admin/waitlist/waitlist-toolbar";
import { ADMIN_WAITLIST_INVITE_STATUS_FILTER } from "@/constants/waitlist-admin.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import type { AdminWaitlistPageData } from "@/types/admin-waitlist.types";
import { ListOrdered } from "lucide-react";

type WaitlistOverviewProps = {
  data: AdminWaitlistPageData;
};

export function WaitlistOverview({ data }: WaitlistOverviewProps) {
  const { clearParams } = useAdminListingParams();

  const hasActiveFilters =
    data.filters.q.length > 0 ||
    data.filters.inviteStatus !== ADMIN_WAITLIST_INVITE_STATUS_FILTER.ALL;

  return (
    <div className="space-y-0">
      <WaitlistPageHeader />
      <WaitlistStatsGrid stats={data.stats} />
      <WaitlistToolbar filters={data.filters} pagination={data.pagination} />
      {data.pagination.totalCount === 0 ? (
        <EmptyState
          icon={ListOrdered}
          title="No hay registros en la lista de espera"
          description="Cuando alguien confirme su correo en /waitlist, aparecerá aquí."
          hasFilters={hasActiveFilters}
          onClearFilters={
            hasActiveFilters
              ? () => clearParams(["inviteStatus", "q"])
              : undefined
          }
        />
      ) : (
        <>
          <WaitlistTable entries={data.entries} />
          <WaitlistPagination pagination={data.pagination} />
        </>
      )}
    </div>
  );
}
