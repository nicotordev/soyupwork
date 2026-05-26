import { DASHBOARD_PAGE } from "@/constants/dashboard.constants";
import { adminEyebrowClass } from "@/lib/admin/styles";
import { IconLayoutDashboard } from "@tabler/icons-react";

export function DashboardPageHeader() {
  return (
    <header className="mb-8 space-y-4 border-b-4 border-foreground pb-6">
      <div className={adminEyebrowClass}>
        <IconLayoutDashboard className="size-4 text-primary" stroke={2.5} />
        {DASHBOARD_PAGE.eyebrow}
      </div>
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
          {DASHBOARD_PAGE.title}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          {DASHBOARD_PAGE.description}
        </p>
      </div>
    </header>
  );
}
