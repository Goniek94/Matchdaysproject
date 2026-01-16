/**
 * Listings API
 * Functions for communicating with the sports listings backend
 */

import type { SmartFormData } from "@/types/features/listing.types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

/**
 * Create headers with authentication
 */
const createHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Create a new sports listing
 */
export const createSportsListing = async (
  data: SmartFormData
): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}> => {
  try {
    console.log("Creating sports listing with data:", data);

    const response = await fetch(`${API_URL}/sports-listings`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create listing");
    }

    return {
      success: true,
      message: result.message || "Listing created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error creating sports listing:", error);
    return {
      success: false,
      message: "Failed to create listing",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Get all sports listings with filters
 */
export const getSportsListings = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  club?: string;
  minPrice?: number;
  maxPrice?: number;
  listingType?: "auction" | "buy_now";
  condition?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}): Promise<{
  success: boolean;
  data?: any[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  error?: string;
}> => {
  try {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_URL}/sports-listings?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch listings");
    }

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error) {
    console.error("Error fetching sports listings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Get a single sports listing by ID
 */
export const getSportsListingById = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/sports-listings/${id}`, {
      method: "GET",
      headers: createHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch listing");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error fetching sports listing:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Update a sports listing
 */
export const updateSportsListing = async (
  id: string,
  data: Partial<SmartFormData>
): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/sports-listings/${id}`, {
      method: "PUT",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update listing");
    }

    return {
      success: true,
      message: result.message || "Listing updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error updating sports listing:", error);
    return {
      success: false,
      message: "Failed to update listing",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Delete a sports listing
 */
export const deleteSportsListing = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/sports-listings/${id}`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete listing");
    }

    return {
      success: true,
      message: result.message || "Listing deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting sports listing:", error);
    return {
      success: false,
      message: "Failed to delete listing",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Place a bid on an auction listing
 */
export const placeBid = async (
  id: string,
  bidAmount: number
): Promise<{
  success: boolean;
  message: string;
  data?: {
    currentBid: number;
    bidCount: number;
  };
  error?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/sports-listings/${id}/bid`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({ bidAmount }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to place bid");
    }

    return {
      success: true,
      message: result.message || "Bid placed successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error placing bid:", error);
    return {
      success: false,
      message: "Failed to place bid",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
