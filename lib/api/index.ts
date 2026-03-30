/**
 * API Services Index
 * Central export point for all API services.
 * All services use axios apiClient with HTTP-Only cookie auth.
 */

// ─── API Client ───────────────────────────────────────────────────────────────

export { default as apiClient } from "./client";

// Note: In-memory cache removed — caching is now handled by React Query (TanStack Query)

// ─── Configuration & Utilities ───────────────────────────────────────────────

export {
  API_URL,
  REQUEST_TIMEOUT,
  setAuthData,
  clearAuthData,
  getUserData,
  isAuthenticated,
  migrateFromLegacyAuth,
} from "./config";

export type { UserData, ApiResponse } from "./config";

// ─── Auth Service ─────────────────────────────────────────────────────────────

export * as authApi from "./auth";
export type {
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
} from "./auth";

// ─── Auctions Service (unified — replaces listings.api.ts + auctions.ts) ─────

export * as auctionsApi from "./auctions.api";
export type {
  AuctionDto,
  AuctionDetailDto,
  AuctionListDto,
  AuctionFilters,
  CreateAuctionDto,
  UpdateAuctionDto,
  RelistAuctionDto,
  AuctionStatus,
  AuctionListingType,
  AuctionSellerDto,
  AuctionBidDto,
} from "@/types/api/auction.types";

// ─── Bids Service ─────────────────────────────────────────────────────────────

export * as bidsApi from "./bids.api";
export type {
  BidDto,
  PlaceBidDto,
  PlaceBidResponseDto,
  BidHistoryDto,
  BidWinningStatusDto,
} from "@/types/api/bid.types";

// ─── Users Service ────────────────────────────────────────────────────────────

export * as usersApi from "./users";
export type {
  UserProfile,
  UpdateUserProfileData,
  UserPreferencesData,
} from "./users";

// ─── Messages Service ─────────────────────────────────────────────────────────

export * as messagesApi from "./messages";

// ─── My Listings Service ──────────────────────────────────────────────────────

export * as myListingsApi from "./my-listings";

// ─── AI Service ───────────────────────────────────────────────────────────────

export * as aiApi from "./ai";
export type { AIAnalysisResult, PhotoDto, AnalyzeListingDto } from "./ai";
