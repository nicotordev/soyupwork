"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MARKETING_PAGE } from "@/constants/marketing.constants";

export function MarketingMobileStickyCta() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      role="region"
      aria-label="Acción principal"
      className="fixed inset-x-0 bottom-0 z-[100] border-t-2 border-foreground bg-background pb-safe backdrop-blur-md md:hidden"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <p className="min-w-0 flex-1 text-xs font-semibold leading-snug text-muted-foreground">
          {MARKETING_PAGE.hero.descriptionEmphasis}
        </p>
        <Button
          asChild
          size="lg"
          className="h-11 min-h-11 shrink-0 px-4 active:opacity-80"
        >
          <Link href="/waitlist">
            {MARKETING_PAGE.hero.ctaPrimary}
            <ArrowRight className="stroke-3" />
          </Link>
        </Button>
      </div>
    </div>,
    document.body,
  );
}
