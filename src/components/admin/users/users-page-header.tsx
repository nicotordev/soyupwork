"use client";

import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { ADMIN_USERS_PAGE } from "@/constants/users.constants";
import { Users } from "lucide-react";

export function UsersPageHeader() {
  return (
    <AdminDashboardPageHeader
      eyebrow={ADMIN_USERS_PAGE.eyebrow}
      icon={<Users className="size-4 text-primary" />}
      title={ADMIN_USERS_PAGE.title}
      description={ADMIN_USERS_PAGE.description}
    />
  );
}
