"use client";

import { useWatchlist } from "@/lib/context/WatchlistContext";
import WatchlistCard from "@/components/watchlist/WatchlistCard";
import Link from "next/link";
import { Heart, ArrowRight, Gavel, Tag } from "lucide-react";

/**
 * Favorites / Watchlist page.
 * Displays all items the user has added to their watchlist.
 * Data is persisted in localStorage via WatchlistContext.
 */
export default function FavoritesPage() {
  const { watchlist, clearWatchlist } = useWatchlist();

  const auctions = watchlist.filter(
    (i) => i.listingType === "auction" || i.listingType === "auction_buy_now",
  );
  const buyNow = watchlist.filter((i) => i.listingType === "buy_now");

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-black via-gray-600 to-black" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-gray-900">
              Favorites
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {watchlist.length === 0
                ? "No items saved yet"
                : `${watchlist.length} ${watchlist.length === 1 ? "item" : "items"} saved`}
            </p>
          </div>

          {watchlist.length > 0 && (
            <button
              onClick={clearWatchlist}
              className="text-xs text-gray-400 hover:text-red-500 uppercase tracking-widest font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Empty state */}
        {watchlist.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart size={36} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your watchlist is empty
            </h2>
            <p className="text-gray-500 text-sm max-w-sm mb-8">
              Browse auctions and click{" "}
              <span className="font-semibold text-gray-700">
                &quot;Add to Watchlist&quot;
              </span>{" "}
              to save items here for easy access.
            </p>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-[2px] hover:bg-gray-800 transition-colors"
            >
              Browse Auctions
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Stats bar */}
        {watchlist.length > 0 && (
          <div className="flex gap-4 mb-8">
            {auctions.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-[2px]">
                <Gavel size={14} className="text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
                  {auctions.length} Auction{auctions.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
            {buyNow.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-[2px]">
                <Tag size={14} className="text-green-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-green-700">
                  {buyNow.length} Buy Now
                </span>
              </div>
            )}
          </div>
        )}

        {/* Items list */}
        {watchlist.length > 0 && (
          <div className="space-y-3">
            {watchlist.map((item) => (
              <WatchlistCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {watchlist.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Looking for more items?
            </p>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black text-black text-sm font-bold uppercase tracking-widest rounded-[2px] hover:bg-black hover:text-white transition-all"
            >
              Browse Auctions
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
