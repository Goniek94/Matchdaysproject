"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getAuctionById } from "@/lib/api/auctions.api";
import type { AuctionBidDto } from "@/types/api/auction.types";
import { logger } from "@/lib/logger";

interface BidDisplay {
  id: string;
  username: string;
  amount: number;
  time: string;
  isWinning: boolean;
}

interface AuctionRealtimeState {
  currentBid: number;
  bidCount: number;
  status: string;
  bids: BidDisplay[];
  highestBidder: string | undefined;
  secondsRemaining: number;
  isEnded: boolean;
  winner: string | undefined;
  wsConnected: boolean;
}

// Derived at module initialisation — fail-fast if the env var is absent.
// The WebSocket server lives on the same host as the REST API.
const _rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!_rawApiUrl && typeof window !== "undefined") {
  logger.error(
    "NEXT_PUBLIC_API_URL is not set — auction realtime will not connect.",
    "useAuctionRealtime",
  );
}
const BACKEND_URL = _rawApiUrl
  ? _rawApiUrl.replace("/api/v1", "")
  : "";

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
    wsConnected: false,
  });

  const endTimeRef = useRef(initialEndTime);
  const socketRef = useRef<Socket | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // ── Countdown timer ──────────────────────────────────────────────────────────
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

  // ── Fetch latest data from backend ───────────────────────────────────────────
  const fetchLatest = useCallback(async () => {
    if (!auctionId || !isRealAuction) return;

    try {
      const result = await getAuctionById(auctionId);
      if (!result.success || !result.data) return;

      const d = result.data;
      const newBids: BidDisplay[] = Array.isArray(d.bids)
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

      if (endTimeStr && !isEnded) {
        startCountdown(endTimeStr);
      }
    } catch (err) {
      logger.warn("Polling fetch failed", "useAuctionRealtime", err);
    }
  }, [auctionId, isRealAuction, startCountdown]);

  // ── WebSocket connection ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!auctionId || !isRealAuction) return;

    // Initial data fetch
    fetchLatest();

    // Start countdown with initial endTime
    if (initialEndTime) {
      const remaining = Math.max(
        0,
        Math.floor((new Date(initialEndTime).getTime() - Date.now()) / 1000),
      );
      setState((prev) => ({ ...prev, secondsRemaining: remaining }));
      startCountdown(initialEndTime);
    }

    // Guard: skip socket setup if ENV was missing at init
    if (!BACKEND_URL) return;

    // Connect WebSocket
    const socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      logger.info(`Connected, joining auction ${auctionId}`, "useAuctionRealtime");
      setState((prev) => ({ ...prev, wsConnected: true }));
      socket.emit("join-auction", auctionId);
    });

    socket.on("connect_error", (err) => {
      logger.warn("WebSocket connection error", "useAuctionRealtime", err);
    });

    socket.on("disconnect", (reason) => {
      logger.info(`Disconnected: ${reason}`, "useAuctionRealtime");
      setState((prev) => ({ ...prev, wsConnected: false }));
    });

    socket.on(
      "bid:placed",
      (payload: {
        bidId: string;
        amount: number;
        bidderUsername: string;
        bidderId: string;
        bidCount: number;
        endTime: string;
        createdAt: string;
      }) => {
        logger.debug(`bid:placed €${payload.amount} by ${payload.bidderUsername}`, "useAuctionRealtime");

        const newBid: BidDisplay = {
          id: payload.bidId,
          username: payload.bidderUsername,
          amount: payload.amount,
          time: "Just now",
          isWinning: true,
        };

        setState((prev) => ({
          ...prev,
          currentBid: payload.amount,
          bidCount: payload.bidCount,
          bids: [
            newBid,
            ...prev.bids.map((b) => ({ ...b, isWinning: false })),
          ],
          highestBidder: payload.bidderUsername,
        }));

        // Update countdown if endTime was extended (anti-snipe)
        if (payload.endTime && payload.endTime !== endTimeRef.current) {
          endTimeRef.current = payload.endTime;
          startCountdown(payload.endTime);
        }
      },
    );

    // Slow fallback poll (30s) — catches missed WS events
    const schedulePoll = () => {
      pollRef.current = setTimeout(async () => {
        await fetchLatest();
        schedulePoll();
      }, 30000);
    };
    schedulePoll();

    return () => {
      socket.emit("leave-auction", auctionId);
      socket.disconnect();
      socketRef.current = null;
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (pollRef.current) clearTimeout(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId, isRealAuction]);

  // Force refresh — call this after placing a bid (ensures our own bid appears immediately)
  const refresh = useCallback(() => {
    fetchLatest();
  }, [fetchLatest]);

  return { ...state, refresh };
}
