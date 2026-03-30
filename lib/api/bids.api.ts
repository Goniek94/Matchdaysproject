/**
 * Bids API Service
 * Handles all bid-related API calls.
 * Uses axios apiClient with HTTP-Only cookie auth (withCredentials: true).
 */

import apiClient from "./client";
import type { ApiResponse } from "./config";
import type {
  BidDto,
  BidHistoryDto,
  BidWinningStatusDto,
  PlaceBidResponseDto,
} from "@/types/api/bid.types";

// ─── Place Bid ────────────────────────────────────────────────────────────────

/**
 * Place a bid on an auction.
 * Requires authentication (HTTP-Only cookie).
 */
export const placeBid = async (
  auctionId: string,
  amount: number,
): Promise<ApiResponse<PlaceBidResponseDto>> => {
  const response = await apiClient.post<ApiResponse<PlaceBidResponseDto>>(
    `/auctions/${auctionId}/bid`,
    { amount },
  );
  return response.data;
};

// ─── Get Auction Bids ─────────────────────────────────────────────────────────

/**
 * Get all bids for a specific auction.
 * Public endpoint — no auth required.
 */
export const getAuctionBids = async (
  auctionId: string,
): Promise<ApiResponse<BidDto[]>> => {
  const response = await apiClient.get<ApiResponse<BidDto[]>>(
    `/bids/auction/${auctionId}`,
  );
  return response.data;
};

/**
 * Get paginated bid history for an auction.
 * Public endpoint — no auth required.
 */
export const getAuctionBidHistory = async (
  auctionId: string,
  page: number = 1,
  limit: number = 20,
): Promise<ApiResponse<BidHistoryDto>> => {
  const response = await apiClient.get<ApiResponse<BidHistoryDto>>(
    `/auctions/${auctionId}/bids/history`,
    { params: { page, limit } },
  );
  return response.data;
};

// ─── My Bids ──────────────────────────────────────────────────────────────────

/**
 * Get all bids placed by the current user.
 * Requires authentication (HTTP-Only cookie).
 */
export const getMyBids = async (
  status?: "winning" | "outbid" | "won" | "lost",
): Promise<ApiResponse<BidDto[]>> => {
  const response = await apiClient.get<ApiResponse<BidDto[]>>("/bids/my", {
    params: status ? { status } : {},
  });
  return response.data;
};

/**
 * Get active bids (auctions still running) for the current user.
 * Requires authentication (HTTP-Only cookie).
 */
export const getMyActiveBids = async (): Promise<ApiResponse<BidDto[]>> => {
  const response =
    await apiClient.get<ApiResponse<BidDto[]>>("/bids/my/active");
  return response.data;
};

/**
 * Get auctions won by the current user.
 * Requires authentication (HTTP-Only cookie).
 */
export const getMyWonAuctions = async (): Promise<ApiResponse<BidDto[]>> => {
  const response = await apiClient.get<ApiResponse<BidDto[]>>("/bids/my/won");
  return response.data;
};

// ─── Bid Status ───────────────────────────────────────────────────────────────

/**
 * Check if the current user is winning a specific auction.
 * Requires authentication (HTTP-Only cookie).
 */
export const checkWinningStatus = async (
  auctionId: string,
): Promise<ApiResponse<BidWinningStatusDto>> => {
  const response = await apiClient.get<ApiResponse<BidWinningStatusDto>>(
    `/auctions/${auctionId}/bids/status`,
  );
  return response.data;
};

// ─── Cancel Bid ───────────────────────────────────────────────────────────────

/**
 * Cancel / retract a bid (if allowed by auction rules).
 * Requires authentication (HTTP-Only cookie).
 */
export const cancelBid = async (bidId: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/bids/${bidId}`);
  return response.data;
};
