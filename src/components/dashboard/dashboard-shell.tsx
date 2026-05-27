import { COURSE_PAGE } from "@/constants/course-page.constants";
import { IconArrowLeft, IconBooks } from "@tabler/icons-react";
import Link from "next/link";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b-2 border-foreground bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wide"
          >
            <IconBooks className="size-4 text-primary" stroke={2.5} />
            SoyUpwork
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground"
          >
            <IconArrowLeft className="size-3.5" stroke={2.25} />
            Catálogo
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export function DashboardPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b-2 border-foreground bg-muted/20 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-1">
        <p className="font-mono text-[10px] font-bold uppercase text-primary">
          {COURSE_PAGE.dashboardEyebrow}
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
