// Auction types
export interface Auction {
  id: string;
  title: string;
  description: string;
  price: number; // Changed from currentBid to match mockData
  currency: string;
  bids: number; // Changed from bidCount to match mockData
  endTime: string; // Changed from timeLeft to match mockData
  image: string;
  verified: boolean;
  rare: boolean;
  type: "auction" | "buy_now"; // Type of listing (Auction / Buy Now)
  itemType: "shirt" | "shoes" | "pants" | "accessory"; // Product type
  seller: Seller;
  country: {
    name: string;
    code: string;
  };
  images?: string[];
  // Legacy support for old components
  currentBid?: number;
  bidCount?: number;
  timeLeft?: string;
}

export interface Seller {
  name: string;
  rating: number;
  reviews: number;
  sales?: number;
  positivePercentage?: number;
  avgShippingTime?: string;
}

// Bid types
export interface Bid {
  id: string;
  username: string;
  amount: number;
  time: string;
  isWinning: boolean;
}

// My Active Bid types
export interface MyActiveBid extends Auction {
  myBid: number;
  status: "winning" | "outbid";
}
