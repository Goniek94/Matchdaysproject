"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Clock, Tag, Gavel } from "lucide-react";
import { useWatchlist, WatchlistItem } from "@/lib/context/WatchlistContext";
import { useState } from "react";

interface WatchlistCardProps {
  item: WatchlistItem;
}

/**
 * Card component for a single watchlist (favorites) item.
 * Shows auction image, title, price info, time remaining and remove button.
 */
export default function WatchlistCard({ item }: WatchlistCardProps) {
  const { removeFromWatchlist } = useWatchlist();
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    // Small delay for animation feel
    setTimeout(() => removeFromWatchlist(item.id), 200);
  };

  const formatTimeLeft = (endTime?: string): string => {
    if (!endTime) return "—";
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return "Ended";
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const formatPrice = (amount?: number): string => {
    if (!amount) return "—";
    return `€${amount.toLocaleString("en-US")}`;
  };

  const isAuction =
    item.listingType === "auction" || item.listingType === "auction_buy_now";
  const isBuyNow =
    item.listingType === "buy_now" || item.listingType === "auction_buy_now";

  const displayPrice = isAuction ? item.currentBid : item.buyNowPrice;
  const priceLabel = isAuction ? "Current Bid" : "Buy Now";

  const timeLeft = formatTimeLeft(item.endTime);
  const isEnded = timeLeft === "Ended";

  return (
    <div
      className={`group bg-white border border-gray-200 rounded-[2px] overflow-hidden flex flex-col sm:flex-row transition-all duration-200 hover:shadow-md hover:border-gray-300 ${
        removing ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Image */}
      <Link
        href={`/auction/${item.id}`}
        className="relative w-full sm:w-40 h-40 sm:h-auto flex-shrink-0 bg-gray-100 overflow-hidden"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, 160px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">👕</span>
          </div>
        )}

        {/* Listing type badge */}
        <div className="absolute top-2 left-2">
          {isAuction && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-[2px] bg-blue-600 text-white">
              <Gavel size={8} />
              Auction
            </span>
          )}
          {!isAuction && isBuyNow && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-[2px] bg-green-600 text-white">
              <Tag size={8} />
              Buy Now
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          {/* Title */}
          <Link href={`/auction/${item.id}`}>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug hover:text-black transition-colors line-clamp-2 mb-2">
              {item.title}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {priceLabel}
            </span>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(displayPrice)}
            </span>
          </div>

          {/* Time left */}
          {item.endTime && (
            <div
              className={`flex items-center gap-1.5 text-xs ${
                isEnded ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Clock size={12} />
              <span className={isEnded ? "" : "font-medium"}>{timeLeft}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Link
            href={`/auction/${item.id}`}
            className="flex-1 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-[2px] text-center hover:bg-gray-800 transition-colors"
          >
            {isAuction && !isEnded ? "Place Bid" : "View Item"}
          </Link>
          <button
            onClick={handleRemove}
            title="Remove from favorites"
            className="p-2 border border-gray-200 rounded-[2px] text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
          >
            <Heart size={16} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Added date - subtle */}
      <div className="hidden sm:flex items-end pb-4 pr-4">
        <span className="text-[10px] text-gray-300 uppercase tracking-widest whitespace-nowrap">
          Added{" "}
          {new Date(item.addedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>
    </div>
  );
}
