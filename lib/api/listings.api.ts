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
 * Map SmartFormData to backend CreateAuctionDto format
 */
const mapFormDataToAuctionDto = (data: SmartFormData) => {
  // Calculate auction times
  const now = new Date();
  const startTime = now.toISOString();

  // Parse duration (e.g., "7d" -> 7 days)
  const durationMatch = data.duration.match(/(\d+)([dhm])/);
  let endTime = new Date(now);

  if (durationMatch) {
    const value = parseInt(durationMatch[1]);
    const unit = durationMatch[2];

    switch (unit) {
      case "d":
        endTime.setDate(endTime.getDate() + value);
        break;
      case "h":
        endTime.setHours(endTime.getHours() + value);
        break;
      case "m":
        endTime.setMinutes(endTime.getMinutes() + value);
        break;
    }
  } else {
    // Default to 7 days
    endTime.setDate(endTime.getDate() + 7);
  }

  // Map listing type
  const listingType =
    data.listingType === "buy_now"
      ? "buy_now"
      : data.price && data.startPrice
        ? "auction_buy_now"
        : "auction";

  return {
    // Basic info
    title: data.title || `${data.brand} ${data.model} ${data.club}`.trim(),
    description: data.description || "No description provided",

    // Category & Type
    category: data.category || "Other",
    itemType: data.categorySlug || "shirt",
    listingType,

    // Details
    team: data.club || "Unknown",
    season: data.season || "Unknown",
    size: data.size || "M",
    condition: data.condition || "excellent",
    manufacturer: data.brand || undefined,
    playerName: undefined, // Can be extracted from verification if needed
    playerNumber: undefined,

    // Images - extract URLs from Photo objects
    images: data.photos.map((photo) => photo.url),

    // Pricing - ensure buyNowPrice > startingBid for backend validation
    startingBid: (() => {
      if (data.listingType === "buy_now") {
        // For buy_now only: startingBid should be lower than buyNowPrice
        const price = parseFloat(data.price) || 10;
        return (
          parseFloat(data.startPrice) || Math.max(1, Math.floor(price * 0.5))
        );
      }
      return parseFloat(data.startPrice) || parseFloat(data.price) || 10;
    })(),
    bidIncrement: parseFloat(data.bidStep) || 5,
    buyNowPrice: (() => {
      const price = parseFloat(data.price);
      if (!price) return undefined;
      // Always set buyNowPrice when price is provided (for buy_now or auction_buy_now)
      if (data.listingType === "buy_now" || data.price) {
        // Ensure buyNowPrice is always greater than startingBid
        const startBid =
          parseFloat(data.startPrice) || Math.max(1, Math.floor(price * 0.5));
        return price > startBid ? price : price + 1;
      }
      return price || undefined;
    })(),

    // Timing
    startTime,
    endTime: endTime.toISOString(),

    // Shipping (defaults)
    shippingCost: 0,
    shippingTime: "3-5 business days",
    shippingFrom: "Poland", // Default, can be made configurable

    // Flags
    verified: data.verificationStatus === "AI_VERIFIED_HIGH",
    rare: data.verification.isVintage || data.verification.hasAutograph,
    featured: false,
  };
};

/**
 * Create a new sports listing
 */
export const createSportsListing = async (
  data: SmartFormData,
): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}> => {
  try {
    console.group("🌐 [API] createSportsListing");
    console.log("📋 Input SmartFormData keys:", Object.keys(data));
    console.log("📋 Photos count:", data.photos?.length);

    // Map form data to auction DTO
    const auctionData = mapFormDataToAuctionDto(data);
    console.log(
      "🗺️ Mapped to auction DTO:",
      JSON.stringify(auctionData, null, 2),
    );

    // Check for potential issues
    if (!auctionData.title) console.warn("⚠️ Title is empty!");
    if (!auctionData.images || auctionData.images.length === 0)
      console.warn("⚠️ No images in DTO!");
    if (auctionData.images?.some((img: string) => img.startsWith("blob:")))
      console.warn("⚠️ Some images are still blob URLs!");
    if (auctionData.images?.some((img: string) => img.startsWith("data:")))
      console.warn("⚠️ Some images are still base64 (not uploaded)!");
    if (!auctionData.startingBid || auctionData.startingBid <= 0)
      console.warn("⚠️ Starting bid is 0 or missing!");

    const url = `${API_URL}/auctions`;
    const headers = createHeaders();
    console.log("📡 POST to:", url);
    console.log("📡 Headers:", JSON.stringify(headers));
    console.log("📡 Auth token present:", !!getAuthToken());

    // Send to /auctions endpoint (NestJS backend)
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(auctionData),
    });

    console.log("📡 Response status:", response.status, response.statusText);

    const result = await response.json();
    console.log("📡 Response body:", JSON.stringify(result, null, 2));

    // Check both HTTP status AND backend success field
    if (!response.ok || result.success === false) {
      console.error("❌ Backend returned error:", result.message);
      throw new Error(result.message || "Failed to create listing");
    }

    console.log("✅ Listing created successfully!");
    console.groupEnd();

    return {
      success: true,
      message: result.message || "Listing created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("💥 [API] Error creating sports listing:", error);
    console.groupEnd();
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
          // Map 'club' to 'team' for backend
          const backendKey = key === "club" ? "team" : key;
          queryParams.append(backendKey, value.toString());
        }
      });
    }

    const url = `${API_URL}/auctions?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch listings");
    }

    // Backend returns { success, data: { auctions, total, page, totalPages } }
    return {
      success: true,
      data: result.data?.auctions || result.data,
      pagination: {
        currentPage: result.data?.page || 1,
        totalPages: result.data?.totalPages || 1,
        totalItems: result.data?.total || 0,
        itemsPerPage: params?.limit || 20,
      },
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
  id: string,
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/auctions/${id}`, {
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
  data: Partial<SmartFormData>,
): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}> => {
  try {
    // Map form data to auction DTO if needed
    const updateData = data.photos
      ? mapFormDataToAuctionDto(data as SmartFormData)
      : data;

    const response = await fetch(`${API_URL}/auctions/${id}`, {
      method: "PUT",
      headers: createHeaders(),
      body: JSON.stringify(updateData),
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
  id: string,
): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/auctions/${id}`, {
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
  bidAmount: number,
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
    const response = await fetch(`${API_URL}/auctions/${id}/bid`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({ amount: bidAmount }), // Backend expects 'amount' not 'bidAmount'
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
