/**
 * API Client
 * Axios instance with interceptors for authentication and error handling
 * Based on Marketplace frontend pattern, adapted for Matchdays
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
  withCredentials: true, // Critical: send HTTP-Only cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Token Refresh Queue ───────────────────────────────────────────────────────

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

// ─── Request Interceptor ───────────────────────────────────────────────────────

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
  },
);

// ─── Response Interceptor ──────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // ── Handle 401 Unauthorized ──
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints to avoid infinite loops
      const isAuthEndpoint =
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register") ||
        originalRequest.url?.includes("/auth/refresh") ||
        originalRequest.url?.includes("/auth/check-auth");

      if (isAuthEndpoint) {
        // For auth endpoints, just reject - let AuthContext handle cleanup
        return Promise.reject(buildError(error));
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the session using refresh token cookie
        await apiClient.post("/auth/refresh");

        processQueue();
        isRefreshing = false;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear local auth data
        processQueue(refreshError);
        isRefreshing = false;
        clearAuthData();

        // Remove session flag so AuthContext knows user is logged out
        if (typeof window !== "undefined") {
          localStorage.removeItem("isLoggedIn");
        }

        // Do NOT hard redirect here - let the component/page handle it
        // This avoids disrupting the UX with unexpected redirects

        return Promise.reject(buildError(refreshError as AxiosError));
      }
    }

    // ── Handle 431 Request Header Fields Too Large ──
    if (error.response?.status === 431) {
      console.error("Request headers too large. Clearing auth data.");
      clearAuthData();
    }

    // ── Handle network errors ──
    if (!error.response) {
      return Promise.reject({
        success: false,
        message: "Błąd połączenia z serwerem. Sprawdź połączenie internetowe.",
        error: error.message,
        status: 0,
      });
    }

    // ── Return formatted error ──
    return Promise.reject(buildError(error));
  },
);

/**
 * Build a consistent error object from AxiosError
 */
function buildError(error: any) {
  const responseData = error?.response?.data as any;
  return {
    success: false,
    message:
      responseData?.message || error?.message || "Wystąpił nieoczekiwany błąd",
    error: responseData?.error || error?.message,
    status: error?.response?.status,
  };
}

// ─── Simple In-Memory Cache ────────────────────────────────────────────────────

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
