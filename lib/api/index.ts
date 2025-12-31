/**
 * API Services Index
 * Central export point for all API services
 */

// Export API client and utilities
export { default as apiClient } from "./client";
export {
  getCachedData,
  setCachedData,
  clearCache,
  clearCacheEntry,
} from "./client";

// Export configuration and types
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

// Export authentication service
export * as authApi from "./auth";
export type {
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
} from "./auth";

// Export auctions service
export * as auctionsApi from "./auctions";
export type {
  AuctionFilters,
  AuctionData,
  CreateAuctionData,
  UpdateAuctionData,
} from "./auctions";

// Export bids service
export * as bidsApi from "./bids";
export type { BidData, PlaceBidData } from "./bids";

// Export users service
export * as usersApi from "./users";
export type {
  UserProfile,
  UpdateUserProfileData,
  UserPreferencesData,
} from "./users";

// Default export with all services
const api = {
  auth: require("./auth"),
  auctions: require("./auctions"),
  bids: require("./bids"),
  users: require("./users"),
  client: require("./client").default,
  config: {
    API_URL: require("./config").API_URL,
    setAuthData: require("./config").setAuthData,
    clearAuthData: require("./config").clearAuthData,
    getUserData: require("./config").getUserData,
    isAuthenticated: require("./config").isAuthenticated,
  },
};

export default api;
