/**
 * API Configuration
 * Handles API URL, authentication helpers, and user data management
 */

// API Base URL from environment variables
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// User data interface
export interface UserData {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt: string;
}

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// In-memory user data cache
let cachedUserData: UserData | null = null;

/**
 * Set user data in memory cache
 * Note: Tokens are stored in HTTP-Only cookies, never in localStorage
 */
export const setAuthData = (userData: UserData): void => {
  cachedUserData = userData;

  // Store minimal user info in localStorage for quick access
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userData.id,
          email: userData.email,
          username: userData.username,
          role: userData.role,
        })
      );
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  }
};

/**
 * Get cached user data
 */
export const getUserData = (): UserData | null => {
  if (cachedUserData) {
    return cachedUserData;
  }

  // Try to get from localStorage as fallback
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        cachedUserData = JSON.parse(stored);
        return cachedUserData;
      }
    } catch (error) {
      console.error("Error reading user data:", error);
    }
  }

  return null;
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  cachedUserData = null;

  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("user");

      // Clear any legacy tokens if they exist
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  }
};

/**
 * Check if user is authenticated
 * This should be verified with the backend via API call
 */
export const isAuthenticated = (): boolean => {
  return getUserData() !== null;
};

/**
 * Migrate from old token-based auth to HTTP-Only cookies
 * This removes any tokens stored in localStorage
 */
export const migrateFromLegacyAuth = (): void => {
  if (typeof window !== "undefined") {
    const legacyKeys = ["token", "refreshToken", "accessToken", "authToken"];

    legacyKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        console.warn(`Removing legacy auth token: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }
};

// Run migration on module load
if (typeof window !== "undefined") {
  migrateFromLegacyAuth();
}
