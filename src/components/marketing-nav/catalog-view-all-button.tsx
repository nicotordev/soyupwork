"use client";

import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export function CatalogViewAllButton() {
  return (
    <Button
      asChild
      className="border-2 border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-y-[2px] transition-all font-mono text-[10px] md:text-xs font-bold uppercase tracking-wider"
    >
      <Link href="/catalog" className="flex items-center gap-2">
        Ver todos los cursos
        <IconArrowRight className="size-3.5" />
      </Link>
    </Button>
  );
}
