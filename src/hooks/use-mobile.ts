import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const IS_MOBILE_QUERY_KEY = ["ui", "isMobile"] as const;

export function useIsMobile() {
  const queryClient = useQueryClient();
  const isBrowser = typeof window !== "undefined";

  const isMobileQuery = useQuery({
    queryKey: IS_MOBILE_QUERY_KEY,
    queryFn: () => window.innerWidth < MOBILE_BREAKPOINT,
    enabled: isBrowser,
    staleTime: Infinity,
    gcTime: Infinity,
    initialData: () =>
      isBrowser ? window.innerWidth < MOBILE_BREAKPOINT : false,
  });

  React.useEffect(() => {
    if (!isBrowser) return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      queryClient.setQueryData(
        IS_MOBILE_QUERY_KEY,
        window.innerWidth < MOBILE_BREAKPOINT,
      );
    };

    mql.addEventListener("change", onChange);
    onChange();

    return () => mql.removeEventListener("change", onChange);
  }, [isBrowser, queryClient]);

  return !!isMobileQuery.data;
}
