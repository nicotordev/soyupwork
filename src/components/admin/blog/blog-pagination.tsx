"use client";

import { ADMIN_BLOG_PAGE_SIZE_OPTIONS } from "@/constants/blog.constants";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { BlogPagination } from "@/types/blog.types";
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

type BlogPaginationBarProps = {
  pagination: BlogPagination;
};

function buildPageHref(
  pathname: string,
  searchParams: URLSearchParams,
  page: number,
): string {
  const params = new URLSearchParams(searchParams.toString());
  if (page <= 1) params.delete("page");
  else params.set("page", String(page));
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function BlogPaginationBar({ pagination }: BlogPaginationBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { page, pageSize, totalCount, totalPages } = pagination;
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalCount);

  if (totalCount === 0) return null;

  const navigate = (href: string) => {
    startTransition(() => router.replace(href, { scroll: false }));
  };

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
    >
      <p className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
        {rangeStart}–{rangeEnd} de {totalCount}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("pageSize", value);
            params.delete("page");
            startTransition(() => {
              const next = params.toString();
              router.replace(next ? `${pathname}?${next}` : pathname, {
                scroll: false,
              });
            });
          }}
        >
          <SelectTrigger className={cn(adminInputClass, "h-8 w-[72px]")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ADMIN_BLOG_PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={prevHref ?? "#"}
                className={cn(
                  adminBrutalButtonClass,
                  !prevHref && "opacity-50",
                )}
                onClick={(e) => {
                  if (!prevHref) {
                    e.preventDefault();
                    return;
                  }
                  e.preventDefault();
                  navigate(prevHref);
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 font-mono text-xs font-bold">
                {page}/{totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={nextHref ?? "#"}
                className={cn(
                  adminBrutalButtonClass,
                  !nextHref && "opacity-50",
                )}
                onClick={(e) => {
                  if (!nextHref) {
                    e.preventDefault();
                    return;
                  }
                  e.preventDefault();
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
