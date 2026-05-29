import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const neoBrutalPress =
  "hover:translate-x-px hover:translate-y-px active:translate-y-[3px] active:shadow-none";

const buttonVariants = cva(
  cn(
    "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded border-2 bg-clip-padding",
    "text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all outline-none select-none",
    neoBrutalPress,
    "focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ),
  {
    variants: {
      variant: {
        default: cn(
          "border-foreground bg-primary text-primary-foreground",
          "shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[1px_1px_0px_0px_var(--foreground)]",
        ),
        outline: cn(
          "border-foreground bg-background text-foreground",
          "shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[1px_1px_0px_0px_var(--foreground)]",
        ),
        accent: cn(
          "border-primary bg-background text-primary",
          "shadow-[2px_2px_0px_0px_var(--primary)] hover:shadow-[1px_1px_0px_0px_var(--primary)]",
        ),
        secondary: cn(
          "border-foreground bg-secondary text-secondary-foreground",
          "shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[1px_1px_0px_0px_var(--foreground)]",
          "aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ),
        ghost: cn(
          "border-transparent bg-transparent text-foreground shadow-none",
          "hover:border-foreground hover:bg-muted hover:shadow-[2px_2px_0px_0px_var(--foreground)]",
          "active:border-foreground",
          "aria-expanded:bg-muted aria-expanded:text-foreground",
        ),
        destructive: cn(
          "border-destructive bg-destructive/10 text-destructive",
          "shadow-[2px_2px_0px_0px_var(--destructive)] hover:shadow-[1px_1px_0px_0px_var(--destructive)]",
          "focus-visible:ring-destructive/30",
        ),
        link: cn(
          "h-auto border-transparent bg-transparent p-0 font-semibold normal-case tracking-normal text-primary shadow-none",
          "hover:translate-x-0 hover:translate-y-0 hover:underline active:translate-y-0",
        ),
      },
      size: {
        default:
          "h-9 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-6 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
        sm: "h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        lg: cn(
          "h-12 px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-4",
        ),
        xl: cn(
          "h-auto py-3.5 px-8 has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6 [&_svg:not([class*='size-'])]:size-4",
        ),
        icon: "size-9 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs": "size-6 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    compoundVariants: [
      {
        variant: ["default", "outline", "secondary"],
        size: ["lg", "xl"],
        class:
          "shadow-[4px_4px_0px_0px_var(--foreground)] hover:shadow-[3px_3px_0px_0px_var(--foreground)]",
      },
      {
        variant: "accent",
        size: ["lg", "xl"],
        class:
          "shadow-[4px_4px_0px_0px_var(--primary)] hover:shadow-[3px_3px_0px_0px_var(--primary)]",
      },
      {
        variant: "destructive",
        size: ["lg", "xl"],
        class:
          "shadow-[4px_4px_0px_0px_var(--destructive)] hover:shadow-[3px_3px_0px_0px_var(--destructive)]",
      },
      { variant: "link", class: "h-auto px-0" },
      {
        variant: "ghost",
        size: ["icon", "icon-xs", "icon-sm", "icon-lg"],
        class: "hover:shadow-none",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
