/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import apiClient from "./client";
import {
  ApiResponse,
  UserData,
  setAuthData,
  clearAuthData,
  getUserData,
} from "./config";

// Login credentials interface
export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

// Registration data interface
export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Update profile data interface
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
}

// Change password data interface
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Login user
 * @param credentials - Email/username and password
 * @returns User data and success status
 */
export const login = async (
  credentials: LoginCredentials
): Promise<ApiResponse<UserData>> => {
  try {
    const response = await apiClient.post<ApiResponse<UserData>>(
      "/auth/login",
      credentials
    );

    // Store user data if login successful
    if (response.data.success && response.data.data) {
      setAuthData(response.data.data);
    }

    return response.data;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Register new user
 * @param userData - Registration data
 * @returns User data and success status
 */
export const register = async (
  userData: RegisterData
): Promise<ApiResponse<UserData>> => {
  try {
    const response = await apiClient.post<ApiResponse<UserData>>(
      "/auth/register",
      userData
    );

    // Store user data if registration successful
    if (response.data.success && response.data.data) {
      setAuthData(response.data.data);
    }

    return response.data;
  } catch (error: any) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Logout user
 * Clears cookies and local auth data
 */
export const logout = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>("/auth/logout");

    // Clear local auth data
    clearAuthData();

    return response.data;
  } catch (error: any) {
    console.error("Logout error:", error);
    // Clear local data even if API call fails
    clearAuthData();
    throw error;
  }
};

/**
 * Check if user is authenticated
 * Verifies with backend
 */
export const checkAuth = async (): Promise<ApiResponse<UserData>> => {
  try {
    const response = await apiClient.get<ApiResponse<UserData>>(
      "/auth/check-auth"
    );

    // Update user data if authenticated
    if (response.data.success && response.data.data) {
      setAuthData(response.data.data);
    } else {
      clearAuthData();
    }

    return response.data;
  } catch (error: any) {
    console.error("Check auth error:", error);
    clearAuthData();
    throw error;
  }
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
 * @param profileData - Profile data to update
 */
export const updateProfile = async (
  profileData: UpdateProfileData
): Promise<ApiResponse<UserData>> => {
  try {
    const response = await apiClient.patch<ApiResponse<UserData>>(
      "/auth/profile",
      profileData
    );

    // Update cached user data
    if (response.data.success && response.data.data) {
      setAuthData(response.data.data);
    }

    return response.data;
  } catch (error: any) {
    console.error("Update profile error:", error);
    throw error;
  }
};

/**
 * Change user password
 * @param passwordData - Current and new password
 */
export const changePassword = async (
  passwordData: ChangePasswordData
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      "/auth/change-password",
      passwordData
    );

    return response.data;
  } catch (error: any) {
    console.error("Change password error:", error);
    throw error;
  }
};

/**
 * Request password reset
 * @param email - User email
 */
export const requestPasswordReset = async (
  email: string
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      "/auth/forgot-password",
      { email }
    );

    return response.data;
  } catch (error: any) {
    console.error("Request password reset error:", error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param token - Reset token from email
 * @param newPassword - New password
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>("/auth/reset-password", {
      token,
      newPassword,
    });

    return response.data;
  } catch (error: any) {
    console.error("Reset password error:", error);
    throw error;
  }
};

/**
 * Verify email with token
 * @param token - Verification token from email
 */
export const verifyEmail = async (token: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>("/auth/verify-email", {
      token,
    });

    return response.data;
  } catch (error: any) {
    console.error("Verify email error:", error);
    throw error;
  }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      "/auth/resend-verification"
    );

    return response.data;
  } catch (error: any) {
    console.error("Resend verification email error:", error);
    throw error;
  }
};
