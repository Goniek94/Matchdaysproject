"use client";

import { useState, useEffect } from "react";

interface BidPanelProps {
  currentBid: number;
  bidCount: number;
  highestBidder?: string;
  initialSeconds?: number;
  onPlaceBid?: (amount: number) => void;
  disabled?: boolean;
}

/**
 * Combined auction panel with countdown timer, current bid info,
 * highest bidder display, and bid placement controls.
 * Currency: EUR (€)
 */
export default function BidPanel({
  currentBid,
  bidCount,
  highestBidder,
  initialSeconds = 0,
  onPlaceBid,
  disabled = false,
}: BidPanelProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isUrgent, setIsUrgent] = useState(false);

  const minimumBid = currentBid + 5;
  const quickBids = [minimumBid, currentBid + 10, currentBid + 25];

  // Countdown timer
  useEffect(() => {
    if (initialSeconds <= 0) return;
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

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
  };

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount);
    if (amount >= minimumBid) {
      onPlaceBid?.(amount);
      setBidAmount("");
    } else {
      alert(`Minimum bid is ${formatEur(minimumBid)}`);
    }
  };

  const auctionEnded = timeLeft <= 0;

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

      {/* Highest Bidder */}
      {highestBidder && bidCount > 0 && (
        <div className="mt-3 mb-5 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
          <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <span className="text-green-400 text-xs">👑</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              Highest Bidder
            </p>
            <p className="text-sm font-semibold text-white truncate">
              {highestBidder}
            </p>
          </div>
        </div>
      )}

      {/* Bid Controls */}
      {!auctionEnded && (
        <>
          <div className="mt-5 mb-3">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Enter bid (min. ${formatEur(minimumBid)})`}
              disabled={disabled}
              className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/40 text-sm focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all disabled:opacity-50"
            />
          </div>

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
    </div>
  );
}
