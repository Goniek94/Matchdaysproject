"use client";

/**
 * AuthContext - Global authentication state management
 * Based on Marketplace frontend pattern, adapted for Matchdays (TypeScript/Next.js)
 * Uses HTTP-Only cookies for tokens, localStorage only for session flag
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authApi } from "@/lib/api";
import { clearAuthData, getUserData, setAuthData } from "@/lib/api/config";
import type { UserData, ApiResponse } from "@/lib/api/config";
import type { RegisterData } from "@/lib/api/auth";
import { logger } from "@/lib/logger";

/**
 * Read cached auth state synchronously so the very first React render can
 * already show the logged-in UI. We still revalidate against the backend
 * in the background — if the cached session is stale, the navbar swaps
 * to logged-out only AFTER the API confirms it.
 *
 * Returns null/false during SSR (no localStorage), so the server renders
 * the logged-out variant; the client hydration step then upgrades to the
 * cached state without a flash because both paths render identical HTML
 * for the navbar shell.
 */
function readCachedAuth(): { user: UserData | null; isAuthenticated: boolean } {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false };
  }
  const hasFlag = localStorage.getItem("isLoggedIn") === "true";
  if (!hasFlag) return { user: null, isAuthenticated: false };
  const cached = getUserData();
  return { user: cached, isAuthenticated: !!cached };
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (emailOrUsername: string, password: string) => Promise<ApiResponse<UserData>>;
  register: (userData: RegisterData) => Promise<ApiResponse<UserData>>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<UserData | null>;

  hasRole: (role: string | string[]) => boolean;
  isAdmin: boolean;
  clearError: () => void;
}

// Re-export RegisterData so consumers can import from AuthContext
export type { RegisterData };

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Hydration-safe initialisation. We CANNOT call `readCachedAuth()` inline
  // as the initial state because it reads localStorage on the client but not
  // on the server — that would make the first client render diverge from the
  // SSR output (logged-in dropdown vs logged-out buttons in the Navbar) and
  // trigger a React hydration error.
  //
  // Pattern: start as guest on both server and client first render, then
  // upgrade to the cached state in a useEffect (post-mount). Trade-off is a
  // ~1-frame flash of the logged-out navbar — acceptable, far less bad than
  // the hydration mismatch wiping out the entire root and re-rendering.
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read the localStorage cache after mount — same effect as before, just
  // moved out of the render path so SSR/CSR start identically.
  useEffect(() => {
    const cached = readCachedAuth();
    if (cached.isAuthenticated && cached.user) {
      setUser(cached.user);
      setIsAuthenticated(true);
    } else {
      setIsLoading(false);
    }
  }, []);

  // ── Cleanup helper ──────────────────────────────────────────────────────────
  const handleLogoutCleanup = useCallback(() => {
    clearAuthData();
    // Remove session flag - same pattern as Marketplace
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
    }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ── Initialize auth on app start ────────────────────────────────────────────
  // Strategy: trust the localStorage cache for the optimistic render (already
  // applied in useState), then revalidate in the background.
  //  - Backend 401/403 → session is truly dead → log out
  //  - Network error / timeout → keep cached session, just stop loading
  //    (next request will hit the axios refresh interceptor anyway)
  const initializeAuth = useCallback(async () => {
    const hasSessionFlag =
      typeof window !== "undefined" &&
      localStorage.getItem("isLoggedIn") === "true";

    if (!hasSessionFlag) {
      // No cached session — nothing to validate. Already correct from useState.
      setIsLoading(false);
      return;
    }

    try {
      // Verify with backend via HTTP-Only cookie
      const response = await authApi.checkAuth();

      if (response.success && response.data) {
        // Session confirmed — refresh cached profile (rating, level, etc. may
        // have changed server-side since the last login).
        setUser(response.data);
        setIsAuthenticated(true);
        setAuthData(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("isLoggedIn", "true");
        }
      } else {
        // Backend explicitly says "not you" — kill the session
        handleLogoutCleanup();
      }
    } catch (err: unknown) {
      const status =
        (err as { status?: number; response?: { status?: number } })?.status ??
        (err as { response?: { status?: number } })?.response?.status;

      if (status === 401 || status === 403) {
        // Backend rejected the cookie — log out for real
        handleLogoutCleanup();
      } else {
        // Network error / timeout / 5xx — keep the optimistic logged-in state.
        // The next authenticated API call will retry via the axios refresh
        // interceptor and only then log out if refresh actually fails.
        logger.warn(
          "Auth revalidation failed (network/server) — keeping cached session",
          "AuthContext",
          err,
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleLogoutCleanup]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Revalidate when the tab regains focus. Catches the case where the user
  // was on /add-listing for several minutes (uploads + AI analysis), the
  // 15-minute access token expired, and switching back should restore them
  // via the refresh-token cookie rather than show a stale "logged in" state.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onFocus = () => {
      if (localStorage.getItem("isLoggedIn") !== "true") return;
      // Fire-and-forget — initializeAuth already handles errors gracefully.
      void initializeAuth();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [initializeAuth]);

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = async (emailOrUsername: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authApi.login({ emailOrUsername, password });

      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        setAuthData(response.data);

        // Set session flag - same pattern as Marketplace
        if (typeof window !== "undefined") {
          localStorage.setItem("isLoggedIn", "true");
        }
      }

      return response;
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || "Login failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Register ─────────────────────────────────────────────────────────────────
  const register = async (userData: RegisterData) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authApi.register(userData);

      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        setAuthData(response.data);

        if (typeof window !== "undefined") {
          localStorage.setItem("isLoggedIn", "true");
        }
      }

      return response;
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || "Registration failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clean up local state, even if API call fails
      handleLogoutCleanup();
      setError(null);
      setIsLoading(false);
    }
  };

  // ── Refresh user data ────────────────────────────────────────────────────────
  const refreshUser = async (): Promise<UserData | null> => {
    try {
      const response = await authApi.checkAuth();

      if (response.success && response.data) {
        setUser(response.data);
        setAuthData(response.data);
        return response.data;
      }

      handleLogoutCleanup();
      return null;
    } catch (err) {
      console.error("User data refresh failed:", err);
      handleLogoutCleanup();
      return null;
    }
  };

  // ── Role helpers ─────────────────────────────────────────────────────────────
  const hasRole = (requiredRole: string | string[]): boolean => {
    if (!user?.role) return false;
    return Array.isArray(requiredRole)
      ? requiredRole.includes(user.role)
      : user.role === requiredRole;
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,

    login,
    register,
    logout,
    refreshUser,

    hasRole,
    isAdmin: hasRole("admin"),
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
