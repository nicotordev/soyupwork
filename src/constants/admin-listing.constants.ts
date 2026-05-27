export const ADMIN_LISTING_VIEW_PARAM = "view" as const;

export const ADMIN_LISTING_VIEW = {
  TABLE: "table",
  CARDS: "cards",
} as const;

export type AdminListingViewMode =
  (typeof ADMIN_LISTING_VIEW)[keyof typeof ADMIN_LISTING_VIEW];

export const ADMIN_LISTING_DEFAULT_VIEW: AdminListingViewMode =
  ADMIN_LISTING_VIEW.TABLE;

export const ADMIN_LISTING_SEARCH_DEBOUNCE_MS = 350;
