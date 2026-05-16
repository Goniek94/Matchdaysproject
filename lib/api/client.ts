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
import { logger } from "@/lib/logger";
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
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: unknown = null) => {
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

/**
 * Reads a cookie value by name. The CSRF cookie is intentionally NOT
 * HttpOnly so we can read it here and echo it back in a header — that
 * is the entire point of the double-submit pattern. Returns null if the
 * cookie isn't set (server will mint one on the next safe request).
 */
function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null; // SSR
  const prefix = name + "=";
  const parts = document.cookie.split(";");
  for (const raw of parts) {
    const c = raw.trim();
    if (c.startsWith(prefix)) {
      return decodeURIComponent(c.substring(prefix.length));
    }
  }
  return null;
}

// HTTP methods that mutate state on the backend. Must match the
// UNSAFE_METHODS set in `src/common/csrf/csrf.middleware.ts`.
const UNSAFE_METHODS = new Set(["post", "put", "patch", "delete"]);

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userData = getUserData();

    // Add user ID to headers if available (optional, for backend logging)
    if (userData?.id) {
      config.headers["X-User-ID"] = userData.id;
    }

    // CSRF double-submit: echo the `csrf` cookie back as a header on any
    // state-changing request. The backend rejects unsafe methods that
    // don't carry this. Safe methods (GET/HEAD/OPTIONS) skip the check
    // to avoid an extra round-trip on initial page loads before the
    // cookie has been minted.
    const method = (config.method ?? "get").toLowerCase();
    if (UNSAFE_METHODS.has(method)) {
      const csrf = readCookie("csrf");
      if (csrf) {
        config.headers["X-CSRF-Token"] = csrf;
      }
      // If no cookie yet (first POST after a hard refresh on a fresh
      // session), the call will 403. The response interceptor catches
      // that case and retries once after a GET that primes the cookie.
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
      _csrfRetry?: boolean;
    };

    // ── Handle 403 from missing/stale CSRF token ──
    // Happens on the very first state-changing call of a session: the
    // server only mints the `csrf` cookie when it sees the first request,
    // so the request interceptor for THIS call had no cookie to echo.
    // Prime the cookie with a safe GET, then retry once. After this
    // single retry the cookie is in place for the rest of the session.
    //
    // We only retry on the specific CSRF error shape so a real
    // authorisation 403 still surfaces to the caller.
    const csrfFailed =
      error.response?.status === 403 &&
      typeof (error.response?.data as { message?: string } | undefined)
        ?.message === "string" &&
      /csrf/i.test(
        (error.response?.data as { message?: string }).message ?? "",
      );
    if (csrfFailed && !originalRequest._csrfRetry) {
      originalRequest._csrfRetry = true;
      try {
        // Any safe endpoint will do — the middleware mints the cookie
        // on every request that lacks one. `/auth/csrf-prime` would be
        // an explicit choice; using `/auth/check-auth` reuses an
        // endpoint that already exists.
        await apiClient.get("/auth/check-auth").catch(() => {
          /* even a 401 here is fine — the cookie still gets set */
        });
        return apiClient(originalRequest);
      } catch (retryErr) {
        return Promise.reject(buildError(retryErr as AxiosError));
      }
    }

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
        // Refresh failed - clear local auth data (includes isLoggedIn flag)
        processQueue(refreshError);
        isRefreshing = false;
        clearAuthData();

        // Do NOT hard redirect here - let the component/page handle it
        // This avoids disrupting the UX with unexpected redirects

        return Promise.reject(buildError(refreshError as AxiosError));
      }
    }

    // ── Handle 431 Request Header Fields Too Large ──
    // Note: we used to clearAuthData() here, but 431 isn't an auth signal —
    // it's usually a cookie-size problem from third-party scripts or an
    // overgrown header. Clearing the session was punishing the user for
    // a browser issue. Just log it; the user can clear cookies manually
    // if it persists.
    if (error.response?.status === 431) {
      logger.error(
        "Request headers too large (431) — session left intact",
        "apiClient",
      );
    }

    // ── Handle network errors ──
    if (!error.response) {
      return Promise.reject({
        success: false,
        message: "Connection error. Please check your internet connection.",
        error: error.message,
        status: 0,
      });
    }

    // ── Return formatted error ──
    const built = buildError(error);
    // Loud, plain-text logging for 4xx — Object in DevTools is collapsed by
    // default, so we also dump message/error as a string so it's readable
    // without expanding anything.
    if (error.response && error.response.status >= 400) {
      const url = `${error.config?.method?.toUpperCase()} ${error.config?.url}`;
      // eslint-disable-next-line no-console
      console.error(
        `🔴 API ${built.status} on ${url}\n` +
          `   message: ${
            Array.isArray(built.message)
              ? "\n     • " + built.message.join("\n     • ")
              : built.message
          }\n` +
          `   error:   ${built.error}`,
      );
    }
    return Promise.reject(built);
  },
);

interface ApiErrorShape {
  message?: string;
  error?: string;
}

function buildError(error: AxiosError) {
  const responseData = error.response?.data as ApiErrorShape | undefined;
  return {
    success: false,
    message: responseData?.message ?? error.message ?? "An unexpected error occurred",
    error: responseData?.error ?? error.message,
    status: error.response?.status,
  };
}


export default apiClient;
