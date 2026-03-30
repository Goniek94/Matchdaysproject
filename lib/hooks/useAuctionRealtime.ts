"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getAuctionById } from "@/lib/api/auctions.api";
import type { AuctionBidDto } from "@/types/api/auction.types";

interface AuctionRealtimeState {
  currentBid: number;
  bidCount: number;
  status: string;
  bids: Array<{
    id: string;
    username: string;
    amount: number;
    time: string;
    isWinning: boolean;
  }>;
  highestBidder: string | undefined;
  secondsRemaining: number;
  isEnded: boolean;
  winner: string | undefined;
}

const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "Unknown";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export function useAuctionRealtime(
  auctionId: string | null,
  initialEndTime: string | undefined,
  isRealAuction: boolean,
) {
  const [state, setState] = useState<AuctionRealtimeState>({
    currentBid: 0,
    bidCount: 0,
    status: "active",
    bids: [],
    highestBidder: undefined,
    secondsRemaining: 0,
    isEnded: false,
    winner: undefined,
  });

  const endTimeRef = useRef(initialEndTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer — ticks every second locally
  const startCountdown = useCallback((endTimeStr: string) => {
    if (countdownRef.current) clearInterval(countdownRef.current);

    countdownRef.current = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(endTimeStr).getTime() - Date.now()) / 1000),
      );
      setState((prev) => ({
        ...prev,
        secondsRemaining: remaining,
        isEnded: remaining === 0,
      }));
    }, 1000);
  }, []);

  // Fetch latest data from backend
  const fetchLatest = useCallback(async () => {
    if (!auctionId || !isRealAuction) return;

    try {
      const result = await getAuctionById(auctionId);
      if (!result.success || !result.data) return;

      const d = result.data;
      const newBids = Array.isArray(d.bids)
        ? d.bids.map((bid: AuctionBidDto, index: number) => ({
            id: bid.id,
            username: bid.bidder?.username || "Anonymous",
            amount: Number(bid.amount),
            time: formatTimeAgo(bid.createdAt),
            isWinning: index === 0,
          }))
        : [];

      const endTimeStr = d.endTime || endTimeRef.current || "";
      endTimeRef.current = endTimeStr;

      const isEnded = ["ended", "sold", "cancelled"].includes(
        d.status?.toLowerCase(),
      );

      setState((prev) => ({
        ...prev,
        currentBid: Number(d.currentBid || d.startingBid || 0),
        bidCount: d.bidCount || 0,
        status: d.status?.toLowerCase() || "active",
        bids: newBids,
        highestBidder: newBids.length > 0 ? newBids[0].username : undefined,
        isEnded,
        winner: isEnded && newBids.length > 0 ? newBids[0].username : undefined,
      }));

      // Restart countdown if endTime changed
      if (endTimeStr && !isEnded) {
        startCountdown(endTimeStr);
      }
    } catch {
      // Silently fail — don't disrupt UI on polling error
    }
  }, [auctionId, isRealAuction, startCountdown]);

  // Start polling — fast when active, slow when ended
  useEffect(() => {
    if (!auctionId || !isRealAuction) return;

    // Initial fetch
    fetchLatest();

    // Start countdown with initial endTime
    if (initialEndTime) {
      startCountdown(initialEndTime);
      const remaining = Math.max(
        0,
        Math.floor((new Date(initialEndTime).getTime() - Date.now()) / 1000),
      );
      setState((prev) => ({ ...prev, secondsRemaining: remaining }));
    }

    // Poll every 3s when active, every 30s when ended
    const scheduleNext = () => {
      intervalRef.current = setTimeout(
        async () => {
          await fetchLatest();
          const isEnded = ["ended", "sold", "cancelled"].includes(state.status);
          scheduleNext();
          // If ended, slow down polling significantly
          if (isEnded && intervalRef.current) {
            clearTimeout(intervalRef.current);
            intervalRef.current = setTimeout(fetchLatest, 30000);
          }
        },
        state.isEnded ? 30000 : 3000,
      );
    };

    scheduleNext();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [auctionId, isRealAuction]);

  // Force refresh — call this after placing a bid
  const refresh = useCallback(() => {
    fetchLatest();
  }, [fetchLatest]);

  return { ...state, refresh };
}
