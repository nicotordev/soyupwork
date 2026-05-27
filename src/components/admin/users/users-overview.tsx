import { UsersEmptyState } from "@/components/admin/users/users-empty-state";
import { UsersPageHeader } from "@/components/admin/users/users-page-header";
import { UsersPagination } from "@/components/admin/users/users-pagination";
import { UsersStatsGrid } from "@/components/admin/users/users-stats-grid";
import { UsersTable } from "@/components/admin/users/users-table";
import { UsersToolbar } from "@/components/admin/users/users-toolbar";
import {
  ADMIN_USERS_FILTER_ALL,
  ADMIN_USERS_STATUS_FILTER,
} from "@/constants/users.constants";
import type { AdminUsersPageData } from "@/types/admin-user.types";

type UsersOverviewProps = {
  data: AdminUsersPageData;
};

export function UsersOverview({ data }: UsersOverviewProps) {
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
        <UsersEmptyState hasFilters={hasActiveFilters} />
      ) : (
        <>
          <UsersTable
            users={data.users}
            currentAdminUserId={data.currentAdminUserId}
          />
          <UsersPagination pagination={data.pagination} />
        </>
      )}
    </div>
  );
}
