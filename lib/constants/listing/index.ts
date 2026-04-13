/**
 * Listing Constants - Barrel Export
 *
 * Organized into logical modules:
 * - categories:       Category definitions with verification requirements
 * - product-options:  Conditions, sizes, defect types, brands
 * - listing-config:   Photo limits, listing types, auction durations, currency
 * - photo-groups:     Photo group configurations per category
 */

export { CATEGORIES } from "./categories.constants";

export {
  SPORTS,
  ITEM_CATEGORIES,
  ALL_SPORT_IDS,
  ALL_ITEM_CATEGORY_IDS,
  getItemCategoriesForSport,
  getCategoryBreadcrumb,
} from "./taxonomy.constants";

export type { Sport, SportId, ItemCategory, ItemCategoryId } from "./taxonomy.constants";

export {
  CONDITIONS,
  SHIRT_SIZES,
  DEFECT_TYPES,
  BRANDS,
} from "./product-options.constants";

export {
  PHOTO_LIMITS,
  LISTING_TYPES,
  AUCTION_DURATIONS,
  CURRENCY,
} from "./listing-config.constants";

export {
  CATEGORY_PHOTO_GROUPS,
  getPhotoGroupsForCategory,
} from "./photo-groups.constants";

export type { PhotoConfig, PhotoGroup } from "./photo-groups.constants";
