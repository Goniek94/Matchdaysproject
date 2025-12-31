/**
 * API Client
 * Axios instance with interceptors for authentication and error handling
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { API_URL, REQUEST_TIMEOUT, clearAuthData, getUserData } from "./config";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  withCredentials: true, // Important: Send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Request queue for handling token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: any = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

/**
 * Request Interceptor
 * Adds authorization header if user is authenticated
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userData = getUserData();

    // Add user ID to headers if available (optional, for backend logging)
    if (userData?.id) {
      config.headers["X-User-ID"] = userData.id;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles token refresh on 401 errors
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the session
        await apiClient.post("/auth/refresh");

        // Process queued requests
        processQueue();
        isRefreshing = false;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth data and redirect to login
        processQueue(refreshError);
        isRefreshing = false;
        clearAuthData();

        // Redirect to login page (only in browser)
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle 431 Request Header Fields Too Large
    if (error.response?.status === 431) {
      console.error("Request headers too large. Clearing auth data.");
      clearAuthData();

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject({
        success: false,
        message: "Błąd połączenia z serwerem. Sprawdź połączenie internetowe.",
        error: error.message,
      });
    }

    // Return formatted error
    const responseData = error.response?.data as any;
    return Promise.reject({
      success: false,
      message:
        responseData?.message || error.message || "Wystąpił nieoczekiwany błąd",
      error: responseData?.error || error.message,
      status: error.response?.status,
    });
  }
);

/**
 * Simple in-memory cache for GET requests
 */
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get data from cache if available and not expired
 */
export const getCachedData = (key: string): any | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

/**
 * Store data in cache
 */
export const setCachedData = (key: string, data: any): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

/**
 * Clear all cached data
 */
export const clearCache = (): void => {
  cache.clear();
};

/**
 * Clear specific cache entry
 */
export const clearCacheEntry = (key: string): void => {
  cache.delete(key);
};

export default apiClient;
