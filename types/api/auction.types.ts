/**
 * Auction API DTO Types
 * TypeScript types matching the NestJS backend responses exactly
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

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

// ─── Embedded DTOs ────────────────────────────────────────────────────────────

export interface AuctionSellerDto {
  id: string;
  username: string;
  rating: number;
  reviews: number;
  sales?: number;
  positivePercentage?: number;
  avgShippingTime?: string;
  avatar?: string;
}

// ─── Main Auction DTO ─────────────────────────────────────────────────────────

export interface AuctionDto {
  id: string;
  title: string;
  description: string;

  // Category & Type
  category: string;
  itemType: string;
  listingType: AuctionListingType;
  status: AuctionStatus;

  // Item details
  team: string;
  season: string;
  size: string;
  sizeEU?: string | null;
  sizeUK?: string | null;
  condition: string;
  manufacturer: string | null;
  model: string | null;
  playerName: string | null;
  playerNumber: string | null;
  productionYear: string | null;
  countryOfProduction: string | null;
  serialCode: string | null;

  // Verification
  tagCondition: string | null;
  hasAutograph: boolean;
  autographDetails: string | null;
  isVintage: boolean;
  vintageYear: string | null;

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

  // Flags
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
  seller: AuctionSellerDto;
  winnerId: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ─── Auction with Bids (detail view) ─────────────────────────────────────────

export interface AuctionBidDto {
  id: string;
  amount: number;
  createdAt: string;
  bidder: {
    id: string;
    username: string;
  };
}

export interface AuctionDetailDto extends AuctionDto {
  bids: AuctionBidDto[];
  _count?: {
    bids: number;
    favorites?: number;
  };
}

// ─── List Response ────────────────────────────────────────────────────────────

export interface AuctionListDto {
  auctions: AuctionDto[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface AuctionFilters {
  page?: number;
  limit?: number;
  category?: string;
  team?: string;
  status?: AuctionStatus | "all";
  listingType?: AuctionListingType;
  search?: string;
  sortBy?: "endDate" | "price" | "bids" | "createdAt";
  order?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  brand?: string;
}

// ─── Create / Update DTOs ─────────────────────────────────────────────────────

export interface CreateAuctionDto {
  // Basic
  title: string;
  description: string;

  // Category
  category: string;
  itemType: string;
  listingType: AuctionListingType;

  // Item details
  team: string;
  season: string;
  size: string;
  condition: string;
  manufacturer?: string;
  model?: string;
  playerName?: string;
  playerNumber?: string;
  productionYear?: string;
  countryOfProduction?: string;
  serialCode?: string;

  // Verification
  tagCondition?: string;
  hasAutograph?: boolean;
  autographDetails?: string;
  isVintage?: boolean;
  vintageYear?: string;

  // Images
  images: string[];

  // Pricing
  startingBid: number;
  bidIncrement: number;
  buyNowPrice?: number;

  // Timing
  startTime: string;
  endTime: string;

  // Shipping
  shippingCost: number;
  shippingTime: string;
  shippingFrom: string;

  // Flags
  verified?: boolean;
  rare?: boolean;
  featured?: boolean;
}

export interface UpdateAuctionDto {
  title?: string;
  description?: string;
  images?: string[];
  buyNowPrice?: number | null;
  endTime?: string;
  shippingCost?: number;
  shippingTime?: string;
  shippingFrom?: string;
  size?: string;
  condition?: string;
  playerName?: string | null;
  playerNumber?: string | null;
}

export interface RelistAuctionDto {
  endTime: string;
  listingType?: AuctionListingType;
  startingBid?: number;
  buyNowPrice?: number;
  bidIncrement?: number;
  title?: string;
  description?: string;
}
