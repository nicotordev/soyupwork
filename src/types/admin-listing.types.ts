import type { AdminListingViewMode } from "@/constants/admin-listing.constants";
import type { ReactNode } from "react";

export type { AdminListingViewMode };

export type AdminActiveFilter = {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
};

export type AdminTableActionItem = {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  external?: boolean;
};

export type AdminSearchConfig = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
};

export type AdminFiltersConfig = {
  activeCount: number;
  hasActiveFilters: boolean;
  onClear: () => void;
  title?: string;
  children: ReactNode;
};

export type AdminViewConfig = {
  mode: AdminListingViewMode;
  onChange: (mode: AdminListingViewMode) => void;
};
