/**
 * Auction Adapter
 * Converts backend auction data to frontend display format
 * Also filters out ended/sold/cancelled auctions as a safety net
 */

// Statuses that should NOT be shown on public listing pages
const HIDDEN_STATUSES = ["ended", "sold", "cancelled"];

export function adaptAuctionForDisplay(backendAuction: any) {
  // Calculate time remaining
  const calculateTimeRemaining = (endTime: string): string => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return {
    id: backendAuction.id,
    title: backendAuction.title,
    price: Number(backendAuction.currentBid || backendAuction.startingBid || 0),
    currency: "PLN",
    description: backendAuction.description || "No description",
    image: backendAuction.images?.[0] || "/placeholder-jersey.jpg",
    bids: backendAuction.bidCount || 0,
    likes: 0,
    endTime: calculateTimeRemaining(backendAuction.endTime),
    endTimeRaw: backendAuction.endTime, // Keep raw for sorting
    verified: backendAuction.verified || false,
    rare: backendAuction.rare || false,
    status: backendAuction.status || "active", // Pass status to frontend
    type: backendAuction.listingType === "buy_now" ? "buy_now" : "auction",
    itemType: backendAuction.itemType || "shirt",
    seller: {
      name: backendAuction.seller?.username || "Unknown",
      avatar: backendAuction.seller?.avatar || undefined,
      rating: backendAuction.seller?.rating || 5.0,
      reviews: backendAuction.seller?.reviews || 0,
    },
    country: {
      name: "Poland",
      code: "pl",
    },
  };
}

/**
 * Adapt and filter auctions for public display
 * Filters out ended/sold/cancelled as a frontend safety net
 * (backend should already filter, but this is a double check)
 */
export function adaptAuctionsForDisplay(backendAuctions: any[]) {
  return backendAuctions
    .filter((auction) => !HIDDEN_STATUSES.includes(auction.status))
    .map(adaptAuctionForDisplay);
}

/**
 * Adapt all auctions without filtering (for admin/my-listings views)
 */
export function adaptAllAuctionsForDisplay(backendAuctions: any[]) {
  return backendAuctions.map(adaptAuctionForDisplay);
}
