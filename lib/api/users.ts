/**
 * Users API Service
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

export interface UserPreferencesData {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  bidAlerts?: boolean;
  auctionEndAlerts?: boolean;
}

export const getUserProfile = async (
  userId: string,
): Promise<ApiResponse<UserProfile>> => {
  const response = await apiClient.get<ApiResponse<UserProfile>>(`/users/${userId}`);
  return response.data;
};

export const getMyProfile = async (): Promise<ApiResponse<UserProfile>> => {
  const response = await apiClient.get<ApiResponse<UserProfile>>("/users/me");
  return response.data;
};

export const updateMyProfile = async (
  profileData: UpdateUserProfileData,
): Promise<ApiResponse<UserProfile>> => {
  const response = await apiClient.patch<ApiResponse<UserProfile>>("/users/profile", profileData);
  return response.data;
};

export const uploadAvatar = async (
  file: File,
): Promise<ApiResponse<{ avatarUrl: string }>> => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await apiClient.post<ApiResponse<{ avatarUrl: string }>>(
    "/users/me/avatar",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const deleteAvatar = async (): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>("/users/me/avatar");
  return response.data;
};

export const getUserPreferences = async (): Promise<ApiResponse<UserPreferencesData>> => {
  const response = await apiClient.get<ApiResponse<UserPreferencesData>>("/users/me/preferences");
  return response.data;
};

export const updateUserPreferences = async (
  preferences: UserPreferencesData,
): Promise<ApiResponse<UserPreferencesData>> => {
  const response = await apiClient.patch<ApiResponse<UserPreferencesData>>(
    "/users/me/preferences",
    preferences,
  );
  return response.data;
};

export interface UserStats {
  totalAuctions: number;
  activeAuctions: number;
  totalBids: number;
  wonAuctions: number;
  rating: number;
  reviewCount: number;
}

export const getUserStats = async (userId?: string): Promise<ApiResponse<UserStats>> => {
  const endpoint = userId ? `/users/${userId}/stats` : "/users/me/stats";
  const response = await apiClient.get<ApiResponse<UserStats>>(endpoint);
  return response.data;
};

export interface UserReview {
  id: string;
  rating: number;
  comment: string;
  reviewerId: string;
  reviewerName: string;
  createdAt: string;
}

export interface UserReviewsResponse {
  reviews: UserReview[];
  total: number;
  averageRating: number;
}

export const getUserReviews = async (
  userId: string,
  page = 1,
  limit = 10,
): Promise<ApiResponse<UserReviewsResponse>> => {
  const response = await apiClient.get<ApiResponse<UserReviewsResponse>>(
    `/users/${userId}/reviews`,
    { params: { page, limit } },
  );
  return response.data;
};

export const addUserReview = async (
  userId: string,
  rating: number,
  comment: string,
): Promise<ApiResponse<{ id: string; rating: number; comment: string }>> => {
  const response = await apiClient.post<ApiResponse<{ id: string; rating: number; comment: string }>>(
    `/users/${userId}/reviews`,
    { rating, comment },
  );
  return response.data;
};

// ─── Address ──────────────────────────────────────────────────────────────────

export interface UserAddress {
  street: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
}

export const getMyAddress = async (): Promise<ApiResponse<{ address: UserAddress }>> => {
  const response = await apiClient.get<ApiResponse<{ address: UserAddress }>>("/users/address");
  return response.data;
};

export const updateMyAddress = async (address: Partial<UserAddress>): Promise<ApiResponse> => {
  const response = await apiClient.patch<ApiResponse>("/users/address", {
    addressStreet: address.street,
    addressCity: address.city,
    addressPostalCode: address.postalCode,
    addressCountry: address.country,
  });
  return response.data;
};

// ─── Public Profile ───────────────────────────────────────────────────────────

export interface PublicReview {
  id: string;
  rating: number;
  sentiment: string;
  comment: string | null;
  role: string;
  createdAt: string;
  reviewer: { id: string; username: string; avatar?: string };
  auction: { id: string; title: string } | null;
}

export interface PublicAuction {
  id: string;
  title: string;
  currentPrice: number;
  currency: string;
  status: string;
  listingType: string;
  images: string[];
  endTime: string | null;
  bidsCount: number;
  seller: { id: string; username: string; rating: number; reviews: number };
}

export interface PublicCollectionItem {
  id: string;
  title: string;
  images: string[];
  team: string | null;
  season: string | null;
  rarity: string;
  isVintage: boolean;
  estimatedValue: number | null;
}

export interface PublicUserProfile {
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  country: string | null;
  isVerified: boolean;
  rating: number;
  reviews: number;
  sales: number;
  positivePercentage: number | null;
  avgShippingTime: string | null;
  level: number;
  experience: number;
  totalPoints: number;
  reputationScore: number;
  subscriptionTier: string;
  memberSince: string;
  warningCount: number;
  banCount: number;
  activeListings: PublicAuction[];
  collectionPreview: PublicCollectionItem[];
  recentReviews: PublicReview[];
}

export const awardSpinPoints = async (
  points: number,
  source = "spin_wheel",
): Promise<ApiResponse<{ pointsAwarded: number; totalPoints: number; level: number }>> => {
  const res = await apiClient.post<
    ApiResponse<{ pointsAwarded: number; totalPoints: number; level: number }>
  >("/users/me/award-points", { points, source });
  return res.data;
};

export const getPublicUserProfile = async (
  username: string,
): Promise<ApiResponse<PublicUserProfile>> => {
  const res = await apiClient.get<ApiResponse<PublicUserProfile>>(`/users/public/${username}`);
  return res.data;
};

export const deleteAccount = async (password: string): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>("/users/me", { data: { password } });
  return response.data;
};

export interface UserSearchResponse {
  users: UserProfile[];
  total: number;
  page: number;
  totalPages: number;
}

export const searchUsers = async (
  query: string,
  page = 1,
  limit = 20,
): Promise<ApiResponse<UserSearchResponse>> => {
  const response = await apiClient.get<ApiResponse<UserSearchResponse>>("/users/search", {
    params: { query, page, limit },
  });
  return response.data;
};
