"use client";

import { EmptyState } from "@/components/admin/listing/empty-state";
import { UsersPageHeader } from "@/components/admin/users/users-page-header";
import { UsersCards } from "@/components/admin/users/users-cards";
import { UsersPagination } from "@/components/admin/users/users-pagination";
import { UsersStatsGrid } from "@/components/admin/users/users-stats-grid";
import { UsersTable } from "@/components/admin/users/users-table";
import { UsersToolbar } from "@/components/admin/users/users-toolbar";
import { ADMIN_LISTING_VIEW } from "@/constants/admin-listing.constants";
import {
  ADMIN_USERS_FILTER_ALL,
  ADMIN_USERS_STATUS_FILTER,
} from "@/constants/users.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import type { AdminUsersPageData } from "@/types/admin-user.types";
import { Users } from "lucide-react";

type UsersOverviewProps = {
  data: AdminUsersPageData;
};

export function UsersOverview({ data }: UsersOverviewProps) {
  const { viewMode, clearParams } = useAdminListingParams();

  const hasActiveFilters =
    data.filters.q.length > 0 ||
    data.filters.role !== ADMIN_USERS_FILTER_ALL ||
    data.filters.status !== ADMIN_USERS_STATUS_FILTER.ACTIVE;

  return (
    <div className="space-y-0">
      <UsersPageHeader />
      <UsersStatsGrid stats={data.stats} />
      <UsersToolbar filters={data.filters} pagination={data.pagination} />
      {data.pagination.totalCount === 0 ? (
        <EmptyState
          icon={Users}
          title="Aún no hay miembros"
          description="Cuando los usuarios se registren, aparecerán aquí en la base de datos."
          hasFilters={hasActiveFilters}
          onClearFilters={
            hasActiveFilters
              ? () => clearParams(["role", "status", "q"])
              : undefined
          }
        />
      ) : (
        <>
          {viewMode === ADMIN_LISTING_VIEW.TABLE ? (
            <UsersTable
              users={data.users}
              currentAdminUserId={data.currentAdminUserId}
            />
          ) : (
            <UsersCards
              users={data.users}
              currentAdminUserId={data.currentAdminUserId}
            />
          )}
          <UsersPagination pagination={data.pagination} />
        </>
      )}
    </div>
  );
}
