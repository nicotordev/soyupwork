"use client";

import type { StudentNavGroup } from "@/constants/student-nav.constants";
import { isStudentNavItemActive } from "@/constants/student-nav.constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuButtonClassName = cn(
  "border border-transparent font-mono text-xs font-bold uppercase tracking-wide",
  "group-data-[collapsible=icon]:size-7! group-data-[collapsible=icon]:p-1.5! group-data-[collapsible=icon]:[&_svg]:size-3.5!",
);

type StudentSidebarNavGroupProps = {
  group: StudentNavGroup;
};

export function StudentSidebarNavGroup({ group }: StudentSidebarNavGroupProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-mono text-[10px] font-bold uppercase tracking-wider">
        {group.label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => {
            const isActive = isStudentNavItemActive(pathname, item);
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={cn(
                    menuButtonClassName,
                    isActive &&
                      "border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)]",
                  )}
                >
                  <Link href={item.href}>
                    <Icon stroke={2.25} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
