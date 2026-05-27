"use client";

import { ADMIN_BASE_PATH } from "@/constants/dashboard.constants";
import { adminBrutalButtonClass, adminInputClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { IconBell, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

function getBreadcrumbLabel(pathname: string): string {
  const segments: Record<string, string> = {
    courses: "Cursos",
    categories: "Categorías",
    users: "Usuarios",
    sales: "Ventas",
    cohorts: "Cohortes",
    metrics: "Métricas",
    settings: "Configuración",
    general: "General",
    auth: "Autenticación",
    payments: "Pagos",
    email: "Correo",
    storage: "Almacenamiento",
    video: "Video",
    notifications: "Notificaciones",
  };

  const parts = pathname
    .replace(ADMIN_BASE_PATH, "")
    .split("/")
    .filter(Boolean);
  const slug = parts.at(-1) ?? parts[0];
  if (!slug) return "Resumen";
  return segments[slug] ?? "Admin";
}

export function AdminHeader() {
  const pathname = usePathname();
  const pageLabel = getBreadcrumbLabel(pathname);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b-2 border-foreground bg-background px-4">
      <SidebarTrigger
        className={cn(adminBrutalButtonClass, "size-8 shrink-0")}
      />

      <Separator
        orientation="vertical"
        className="hidden h-full w-px sm:block"
      />

      <Breadcrumb className="hidden min-w-0 sm:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={ADMIN_BASE_PATH}
                className="font-mono text-xs uppercase"
              >
                Admin
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

      <div className="relative ml-auto flex max-w-md flex-1 items-center">
        <IconSearch
          className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground"
          stroke={2.25}
        />
        <Input
          type="search"
          placeholder="Buscar cursos, pedidos, usuarios..."
          className={cn(adminInputClass, "h-8 w-full pl-8 font-mono text-xs")}
          aria-label="Buscar en el panel"
        />
      </div>

      <Button
        variant="outline"
        size="icon-sm"
        className={adminBrutalButtonClass}
        aria-label="Notificaciones"
      >
        <IconBell stroke={2.25} />
      </Button>

      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-foreground bg-secondary",
          adminBrutalButtonClass,
        )}
      >
        {isMounted ? (
          <UserButton />
        ) : (
          <div
            className="size-5 animate-pulse rounded-full bg-foreground/20"
            aria-hidden
          />
        )}
      </div>
    </header>
  );
}
