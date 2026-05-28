"use client";

import {
  adminBrutalButtonClass,
  adminSidebarBrandClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBook,
  IconBooks,
  IconCompass,
  IconExternalLink,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const STUDENT_BRAND = {
  name: "SoyUpwork",
  shortName: "SU",
  panelLabel: "Área de Estudiante",
};

const STUDENT_NAV_ITEMS = [
  {
    label: "Mi Panel",
    href: "/dashboard",
    icon: IconBook,
  },
  {
    label: "Mis Cursos",
    href: "/dashboard/courses",
    icon: IconBooks,
  },
  {
    label: "Catálogo",
    href: "/catalog",
    icon: IconCompass,
  },
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-2 border-foreground **:data-[sidebar=sidebar]:border-foreground/20 **:data-[sidebar=sidebar]:bg-sidebar"
    >
      <SidebarHeader className="gap-3 p-3 group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:p-2">
        <Link
          href="/dashboard"
          className={cn(
            adminSidebarBrandClass,
            "w-fit group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-0.5 group-data-[collapsible=icon]:text-[10px] group-data-[collapsible=icon]:uppercase",
          )}
        >
          <span className="group-data-[collapsible=icon]:hidden">
            {STUDENT_BRAND.name}
          </span>
          <span className="hidden group-data-[collapsible=icon]:inline">
            {STUDENT_BRAND.shortName}
          </span>
        </Link>
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden">
          {STUDENT_BRAND.panelLabel}
        </span>
      </SidebarHeader>

      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] font-bold uppercase tracking-wider">
            Mi Aprendizaje
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {STUDENT_NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "border border-transparent font-mono text-xs font-bold uppercase tracking-wide",
                        "group-data-[collapsible=icon]:size-7! group-data-[collapsible=icon]:p-1.5! group-data-[collapsible=icon]:[&_svg]:size-3.5!",
                        isActive &&
                          "border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)]",
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon stroke={2.25} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 p-3 group-data-[collapsible=icon]:gap-1.5 group-data-[collapsible=icon]:p-2">
        <SidebarSeparator className="bg-foreground/20" />
        <div className="flex flex-col gap-1.5 group-data-[collapsible=icon]:hidden px-1">
          <a
            href="mailto:soporte@soyup.work"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-muted-foreground transition-colors hover:text-primary"
          >
            <IconMail className="size-3.5 text-emerald-500" stroke={2.5} />
            Soporte Técnico
            <IconExternalLink className="size-2.5" stroke={2.5} />
          </a>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(
            adminBrutalButtonClass,
            "w-full justify-start gap-2 bg-background",
            "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-7 group-data-[collapsible=icon]:w-7 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:[&_svg]:size-3.5",
          )}
        >
          <Link href="/">
            <IconArrowLeft stroke={2.25} />
            <span className="group-data-[collapsible=icon]:hidden">
              Volver al inicio
            </span>
          </Link>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
