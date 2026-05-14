/**
 * Auction Adapter
 * Maps SmartFormData (frontend form) to CreateAuctionDto (backend DTO)
 * Also maps AuctionDto (backend response) to the display format used by AuctionCard.
 * Extracted from listings.api.ts to keep API layer clean
 */

import type { SmartFormData } from "@/types/features/listing.types";
import type {
  AuctionDto,
  CreateAuctionDto,
  AuctionListingType,
} from "@/types/api/auction.types";

// ─── Display format (matches AuctionCard props) ───────────────────────────────

export interface AuctionDisplayDto {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  bids: number;
  endTime: string;
  image: string;
  verified: boolean;
  rare: boolean;
  featured?: boolean;
  type: "auction" | "buy_now";
  sport: string;
  category: string;
  itemType: string;
  league?: string;
  seller: {
    name: string;
    avatar?: string;
    rating: number;
    reviews: number;
  };
  country: {
    name: string;
    code: string;
  };
}

/**
 * Formats an ISO date string into a human-readable countdown string.
 * Returns e.g. "2d 4h", "3h 20m", "45m", "Ended"
 */
const formatTimeRemaining = (endTimeIso: string): string => {
  const diff = new Date(endTimeIso).getTime() - Date.now();
  if (diff <= 0) return "Ended";

  const totalMinutes = Math.floor(diff / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/**
 * Maps a single AuctionDto from the backend to the display format used by AuctionCard.
 */
export const adaptAuctionForDisplay = (
  auction: AuctionDto,
): AuctionDisplayDto => ({
  id: auction.id,
  title: auction.title,
  description: auction.description,
  // For buy_now listings show the buyNowPrice (the actual price the buyer pays).
  // For auction/auction_buy_now show the current highest bid (or starting bid if no bids yet).
  // Number() is needed because Prisma Decimal serialises to a string like "100.00".
  price:
    auction.listingType === "buy_now"
      ? Number(auction.buyNowPrice || auction.currentBid || auction.startingBid)
      : Number(auction.currentBid || auction.startingBid),
  currency: "€",
  bids: auction.bidCount,
  endTime: formatTimeRemaining(auction.endTime),
  image: auction.images?.[0] || "/images/placeholder.jpg",
  verified: auction.verified,
  rare: auction.rare,
  featured: auction.featured,
  type: auction.listingType === "buy_now" ? "buy_now" : "auction",
  // category in DB stores the sport (e.g. "football"), itemType stores the item kind
  sport: auction.category || "other",
  category: auction.category || "other",
  itemType: auction.itemType || "shirt",
  league: auction.league ?? undefined,
  seller: {
    // Try username first, then name, then email prefix as last resort.
    // seller relation may be missing if backend version doesn't include it yet.
    name:
      auction.seller?.username ||
      (auction.seller as any)?.name ||
      (auction.seller as any)?.firstName ||
      (auction.seller as any)?.email?.split("@")[0] ||
      // Last resort: shorten the sellerId UUID to a readable handle
      (auction.sellerId ? `user_${auction.sellerId.slice(0, 6)}` : "Unknown"),
    // Treat empty string as no avatar (avoids broken <Image> src)
    avatar: auction.seller?.avatar || undefined,
    rating: auction.seller?.rating ?? 0,
    reviews: auction.seller?.reviews ?? 0,
  },
  country: {
    name: auction.shippingFrom || "Poland",
    // Use seller's country if available, fallback to shippingFrom country code
    code: (auction.seller as any)?.country?.toUpperCase().slice(0, 2) || "PL",
  },
});

/**
 * Maps an array of AuctionDto objects to the display format used by AuctionCard.
 */
export const adaptAuctionsForDisplay = (
  auctions: AuctionDto[],
): AuctionDisplayDto[] => auctions.map(adaptAuctionForDisplay);

/**
 * Maps the multi-step SmartForm data to the backend CreateAuctionDto shape.
 * Handles duration parsing, price logic, and listing type resolution.
 */
export const mapFormDataToCreateAuctionDto = (
  data: SmartFormData,
): CreateAuctionDto => {
  const now = new Date();
  const startTime = now.toISOString();

  // Parse duration string (e.g. "7d", "12h", "30m")
  const durationMatch = data.duration.match(/(\d+)([dhm])/);
  const endTime = new Date(now);

  if (durationMatch) {
    const value = parseInt(durationMatch[1]);
    const unit = durationMatch[2];

    switch (unit) {
      case "d":
        endTime.setDate(endTime.getDate() + value);
        break;
      case "h":
        endTime.setHours(endTime.getHours() + value);
        break;
      case "m":
        endTime.setMinutes(endTime.getMinutes() + value);
        break;
    }
  } else {
    // Default: 7 days
    endTime.setDate(endTime.getDate() + 7);
  }

  // Resolve listing type
  const listingType: AuctionListingType =
    data.listingType === "buy_now" ? "buy_now" : "auction";

  // Resolve size — prefer form value, fallback to AI suggestion
  const resolvedSize = data.size?.trim() || data.aiData?.size?.trim() || "M";

  // Resolve starting bid
  const startingBid = (() => {
    if (data.listingType === "buy_now") {
      const buyNow = parseFloat(String(data.price)) || 10;
      return Math.max(1, Math.floor(buyNow * 0.9));
    }
    return parseFloat(String(data.startPrice)) || 10;
  })();

  // Resolve buy now price
  const buyNowPrice = (() => {
    if (data.listingType === "buy_now") {
      const price = parseFloat(String(data.price));
      return price > 0 ? price : undefined;
    }
    return undefined;
  })();

  return {
    // Basic
    title: data.title || `${data.brand} ${data.model} ${data.club}`.trim(),
    description: data.description || "No description provided",

    // Taxonomy: AI detects → sport (DB: category), item type (DB: itemType), league (DB: league)
    // AI result overrides user selection; user selection is the fallback
    category: data.aiData?.sport || data.sport || "other",
    itemType:
      data.aiData?.itemCategory ||
      data.itemCategory ||
      data.categorySlug ||
      "jersey_shirt",
    league: data.aiData?.league || data.league || undefined,
    listingType,

    // Item details
    team: data.club || data.aiData?.team || "Unknown",
    season: data.season || data.aiData?.season || "Unknown",
    size: resolvedSize,
    condition: data.condition || "excellent",
    manufacturer: data.brand || data.aiData?.brand || undefined,
    model: data.model || data.aiData?.model || undefined,
    playerName: data.playerName || data.aiData?.playerName || undefined,
    playerNumber: data.playerNumber || data.aiData?.playerNumber || undefined,
    productionYear:
      data.productionYear || data.aiData?.productionYear || undefined,
    countryOfProduction:
      data.countryOfProduction?.trim() ||
      data.aiData?.countryOfProduction?.trim() ||
      undefined,
    serialCode:
      data.serialCode?.trim() || data.aiData?.serialCode?.trim() || undefined,

    // Verification
    tagCondition: data.verification?.tagCondition || undefined,
    hasAutograph: data.verification?.hasAutograph || false,
    autographDetails: data.verification?.autographDetails || undefined,
    isVintage: data.verification?.isVintage || false,
    vintageYear: data.verification?.vintageYear || undefined,

    // Images
    images: data.photos.map((photo) => photo.url),

    // Pricing
    startingBid,
    bidIncrement: parseFloat(String(data.bidStep)) || 5,
    buyNowPrice,

    // Timing
    startTime,
    endTime: endTime.toISOString(),

    // Shipping
    shippingCost: 0,
    shippingTime: "3-5 business days",
    shippingFrom: "Poland",

    // verified / rare / featured intentionally not sent — the backend rejects
    // them on CreateAuctionDto (sellers were flagging their own listings as
    // "Featured/Verified"). The AI worker sets verified=true when score >= 90,
    // and admins flip rare/featured via dedicated routes.

    // Completion mode: tells backend whether to start as PENDING_APPROVAL (MANUAL) or active (AI)
    completionMode: data.completionMode ?? "MANUAL",
  };
};
