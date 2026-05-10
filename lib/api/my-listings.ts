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
import type { RelistPayload } from "@/components/my-listings/RelistAuctionModal";

// ─── Get Single Listing ───────────────────────────────────────────────────────

/**
 * Fetch a single auction by ID (for edit page)
 * @param id - Auction ID
 */
export const getListing = async (
  id: string,
): Promise<ApiResponse<MyListing>> => {
  const response = await apiClient.get<ApiResponse<MyListing>>(
    `/auctions/${id}`,
  );
  return response.data;
};

// ─── Get My Listings ──────────────────────────────────────────────────────────

/**
 * Fetch the seller's own auctions.
 *
 * @param status   Optional status filter (active, upcoming, ended, sold, cancelled)
 * @param archived Archive scope:
 *                   "active"   (default) — un-archived only
 *                   "archived"           — only the seller's archive ("History" tab)
 *                   "all"                — both
 */
export const getMyListings = async (
  status?: string,
  archived: "active" | "archived" | "all" = "active",
): Promise<ApiResponse<MyListing[]>> => {
  const params: Record<string, string> = { archived };
  if (status) params.status = status;
  const response = await apiClient.get<ApiResponse<MyListing[]>>(
    "/auctions/my/auctions",
    { params },
  );
  return response.data;
};

// ─── Archive / Unarchive ──────────────────────────────────────────────────────

/**
 * Move a closed listing (sold/ended/cancelled) to the seller's archive.
 * Listing stays in the database — reviews and disputes still reference it.
 */
export const archiveListing = async (
  id: string,
): Promise<ApiResponse<MyListing>> => {
  const response = await apiClient.patch<ApiResponse<MyListing>>(
    `/auctions/${id}/archive`,
  );
  return response.data;
};

/**
 * Restore a previously archived listing back to the active "My Listings" view.
 */
export const unarchiveListing = async (
  id: string,
): Promise<ApiResponse<MyListing>> => {
  const response = await apiClient.patch<ApiResponse<MyListing>>(
    `/auctions/${id}/unarchive`,
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

// ─── Relist Listing ───────────────────────────────────────────────────────────

/**
 * Relist an ended or cancelled auction with new settings
 * @param id - Auction ID
 * @param payload - New listing settings (endTime, listingType, prices, etc.)
 */
export const relistListing = async (
  id: string,
  payload: RelistPayload,
): Promise<ApiResponse<MyListing>> => {
  const response = await apiClient.patch<ApiResponse<MyListing>>(
    `/auctions/${id}/relist`,
    payload,
  );
  return response.data;
};
