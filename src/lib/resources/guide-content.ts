import type { ResourceCatalogItem } from "@/types/resource-catalog.types";

export type GuideDetail = {
  item: ResourceCatalogItem;
  content: string;
  categoryName?: string;
};
