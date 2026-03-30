"use client";

/**
 * usePlaceBid Hook
 * Mutation hook for placing a bid on an auction.
 * Automatically invalidates the auction cache after a successful bid.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { placeBid } from "@/lib/api/bids.api";
import { auctionKeys } from "@/lib/hooks/auctions/useAuction";
import type { PlaceBidResponseDto } from "@/types/api/bid.types";
import type { ApiResponse } from "@/lib/api/config";

interface UsePlaceBidOptions {
  onSuccess?: (data: PlaceBidResponseDto) => void;
  onError?: (message: string) => void;
}

export function usePlaceBid(auctionId: string, options?: UsePlaceBidOptions) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<PlaceBidResponseDto>, Error, number>({
    mutationFn: (amount: number) => placeBid(auctionId, amount),

    onSuccess: (result) => {
      if (!result.success) {
        options?.onError?.(result.message || "Failed to place bid");
        return;
      }

      // Invalidate auction cache so the new bid is reflected immediately
      queryClient.invalidateQueries({
        queryKey: auctionKeys.detail(auctionId),
      });

      if (result.data) {
        options?.onSuccess?.(result.data);
      }
    },

    onError: (error) => {
      options?.onError?.(error.message || "Failed to place bid");
    },
  });
}
