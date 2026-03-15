/**
 * Authentication API Service
 * Handles all authentication-related API calls
 * Based on Marketplace frontend pattern, adapted for Matchdays
 */

import apiClient from "./client";
import {
  ApiResponse,
  UserData,
  setAuthData,
  clearAuthData,
  getUserData,
} from "./config";

// ─── Interfaces ────────────────────────────────────────────────────────────────

/**
 * Login credentials - matches backend LoginDto
 */
export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

/**
 * Registration data - matches backend RegisterDto exactly
 */
export interface RegisterData {
  firstName: string;
  lastName: string;
  birthDate: string; // YYYY-MM-DD
  country: string; // ISO 3166-1 alpha-2 (e.g. "PL")
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  username?: string; // optional - auto-generated if not provided
}

/**
 * Update profile data
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  phone?: string;
  country?: string;
  avatar?: string;
}

/**
 * Change password data
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// ─── Auth API Functions ────────────────────────────────────────────────────────

/**
 * Login user
 * Backend sets HTTP-Only cookies automatically
 */
export const login = async (
  credentials: LoginCredentials,
): Promise<ApiResponse<UserData>> => {
  const response = await apiClient.post<ApiResponse<UserData>>(
    "/auth/login",
    credentials,
  );

  // Store user data if login successful
  if (response.data.success && response.data.data) {
    setAuthData(response.data.data);
  }

  return response.data;
};

/**
 * Register new user
 * Backend sets HTTP-Only cookies automatically
 */
export const register = async (
  userData: RegisterData,
): Promise<ApiResponse<UserData>> => {
  const response = await apiClient.post<ApiResponse<UserData>>(
    "/auth/register",
    userData,
  );

  // Store user data if registration successful
  if (response.data.success && response.data.data) {
    setAuthData(response.data.data);
  }

  return response.data;
};

/**
 * Logout user
 * Backend clears HTTP-Only cookies
 */
export const logout = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>("/auth/logout");
    return response.data;
  } catch (error: any) {
    // Ignore errors during logout - we always clean up locally
    console.error("Logout API error (ignored):", error?.message);
    return { success: false, message: "Logout API error" };
  } finally {
    // Always clear local data, regardless of API result
    clearAuthData();
  }
};

/**
 * Check if user is authenticated by verifying with backend
 * Uses HTTP-Only cookie to verify session
 * Does NOT clear auth data on network errors - only on explicit 401
 */
export const checkAuth = async (): Promise<ApiResponse<UserData>> => {
  const response =
    await apiClient.get<ApiResponse<UserData>>("/auth/check-auth");

  // Update user data if authenticated
  if (response.data.success && response.data.data) {
    setAuthData(response.data.data);
  }

  return response.data;
};

/**
 * Get current user data
 * Returns cached data or fetches from API
 */
export const getCurrentUser = async (): Promise<ApiResponse<UserData>> => {
  // Try to get from cache first
  const cachedUser = getUserData();
  if (cachedUser) {
    return {
      success: true,
      message: "User data retrieved from cache",
      data: cachedUser,
    };
  }

  // Fetch from API if not in cache
  return checkAuth();
};

/**
 * Refresh user data from API
 */
export const refreshUserData = async (): Promise<ApiResponse<UserData>> => {
  return checkAuth();
};

/**
 * Update user profile
 */
export const updateProfile = async (
  profileData: UpdateProfileData,
): Promise<ApiResponse<UserData>> => {
  const response = await apiClient.patch<ApiResponse<UserData>>(
    "/auth/profile",
    profileData,
  );

  // Update cached user data
  if (response.data.success && response.data.data) {
    setAuthData(response.data.data);
  }

  return response.data;
};

/**
 * Change user password
 */
export const changePassword = async (
  passwordData: ChangePasswordData,
): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    "/auth/change-password",
    passwordData,
  );

  return response.data;
};

/**
 * Request password reset email
 */
export const requestPasswordReset = async (
  email: string,
): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>("/auth/forgot-password", {
    email,
  });

  return response.data;
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>("/auth/reset-password", {
    token,
    newPassword,
  });

  return response.data;
};
