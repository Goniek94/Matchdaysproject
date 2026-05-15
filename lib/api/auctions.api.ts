/**
 * Auctions API Service
 * Unified service for all auction-related API calls.
 * Uses axios apiClient with HTTP-Only cookie auth (withCredentials: true).
 *
 * Replaces: listings.api.ts (fetch + localStorage) and auctions.ts (axios)
 */

import apiClient from "./client";
import type { ApiResponse } from "./config";
import type {
  AuctionDetailDto,
  AuctionDto,
  AuctionFilters,
  AuctionListDto,
  CreateAuctionDto,
  RelistAuctionDto,
  UpdateAuctionDto,
} from "@/types/api/auction.types";
import type { SmartFormData } from "@/types/features/listing.types";
import { mapFormDataToCreateAuctionDto } from "@/lib/utils/auction-adapter";

// ─── Get All Auctions ─────────────────────────────────────────────────────────

/**
 * Fetch a paginated, filtered list of auctions.
 * Public endpoint — no auth required.
 */
export const getAuctions = async (
  filters?: AuctionFilters,
): Promise<ApiResponse<AuctionListDto>> => {
  const response = await apiClient.get<ApiResponse<AuctionListDto>>(
    "/auctions",
    { params: filters },
  );
  return response.data;
};

// ─── Get Single Auction ───────────────────────────────────────────────────────

/**
 * Fetch a single auction by ID, including bids and seller info.
 * Public endpoint — no auth required.
 */
export const getAuctionById = async (
  id: string,
): Promise<ApiResponse<AuctionDetailDto>> => {
  const response = await apiClient.get<ApiResponse<AuctionDetailDto>>(
    `/auctions/${id}`,
  );
  return response.data;
};

// ─── Create Auction ───────────────────────────────────────────────────────────

/**
 * Create a new auction from a raw DTO.
 * Requires authentication (HTTP-Only cookie).
 */
export const createAuction = async (
  dto: CreateAuctionDto,
): Promise<ApiResponse<AuctionDto>> => {
  const response = await apiClient.post<ApiResponse<AuctionDto>>(
    "/auctions",
    dto,
  );
  return response.data;
};

/**
 * Create a new auction from SmartForm data.
 * Maps form data to DTO internally.
 * Requires authentication (HTTP-Only cookie).
 */
export const createAuctionFromForm = async (
  formData: SmartFormData,
): Promise<ApiResponse<AuctionDto>> => {
  const dto = mapFormDataToCreateAuctionDto(formData);
  return createAuction(dto);
};

// ─── Update Auction ───────────────────────────────────────────────────────────

/**
 * Update an existing auction (seller only, limited fields).
 * Requires authentication (HTTP-Only cookie).
 */
export const updateAuction = async (
  id: string,
  payload: UpdateAuctionDto,
): Promise<ApiResponse<AuctionDto>> => {
  const response = await apiClient.patch<ApiResponse<AuctionDto>>(
    `/auctions/${id}`,
    payload,
  );
  return response.data;
};

// ─── Delete Auction ───────────────────────────────────────────────────────────

/**
 * Permanently delete an auction (only if no bids have been placed).
 * Requires authentication (HTTP-Only cookie).
 */
