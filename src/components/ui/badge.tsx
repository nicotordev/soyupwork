import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded border-2 border-foreground px-2 py-0.5 text-[0.625rem] font-mono font-black uppercase tracking-wider whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-2.5!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[1.5px_1.5px_0px_0px_var(--foreground)] [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[1.5px_1.5px_0px_0px_var(--foreground)] [a]:hover:bg-secondary/80",
        destructive:
          "border-destructive bg-destructive/10 text-destructive shadow-[1.5px_1.5px_0px_0px_var(--destructive)] [a]:hover:bg-destructive/20",
        outline:
          "border-foreground bg-background text-foreground shadow-[1.5px_1.5px_0px_0px_var(--foreground)] [a]:hover:bg-muted",
        ghost:
          "border-transparent bg-transparent shadow-none hover:border-foreground hover:bg-muted hover:shadow-[1.5px_1.5px_0px_0px_var(--foreground)] dark:hover:bg-muted/50",
        link: "border-transparent bg-transparent shadow-none text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
