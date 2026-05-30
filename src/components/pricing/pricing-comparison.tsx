import { CheckCircle2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PRICING_PAGE } from "@/constants/pricing.constants";
import type { PricingComparisonFeature } from "@/types/pricing.types";

type PricingComparisonProps = {
  features: readonly PricingComparisonFeature[];
};

function ComparisonCell({
  value,
  planName,
}: {
  value: boolean | string;
  planName: string;
}) {
  if (typeof value === "string") {
    return (
      <span className="text-[10px] font-semibold leading-snug text-foreground sm:text-xs">
        {value}
      </span>
    );
  }

  return value ? (
    <CheckCircle2
      className="size-4 text-primary sm:size-5"
      aria-label={`Incluido en ${planName}`}
    />
  ) : (
    <X
      className="size-4 text-muted-foreground/50 sm:size-5"
      aria-label={`No incluido en ${planName}`}
    />
  );
}

export function PricingComparison({ features }: PricingComparisonProps) {
  const { badge, title, description, planLabels } =
    PRICING_PAGE.comparisonSection;

  const columns = [
    ["mini", planLabels.mini] as const,
    ["flagship", planLabels.flagship] as const,
    ["premium", planLabels.premium] as const,
  ];

  return (
    <section
      id="comparison"
      className="relative scroll-mt-20 border-y-2 border-foreground bg-muted py-8 sm:py-14"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.153_0.006_107.1_/_8%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.153_0.006_107.1_/_8%)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-10">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/15 font-mono text-[9px] font-bold uppercase tracking-wider text-primary"
          >
            {badge}
          </Badge>
          <h2 className="mt-3 text-xl font-black leading-tight tracking-tight text-foreground sm:text-2xl md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-xs font-medium text-muted-foreground sm:text-sm">
            {description}
          </p>
        </div>

        {/* Mobile: compact rows */}
        <div className="overflow-hidden rounded-xl border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)] md:hidden">
          {features.map((feature, rowIndex) => (
            <div
              key={feature.id}
              className={
                rowIndex < features.length - 1
                  ? "border-b-2 border-foreground"
                  : undefined
              }
            >
              <h3 className="border-b border-foreground/20 bg-secondary/60 px-3 py-1.5 text-[11px] font-black text-foreground">
                {feature.label}
              </h3>
              <div className="grid grid-cols-3 divide-x-2 divide-foreground">
                {columns.map(([key, label]) => {
                  const value =
                    key === "mini"
                      ? feature.mini
                      : key === "flagship"
                        ? feature.flagship
                        : feature.premium;

                  return (
                    <div
                      key={key}
                      className={`flex min-h-10 flex-col items-center justify-center gap-0.5 px-1.5 py-2 ${
                        key === "flagship" ? "bg-primary/5" : ""
                      }`}
                    >
                      <span className="font-mono text-[7px] font-bold uppercase tracking-wider text-muted-foreground">
                        {label}
                      </span>
                      <ComparisonCell value={value} planName={label} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-xl border-2 border-foreground bg-card shadow-[6px_6px_0px_0px_var(--foreground)] md:block select-none">
          <table className="w-full text-left text-xs font-medium sm:text-sm">
            <thead>
              <tr className="border-b-2 border-foreground bg-secondary/80 font-mono text-[10px] tracking-wider text-muted-foreground">
                <th className="p-4 font-bold uppercase">Incluye</th>
                <th className="border-l-2 border-foreground p-4 font-bold uppercase">
                  {planLabels.mini}
                </th>
                <th className="border-l-2 border-foreground bg-primary/10 p-4 font-bold uppercase text-primary">
                  {planLabels.flagship}
                </th>
                <th className="border-l-2 border-foreground p-4 font-bold uppercase">
                  {planLabels.premium}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-foreground">
              {features.map((feature) => (
                <tr
                  key={feature.id}
                  className="transition-colors hover:bg-muted/40"
                >
                  <td className="p-4 font-semibold text-foreground">
                    {feature.label}
                  </td>
                  <td className="border-l-2 border-foreground p-4">
                    <ComparisonCell
                      value={feature.mini}
                      planName={planLabels.mini}
                    />
                  </td>
                  <td className="border-l-2 border-foreground bg-primary/5 p-4">
                    <ComparisonCell
                      value={feature.flagship}
                      planName={planLabels.flagship}
                    />
                  </td>
                  <td className="border-l-2 border-foreground p-4">
                    <ComparisonCell
                      value={feature.premium}
                      planName={planLabels.premium}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
