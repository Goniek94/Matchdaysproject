/**
 * Auction Adapter
 * Converts backend auction data to frontend format
 */

export function adaptAuctionForDisplay(backendAuction: any) {
  // Calculate time remaining
  const calculateTimeRemaining = (endTime: string) => {
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
    likes: 0, // Can be added later
    endTime: calculateTimeRemaining(backendAuction.endTime),
    verified: backendAuction.verified || false,
    rare: backendAuction.rare || false,
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

export function adaptAuctionsForDisplay(backendAuctions: any[]) {
  return backendAuctions.map(adaptAuctionForDisplay);
}
