"use client";

import {
  ADMIN_BRAND,
  ADMIN_FOOTER_LINKS,
  ADMIN_NAV_ITEMS,
} from "@/constants/dashboard.constants";
import {
  adminBrutalButtonClass,
  adminSidebarBrandClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { IconArrowLeft, IconExternalLink } from "@tabler/icons-react";
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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-2 border-foreground [&_[data-sidebar=sidebar]]:border-foreground/20 [&_[data-sidebar=sidebar]]:bg-sidebar"
    >
      <SidebarHeader className="gap-3 p-3">
        <Link href="/admin" className={cn(adminSidebarBrandClass, "w-fit")}>
          {ADMIN_BRAND.name}
        </Link>
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden">
          {ADMIN_BRAND.panelLabel}
        </span>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] font-bold uppercase tracking-wider">
            Navegación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "border border-transparent font-mono text-xs font-bold uppercase tracking-wide",
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

      <SidebarFooter className="gap-2 p-3">
        <SidebarSeparator className="bg-foreground/20" />
        <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
          {ADMIN_FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
              <IconExternalLink className="size-3" stroke={2.5} />
            </Link>
          ))}
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(adminBrutalButtonClass, "w-full justify-start gap-2")}
        >
          <Link href="/">
            <IconArrowLeft stroke={2.25} />
            <span className="group-data-[collapsible=icon]:hidden">
              Volver al sitio
            </span>
          </Link>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