export const deleteAuction = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/auctions/${id}`);
  return response.data;
};

// ─── Cancel Auction ───────────────────────────────────────────────────────────

/**
 * Cancel an auction (marks status as "cancelled", works even with bids).
 * Requires authentication (HTTP-Only cookie).
 */
export const cancelAuction = async (
  id: string,
): Promise<ApiResponse<AuctionDto>> => {
  const response = await apiClient.patch<ApiResponse<AuctionDto>>(
    `/auctions/${id}/cancel`,
  );
  return response.data;
};

// ─── Relist Auction ───────────────────────────────────────────────────────────

/**
 * Relist an ended or cancelled auction with new settings.
 * Requires authentication (HTTP-Only cookie).
 */
export const relistAuction = async (
  id: string,
  payload: RelistAuctionDto,
): Promise<ApiResponse<AuctionDto>> => {
  const response = await apiClient.patch<ApiResponse<AuctionDto>>(
    `/auctions/${id}/relist`,
    payload,
  );
  return response.data;
};

// ─── My Auctions ──────────────────────────────────────────────────────────────

/**
 * Fetch all auctions belonging to the currently authenticated user.
 * Requires authentication (HTTP-Only cookie).
 */
export const getMyAuctions = async (
  status?: string,
): Promise<ApiResponse<AuctionDto[]>> => {
  const response = await apiClient.get<ApiResponse<AuctionDto[]>>(
    "/auctions/my/auctions",
    { params: status ? { status } : {} },
  );
  return response.data;
};

// ─── Buy Now ──────────────────────────────────────────────────────────────────

// `buyNow` has moved to `ordersApi.createFromBuyNow`. The old auction-side
// endpoint was retired in favour of a settlement-layer flow that:
//   • returns a typed PENDING_PAYMENT Order (not the mutated auction),
//   • snapshots commission / payout amounts,
//   • lets the buyer pick wallet vs. Stripe in the very next call to
//     `ordersApi.pay(orderId, { paymentMethod, shippingAddress })`.
// See `lib/api/orders.ts` for the full surface.

// ─── Won Auctions ─────────────────────────────────────────────────────────────

/**
 * Fetch all auctions won (or bought) by the current user.
 * Requires authentication (HTTP-Only cookie).
 */
export const getWonAuctions = async (): Promise<ApiResponse<AuctionDto[]>> => {
  const response = await apiClient.get<ApiResponse<AuctionDto[]>>(
    "/auctions/my/won",
  );
  return response.data;
};

/**
 * Buyer confirms a purchase after winning/buying an auction.
 * Transitions status: sold → awaiting_payment.
 * Requires authentication (HTTP-Only cookie).
 */
export const confirmPurchase = async (
  id: string,
): Promise<ApiResponse<AuctionDto>> => {
  const response = await apiClient.patch<ApiResponse<AuctionDto>>(
    `/auctions/${id}/confirm`,
  );
  return response.data;
};

// ── Favorites ────────────────────────────────────────────────────────────────

export const addFavorite = async (auctionId: string): Promise<{ success: boolean; favorited: boolean }> => {
  const response = await apiClient.post(`/auctions/${auctionId}/favorite`);
  return response.data;
};

export const removeFavorite = async (auctionId: string): Promise<{ success: boolean; favorited: boolean }> => {
  const response = await apiClient.delete(`/auctions/${auctionId}/favorite`);
  return response.data;
};

export const getFavoriteIds = async (): Promise<string[]> => {
  const response = await apiClient.get<{ success: boolean; data: string[] }>('/auctions/favorites/ids');
  return response.data.data ?? [];
};

// ─── AI Verification Update ───────────────────────────────────────────────────

/**
 * Called after background AI scan completes (silent, no UI).
 * Updates listing verification status based on authenticity score:
 *   >= 90  → AI_VERIFIED_HIGH  → auto-live
 *   60–89  → AI_VERIFIED_MEDIUM → manual review queue
 *   < 60   → FLAGGED           → manual review queue
 */
export const updateListingVerification = async (
  id: string,
  authenticityScore: number,
  aiData: Record<string, unknown>,
): Promise<void> => {
  const verificationStatus =
    authenticityScore >= 90
      ? "AI_VERIFIED_HIGH"
      : authenticityScore >= 60
        ? "AI_VERIFIED_MEDIUM"
        : "FLAGGED";

  await apiClient
    .patch(`/auctions/${id}/verification`, {
      verificationStatus,
      authenticityScore,
      aiData,
    })
    .catch(() => {
      // Silent fail — background task, never interrupt the user
    });
};
