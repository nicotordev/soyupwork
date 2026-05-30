"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import { IconUsers } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

type UsersEmptyStateProps = {
  hasFilters: boolean;
};

export function UsersEmptyState({ hasFilters }: UsersEmptyStateProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const clearFilters = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  return (
    <div className={adminPanelClass}>
      <Empty className="border-0 py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconUsers className="size-6 text-primary" stroke={2.25} />
          </EmptyMedia>
          <EmptyTitle className="font-heading text-xl font-extrabold">
            {hasFilters ? "Sin resultados" : "Aún no hay miembros"}
          </EmptyTitle>
          <EmptyDescription>
            {hasFilters
              ? "Probá con otros términos o limpiá los filtros para ver todos los miembros."
              : "Cuando los usuarios se registren, aparecerán aquí en la base de datos."}
          </EmptyDescription>
        </EmptyHeader>
        {hasFilters ? (
          <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
            disabled={isPending}
            className={adminBrutalButtonClass}
          >
            Limpiar filtros
          </Button>
        ) : null}
      </Empty>
    </div>
  );
}
