"use client";

import { useState } from "react";

interface BidPanelProps {
  currentBid: number;
  bidCount: number;
  onPlaceBid?: (amount: number) => void;
  disabled?: boolean;
}

export default function BidPanel({
  currentBid,
  bidCount,
  onPlaceBid,
  disabled = false,
}: BidPanelProps) {
  const [bidAmount, setBidAmount] = useState("");
  const minimumBid = currentBid + 50;

  const handleQuickBid = (amount: number) => {
    setBidAmount(amount.toString());
  };

  const handlePlaceBid = () => {
    const amount = parseInt(bidAmount);
    if (amount >= minimumBid) {
      onPlaceBid?.(amount);
      setBidAmount("");
    } else {
      alert(`Minimum bid is ${minimumBid.toLocaleString("pl-PL")} zł`);
    }
  };

  return (
    <div className="bg-black text-white p-8 rounded-[2px] mb-8">
      {/* Current Bid Section */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-white/60 mb-2">
          Current Bid
        </div>
        <div className="text-5xl font-light mb-1">
          {currentBid.toLocaleString("pl-PL")} zł
        </div>
        <div className="text-sm text-white/70">
          {bidCount} bids • Minimum increment: 50 zł
        </div>
      </div>

      {/* Bid Input Section */}
      <div className="mb-6">
        <div className="mb-3">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`Enter your bid (min. ${minimumBid.toLocaleString(
              "pl-PL"
            )} zł)`}
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-[2px] text-white placeholder:text-white/50 focus:outline-none focus:bg-white/15 focus:border-white transition-all"
          />
        </div>

        {/* Quick Bid Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => handleQuickBid(currentBid + 50)}
            disabled={disabled}
            className="py-3 bg-white/10 border border-white/20 text-white text-sm font-medium uppercase tracking-wide rounded-[2px] hover:bg-white/20 hover:border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(currentBid + 50).toLocaleString("pl-PL")} zł
          </button>
          <button
            onClick={() => handleQuickBid(currentBid + 100)}
            disabled={disabled}
            className="py-3 bg-white/10 border border-white/20 text-white text-sm font-medium uppercase tracking-wide rounded-[2px] hover:bg-white/20 hover:border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(currentBid + 100).toLocaleString("pl-PL")} zł
          </button>
          <button
            onClick={() => handleQuickBid(currentBid + 250)}
            disabled={disabled}
            className="py-3 bg-white/10 border border-white/20 text-white text-sm font-medium uppercase tracking-wide rounded-[2px] hover:bg-white/20 hover:border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(currentBid + 250).toLocaleString("pl-PL")} zł
          </button>
        </div>

        {/* Place Bid Button */}
        <button
          onClick={handlePlaceBid}
          disabled={disabled}
          className="w-full py-4 bg-white text-black font-medium text-sm uppercase tracking-widest rounded-[2px] hover:bg-gray-200 hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {disabled ? "Bidding..." : "Place Bid"}
        </button>
      </div>
    </div>
  );
}
