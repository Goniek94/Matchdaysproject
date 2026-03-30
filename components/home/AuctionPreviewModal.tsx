"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Shield,
  Star,
  Clock,
  Crown,
  ArrowRight,
  Heart,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useWatchlist } from "@/lib/context/WatchlistContext";
import { getAuctionById } from "@/lib/api/auctions.api";
import { placeBid } from "@/lib/api/bids.api";
import type { AuctionDetailDto } from "@/types/api/auction.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BidEntry {
  id: string;
  username: string;
  amount: number;
  time: string;
  isWinning: boolean;
}

interface AuctionPreviewModalProps {
  auctionId: string;
  onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTimeAgo = (dateString: string): string => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};

const formatCountdown = (seconds: number): string => {
  if (seconds <= 0) return "Ended";
  const d = Math.floor(seconds / 86_400);
  const h = Math.floor((seconds % 86_400) / 3_600);
  const m = Math.floor((seconds % 3_600) / 60);
  const s = seconds % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuctionPreviewModal({
  auctionId,
  onClose,
}: AuctionPreviewModalProps) {
  const { isAuthenticated } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const [auction, setAuction] = useState<AuctionDetailDto | null>(null);
  const [bids, setBids] = useState<BidEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bid state
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidding, setBidding] = useState(false);
  const [bidFeedback, setBidFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Countdown
  const [secondsLeft, setSecondsLeft] = useState(0);

  const inWatchlist = isInWatchlist(auctionId);

  // ─── Load auction data ──────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await getAuctionById(auctionId);
        if (result.success && result.data) {
          setAuction(result.data);
          const secs = Math.max(
            0,
            Math.floor(
              (new Date(result.data.endTime).getTime() - Date.now()) / 1000,
            ),
          );
          setSecondsLeft(secs);

          if (result.data.bids?.length) {
            setBids(
              result.data.bids.map((b, i) => ({
                id: b.id,
                username: b.bidder?.username || "Anonymous",
                amount: Number(b.amount),
                time: formatTimeAgo(b.createdAt),
                isWinning: i === 0,
              })),
            );
          }
        } else {
          setError("Auction not found");
        }
      } catch {
        setError("Failed to load auction");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [auctionId]);

  // ─── Countdown tick ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => clearInterval(interval);
  }, [secondsLeft]);

  // ─── Close on Escape ────────────────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // ─── Bid handlers ───────────────────────────────────────────────────────────

  const showFeedback = (type: "success" | "error", message: string) => {
    setBidFeedback({ type, message });
    setTimeout(() => setBidFeedback(null), 3500);
  };

  const handlePlaceBid = async () => {
    setBidError(null);
    if (!isAuthenticated) {
      setBidError("You must be logged in to place a bid.");
      return;
    }
    const amount = parseFloat(bidAmount);
    const minBid = (auction?.currentBid ?? 0) + (auction?.bidIncrement ?? 5);
    if (isNaN(amount) || amount < minBid) {
      setBidError(`Minimum bid is €${minBid}.`);
      return;
    }
    try {
      setBidding(true);
      const result = await placeBid(auctionId, amount);
      if (result.success) {
        showFeedback("success", `Bid of €${amount} placed!`);
        setBidAmount("");
        // Refresh auction data
        const updated = await getAuctionById(auctionId);
        if (updated.success && updated.data) {
          setAuction(updated.data);
          if (updated.data.bids?.length) {
            setBids(
              updated.data.bids.map((b, i) => ({
                id: b.id,
                username: b.bidder?.username || "Anonymous",
                amount: Number(b.amount),
                time: formatTimeAgo(b.createdAt),
                isWinning: i === 0,
              })),
            );
          }
        }
      } else {
        showFeedback("error", result.message || "Failed to place bid");
      }
    } catch {
      showFeedback("error", "Failed to place bid");
    } finally {
      setBidding(false);
    }
  };

  const handleToggleWatchlist = () => {
    if (!auction) return;
    toggleWatchlist({
      id: auctionId,
      title: auction.title,
      currentBid: auction.currentBid,
      image: auction.images?.[0],
      endTime: auction.endTime,
      listingType: auction.listingType === "buy_now" ? "buy_now" : "auction",
    });
  };

  // ─── Derived values ─────────────────────────────────────────────────────────

  const currentBid = auction?.currentBid ?? 0;
  const minBid = currentBid + (auction?.bidIncrement ?? 5);
  const quickBids = [minBid, currentBid + 10, currentBid + 25];
  const auctionEnded = secondsLeft <= 0;
  const isUrgent = secondsLeft > 0 && secondsLeft <= 300;
  const highestBidder = bids[0]?.username;
  const isAuction = auction?.listingType !== "buy_now";

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Quick Preview
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error || !auction ? (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
              {error || "Auction not found"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Left: Image + Info */}
              <div className="p-5 border-r border-gray-100">
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-4">
                  {auction.images?.[0] ? (
                    <Image
                      src={auction.images[0]}
                      alt={auction.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                      🏆
                    </div>
                  )}
                  {/* Countdown overlay */}
                  <div
                    className={`absolute bottom-3 left-3 text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold shadow-sm ${
                      isUrgent
                        ? "bg-red-600 text-white animate-pulse"
                        : auctionEnded
                          ? "bg-gray-800 text-gray-300"
                          : "bg-black/70 text-white backdrop-blur-sm"
                    }`}
                  >
                    <Clock size={10} />
                    {auctionEnded ? "Ended" : formatCountdown(secondsLeft)}
                  </div>
                  {/* Badges */}
                  {auction.verified && (
                    <div className="absolute top-3 right-3 bg-black text-white text-[9px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                      <Shield size={9} />
                      Verified
                    </div>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-base font-black text-slate-900 leading-snug mb-2 tracking-tight">
                  {auction.title}
                </h2>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                  {auction.description || "No description provided."}
                </p>

                {/* Seller */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">
                      {auction.seller?.username?.[0] ?? "?"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {auction.seller?.username || "Unknown"}
                    </p>
                    <div className="flex items-center gap-0.5">
                      <Star
                        size={9}
                        className="text-amber-400 fill-amber-400"
                      />
                      <span className="text-[10px] text-slate-500">
                        {(auction.seller?.rating ?? 0).toFixed(1)} (
                        {auction.seller?.reviews ?? 0})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Bid Panel */}
              <div className="p-5 bg-[#0d0d0d] text-white flex flex-col gap-4">
                {/* Current Bid */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    {isAuction ? "Current Bid" : "Price"}
                  </p>
                  <p className="text-4xl font-black tracking-tight">
                    €{currentBid.toLocaleString()}
                  </p>
                  {isAuction && (
                    <p className="text-[10px] text-gray-400 mt-1">
                      {auction.bidCount}{" "}
                      {auction.bidCount === 1 ? "bid" : "bids"} · Min.
                      increment: €{auction.bidIncrement}
                    </p>
                  )}
                </div>

                {/* Highest Bidder — gold highlight */}
                {isAuction && highestBidder && auction.bidCount > 0 && (
                  <div className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/30 rounded-xl px-3 py-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                      <Crown size={13} className="text-black" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-amber-400">
                        Leading Bidder
                      </p>
                      <p className="text-sm font-black text-amber-300 truncate">
                        {highestBidder}
                      </p>
                    </div>
                    <div className="ml-auto text-right shrink-0">
                      <p className="text-[9px] text-amber-500/70 uppercase tracking-wider">
                        Top bid
                      </p>
                      <p className="text-sm font-black text-amber-400">
                        €{bids[0]?.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bid feedback */}
                {bidFeedback && (
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                      bidFeedback.type === "success"
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    <span>{bidFeedback.type === "success" ? "✓" : "✕"}</span>
                    {bidFeedback.message}
                  </div>
                )}

                {/* Bid controls */}
                {isAuction && !auctionEnded && (
                  <>
                    {!isAuthenticated ? (
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-300 mb-3">
                          Sign in to place a bid
                        </p>
                        <Link
                          href="/register"
                          onClick={onClose}
                          className="inline-flex items-center gap-2 w-full justify-center py-2.5 bg-white text-black font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all"
                        >
                          <LogIn size={12} />
                          Sign In / Register
                        </Link>
                      </div>
                    ) : (
                      <>
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => {
                            setBidAmount(e.target.value);
                            setBidError(null);
                          }}
                          placeholder={`Enter bid (min. €${minBid})`}
                          disabled={bidding}
                          className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/40 text-sm focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all disabled:opacity-50"
                        />

                        {bidError && (
                          <div className="flex items-center gap-1.5 text-red-400 text-xs -mt-2">
                            <AlertCircle size={12} />
                            {bidError}
                          </div>
                        )}

                        {/* Quick bids */}
                        <div className="grid grid-cols-3 gap-2">
                          {quickBids.map((amount) => (
                            <button
                              key={amount}
                              onClick={() => {
                                setBidAmount(amount.toString());
                                setBidError(null);
                              }}
                              disabled={bidding}
                              className="py-2 bg-white/10 border border-white/15 text-white text-[11px] font-bold rounded-xl hover:bg-white/20 transition-all disabled:opacity-50"
                            >
                              €{amount}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={handlePlaceBid}
                          disabled={bidding}
                          className="w-full py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                          {bidding ? "Placing bid..." : "Place Bid"}
                        </button>
                      </>
                    )}
                  </>
                )}

                {/* Ended state */}
                {auctionEnded && (
                  <div className="text-center py-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                      Auction Ended
                    </p>
                    {highestBidder && (
                      <p className="text-sm font-black text-amber-400 mt-1">
                        🏆 {highestBidder} won
                      </p>
                    )}
                  </div>
                )}

                {/* Watchlist */}
                <button
                  onClick={handleToggleWatchlist}
                  className={`w-full py-2.5 border font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${
                    inWatchlist
                      ? "bg-white/20 border-white text-white"
                      : "bg-white/5 border-white/20 text-white/60 hover:bg-white/10 hover:border-white/40 hover:text-white"
                  }`}
                >
                  <Heart
                    size={12}
                    fill={inWatchlist ? "currentColor" : "none"}
                    className={inWatchlist ? "text-red-400" : ""}
                  />
                  {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </button>

                {/* Recent bids */}
                {bids.length > 0 && (
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Recent Bids
                    </p>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {bids.slice(0, 5).map((bid, i) => (
                        <div
                          key={bid.id}
                          className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs ${
                            i === 0
                              ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/25"
                              : "bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {i === 0 && (
                              <Crown
                                size={10}
                                className="text-amber-400 shrink-0"
                              />
                            )}
                            <span
                              className={`font-semibold truncate ${i === 0 ? "text-amber-300" : "text-gray-300"}`}
                            >
                              {bid.username}
                            </span>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <span
                              className={`font-black ${i === 0 ? "text-amber-400" : "text-white"}`}
                            >
                              €{bid.amount.toLocaleString()}
                            </span>
                            <span className="text-gray-500 text-[9px] block">
                              {bid.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && auction && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 shrink-0 flex items-center justify-between">
            <span className="text-[10px] text-gray-400">
              View full details for more info
            </span>
            <Link
              href={`/auction/${auctionId}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:text-gray-600 transition-colors uppercase tracking-widest group"
            >
              Full Page
              <ArrowRight
                size={11}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
