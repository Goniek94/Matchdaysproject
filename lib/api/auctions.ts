/**
 * Auctions API Service
 * Handles all auction-related API calls
 */

import apiClient from "./client";
import { ApiResponse } from "./config";
import { getCachedData, setCachedData, clearCacheEntry } from "./client";

// Auction filters interface
export interface AuctionFilters {
  category?: string;
  status?: "active" | "ended" | "upcoming";
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "endDate" | "price" | "bids" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Auction data interface (extends the existing Auction type)
export interface AuctionData {
  id: string;
  title: string;
  description: string;
  category: string;
  startingPrice: number;
  currentPrice: number;
  buyNowPrice?: number;
  reservePrice?: number;
  bidCount: number;
  startDate: string;
  endDate: string;
  status: "active" | "ended" | "upcoming";
  images: string[];
  sellerId: string;
  seller?: {
    id: string;
    username: string;
    rating: number;
    reviewCount: number;
  };
  verified?: boolean;
  rare?: boolean;
  condition?: string;
  authenticity?: string;
  createdAt: string;
  updatedAt: string;
}

// Create auction data interface
export interface CreateAuctionData {
  title: string;
  description: string;
  category: string;
  startingPrice: number;
  buyNowPrice?: number;
  reservePrice?: number;
  duration: number; // in days
  images: string[];
  condition?: string;
  authenticity?: string;
}

// Update auction data interface
export interface UpdateAuctionData {
  title?: string;
  description?: string;
  buyNowPrice?: number;
  images?: string[];
}

/**
 * Get all auctions with optional filters
 * @param filters - Filter options
 * @returns List of auctions
 */
export const getAuctions = async (
  filters?: AuctionFilters
): Promise<
  ApiResponse<{
    auctions: AuctionData[];
    total: number;
    page: number;
    totalPages: number;
  }>
> => {
  try {
    // Create cache key from filters
    const cacheKey = `auctions_${JSON.stringify(filters || {})}`;

    // Check cache first
    const cached = getCachedData(cacheKey);
    if (cached) {
      return {
        success: true,
        message: "Auctions retrieved from cache",
        data: cached,
      };
    }

    const response = await apiClient.get<
      ApiResponse<{
        auctions: AuctionData[];
        total: number;
        page: number;
        totalPages: number;
      }>
    >("/auctions", { params: filters });

    // Cache the result
    if (response.data.success && response.data.data) {
      setCachedData(cacheKey, response.data.data);
    }

    return response.data;
  } catch (error: any) {
    console.error("Get auctions error:", error);
    throw error;
  }
};

/**
 * Get auction by ID
 * @param id - Auction ID
 * @returns Auction details
 */
export const getAuctionById = async (
  id: string
): Promise<ApiResponse<AuctionData>> => {
  try {
    const cacheKey = `auction_${id}`;

    // Check cache first
    const cached = getCachedData(cacheKey);
    if (cached) {
      return {
        success: true,
        message: "Auction retrieved from cache",
        data: cached,
      };
    }

    const response = await apiClient.get<ApiResponse<AuctionData>>(
      `/auctions/${id}`
    );

    // Cache the result
    if (response.data.success && response.data.data) {
      setCachedData(cacheKey, response.data.data);
    }

    return response.data;
  } catch (error: any) {
    console.error("Get auction error:", error);
    throw error;
  }
};

/**
 * Create new auction
 * @param auctionData - Auction data
 * @returns Created auction
 */
export const createAuction = async (
  auctionData: CreateAuctionData
): Promise<ApiResponse<AuctionData>> => {
  try {
    const response = await apiClient.post<ApiResponse<AuctionData>>(
      "/auctions",
      auctionData
    );

    // Clear auctions list cache
    clearCacheEntry("auctions_{}");

    return response.data;
  } catch (error: any) {
    console.error("Create auction error:", error);
    throw error;
  }
};

/**
 * Update auction
 * @param id - Auction ID
 * @param auctionData - Updated auction data
 * @returns Updated auction
 */
export const updateAuction = async (
  id: string,
  auctionData: UpdateAuctionData
): Promise<ApiResponse<AuctionData>> => {
  try {
    const response = await apiClient.patch<ApiResponse<AuctionData>>(
      `/auctions/${id}`,
      auctionData
    );

    // Clear cache for this auction
    clearCacheEntry(`auction_${id}`);
    clearCacheEntry("auctions_{}");

    return response.data;
  } catch (error: any) {
    console.error("Update auction error:", error);
    throw error;
  }
};

/**
 * Delete auction
 * @param id - Auction ID
 * @returns Success status
 */
export const deleteAuction = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.delete<ApiResponse>(`/auctions/${id}`);

    // Clear cache
    clearCacheEntry(`auction_${id}`);
    clearCacheEntry("auctions_{}");

    return response.data;
  } catch (error: any) {
    console.error("Delete auction error:", error);
    throw error;
  }
};

/**
 * Get user's auctions
 * @param userId - User ID (optional, defaults to current user)
 * @returns List of user's auctions
 */
export const getUserAuctions = async (
  userId?: string
): Promise<ApiResponse<AuctionData[]>> => {
  try {
    const endpoint = userId ? `/auctions/user/${userId}` : "/auctions/my";

    const response = await apiClient.get<ApiResponse<AuctionData[]>>(endpoint);

    return response.data;
  } catch (error: any) {
    console.error("Get user auctions error:", error);
    throw error;
  }
};

/**
 * Get featured/hot auctions
 * @returns List of featured auctions
 */
export const getFeaturedAuctions = async (): Promise<
  ApiResponse<AuctionData[]>
> => {
  try {
    const cacheKey = "featured_auctions";

    // Check cache first
    const cached = getCachedData(cacheKey);
    if (cached) {
      return {
        success: true,
        message: "Featured auctions retrieved from cache",
        data: cached,
      };
    }

    const response = await apiClient.get<ApiResponse<AuctionData[]>>(
      "/auctions/featured"
    );

    // Cache the result
    if (response.data.success && response.data.data) {
      setCachedData(cacheKey, response.data.data);
    }

    return response.data;
  } catch (error: any) {
    console.error("Get featured auctions error:", error);
    throw error;
  }
};

/**
 * Get ending soon auctions
 * @param limit - Number of auctions to return
 * @returns List of ending soon auctions
 */
export const getEndingSoonAuctions = async (
  limit: number = 10
): Promise<ApiResponse<AuctionData[]>> => {
  try {
    const cacheKey = `ending_soon_${limit}`;

    // Check cache first
    const cached = getCachedData(cacheKey);
    if (cached) {
      return {
        success: true,
        message: "Ending soon auctions retrieved from cache",
        data: cached,
      };
    }

    const response = await apiClient.get<ApiResponse<AuctionData[]>>(
      "/auctions/ending-soon",
      { params: { limit } }
    );

    // Cache the result
    if (response.data.success && response.data.data) {
      setCachedData(cacheKey, response.data.data);
    }

    return response.data;
  } catch (error: any) {
    console.error("Get ending soon auctions error:", error);
    throw error;
  }
};

/**
 * Search auctions
 * @param query - Search query
 * @param filters - Additional filters
 * @returns Search results
 */
export const searchAuctions = async (
  query: string,
  filters?: Omit<AuctionFilters, "search">
): Promise<ApiResponse<{ auctions: AuctionData[]; total: number }>> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{ auctions: AuctionData[]; total: number }>
    >("/auctions/search", { params: { search: query, ...filters } });

    return response.data;
  } catch (error: any) {
    console.error("Search auctions error:", error);
    throw error;
  }
};
