import type { ResourceCatalogItem } from "@/types/resource-catalog.types";

export type TemplateSection = {
  title: string;
  body: string;
};

export type TemplateDetail = {
  item: ResourceCatalogItem;
  sections: TemplateSection[];
  includes: string[];
  categoryName?: string;
};
