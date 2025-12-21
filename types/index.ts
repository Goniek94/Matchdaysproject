// Auction types
export interface Auction {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  bidCount: number;
  timeLeft: string;
  image: string;
  verified: boolean;
  rare: boolean;
  seller: Seller;
  images?: string[];
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
