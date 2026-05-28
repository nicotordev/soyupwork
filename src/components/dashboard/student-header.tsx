"use client";

import { adminBrutalButtonClass, adminInputClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { UserProfileDropdown } from "@/components/dashboard/user-profile-dropdown";
import { IconBell, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function getStudentBreadcrumbLabel(pathname: string): string {
  const segments: Record<string, string> = {
    dashboard: "Mi Panel",
    courses: "Cursos",
    lecciones: "Lecciones",
  };

  const parts = pathname.split("/").filter(Boolean);
  const slug = parts.at(-1) ?? parts[0];
  if (!slug || slug === "dashboard") return "Mi Panel";
  return segments[slug] ?? "Área Estudiante";
}

export function StudentHeader() {
  const pathname = usePathname();
  const pageLabel = getStudentBreadcrumbLabel(pathname);

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b-2 border-foreground bg-background px-4">
      <SidebarTrigger
        className={cn(adminBrutalButtonClass, "size-8 shrink-0 bg-background")}
      />

      <Separator
        orientation="vertical"
        className="hidden h-full w-px sm:block"
      />

      <Breadcrumb className="hidden min-w-0 sm:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="font-mono text-xs uppercase">
                Panel
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-mono text-xs font-bold uppercase">
              {pageLabel}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="relative ml-auto flex max-w-xs flex-1 items-center md:max-w-md">
        <IconSearch
          className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground"
          stroke={2.25}
        />
        <Input
          type="search"
          placeholder="Buscar lecciones, apuntes..."
          className={cn(adminInputClass, "h-8 w-full pl-8 font-mono text-xs")}
          aria-label="Buscar en tus cursos"
        />
      </div>

      <Button
        variant="outline"
        size="icon-sm"
        className={cn(adminBrutalButtonClass, "bg-background")}
        aria-label="Notificaciones"
      >
        <IconBell stroke={2.25} />
      </Button>

      <UserProfileDropdown />
    </header>
  );
}
