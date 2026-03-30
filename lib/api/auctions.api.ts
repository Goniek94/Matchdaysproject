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

/**
 * Instantly purchase an auction with Buy Now option.
 * Requires authentication (HTTP-Only cookie).
 */
export const buyNow = async (
  auctionId: string,
): Promise<ApiResponse<AuctionDto>> => {
  const response = await apiClient.post<ApiResponse<AuctionDto>>(
    `/auctions/${auctionId}/buy-now`,
  );
  return response.data;
};
