"use client";

import { cn } from "@/lib/utils";
import {
  AlertOctagon,
  CircleCheck,
  Info,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const toastSurfaceClass = cn(
  "group pointer-events-auto flex w-full items-center gap-2.5 overflow-hidden rounded-lg border-2 border-foreground bg-card text-foreground",
  "shadow-[4px_4px_0px_0px_var(--foreground)]",
  "transition-all data-[swipe=move]:translate-x-[var(--swipe-move-x)]",
  "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--swipe-end-x)]",
  "data-[swipe=end]:animate-out data-[state=closed]:animate-out",
);

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      position="top-right"
      closeButton
      visibleToasts={4}
      gap={12}
      offset={{ top: "1rem", right: "1rem" }}
      icons={{
        success: <CircleCheck className="size-4 text-primary" aria-hidden />,
        info: <Info className="size-4 text-primary" aria-hidden />,
        warning: (
          <TriangleAlert
            className="size-4 text-amber-600 dark:text-amber-400"
            aria-hidden
          />
        ),
        error: <AlertOctagon className="size-4 text-destructive" aria-hidden />,
        loading: (
          <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: toastSurfaceClass,
          title:
            "font-mono text-xs leading-none font-bold tracking-wide uppercase",
          description:
            "text-[11px] leading-snug text-foreground/90 normal-case font-mono",
          content: "flex min-w-0 flex-1 flex-col gap-1",
          icon: "shrink-0",
          closeButton: cn(
            "absolute top-2 right-2 rounded border border-foreground/30 bg-background/80 p-0.5",
            "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          ),
          success: "border-foreground",
          error:
            "border-destructive shadow-[4px_4px_0px_0px_var(--destructive)]",
          warning: "border-amber-600 dark:border-amber-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
