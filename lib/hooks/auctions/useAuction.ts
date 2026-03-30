"use client";

/**
 * useAuction Hook
 * Fetches a single auction by ID using React Query.
 * Replaces manual useState/useEffect in auction detail pages.
 */

import { useQuery } from "@tanstack/react-query";
import { getAuctionById } from "@/lib/api/auctions.api";
import type { AuctionDetailDto } from "@/types/api/auction.types";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const auctionKeys = {
  all: ["auctions"] as const,
  lists: () => [...auctionKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...auctionKeys.lists(), filters] as const,
  details: () => [...auctionKeys.all, "detail"] as const,
  detail: (id: string) => [...auctionKeys.details(), id] as const,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuction(id: string | null | undefined) {
  return useQuery<AuctionDetailDto>({
    queryKey: auctionKeys.detail(id ?? ""),
    queryFn: async () => {
      const result = await getAuctionById(id!);
      if (!result.success || !result.data) {
        throw new Error(result.message || "Failed to fetch auction");
      }
      return result.data;
    },
    // Only run query when we have a valid ID
    enabled: !!id,
    // Auction data can change frequently (bids) — keep stale time short
    staleTime: 15_000,
  });
}
