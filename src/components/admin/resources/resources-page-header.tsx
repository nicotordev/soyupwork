"use client";

import { ResourceCreateDialog } from "@/components/admin/resources/resource-create-dialog";
import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { ADMIN_RESOURCES_PAGE } from "@/constants/resources-admin.constants";
import type { AdminResourcesKindParam } from "@/constants/resources-admin.constants";
import { FileStack } from "lucide-react";

type ResourcesPageHeaderProps = {
  kind: AdminResourcesKindParam;
};

export function ResourcesPageHeader({ kind }: ResourcesPageHeaderProps) {
  return (
    <AdminDashboardPageHeader
      eyebrow={ADMIN_RESOURCES_PAGE.eyebrow}
      icon={<FileStack className="size-4 text-primary" />}
      title={ADMIN_RESOURCES_PAGE.title}
      description={ADMIN_RESOURCES_PAGE.description}
      actions={<ResourceCreateDialog kind={kind} />}
    />
  );
}
