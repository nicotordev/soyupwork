"use client";

import { ADMIN_CATEGORIES_PAGE_SIZE_OPTIONS } from "@/constants/categories.constants";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { AdminCategoriesPagination } from "@/types/admin-category.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CategoriesPaginationProps = {
  pagination: AdminCategoriesPagination;
};

function buildPageHref(
  pathname: string,
  searchParams: URLSearchParams,
  page: number,
): string {
  const params = new URLSearchParams(searchParams.toString());
  if (page <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(page));
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function CategoriesPagination({
  pagination,
}: CategoriesPaginationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { page, pageSize, totalCount, totalPages } = pagination;
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalCount);

  const navigate = (href: string) => {
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  const updatePageSize = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", value);
    params.delete("page");
    startTransition(() => {
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    });
  };

  if (totalCount === 0) return null;

  const prevHref =
    page > 1 ? buildPageHref(pathname, searchParams, page - 1) : undefined;
  const nextHref =
    page < totalPages
      ? buildPageHref(pathname, searchParams, page + 1)
      : undefined;

  return (
    <footer
      className={cn(
        adminPanelClass,
        "mt-4 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between",
        isPending && "opacity-70",
      )}
      aria-label="Paginación de categorías"
    >
      <p className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
        Mostrando {rangeStart}–{rangeEnd} de {totalCount} categorías
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
            Por página
          </span>
          <Select value={String(pageSize)} onValueChange={updatePageSize}>
            <SelectTrigger
              className={cn(adminInputClass, "h-8 w-[72px] font-mono text-xs")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ADMIN_CATEGORIES_PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={prevHref ?? "#"}
                text="Anterior"
                className={cn(
                  adminBrutalButtonClass,
                  !prevHref && "pointer-events-none opacity-50",
                )}
                onClick={(event) => {
                  if (!prevHref) {
                    event.preventDefault();
                    return;
                  }
                  event.preventDefault();
                  navigate(prevHref);
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 font-mono text-xs font-bold tabular-nums">
                {page} / {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={nextHref ?? "#"}
                text="Siguiente"
                className={cn(
                  adminBrutalButtonClass,
                  !nextHref && "pointer-events-none opacity-50",
                )}
                onClick={(event) => {
                  if (!nextHref) {
                    event.preventDefault();
                    return;
                  }
                  event.preventDefault();
                  navigate(nextHref);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </footer>
  );
}
