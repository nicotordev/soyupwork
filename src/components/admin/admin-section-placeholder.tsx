import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { ADMIN_NAV_ITEMS } from "@/constants/dashboard.constants";
import {
  adminEyebrowClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { IconTools } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type AdminSectionPlaceholderProps = {
  section: string;
};

export function AdminSectionPlaceholder({
  section,
}: AdminSectionPlaceholderProps) {
  const navItem = ADMIN_NAV_ITEMS.find((item) =>
    item.href.endsWith(`/${section}`),
  );

  const title = navItem?.label ?? "Sección";
  const description =
    navItem?.description ??
    "Esta sección del panel estará disponible próximamente.";

  return (
    <AdminDashboardContainer>
      <div className="mx-auto max-w-lg space-y-6 py-16 text-center">
        <div className={adminEyebrowClass}>
          <IconTools className="size-4 text-primary" stroke={2.5} />
          En construcción
        </div>
        <div className={adminPanelClass}>
          <div className="space-y-3 p-8">
            <h1 className="font-heading text-2xl font-extrabold tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{description}</p>
            <Button asChild className="mt-4">
              <Link href="/admin">Volver al resumen</Link>
            </Button>
          </div>
        </div>
      </div>
    </AdminDashboardContainer>
  );
}
