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
  category: string;   // stores sport: "football" | "basketball" | etc.
  itemType: string;   // stores item category: "jersey_shirt" | "boots_cleats" | etc.
  league: string | null; // competition/league: "Premier League" | "NBA" | etc.
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

export type AuctionSort =
  | "recommended"
  | "newest"
  | "ending_soon"
  | "price_low"
  | "price_high"
  | "most_bids";

export interface AuctionFilters {
  page?: number;
  limit?: number;
  category?: string;    // sport: "football" | "basketball" | etc.
  itemType?: string;    // item category: "jersey_shirt" | "boots_cleats" | etc.
  league?: string;      // "Premier League" | "NBA" | etc.
  team?: string;
  season?: string;
  status?: AuctionStatus | "all";
  listingType?: AuctionListingType;
  q?: string;           // server-side full-text search across title/description/team/player/manufacturer
  sort?: AuctionSort;   // server-side sort order
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
}

// ─── Create / Update DTOs ─────────────────────────────────────────────────────

export interface CreateAuctionDto {
  // Basic
  title: string;
  description: string;

  // Category
  category: string;
  itemType: string;
  league?: string;
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

  // verified / rare / featured intentionally NOT in the create payload —
  // backend rejects them (sellers were flagging their own listings as
  // "Featured/Verified"). They're set server-side by the AI worker and admin.

  // Flow control (tells backend whether to start as PENDING_APPROVAL or active)
  completionMode?: string;
}

/**
 * Mirrors backend UpdateAuctionDto (apps/backend/src/modules/auctions/dto/update-auction.dto.ts).
 * Lock-after-bid is enforced server-side; the client may freely send any subset.
 */
export interface UpdateAuctionDto {
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

/**
 * Mirrors backend RelistAuctionDto. Same surface as UpdateAuctionDto plus a
 * required `endTime` (relisting always sets a new deadline).
 */
export interface RelistAuctionDto {
  endTime: string;

  startTime?: string;
  listingType?: AuctionListingType;
  startingBid?: number;
  buyNowPrice?: number | null;
  bidIncrement?: number;

  title?: string;
  description?: string;
  images?: string[];

  category?: string;
  itemType?: string;
  league?: string;
  team?: string;
  season?: string;

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

  hasAutograph?: boolean;
  autographDetails?: string;
  isVintage?: boolean;
  vintageYear?: string;

  shippingCost?: number;
  shippingTime?: string;
  shippingFrom?: string;
}
