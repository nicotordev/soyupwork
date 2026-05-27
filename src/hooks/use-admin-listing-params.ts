"use client";

import {
  ADMIN_LISTING_SEARCH_DEBOUNCE_MS,
  ADMIN_LISTING_VIEW_PARAM,
  type AdminListingViewMode,
} from "@/constants/admin-listing.constants";
import {
  adminViewModeToParam,
  parseAdminViewMode,
} from "@/lib/admin/listing-params";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

type UseAdminListingParamsOptions = {
  searchParamKey?: string;
  debounceMs?: number;
  resetPageOnChange?: boolean;
};

export function useAdminListingParams(
  options: UseAdminListingParamsOptions = {},
) {
  const {
    searchParamKey = "q",
    debounceMs = ADMIN_LISTING_SEARCH_DEBOUNCE_MS,
    resetPageOnChange = true,
  } = options;

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlQuery = searchParams.get(searchParamKey) ?? "";
  const [localQuery, setLocalQuery] = useState(urlQuery);

  useEffect(() => {
    setLocalQuery(urlQuery);
  }, [urlQuery]);

  const viewMode = useMemo(
    () => parseAdminViewMode(searchParams.get(ADMIN_LISTING_VIEW_PARAM)),
    [searchParams],
  );

  const replaceParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const next = params.toString();
      const current = searchParams.toString();
      if (next === current) return;

      startTransition(() => {
        router.replace(next ? `${pathname}?${next}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams],
  );

  const setParam = useCallback(
    (key: string, value: string | null, defaultValue?: string) => {
      replaceParams((params) => {
        const shouldDelete =
          value === null ||
          value === "" ||
          (defaultValue !== undefined && value === defaultValue);

        if (shouldDelete) {
          params.delete(key);
        } else {
          params.set(key, value);
        }

        if (resetPageOnChange && key !== "page") {
          params.delete("page");
        }
      });
    },
    [replaceParams, resetPageOnChange],
  );

  const setViewMode = useCallback(
    (mode: AdminListingViewMode) => {
      const param = adminViewModeToParam(mode);
      setParam(ADMIN_LISTING_VIEW_PARAM, param);
    },
    [setParam],
  );

  const clearParams = useCallback(
    (keys?: string[]) => {
      setLocalQuery("");
      replaceParams((params) => {
        if (keys) {
          for (const key of keys) {
            params.delete(key);
          }
        } else {
          const preservedView = params.get(ADMIN_LISTING_VIEW_PARAM);
          for (const key of [...params.keys()]) {
            params.delete(key);
          }
          if (preservedView) {
            params.set(ADMIN_LISTING_VIEW_PARAM, preservedView);
          }
        }
        params.delete("page");
      });
    },
    [replaceParams],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = localQuery.trim();
      const current = searchParams.get(searchParamKey) ?? "";

      if (trimmed === current) return;

      replaceParams((params) => {
        if (trimmed) {
          params.set(searchParamKey, trimmed);
        } else {
          params.delete(searchParamKey);
        }
        params.delete("page");
      });
    }, debounceMs);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- avoid loop on searchParams
  }, [localQuery, debounceMs, searchParamKey, replaceParams]);

  return {
    pathname,
    searchParams,
    isPending,
    localQuery,
    setLocalQuery,
    urlQuery,
    viewMode,
    setViewMode,
    setParam,
    clearParams,
    replaceParams,
  };
}
