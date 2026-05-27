"use client";

import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { ADMIN_USERS_PAGE } from "@/constants/users.constants";
import { IconUsers } from "@tabler/icons-react";

export function UsersPageHeader() {
  return (
    <AdminDashboardPageHeader
      eyebrow={ADMIN_USERS_PAGE.eyebrow}
      icon={<IconUsers className="size-4 text-primary" stroke={2.5} />}
      title={ADMIN_USERS_PAGE.title}
      description={ADMIN_USERS_PAGE.description}
    />
  );
}
