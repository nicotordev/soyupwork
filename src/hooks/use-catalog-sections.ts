import { useQuery } from "@tanstack/react-query";
import { getCatalogNavSections } from "@/app/actions/catalog.actions";

export default function useCatalogSections() {
  const catalogSectionsQuery = useQuery({
    queryKey: ["catalog-sections"],
    queryFn: getCatalogNavSections,
  });

  return catalogSectionsQuery;
}
