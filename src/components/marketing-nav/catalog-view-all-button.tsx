"use client";

import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export function CatalogViewAllButton() {
  return (
    <Button asChild size="sm" className="font-mono text-[10px] md:text-xs">
      <Link href="/catalog" className="flex items-center gap-2">
        Ver todos los cursos
        <IconArrowRight className="size-3.5" />
      </Link>
    </Button>
  );
}
