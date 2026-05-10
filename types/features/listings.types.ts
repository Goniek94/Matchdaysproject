/**
 * Listings Types
 * TypeScript type definitions for user listings / auctions management
 */

// ============================================
// AUCTION STATUS
// ============================================

export type AuctionStatus =
  | "upcoming"
  | "active"
  | "ended"
  | "cancelled"
  | "sold"
  | "awaiting_payment"
  | "paid"
  | "shipped"
  | "delivered"
  | "completed";

export type AuctionListingType = "auction" | "buy_now" | "auction_buy_now";

// ============================================
// SELLER INFO (embedded in auction)
// ============================================

export interface ListingSeller {
  id: string;
  username: string;
  rating: number;
  reviews: number;
}

// ============================================
// MY LISTING (user's own auction)
// ============================================

export interface MyListing {
  id: string;
  title: string;
  description: string;

  // Category & Type
  category: string;
  itemType: string;
  listingType: AuctionListingType;

  // Details
  team: string;
  season: string;
  size: string;
  condition: string;
  manufacturer: string | null;
  playerName: string | null;
  playerNumber: string | null;

  // Images
  images: string[];

  // Pricing
  startingBid: number;
  currentBid: number;
  bidCount: number;
  bidIncrement: number;
  buyNowPrice: number | null;

  // Timing
  startTime: string;
  endTime: string;

  // Status
  status: AuctionStatus;
  verified: boolean;
  rare: boolean;
  featured: boolean;
  views: number;

  // AI verification score (0-100, set asynchronously by the AI worker after publish)
  authenticityScore?: number | null;

  // Shipping
  shippingCost: number;
  shippingTime: string;
  shippingFrom: string;
  trackingNumber: string | null;

  // Relations
  sellerId: string;
  seller?: ListingSeller;
  winnerId: string | null;

  // Favorites count
  favoritesCount?: number;

  // Bid count from _count
  _count?: {
    bids: number;
    favorites?: number;
  };

  createdAt: string;
  updatedAt: string;
}

// ============================================
// UPDATE LISTING PAYLOAD
// ============================================

/**
 * Fields the seller can edit on an existing auction.
 *
 * Backend lock rule (AuctionsService.update):
 * - listingType "buy_now"                          → all fields editable while open
 * - listingType "auction"/"auction_buy_now"
 *     • bidCount === 0 → all fields editable
 *     • bidCount  > 0  → only description, images and shipping*
 *                        (price/details locked once people are bidding)
 */
export interface UpdateListingPayload {
  // Basic
  title?: string;
  description?: string;
  images?: string[];

  // Categorisation
  category?: string;
  itemType?: string;
  league?: string;
  team?: string;
  season?: string;

  // Item details
  size?: string;
  sizeEU?: string;
  sizeUK?: string;
  condition?: string;
  tagCondition?: string;
  manufacturer?: string;
  model?: string;
  countryOfProduction?: string;
  productionYear?: string;
  serialCode?: string;
  playerName?: string | null;
  playerNumber?: string | null;

  // Authenticity
  hasAutograph?: boolean;
  autographDetails?: string;
  isVintage?: boolean;
  vintageYear?: string;

  // Pricing & timing
  startingBid?: number;
  bidIncrement?: number;
  buyNowPrice?: number | null;
  startTime?: string;
  endTime?: string;
  listingType?: AuctionListingType;

  // Shipping
  shippingCost?: number;
  shippingTime?: string;
  shippingFrom?: string;
}

// ============================================
// LISTING STATS (for dashboard)
// ============================================

export interface ListingStats {
  total: number;
  active: number;
  upcoming: number;
  ended: number;
  sold: number;
  cancelled: number;
}

// ============================================
// STATUS FILTER
// ============================================

export type ListingStatusFilter =
  | "all"
  | "active"
  | "upcoming"
  | "ended"
  | "sold"
  | "cancelled";
