"use client";

/**
 * useMyListings Hook
 * Manages fetching, filtering, updating and deleting the current user's listings
 */

import { useState, useEffect, useCallback } from "react";
import {
  getMyListings,
  updateListing,
  deleteListing,
  cancelListing,
  relistListing,
} from "@/lib/api/my-listings";
import type {
  MyListing,
  ListingStatusFilter,
  UpdateListingPayload,
  ListingStats,
} from "@/types/features/listings.types";
import type { RelistPayload } from "@/components/my-listings/RelistAuctionModal";

// ─── Return type ──────────────────────────────────────────────────────────────

interface UseMyListingsReturn {
  listings: MyListing[];
  filteredListings: MyListing[];
  stats: ListingStats;
  statusFilter: ListingStatusFilter;
  loading: boolean;
  error: string | null;

  setStatusFilter: (filter: ListingStatusFilter) => void;
  refresh: () => Promise<void>;
  update: (id: string, payload: UpdateListingPayload) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  cancel: (id: string) => Promise<boolean>;
  relist: (id: string, payload: RelistPayload) => Promise<boolean>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMyListings(): UseMyListingsReturn {
  const [listings, setListings] = useState<MyListing[]>([]);
  const [statusFilter, setStatusFilter] = useState<ListingStatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch all listings ──────────────────────────────────────────────────────
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMyListings();

      if (response.success && response.data) {
        setListings(response.data);
      } else {
        setError(response.message || "Failed to load listings");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ── Filtered listings based on active status filter ─────────────────────────
  const filteredListings =
    statusFilter === "all"
      ? listings
      : listings.filter((l) => l.status === statusFilter);

  // ── Compute stats from all listings ────────────────────────────────────────
  const stats: ListingStats = {
    total: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    upcoming: listings.filter((l) => l.status === "upcoming").length,
    ended: listings.filter((l) => l.status === "ended").length,
    sold: listings.filter((l) => l.status === "sold").length,
    cancelled: listings.filter((l) => l.status === "cancelled").length,
  };

  // ── Update listing ──────────────────────────────────────────────────────────
  const update = async (
    id: string,
    payload: UpdateListingPayload,
  ): Promise<boolean> => {
    try {
      const response = await updateListing(id, payload);

      if (response.success && response.data) {
        // Optimistically update local state
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, ...response.data! } : l)),
        );
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err?.message || "Failed to update listing");
      return false;
    }
  };

  // ── Delete listing ──────────────────────────────────────────────────────────
  const remove = async (id: string): Promise<boolean> => {
    try {
      const response = await deleteListing(id);

      if (response.success) {
        // Remove from local state
        setListings((prev) => prev.filter((l) => l.id !== id));
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err?.message || "Failed to delete listing");
      return false;
    }
  };

  // ── Cancel listing ──────────────────────────────────────────────────────────
  const cancel = async (id: string): Promise<boolean> => {
    try {
      const response = await cancelListing(id);

      if (response.success && response.data) {
        // Update status in local state
        setListings((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, status: "cancelled" as const } : l,
          ),
        );
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err?.message || "Failed to cancel listing");
      return false;
    }
  };

  // ── Relist listing ──────────────────────────────────────────────────────────
  const relist = async (
    id: string,
    payload: RelistPayload,
  ): Promise<boolean> => {
    try {
      const response = await relistListing(id, payload);

      if (response.success && response.data) {
        // Update listing in local state with new active status
        setListings((prev) =>
          prev.map((l) =>
            l.id === id
              ? {
                  ...l,
                  ...response.data!,
                  status: "active" as const,
                }
              : l,
          ),
        );
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err?.message || "Failed to relist listing");
      return false;
    }
  };

  return {
    listings,
    filteredListings,
    stats,
    statusFilter,
    loading,
    error,
    setStatusFilter,
    refresh: fetchListings,
    update,
    remove,
    cancel,
    relist,
  };
}
