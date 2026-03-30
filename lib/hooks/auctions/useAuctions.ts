"use client";

/**
 * useAuctions Hook
 * Fetches a paginated, filtered list of auctions using React Query.
 */

import { useQuery } from "@tanstack/react-query";
import { getAuctions } from "@/lib/api/auctions.api";
import type { AuctionFilters, AuctionListDto } from "@/types/api/auction.types";
import { auctionKeys } from "./useAuction";

export function useAuctions(filters?: AuctionFilters) {
  return useQuery<AuctionListDto>({
    queryKey: auctionKeys.list((filters ?? {}) as Record<string, unknown>),
    queryFn: async () => {
      const result = await getAuctions(filters);
      if (!result.success || !result.data) {
        throw new Error(result.message || "Failed to fetch auctions");
      }
      return result.data;
    },
    // Auction list is less volatile than individual auction — 30s stale time
    staleTime: 30_000,
  });
}
