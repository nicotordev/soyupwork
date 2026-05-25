import { cn } from "@/lib/utils";

/** Neobrutalist tokens shared by catalog filter shadcn primitives */
export const catalogFilterPanelClass = cn(
  "gap-6 border-2 border-foreground bg-card py-5",
  "shadow-[4px_4px_0px_0px_var(--foreground)] rounded-lg",
);

export const catalogFilterHeaderClass =
  "flex items-center justify-between border-b-2 border-foreground pb-3";

export const catalogFilterTitleClass =
  "font-bold font-mono text-sm uppercase flex items-center gap-2";

export const catalogFilterSectionTitleClass = cn(
  "mb-0 w-full font-bold font-mono text-xs uppercase text-muted-foreground mb-2",
);

export const catalogFilterFieldGroupClass = "gap-1.5";

export const catalogFilterFieldClass = "items-start gap-2.5";

export const catalogFilterCheckboxClass = cn(
  "size-3.5 shrink-0 rounded border-2 border-foreground bg-background",
  "data-checked:border-foreground data-checked:bg-primary data-checked:text-primary-foreground",
  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
  "dark:bg-background dark:data-checked:bg-primary",
);

export const catalogFilterRadioClass = cn(
  "size-3.5 shrink-0 rounded-full border-2 border-foreground bg-background",
  "data-checked:border-foreground data-checked:bg-primary data-checked:text-primary-foreground",
  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
  "dark:bg-background dark:data-checked:bg-primary",
  "[&_[data-slot=radio-group-indicator]_span]:size-1.5",
);

export const catalogFilterOptionLabelClass = cn(
  "w-full cursor-pointer text-xs font-normal leading-snug text-foreground",
  "transition-colors hover:text-primary",
);

export const catalogFilterSeparatorClass =
  "border-dashed border-foreground/35 bg-transparent";

export const catalogFilterClearButtonClass = cn(
  "h-auto p-0 font-mono text-[10px] font-bold uppercase text-destructive",
  "hover:text-destructive/80 hover:no-underline",
);

export const catalogFilterSheetContentClass = cn(
  "w-full max-w-xs gap-6 overflow-y-auto border-r-4 border-foreground bg-background p-6",
  "shadow-[4px_0px_0px_0px_var(--foreground)] sm:max-w-xs",
);

export const catalogFilterSheetOverlayClass =
  "bg-foreground/40 backdrop-blur-xs";

export const ACCESS_FILTER_OPTIONS = [
  { value: "all", label: "Todos los cursos" },
  { value: "free", label: "Solo gratuitos" },
  { value: "paid", label: "Solo de pago" },
] as const;

export const CERTIFICATE_FILTER_OPTIONS = [
  { value: "all", label: "Cualquiera" },
  { value: "yes", label: "Con certificado" },
  { value: "no", label: "Sin certificado" },
] as const;
