"use client";

/**
 * RelistAuctionModal
 * Allows seller to relist an ended or cancelled auction with new settings:
 * - Listing type (auction / buy now / both)
 * - Duration (how long the new listing runs)
 * - Starting bid / buy now price
 */

import { useState } from "react";
import { X, RefreshCw, Gavel, ShoppingCart, Layers, Clock } from "lucide-react";
import type { MyListing } from "@/types/features/listings.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RelistPayload {
  endTime: string;
  listingType: "auction" | "buy_now" | "auction_buy_now";
  startingBid?: number;
  buyNowPrice?: number;
  bidIncrement?: number;
}

interface RelistAuctionModalProps {
  listing: MyListing;
  onClose: () => void;
  onRelist: (id: string, payload: RelistPayload) => Promise<boolean>;
}

// ─── Duration options ─────────────────────────────────────────────────────────

const DURATION_OPTIONS = [
  { label: "1 day", days: 1 },
  { label: "3 days", days: 3 },
  { label: "5 days", days: 5 },
  { label: "7 days", days: 7 },
  { label: "14 days", days: 14 },
  { label: "30 days", days: 30 },
];

// ─── Listing type options ─────────────────────────────────────────────────────

const LISTING_TYPES = [
  {
    id: "auction" as const,
    label: "Auction",
    description: "Buyers place bids, highest wins",
    icon: <Gavel size={18} />,
  },
  {
    id: "buy_now" as const,
    label: "Buy Now",
    description: "Fixed price, instant purchase",
    icon: <ShoppingCart size={18} />,
  },
  {
    id: "auction_buy_now" as const,
    label: "Auction + Buy Now",
    description: "Both bidding and instant purchase",
    icon: <Layers size={18} />,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RelistAuctionModal({
  listing,
  onClose,
  onRelist,
}: RelistAuctionModalProps) {
  const [listingType, setListingType] = useState<
    "auction" | "buy_now" | "auction_buy_now"
  >(
    (listing.listingType as "auction" | "buy_now" | "auction_buy_now") ??
      "auction",
  );
  const [durationDays, setDurationDays] = useState(7);
  const [startingBid, setStartingBid] = useState(
    String(Number(listing.startingBid ?? listing.currentBid ?? 10)),
  );
  const [buyNowPrice, setBuyNowPrice] = useState(
    String(Number(listing.buyNowPrice ?? 0)),
  );
  const [bidIncrement, setBidIncrement] = useState(
    String(Number(listing.bidIncrement ?? 5)),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showBidFields = listingType !== "buy_now";
  const showBuyNowField = listingType !== "auction";

  const handleSubmit = async () => {
    setError(null);

    // Validation
    const startBid = parseFloat(startingBid);
    const buyNow = parseFloat(buyNowPrice);
    const increment = parseFloat(bidIncrement);

    if (showBidFields && (!startBid || startBid <= 0)) {
      setError("Starting bid must be greater than 0");
      return;
    }

    if (showBuyNowField && (!buyNow || buyNow <= 0)) {
      setError("Buy now price must be greater than 0");
      return;
    }

    if (showBidFields && showBuyNowField && buyNow <= startBid) {
      setError("Buy now price must be greater than starting bid");
      return;
    }

    // Calculate end time
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + durationDays);

    const payload: RelistPayload = {
      endTime: endTime.toISOString(),
      listingType,
      ...(showBidFields && { startingBid: startBid, bidIncrement: increment }),
      ...(showBuyNowField && { buyNowPrice: buyNow }),
    };

    setIsSubmitting(true);
    try {
      const success = await onRelist(listing.id, payload);
      if (success) {
        onClose();
      } else {
        setError("Failed to relist auction. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <RefreshCw size={18} className="text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Relist Auction
              </h2>
              <p className="text-xs text-gray-500 line-clamp-1">
                {listing.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Listing type */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Listing Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LISTING_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setListingType(type.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all ${
                    listingType === type.id
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <span
                    className={
                      listingType === type.id ? "text-white" : "text-gray-500"
                    }
                  >
                    {type.icon}
                  </span>
                  <span className="text-xs font-bold leading-tight">
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {LISTING_TYPES.find((t) => t.id === listingType)?.description}
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              <Clock size={12} className="inline mr-1" />
              Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.days}
                  onClick={() => setDurationDays(opt.days)}
                  className={`py-2 px-3 rounded-lg border text-sm font-bold transition-all ${
                    durationDays === opt.days
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bid fields */}
          {showBidFields && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Starting Bid (£)
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={startingBid}
                  onChange={(e) => setStartingBid(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Bid Increment (£)
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={bidIncrement}
                  onChange={(e) => setBidIncrement(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
            </div>
          )}

          {/* Buy now price */}
          {showBuyNowField && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Buy Now Price (£)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={buyNowPrice}
                onChange={(e) => setBuyNowPrice(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>
          )}

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1">
            <p className="font-bold text-gray-800 mb-1">Summary</p>
            <p>
              Type:{" "}
              <span className="font-semibold">
                {LISTING_TYPES.find((t) => t.id === listingType)?.label}
              </span>
            </p>
            <p>
              Duration:{" "}
              <span className="font-semibold">{durationDays} days</span>
            </p>
            {showBidFields && (
              <p>
                Starting bid:{" "}
                <span className="font-semibold">£{startingBid}</span>
              </p>
            )}
            {showBuyNowField && (
              <p>
                Buy now: <span className="font-semibold">£{buyNowPrice}</span>
              </p>
            )}
            <p>
              Ends:{" "}
              <span className="font-semibold">
                {new Date(
                  Date.now() + durationDays * 24 * 60 * 60 * 1000,
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Relisting...
              </>
            ) : (
              <>
                <RefreshCw size={15} />
                Relist Auction
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
