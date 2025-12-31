/**
 * Users API Service
 * Handles all user-related API calls
 */

import apiClient from "./client";
import { ApiResponse, UserData } from "./config";

// User profile interface (extended)
export interface UserProfile extends UserData {
  bio?: string;
  avatar?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  stats?: {
    totalAuctions: number;
    activeAuctions: number;
    totalBids: number;
    wonAuctions: number;
    rating: number;
    reviewCount: number;
  };
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    bidAlerts: boolean;
    auctionEndAlerts: boolean;
  };
}

// Update user profile data
export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

// User preferences data
export interface UserPreferencesData {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  bidAlerts?: boolean;
  auctionEndAlerts?: boolean;
}

/**
 * Get user profile by ID
 * @param userId - User ID
 * @returns User profile data
 */
export const getUserProfile = async (
  userId: string
): Promise<ApiResponse<UserProfile>> => {
  try {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      `/users/${userId}`
    );

    return response.data;
  } catch (error: any) {
    console.error("Get user profile error:", error);
    throw error;
  }
};

/**
 * Get current user's full profile
 * @returns Current user's profile data
 */
export const getMyProfile = async (): Promise<ApiResponse<UserProfile>> => {
  try {
    const response = await apiClient.get<ApiResponse<UserProfile>>("/users/me");

    return response.data;
  } catch (error: any) {
    console.error("Get my profile error:", error);
    throw error;
  }
};

/**
 * Update current user's profile
 * @param profileData - Profile data to update
 * @returns Updated profile data
 */
export const updateMyProfile = async (
  profileData: UpdateUserProfileData
): Promise<ApiResponse<UserProfile>> => {
  try {
    const response = await apiClient.patch<ApiResponse<UserProfile>>(
      "/users/me",
      profileData
    );

    return response.data;
  } catch (error: any) {
    console.error("Update my profile error:", error);
    throw error;
  }
};

/**
 * Upload user avatar
 * @param file - Avatar image file
 * @returns Updated profile with new avatar URL
 */
export const uploadAvatar = async (
  file: File
): Promise<ApiResponse<{ avatarUrl: string }>> => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await apiClient.post<ApiResponse<{ avatarUrl: string }>>(
      "/users/me/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Upload avatar error:", error);
    throw error;
  }
};

/**
 * Delete user avatar
 * @returns Success status
 */
export const deleteAvatar = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.delete<ApiResponse>("/users/me/avatar");

    return response.data;
  } catch (error: any) {
    console.error("Delete avatar error:", error);
    throw error;
  }
};

/**
 * Get user preferences
 * @returns User preferences
 */
export const getUserPreferences = async (): Promise<
  ApiResponse<UserPreferencesData>
> => {
  try {
    const response = await apiClient.get<ApiResponse<UserPreferencesData>>(
      "/users/me/preferences"
    );

    return response.data;
  } catch (error: any) {
    console.error("Get user preferences error:", error);
    throw error;
  }
};

/**
 * Update user preferences
 * @param preferences - Preferences to update
 * @returns Updated preferences
 */
export const updateUserPreferences = async (
  preferences: UserPreferencesData
): Promise<ApiResponse<UserPreferencesData>> => {
  try {
    const response = await apiClient.patch<ApiResponse<UserPreferencesData>>(
      "/users/me/preferences",
      preferences
    );

    return response.data;
  } catch (error: any) {
    console.error("Update user preferences error:", error);
    throw error;
  }
};

/**
 * Get user statistics
 * @param userId - User ID (optional, defaults to current user)
 * @returns User statistics
 */
export const getUserStats = async (
  userId?: string
): Promise<
  ApiResponse<{
    totalAuctions: number;
    activeAuctions: number;
    totalBids: number;
    wonAuctions: number;
    rating: number;
    reviewCount: number;
  }>
> => {
  try {
    const endpoint = userId ? `/users/${userId}/stats` : "/users/me/stats";

    const response = await apiClient.get<
      ApiResponse<{
        totalAuctions: number;
        activeAuctions: number;
        totalBids: number;
        wonAuctions: number;
        rating: number;
        reviewCount: number;
      }>
    >(endpoint);

    return response.data;
  } catch (error: any) {
    console.error("Get user stats error:", error);
    throw error;
  }
};

/**
 * Get user's reviews
 * @param userId - User ID
 * @param page - Page number
 * @param limit - Items per page
 * @returns User reviews
 */
export const getUserReviews = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<
  ApiResponse<{
    reviews: Array<{
      id: string;
      rating: number;
      comment: string;
      reviewerId: string;
      reviewerName: string;
      createdAt: string;
    }>;
    total: number;
    averageRating: number;
  }>
> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{
        reviews: Array<{
          id: string;
          rating: number;
          comment: string;
          reviewerId: string;
          reviewerName: string;
          createdAt: string;
        }>;
        total: number;
        averageRating: number;
      }>
    >(`/users/${userId}/reviews`, {
      params: { page, limit },
    });

    return response.data;
  } catch (error: any) {
    console.error("Get user reviews error:", error);
    throw error;
  }
};

/**
 * Add review for a user
 * @param userId - User ID to review
 * @param rating - Rating (1-5)
 * @param comment - Review comment
 * @returns Created review
 */
export const addUserReview = async (
  userId: string,
  rating: number,
  comment: string
): Promise<ApiResponse<{ id: string; rating: number; comment: string }>> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{ id: string; rating: number; comment: string }>
    >(`/users/${userId}/reviews`, {
      rating,
      comment,
    });

    return response.data;
  } catch (error: any) {
    console.error("Add user review error:", error);
    throw error;
  }
};

/**
 * Delete user account
 * @param password - User password for confirmation
 * @returns Success status
 */
export const deleteAccount = async (password: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.delete<ApiResponse>("/users/me", {
      data: { password },
    });

    return response.data;
  } catch (error: any) {
    console.error("Delete account error:", error);
    throw error;
  }
};

/**
 * Search users
 * @param query - Search query
 * @param page - Page number
 * @param limit - Items per page
 * @returns Search results
 */
export const searchUsers = async (
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<
  ApiResponse<{
    users: UserProfile[];
    total: number;
    page: number;
    totalPages: number;
  }>
> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{
        users: UserProfile[];
        total: number;
        page: number;
        totalPages: number;
      }>
    >("/users/search", {
      params: { query, page, limit },
    });

    return response.data;
  } catch (error: any) {
    console.error("Search users error:", error);
    throw error;
  }
};
