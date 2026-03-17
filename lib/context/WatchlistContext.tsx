"use client";

/**
 * WatchlistContext - Global watchlist (favorites) state management
 * Persists to localStorage for guest users, syncs with auth state
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WatchlistItem {
  id: string;
  title: string;
  currentBid?: number;
  buyNowPrice?: number;
  image?: string;
  endTime?: string;
  listingType?: "auction" | "buy_now" | "auction_buy_now";
  addedAt: string;
}

interface WatchlistContextValue {
  watchlist: WatchlistItem[];
  isInWatchlist: (id: string) => boolean;
  addToWatchlist: (item: Omit<WatchlistItem, "addedAt">) => void;
  removeFromWatchlist: (id: string) => void;
  toggleWatchlist: (item: Omit<WatchlistItem, "addedAt">) => boolean;
  clearWatchlist: () => void;
  count: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const WatchlistContext = createContext<WatchlistContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "matchdays_watchlist";

// ─── Provider ─────────────────────────────────────────────────────────────────

export const WatchlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  // Ref to always have the latest watchlist value synchronously (avoids stale closure)
  const watchlistRef = useRef<WatchlistItem[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    watchlistRef.current = watchlist;
  }, [watchlist]);

  // Build storage key per user (or guest)
  const storageKey = user?.id
    ? `${STORAGE_KEY}_${user.id}`
    : `${STORAGE_KEY}_guest`;

  // Load from localStorage on mount / user change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setWatchlist(JSON.parse(saved));
      } else {
        setWatchlist([]);
      }
    } catch {
      setWatchlist([]);
    }
  }, [storageKey]);

  // Persist to localStorage whenever watchlist changes
  const persist = useCallback(
    (items: WatchlistItem[]) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(items));
      } catch {
        // Ignore storage errors
      }
    },
    [storageKey],
  );

  const isInWatchlist = useCallback(
    (id: string) => watchlist.some((item) => item.id === id),
    [watchlist],
  );

  const addToWatchlist = useCallback(
    (item: Omit<WatchlistItem, "addedAt">) => {
      setWatchlist((prev) => {
        // Prevent duplicates
        if (prev.some((w) => w.id === item.id)) return prev;
        const updated = [
          { ...item, addedAt: new Date().toISOString() },
          ...prev,
        ];
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const removeFromWatchlist = useCallback(
    (id: string) => {
      setWatchlist((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  /**
   * Toggle watchlist status.
   * Returns true if item was added, false if removed.
   * Uses a ref to reliably capture the result from inside setState.
   */
  const toggleWatchlist = useCallback(
    (item: Omit<WatchlistItem, "addedAt">): boolean => {
      // Read current state synchronously to determine result before setState
      const currentWatchlist = watchlistRef.current;
      const exists = currentWatchlist.some((w) => w.id === item.id);

      setWatchlist((prev) => {
        let updated: WatchlistItem[];
        if (exists) {
          updated = prev.filter((w) => w.id !== item.id);
        } else {
          updated = [{ ...item, addedAt: new Date().toISOString() }, ...prev];
        }
        persist(updated);
        return updated;
      });

      return !exists;
    },
    [persist],
  );

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
    persist([]);
  }, [persist]);

  const value: WatchlistContextValue = {
    watchlist,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearWatchlist,
    count: watchlist.length,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useWatchlist = (): WatchlistContextValue => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};

export default WatchlistContext;
