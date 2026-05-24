import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-clip-padding text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:translate-x-[1px] hover:translate-y-[1px] active:translate-y-[2px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:shadow-none",
        outline:
          "bg-background text-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:shadow-none",
        ghost:
          "border-transparent bg-transparent hover:border-foreground hover:bg-secondary shadow-none hover:shadow-[2px_2px_0px_0px_var(--foreground)] active:shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:shadow-none",
        link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline shadow-none hover:translate-x-0 hover:translate-y-0 active:translate-y-0",
      },
      size: {
        default:
          "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
        sm: "h-6 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-8 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs": "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
        "icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-8 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
