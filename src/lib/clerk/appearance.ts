/**
 * Clerk appearance — tokens from globals.css.
 * Auth forms use `clerkAuthFormAppearance` (minimal card on split panel).
 */

const clerkVariables = {
  colorPrimary: "var(--primary)",
  colorDanger: "var(--destructive)",
  colorSuccess: "var(--primary)",
  colorWarning: "var(--destructive)",
  colorNeutral: "var(--muted-foreground)",
  colorForeground: "var(--foreground)",
  colorBackground: "var(--background)",
  colorInputBackground: "var(--background)",
  colorInputText: "var(--foreground)",
  borderRadius: "var(--radius-md)",
  fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  fontFamilyButtons:
    "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
} as const;

const clerkOptions = {
  logoPlacement: "inside" as const,
  socialButtonsPlacement: "bottom" as const,
  socialButtonsVariant: "blockButton" as const,
  showOptionalFields: true,
};

/** Global ClerkProvider — variables only to avoid class stacking on components */
export const clerkProviderAppearance = {
  variables: clerkVariables,
  options: clerkOptions,
};

const clerkAuthFormElements = {
  rootBox: "w-full",
  cardBox: "w-full shadow-none",
  card: "w-full gap-5 border-0 bg-transparent p-0 shadow-none",
  header: "items-start gap-1 px-0 pt-0 pb-1 text-left",
  headerTitle: "font-heading text-2xl font-bold tracking-tight text-foreground",
  headerSubtitle: "text-sm text-muted-foreground",
  main: "gap-4 px-0",
  socialButtons: "flex flex-col gap-2.5",
  socialButtonsBlockButton:
    "h-10 border border-border bg-background text-foreground shadow-sm hover:bg-muted/60",
  dividerLine: "bg-border",
  dividerText:
    "text-xs font-medium uppercase tracking-wide text-muted-foreground",
  formFieldLabel: "text-xs font-semibold text-foreground",
  formFieldInput:
    "h-10 border-2 border-foreground/20 bg-background shadow-none focus:border-primary focus:ring-2 focus:ring-ring/30",
  formButtonPrimary:
    "h-10 border-2 border-foreground bg-primary font-semibold text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:bg-primary/90",
  footer: "border-0 bg-transparent px-0 pt-2",
  footerActionText: "text-sm text-muted-foreground",
  footerActionLink: "font-semibold text-primary hover:text-primary/80",
  identityPreview: "rounded-md border border-border bg-muted/40",
  identityPreviewEditButton: "text-primary font-medium",
  alertText: "text-sm text-destructive",
} as const;

export const clerkAuthFormAppearance = {
  variables: clerkVariables,
  options: clerkOptions,
  elements: clerkAuthFormElements,
};

export const clerkSignInAppearance = clerkAuthFormAppearance;
export const clerkSignUpAppearance = clerkAuthFormAppearance;
