"use client";

import { StudentSidebarNavGroup } from "@/components/dashboard/student-sidebar-nav-group";
import {
  STUDENT_ACCOUNT_NAV,
  STUDENT_EXPLORE_NAV,
  STUDENT_LEARNING_NAV,
} from "@/constants/student-nav.constants";
import {
  adminBrutalButtonClass,
  adminSidebarBrandClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { IconArrowLeft, IconExternalLink, IconMail } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const STUDENT_BRAND = {
  name: "SoyUpwork",
  shortName: "SU",
  panelLabel: "Área de Estudiante",
};

const NAV_GROUPS = [
  { label: "Mi Aprendizaje", items: STUDENT_LEARNING_NAV },
  { label: "Explorar", items: STUDENT_EXPLORE_NAV },
  { label: "Cuenta", items: STUDENT_ACCOUNT_NAV },
] as const;

export function StudentSidebar() {
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
        {NAV_GROUPS.map((group) => (
          <StudentSidebarNavGroup key={group.label} group={group} />
        ))}
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
