"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useWatchlist } from "@/lib/context/WatchlistContext";
import { useAuth } from "@/lib/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";
import { ShoppingCart, Heart, Plus, Truck } from "lucide-react";
import { useShippingEstimate } from "@/lib/hooks/useShippingEstimate";
import { formatShippingRange } from "@/lib/api/shipping";

interface BuyNowPanelProps {
  price: number;
  currency: string;
  auctionId: string;
  title: string;
  image: string;
  endTime?: string;
  seller: {
    name: string;
    rating: number;
  };
  onAddToWatchlist?: () => void;
  /** Seller's country (auction.shippingFrom) — used to estimate shipping. */
  shippingFromCountry?: string | null;
  /** Item taxonomy category — affects weight assumption. */
  itemCategory?: string | null;
}

export default function BuyNowPanel({
  price,
  currency,
  auctionId,
  title,
  image,
  endTime,
  seller,
  onAddToWatchlist,
  shippingFromCountry,
  itemCategory,
}: BuyNowPanelProps) {
  const router = useRouter();
  const { addToCart, items } = useCart();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { isAuthenticated, user } = useAuth();

  const buyerCountry = user?.country?.trim() || null;
  const { estimate: shipEstimate } = useShippingEstimate({
    fromCountry: shippingFromCountry || undefined,
    toCountry: buyerCountry || shippingFromCountry || undefined,
    itemCategory,
    enabled: !!shippingFromCountry,
  });

  const [justAdded, setJustAdded] = useState(false);
  const [watchlistFeedback, setWatchlistFeedback] = useState<string | null>(
    null,
  );
  const [loginOpen, setLoginOpen] = useState(false);

  const isInCart = items.some((item) => item.id === auctionId);
  const inWatchlist = isInWatchlist(auctionId);

  const handleBuyNow = () => {
    // Add to cart first, then redirect to cart for checkout
    addToCart({
      id: auctionId,
      title,
      price,
      currency,
      image,
      seller,
    });
    router.push(`/cart`);
  };

  const handleAddToCart = () => {
    addToCart({
      id: auctionId,
      title,
      price,
      currency,
      image,
      seller,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleWatchlist = () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    const added = toggleWatchlist({
      id: auctionId,
      title,
      buyNowPrice: price,
      image,
      endTime,
      listingType: "buy_now",
    });

    setWatchlistFeedback(
      added ? "Added to watchlist!" : "Removed from watchlist",
    );
    setTimeout(() => setWatchlistFeedback(null), 2000);

    // Also call the optional external callback
    if (added) onAddToWatchlist?.();
  };

  return (
    <>
    <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    <div className="bg-black text-white p-8 rounded-[2px] mb-8">
      {/* Price Section */}
      <div className="mb-4">
        <div className="text-xs uppercase tracking-widest text-white/60 mb-2">
          Buy Now Price
        </div>
        <div className="text-5xl font-light mb-1">
          {price.toLocaleString("pl-PL")} {currency}
        </div>
        <div className="text-sm text-white/70">
          Fixed price • Immediate purchase available
        </div>
      </div>

      {/* Shipping reminder — same pattern as BidPanel so buyers see the
          full cost no matter which way they're buying. */}
      <div className="mb-6 flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <Truck size={13} className="text-amber-300 mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          {shipEstimate && buyerCountry ? (
            <>
              <p className="text-[11px] text-amber-100 leading-snug">
                Price <span className="font-bold">does not include shipping</span> —
                add{" "}
                <span className="font-extrabold text-amber-200">
                  {formatShippingRange(shipEstimate.standard)}
                </span>{" "}
                to {shipEstimate.toCountry}.
              </p>
              <p className="text-[10px] text-amber-200/60 mt-0.5">
                Standard {shipEstimate.standard.carrier} ·{" "}
                {shipEstimate.standard.daysMin}–{shipEstimate.standard.daysMax}{" "}
                business days
              </p>
            </>
          ) : (
            <p className="text-[11px] text-amber-100 leading-snug">
              <span className="font-bold">Shipping is added on top</span> of the
              price.
              {!isAuthenticated
                ? " Sign in to see the exact cost to your country."
                : !buyerCountry
                  ? " Set your country in profile to see the exact cost."
                  : ""}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          className="w-full py-4 bg-white text-black font-medium text-sm uppercase tracking-widest rounded-[2px] hover:bg-gray-200 hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          Buy Now
        </button>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          className={`w-full py-4 border font-medium text-sm uppercase tracking-widest rounded-[2px] transition-all flex items-center justify-center gap-2 ${
            isInCart || justAdded
              ? "bg-white/20 border-white text-white cursor-not-allowed"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white"
          }`}
        >
          {isInCart ? (
            <>
              <ShoppingCart size={18} />
              In Cart
            </>
          ) : justAdded ? (
            <>
              <ShoppingCart size={18} />
              Added!
            </>
          ) : (
            <>
              <Plus size={18} />
              Add to Cart
            </>
          )}
        </button>

        {/* Add to Watchlist Button */}
        <button
          onClick={handleToggleWatchlist}
          className={`w-full py-4 border font-medium text-sm uppercase tracking-widest rounded-[2px] transition-all flex items-center justify-center gap-2 ${
            inWatchlist
              ? "bg-white/20 border-white text-white"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white"
          }`}
        >
          <Heart
            size={18}
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

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="space-y-2 text-sm text-white/70">
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span className="text-white">Calculated at checkout</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Buyer Protection</span>
            <span className="text-white">✓ Included</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Returns</span>
            <span className="text-white">14 days</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
