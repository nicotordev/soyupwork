import { adminGridBackgroundClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";

type DashboardContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function DashboardContainer({
  children,
  className,
}: DashboardContainerProps) {
  return (
    <div className={cn("relative flex-1 overflow-x-hidden", className)}>
      <div aria-hidden className={adminGridBackgroundClass} />
      <div className="relative mx-auto w-full max-w-6xl flex-1 px-2.5 py-4 sm:px-6 lg:py-8">
        {children}
      </div>
    </div>
  );
}
