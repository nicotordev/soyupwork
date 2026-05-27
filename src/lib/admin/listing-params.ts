import {
  ADMIN_LISTING_DEFAULT_VIEW,
  ADMIN_LISTING_VIEW,
  ADMIN_LISTING_VIEW_PARAM,
  type AdminListingViewMode,
} from "@/constants/admin-listing.constants";

export function parseAdminViewMode(
  raw: string | null | undefined,
): AdminListingViewMode {
  if (raw === ADMIN_LISTING_VIEW.CARDS) return ADMIN_LISTING_VIEW.CARDS;
  if (raw === ADMIN_LISTING_VIEW.TABLE) return ADMIN_LISTING_VIEW.TABLE;
  return ADMIN_LISTING_DEFAULT_VIEW;
}

export function adminViewModeToParam(
  mode: AdminListingViewMode,
): string | null {
  if (mode === ADMIN_LISTING_DEFAULT_VIEW) return null;
  return mode;
}

export { ADMIN_LISTING_VIEW_PARAM };
