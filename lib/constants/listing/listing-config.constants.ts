/**
 * Listing Configuration Constants
 * Photo limits, listing types, auction durations, and currency settings
 */

// ============================================
// PHOTO LIMITS
// ============================================

export const PHOTO_LIMITS = {
  MIN: 5,
  MAX: 15,
} as const;

// ============================================
// LISTING TYPES
// ============================================

export const LISTING_TYPES = {
  AUCTION: "auction",
  BUY_NOW: "buy_now",
} as const;

// ============================================
// AUCTION DURATIONS
// ============================================

export const AUCTION_DURATIONS = [
  { id: "24h", label: "24 hours" },
  { id: "3d", label: "3 days" },
  { id: "7d", label: "7 days" },
  { id: "14d", label: "14 days" },
] as const;

// ============================================
// CURRENCY
// ============================================

export const CURRENCY = {
  SYMBOL: "€",
  CODE: "EUR",
} as const;
