"use client";

import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3,
    },
  },
});

type QueryClientProviderProps = {
  children: ReactNode;
};

export default function QueryClientProvider({
  children,
}: QueryClientProviderProps) {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
}
