"use client";

import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { AdminTableActionItem } from "@/types/admin-listing.types";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AdminTableActionsProps = {
  actions: AdminTableActionItem[];
  className?: string;
};

export function AdminTableActions({ actions, className }: AdminTableActionsProps) {
  return (
    <div className={cn("flex justify-end gap-1", className)}>
      {actions.map((action) => {
        const buttonClass = cn(
          adminBrutalButtonClass,
          "h-8 w-8 p-0",
          action.destructive && "text-destructive hover:bg-destructive/10",
        );

        const content = action.icon;

        if (action.href) {
          return (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  disabled={action.disabled}
                  className={buttonClass}
                >
                  <Link
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noopener noreferrer" : undefined}
                    aria-label={action.label}
                  >
                    {content}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{action.label}</TooltipContent>
            </Tooltip>
          );
        }

        return (
          <Tooltip key={action.id}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={action.disabled}
                onClick={action.onClick}
                className={buttonClass}
                aria-label={action.label}
              >
                {content}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{action.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
