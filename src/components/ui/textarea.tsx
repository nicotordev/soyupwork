import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full resize-none rounded-md border-2 border-foreground bg-card px-3 py-2 text-xs transition-all outline-none placeholder:text-muted-foreground shadow-[2px_2px_0px_0px_var(--foreground)] focus-visible:shadow-[3px_3px_0px_0px_var(--foreground)] focus-visible:translate-x-[-1px] focus-visible:translate-y-[-1px] focus-visible:ring-0 focus-visible:border-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:shadow-[2px_2px_0px_0px_var(--destructive)] aria-invalid:focus-visible:shadow-[3px_3px_0px_0px_var(--destructive)] dark:bg-input/10",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
