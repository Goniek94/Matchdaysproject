"use client";

/**
 * useMyListings Hook
 * Manages the current user's auction listings using React Query.
 * Replaces manual useState/useEffect pattern with useQuery + useMutation.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { logger } from "@/lib/logger";
import {
  getMyAuctions,
  updateAuction,
  deleteAuction,
  cancelAuction,
  relistAuction,
} from "@/lib/api/auctions.api";
import type { AuctionDto, AuctionStatus } from "@/types/api/auction.types";
import type {
  ListingStatusFilter,
  UpdateListingPayload,
  ListingStats,
} from "@/types/features/listings.types";
import type { RelistPayload } from "@/components/my-listings/RelistAuctionModal";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const myListingsKeys = {
  all: ["my-listings"] as const,
  list: () => [...myListingsKeys.all, "list"] as const,
};

// ─── Return type ──────────────────────────────────────────────────────────────

interface UseMyListingsReturn {
  listings: AuctionDto[];
  filteredListings: AuctionDto[];
  stats: ListingStats;
  statusFilter: ListingStatusFilter;
  loading: boolean;
  error: string | null;
  setStatusFilter: (filter: ListingStatusFilter) => void;
  refresh: () => void;
  update: (id: string, payload: UpdateListingPayload) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  cancel: (id: string) => Promise<boolean>;
  relist: (id: string, payload: RelistPayload) => Promise<boolean>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

import { useState } from "react";

export function useMyListings(): UseMyListingsReturn {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<ListingStatusFilter>("all");

  // ── Fetch listings ──────────────────────────────────────────────────────────
  const {
    data: listings = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery<AuctionDto[]>({
    queryKey: myListingsKeys.list(),
    queryFn: async () => {
      const result = await getMyAuctions();
      if (!result.success || !result.data) {
        throw new Error(result.message || "Failed to load listings");
      }
      return result.data;
    },
    staleTime: 60_000, // My listings change less frequently
  });

  const error = queryError
    ? (queryError as Error).message || "Failed to load listings"
    : null;

  // ── Filtered listings ───────────────────────────────────────────────────────
  const filteredListings =
    statusFilter === "all"
      ? listings
      : listings.filter((l) => l.status === statusFilter);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats: ListingStats = {
    total: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    upcoming: listings.filter((l) => l.status === "upcoming").length,
    ended: listings.filter((l) => l.status === "ended").length,
    sold: listings.filter((l) => l.status === "sold").length,
    cancelled: listings.filter((l) => l.status === "cancelled").length,
  };

  // ── Update mutation ─────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateListingPayload;
    }) => updateAuction(id, payload),
    onSuccess: (result, { id }) => {
      if (result.success && result.data) {
        // Optimistically update cache
        queryClient.setQueryData<AuctionDto[]>(
          myListingsKeys.list(),
          (prev) =>
            prev?.map((l) => (l.id === id ? { ...l, ...result.data! } : l)) ??
            [],
        );
      }
    },
  });

  // ── Delete mutation ─────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAuction(id),
    onSuccess: (result, id) => {
      if (result.success) {
        queryClient.setQueryData<AuctionDto[]>(
          myListingsKeys.list(),
          (prev) => prev?.filter((l) => l.id !== id) ?? [],
        );
      }
    },
  });

  // ── Cancel mutation ─────────────────────────────────────────────────────────
  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelAuction(id),
    onSuccess: (result, id) => {
      if (result.success) {
        queryClient.setQueryData<AuctionDto[]>(
          myListingsKeys.list(),
          (prev) =>
            prev?.map((l) =>
              l.id === id ? { ...l, status: "cancelled" as AuctionStatus } : l,
            ) ?? [],
        );
      }
    },
  });

  // ── Relist mutation ─────────────────────────────────────────────────────────
  const relistMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RelistPayload }) =>
      relistAuction(id, payload),
    onSuccess: (result, { id }) => {
      if (result.success && result.data) {
        queryClient.setQueryData<AuctionDto[]>(
          myListingsKeys.list(),
          (prev) =>
            prev?.map((l) =>
              l.id === id
                ? { ...l, ...result.data!, status: "active" as AuctionStatus }
                : l,
            ) ?? [],
        );
      }
    },
  });

  // ── Public action wrappers (return boolean for backward compatibility) ───────
  const update = async (
    id: string,
    payload: UpdateListingPayload,
  ): Promise<boolean> => {
    try {
      const result = await updateMutation.mutateAsync({ id, payload });
      return result.success;
    } catch (err) {
      logger.error("Failed to update listing", "useMyListings", err);
      return false;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      const result = await deleteMutation.mutateAsync(id);
      return result.success;
    } catch (err) {
      logger.error("Failed to delete listing", "useMyListings", err);
      return false;
    }
  };

  const cancel = async (id: string): Promise<boolean> => {
    try {
      const result = await cancelMutation.mutateAsync(id);
      return result.success;
    } catch (err) {
      logger.error("Failed to cancel listing", "useMyListings", err);
      return false;
    }
  };

  const relist = async (
    id: string,
    payload: RelistPayload,
  ): Promise<boolean> => {
    try {
      const result = await relistMutation.mutateAsync({ id, payload });
      return result.success;
    } catch (err) {
      logger.error("Failed to relist listing", "useMyListings", err);
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
    refresh: () => refetch(),
    update,
    remove,
    cancel,
    relist,
  };
}
