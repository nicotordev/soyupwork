export function LegalBrutalSeparator() {
  return (
    <div className="flex items-center gap-3 py-2" role="separator" aria-hidden>
      <span className="h-0.5 flex-1 bg-foreground" />
      <span className="size-2 rotate-45 border-2 border-foreground bg-primary" />
      <span className="h-0.5 flex-1 bg-foreground" />
    </div>
  );
}
