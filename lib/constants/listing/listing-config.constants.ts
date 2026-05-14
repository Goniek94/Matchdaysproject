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

// Auction listings only. Buy-now listings have no duration cap — they stay
// up until sold or manually cancelled. Hard ceiling at 7 days keeps the
// marketplace alive (no stale listings) and forces faster price discovery.
export const AUCTION_DURATIONS = [
  { id: "24h", label: "24 hours" },
  { id: "48h", label: "48 hours" },
  { id: "3d", label: "3 days" },
  { id: "5d", label: "5 days" },
  { id: "7d", label: "7 days" },
] as const;

/** Max allowed auction duration in milliseconds — used for backend validation parity. */
export const AUCTION_MAX_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// ============================================
// CURRENCY
// ============================================

export const CURRENCY = {
  SYMBOL: "€",
  CODE: "EUR",
} as const;
