export interface CatalogFilterCategory {
  name: string;
  slug: string;
}

export interface CatalogFilterLevel {
  /** Value stored in URL (`?level=`) — Spanish label */
  label: string;
}

export interface CatalogFilterDuration {
  label: string;
  min: number;
  max: number;
}

export interface CatalogFilterOptions {
  categories: CatalogFilterCategory[];
  levels: CatalogFilterLevel[];
  durations: CatalogFilterDuration[];
}
