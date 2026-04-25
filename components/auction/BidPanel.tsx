"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useWatchlist } from "@/lib/context/WatchlistContext";
import { Heart, LogIn, AlertCircle, Crown } from "lucide-react";
import Link from "next/link";

interface BidPanelProps {
  auctionId?: string;
  auctionTitle?: string;
  auctionImage?: string;
  auctionEndTime?: string;
  currentBid: number;
  bidCount: number;
  highestBidder?: string;
  initialSeconds?: number;
  onPlaceBid?: (amount: number) => void;
  disabled?: boolean;
  isEnded?: boolean;
}

/**
 * Combined auction panel with countdown timer, current bid info,
 * highest bidder display, bid placement controls and watchlist button.
 * Requires authentication to place a bid.
 * Currency: EUR (€)
 */
export default function BidPanel({
  auctionId,
  auctionTitle,
  auctionImage,
  auctionEndTime,
  currentBid,
  bidCount,
  highestBidder,
  initialSeconds = 0,
  onPlaceBid,
  disabled = false,
  isEnded = false,
}: BidPanelProps) {
  const { isAuthenticated } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isUrgent, setIsUrgent] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [watchlistFeedback, setWatchlistFeedback] = useState<string | null>(
    null,
  );

  const minimumBid = currentBid + 5;
  const quickBids = [minimumBid, currentBid + 10, currentBid + 25];

  const inWatchlist = auctionId ? isInWatchlist(auctionId) : false;

  // Sync countdown with initialSeconds prop changes
  useEffect(() => {
    if (initialSeconds <= 0) return;
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  // Countdown tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsUrgent(timeLeft <= 10 && timeLeft > 0);
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatTime = () => {
    if (timeLeft <= 0) return "Auction Ended";
    if (timeLeft <= 10) return `${timeLeft}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  const formatEur = (amount: number) =>
    `€${amount.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;

  const handleQuickBid = (amount: number) => {
    setBidAmount(amount.toString());
    setBidError(null);
  };

  const handlePlaceBid = () => {
    setBidError(null);

    if (!isAuthenticated) {
      setBidError("You must be logged in to place a bid.");
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setBidError("Please enter a valid bid amount.");
      return;
    }

    if (amount < minimumBid) {
      setBidError(`Minimum bid is ${formatEur(minimumBid)}.`);
      return;
    }

    onPlaceBid?.(amount);
    setBidAmount("");
  };

  const handleToggleWatchlist = () => {
    if (!auctionId) return;

    const added = toggleWatchlist({
      id: auctionId,
      title: auctionTitle || "Auction",
      currentBid,
      image: auctionImage,
      endTime: auctionEndTime,
      listingType: "auction",
    });

    setWatchlistFeedback(
      added ? "Added to watchlist!" : "Removed from watchlist",
    );
    setTimeout(() => setWatchlistFeedback(null), 2000);
  };

  // Use explicit isEnded prop from parent (authoritative), fall back to local timer only
  // when we have confirmed timer data (initialSeconds > 0)
  const auctionEnded = isEnded || (initialSeconds > 0 && timeLeft <= 0);

  return (
    <div className="bg-black text-white p-6 rounded-3xl">
      {/* Timer Section */}
      {initialSeconds > 0 && (
        <div className="mb-5">
          <div
            className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
              isUrgent ? "text-red-400" : "text-gray-400"
            }`}
          >
            {auctionEnded ? "Auction ended" : "Ends in"}
          </div>
          <div className="flex items-center gap-2">
            {!auctionEnded && (
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isUrgent
                    ? "bg-red-500 animate-pulse"
                    : "bg-green-400 animate-pulse"
                }`}
              />
            )}
            <span
              className={`text-2xl font-bold tracking-tight ${
                isUrgent ? "text-red-400" : "text-white"
              }`}
            >
              {formatTime()}
            </span>
          </div>
        </div>
      )}

      {/* Divider */}
      {initialSeconds > 0 && <div className="border-t border-white/10 mb-5" />}

      {/* Current Bid */}
      <div className="mb-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
          Current Bid
        </div>
        <div className="text-4xl font-bold tracking-tight">
          {formatEur(currentBid)}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {bidCount} {bidCount === 1 ? "bid" : "bids"} • Min. increment: €5
        </div>
      </div>

      {/* Highest Bidder — gold highlight */}
      {highestBidder && bidCount > 0 && (
        <div className="mt-3 mb-5 flex items-center gap-2.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/30 rounded-xl px-3 py-2.5">
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
              {`€${currentBid.toLocaleString()}`}
            </p>
          </div>
        </div>
      )}

      {/* Bid Controls */}
      {!auctionEnded && (
        <>
          {/* Auth gate - show login prompt if not authenticated */}
          {!isAuthenticated ? (
            <div className="mt-5 mb-3 bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-300 mb-3">
                Sign in to place a bid
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 w-full justify-center py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all"
              >
                <LogIn size={14} />
                Sign In / Register
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-5 mb-3">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => {
                    setBidAmount(e.target.value);
                    setBidError(null);
                  }}
                  placeholder={`Enter bid (min. ${formatEur(minimumBid)})`}
                  disabled={disabled}
                  className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/40 text-sm focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all disabled:opacity-50"
                />
              </div>

              {/* Error message */}
              {bidError && (
                <div className="flex items-center gap-2 mb-3 text-red-400 text-xs">
                  <AlertCircle size={13} />
                  <span>{bidError}</span>
                </div>
              )}

              {/* Quick Bid Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {quickBids.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickBid(amount)}
                    disabled={disabled}
                    className="py-2.5 bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wide rounded-xl hover:bg-white/20 hover:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formatEur(amount)}
                  </button>
                ))}
              </div>

              {/* Place Bid Button */}
              <button
                onClick={handlePlaceBid}
                disabled={disabled}
                className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {disabled ? "Placing bid..." : "Place Bid"}
              </button>
            </>
          )}
        </>
      )}

      {/* Watchlist Button */}
      {auctionId && (
        <div className="mt-4">
          <button
            onClick={handleToggleWatchlist}
            className={`w-full py-3 border font-medium text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${
              inWatchlist
                ? "bg-white/20 border-white text-white"
                : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/40 hover:text-white"
            }`}
          >
            <Heart
              size={14}
              fill={inWatchlist ? "currentColor" : "none"}
              className={inWatchlist ? "text-red-400" : ""}
            />
            {watchlistFeedback
              ? watchlistFeedback
              : inWatchlist
                ? "In Watchlist"
                : "Add to Watchlist"}
          </button>
        </div>
      )}
    </div>
  );
}
