"use client";

/**
 * useMyListings Hook
 *
 * Manages fetching, filtering and mutations for the seller's own auctions.
 * Tracks two orthogonal axes:
 *   - statusFilter (all/active/upcoming/ended/sold/cancelled) — UI tabs
 *   - scope        (active/archived)                          — toggle "Archive view"
 *
 * The backend exposes both via /auctions/my/auctions?status=...&archived=...
 */

import { useState, useEffect, useCallback } from "react";
import {
  getMyListings,
  updateListing,
  deleteListing,
  cancelListing,
  relistListing,
  archiveListing,
  unarchiveListing,
} from "@/lib/api/my-listings";
import type {
  MyListing,
  ListingStatusFilter,
  UpdateListingPayload,
  ListingStats,
} from "@/types/features/listings.types";
import type { RelistPayload } from "@/components/my-listings/RelistAuctionModal";

export type ListingScope = "active" | "archived";

interface UseMyListingsReturn {
  listings: MyListing[];
  filteredListings: MyListing[];
  stats: ListingStats;
  statusFilter: ListingStatusFilter;
  scope: ListingScope;
  loading: boolean;
  error: string | null;

  setStatusFilter: (filter: ListingStatusFilter) => void;
  setScope: (scope: ListingScope) => void;
  refresh: () => Promise<void>;
  update: (id: string, payload: UpdateListingPayload) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  cancel: (id: string) => Promise<boolean>;
  relist: (id: string, payload: RelistPayload) => Promise<boolean>;
  archive: (id: string) => Promise<boolean>;
  unarchive: (id: string) => Promise<boolean>;
}

export function useMyListings(): UseMyListingsReturn {
  const [listings, setListings] = useState<MyListing[]>([]);
  const [statusFilter, setStatusFilter] = useState<ListingStatusFilter>("all");
  const [scope, setScope] = useState<ListingScope>("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch listings for the current scope ─────────────────────────────────
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyListings(undefined, scope);
      if (response.success && response.data) {
        setListings(response.data);
      } else {
        setError(response.message || "Failed to load listings");
      }
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message || "Failed to load listings",
      );
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ── Derived: filtered by status tab ──────────────────────────────────────
  const filteredListings =
    statusFilter === "all"
      ? listings
      : listings.filter((l) => l.status === statusFilter);

  // ── Stats over the current scope ─────────────────────────────────────────
  const stats: ListingStats = {
    total: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    upcoming: listings.filter((l) => l.status === "upcoming").length,
    ended: listings.filter((l) => l.status === "ended").length,
    sold: listings.filter((l) => l.status === "sold").length,
    cancelled: listings.filter((l) => l.status === "cancelled").length,
  };

  // ── Mutations ────────────────────────────────────────────────────────────
  const update = async (
    id: string,
    payload: UpdateListingPayload,
  ): Promise<boolean> => {
    try {
      const response = await updateListing(id, payload);
      if (response.success && response.data) {
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, ...response.data! } : l)),
        );
        return true;
      }
      return false;
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message || "Failed to update listing",
      );
      return false;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      const response = await deleteListing(id);
      if (response.success) {
        setListings((prev) => prev.filter((l) => l.id !== id));
        return true;
      }
      return false;
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message || "Failed to delete listing",
      );
      return false;
    }
  };

  const cancel = async (id: string): Promise<boolean> => {
    try {
      const response = await cancelListing(id);
      if (response.success && response.data) {
        setListings((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, status: "cancelled" as const } : l,
          ),
        );
        return true;
      }
      return false;
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message || "Failed to cancel listing",
      );
      return false;
    }
  };

  const relist = async (
    id: string,
    payload: RelistPayload,
  ): Promise<boolean> => {
    try {
      const response = await relistListing(id, payload);
      if (response.success && response.data) {
        setListings((prev) =>
          prev.map((l) =>
            l.id === id
              ? { ...l, ...response.data!, status: "active" as const }
              : l,
          ),
        );
        return true;
      }
      return false;
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message || "Failed to relist listing",
      );
      return false;
    }
  };

  /**
   * Archiving / unarchiving moves the listing between the two scopes.
   * If we're currently viewing the source scope, the row disappears from view.
   */
  const archive = async (id: string): Promise<boolean> => {
    try {
      const response = await archiveListing(id);
      if (response.success) {
        setListings((prev) =>
          scope === "active" ? prev.filter((l) => l.id !== id) : prev,
        );
        return true;
      }
      return false;
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message || "Failed to archive listing",
      );
      return false;
    }
  };

  const unarchive = async (id: string): Promise<boolean> => {
    try {
      const response = await unarchiveListing(id);
      if (response.success) {
        setListings((prev) =>
          scope === "archived" ? prev.filter((l) => l.id !== id) : prev,
        );
        return true;
      }
      return false;
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message ||
          "Failed to restore listing",
      );
      return false;
    }
  };

  return {
    listings,
    filteredListings,
    stats,
    statusFilter,
    scope,
    loading,
    error,
    setStatusFilter,
    setScope,
    refresh: fetchListings,
    update,
    remove,
    cancel,
    relist,
    archive,
    unarchive,
  };
}
