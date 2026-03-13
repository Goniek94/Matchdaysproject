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

  // Shipping
  shippingCost: number;
  shippingTime: string;
  shippingFrom: string;
  trackingNumber: string | null;

  // Relations
  sellerId: string;
  seller?: ListingSeller;
  winnerId: string | null;

  // Bid count from _count
  _count?: {
    bids: number;
  };

  createdAt: string;
  updatedAt: string;
}

// ============================================
// UPDATE LISTING PAYLOAD
// ============================================

export interface UpdateListingPayload {
  title?: string;
  description?: string;
  images?: string[];
  buyNowPrice?: number | null;
  endTime?: string;
  shippingCost?: number;
  shippingTime?: string;
  shippingFrom?: string;
  // Auction details (editable before auction starts)
  size?: string;
  condition?: string;
  playerName?: string | null;
  playerNumber?: string | null;
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
