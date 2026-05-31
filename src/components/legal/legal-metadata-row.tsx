type LegalMetadataRowProps = {
  items: readonly { label: string; value: string }[];
};

export function LegalMetadataRow({ items }: LegalMetadataRowProps) {
  return (
    <dl className="grid gap-2 rounded-xl border-2 border-dashed border-foreground/25 bg-muted/30 p-3 sm:grid-cols-2 sm:gap-3 sm:p-4">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 space-y-0.5">
          <dt className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            {item.label}
          </dt>
          <dd className="text-sm font-semibold text-foreground">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
