/**
 * Bid API DTO Types
 * TypeScript types matching the NestJS backend responses exactly
 */

// ─── Main Bid DTO ─────────────────────────────────────────────────────────────

export interface BidDto {
  id: string;
  amount: number;
  auctionId: string;
  bidderId: string;
  createdAt: string;
  bidder?: {
    id: string;
    username: string;
  };
  auction?: {
    id: string;
    title: string;
    endTime: string;
    status: string;
    images: string[];
  };
}

// ─── Place Bid ────────────────────────────────────────────────────────────────

export interface PlaceBidDto {
  amount: number;
}

export interface PlaceBidResponseDto {
  bid: BidDto;
  auction: {
    id: string;
    currentBid: number;
    bidCount: number;
    endTime: string;
  };
}

// ─── Bid History ─────────────────────────────────────────────────────────────

export interface BidHistoryDto {
  bids: BidDto[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Winning Status ───────────────────────────────────────────────────────────

export interface BidWinningStatusDto {
  isWinning: boolean;
  currentBid?: BidDto;
}
