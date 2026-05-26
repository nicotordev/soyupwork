import { adminGridBackgroundClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";

type AdminDashboardContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function AdminDashboardContainer({
  children,
  className,
}: AdminDashboardContainerProps) {
  return (
    <div className={cn("relative flex-1 overflow-x-hidden", className)}>
      <div aria-hidden className={adminGridBackgroundClass} />
      <div className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </div>
    </div>
  );
}
