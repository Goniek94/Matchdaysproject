/**
 * My Listings API Service
 * Handles all API calls related to the current user's own auction listings
 */

import apiClient from "./client";
import type { ApiResponse } from "./config";
import type {
  MyListing,
  UpdateListingPayload,
} from "@/types/features/listings.types";

// ─── Get My Listings ──────────────────────────────────────────────────────────

/**
 * Fetch all auctions belonging to the currently authenticated user
 * @param status - Optional status filter (active, upcoming, ended, sold, cancelled)
 */
export const getMyListings = async (
  status?: string,
): Promise<ApiResponse<MyListing[]>> => {
  const params = status ? { status } : {};
  const response = await apiClient.get<ApiResponse<MyListing[]>>(
    "/auctions/my/auctions",
    { params },
  );
  return response.data;
};

// ─── Update Listing ───────────────────────────────────────────────────────────

/**
 * Update an existing auction (seller only, limited fields)
 * @param id - Auction ID
 * @param payload - Fields to update
 */
export const updateListing = async (
  id: string,
  payload: UpdateListingPayload,
): Promise<ApiResponse<MyListing>> => {
  const response = await apiClient.patch<ApiResponse<MyListing>>(
    `/auctions/${id}`,
    payload,
  );
  return response.data;
};

// ─── Delete Listing ───────────────────────────────────────────────────────────

/**
 * Permanently delete an auction (only if no bids have been placed)
 * @param id - Auction ID
 */
export const deleteListing = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/auctions/${id}`);
  return response.data;
};

// ─── Cancel Listing ───────────────────────────────────────────────────────────

/**
 * Cancel an auction (marks status as "cancelled", works even with bids)
 * @param id - Auction ID
 */
export const cancelListing = async (
  id: string,
): Promise<ApiResponse<MyListing>> => {
  const response = await apiClient.patch<ApiResponse<MyListing>>(
    `/auctions/${id}/cancel`,
  );
  return response.data;
};
