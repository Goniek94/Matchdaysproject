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
import { clearAuthData, setAuthData } from "@/lib/api/config";
import type { UserData } from "@/lib/api/config";
import type { RegisterData } from "@/lib/api/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (emailOrUsername: string, password: string) => Promise<any>;
  register: (userData: RegisterData) => Promise<any>;
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
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const initializeAuth = useCallback(async () => {
    try {
      // Check session flag first - avoids unnecessary 401 errors for guests
      // Same pattern as Marketplace AuthContext
      const hasSessionFlag =
        typeof window !== "undefined" &&
        localStorage.getItem("isLoggedIn") === "true";

      if (!hasSessionFlag) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Verify with backend via HTTP-Only cookie
      const response = await authApi.checkAuth();

      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        setAuthData(response.data);
        // Ensure flag is set
        if (typeof window !== "undefined") {
          localStorage.setItem("isLoggedIn", "true");
        }
      } else {
        handleLogoutCleanup();
      }
    } catch (err: any) {
      // Silently ignore 401 - user is simply not logged in
      if (err?.status !== 401 && err?.response?.status !== 401) {
        console.error("Auth initialization failed:", err);
      }
      handleLogoutCleanup();
    } finally {
      setIsLoading(false);
    }
  }, [handleLogoutCleanup]);

  useEffect(() => {
    initializeAuth();
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
    } catch (err: any) {
      const message = err?.message || "Nie udało się zalogować";
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
    } catch (err: any) {
      const message = err?.message || "Nie udało się zarejestrować";
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
