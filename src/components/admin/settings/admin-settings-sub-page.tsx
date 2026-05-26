import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReactNode } from "react";

type AdminSettingsSubPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
};

export function AdminSettingsSubPage({
  eyebrow,
  title,
  description,
  icon,
  children,
}: AdminSettingsSubPageProps) {
  return (
    <AdminDashboardContainer>
      <div className="space-y-8">
        <AdminDashboardPageHeader
          eyebrow={eyebrow}
          icon={icon}
          title={title}
          description={description}
          actions={
            <Button asChild variant="outline">
              <Link href="/admin/settings">Volver</Link>
            </Button>
          }
        />
        {children}
      </div>
    </AdminDashboardContainer>
  );
}
