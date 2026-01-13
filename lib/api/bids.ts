/**
 * Bids API Service
 * Handles all bid-related API calls
 */

import apiClient from "./client";
import { ApiResponse } from "./config";
import { clearCacheEntry } from "./client";

// Bid data interface
export interface BidData {
  id: string;
  auctionId: string;
  userId: string;
  amount: number;
  isWinning: boolean;
  createdAt: string;
  user?: {
    id: string;
    username: string;
  };
  auction?: {
    id: string;
    title: string;
    endDate: string;
    status: string;
  };
}

// Place bid data interface
export interface PlaceBidData {
  amount: number;
}

/**
 * Place a bid on an auction
 * @param auctionId - Auction ID
 * @param amount - Bid amount
 * @returns Bid data
 */
export const placeBid = async (
  auctionId: string,
  amount: number
): Promise<ApiResponse<BidData>> => {
  try {
    const response = await apiClient.post<ApiResponse<BidData>>(
      `/auctions/${auctionId}/bid`,
      { amount }
    );

    // Clear auction cache to refresh current price
    clearCacheEntry(`auction_${auctionId}`);
    clearCacheEntry("auctions_{}");

    return response.data;
  } catch (error: any) {
    console.error("Place bid error:", error);
    throw error;
  }
};

/**
 * Get user's bids
 * @param status - Filter by status (optional)
 * @returns List of user's bids
 */
export const getUserBids = async (
  status?: "winning" | "outbid" | "won" | "lost"
): Promise<ApiResponse<BidData[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<BidData[]>>("/bids/my", {
      params: { status },
    });

    return response.data;
  } catch (error: any) {
    console.error("Get user bids error:", error);
    throw error;
  }
};

/**
 * Get bids for a specific auction
 * @param auctionId - Auction ID
 * @returns List of bids for the auction
 */
export const getAuctionBids = async (
  auctionId: string
): Promise<ApiResponse<BidData[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<BidData[]>>(
      `/bids/auction/${auctionId}`
    );

    return response.data;
  } catch (error: any) {
    console.error("Get auction bids error:", error);
    throw error;
  }
};

/**
 * Get bid history for an auction (with pagination)
 * @param auctionId - Auction ID
 * @param page - Page number
 * @param limit - Items per page
 * @returns Paginated bid history
 */
export const getAuctionBidHistory = async (
  auctionId: string,
  page: number = 1,
  limit: number = 20
): Promise<
  ApiResponse<{
    bids: BidData[];
    total: number;
    page: number;
    totalPages: number;
  }>
> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{
        bids: BidData[];
        total: number;
        page: number;
        totalPages: number;
      }>
    >(`/auctions/${auctionId}/bids/history`, {
      params: { page, limit },
    });

    return response.data;
  } catch (error: any) {
    console.error("Get auction bid history error:", error);
    throw error;
  }
};

/**
 * Get user's active bids (auctions still running)
 * @returns List of active bids
 */
export const getActiveBids = async (): Promise<ApiResponse<BidData[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<BidData[]>>(
      "/bids/my/active"
    );

    return response.data;
  } catch (error: any) {
    console.error("Get active bids error:", error);
    throw error;
  }
};

/**
 * Get user's won auctions
 * @returns List of won auctions
 */
export const getWonAuctions = async (): Promise<ApiResponse<BidData[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<BidData[]>>(
      "/bids/my/won"
    );

    return response.data;
  } catch (error: any) {
    console.error("Get won auctions error:", error);
    throw error;
  }
};

/**
 * Cancel/retract a bid (if allowed by auction rules)
 * @param bidId - Bid ID
 * @returns Success status
 */
export const cancelBid = async (bidId: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.delete<ApiResponse>(`/bids/${bidId}`);

    return response.data;
  } catch (error: any) {
    console.error("Cancel bid error:", error);
    throw error;
  }
};

/**
 * Get highest bid for an auction
 * @param auctionId - Auction ID
 * @returns Highest bid data
 */
export const getHighestBid = async (
  auctionId: string
): Promise<ApiResponse<BidData>> => {
  try {
    const response = await apiClient.get<ApiResponse<BidData>>(
      `/auctions/${auctionId}/bids/highest`
    );

    return response.data;
  } catch (error: any) {
    console.error("Get highest bid error:", error);
    throw error;
  }
};

/**
 * Check if user is winning an auction
 * @param auctionId - Auction ID
 * @returns Winning status
 */
export const checkWinningStatus = async (
  auctionId: string
): Promise<ApiResponse<{ isWinning: boolean; currentBid?: BidData }>> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{ isWinning: boolean; currentBid?: BidData }>
    >(`/auctions/${auctionId}/bids/status`);

    return response.data;
  } catch (error: any) {
    console.error("Check winning status error:", error);
    throw error;
  }
};
