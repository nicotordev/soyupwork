"use client";

import { useQuery } from "@tanstack/react-query";
import { getCatalogNavSections } from "@/app/actions/catalog.actions";

export default function useCatalogSections() {
  const catalogSectionsQuery = useQuery({
    queryKey: ["catalog-sections"],
    queryFn: getCatalogNavSections,
    staleTime: 5 * 60_000,
  });

  return catalogSectionsQuery;
}
