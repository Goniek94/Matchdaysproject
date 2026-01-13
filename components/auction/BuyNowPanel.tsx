"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { ShoppingCart, Heart, Plus } from "lucide-react";

interface BuyNowPanelProps {
  price: number;
  currency: string;
  auctionId: string;
  title: string;
  image: string;
  seller: {
    name: string;
    rating: number;
  };
  onAddToWatchlist?: () => void;
}

export default function BuyNowPanel({
  price,
  currency,
  auctionId,
  title,
  image,
  seller,
  onAddToWatchlist,
}: BuyNowPanelProps) {
  const router = useRouter();
  const { addToCart, items } = useCart();
  const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isInCart = items.some((item) => item.id === auctionId);

  const handleBuyNow = () => {
    // Redirect to checkout page with auction ID
    router.push(`/checkout?id=${auctionId}`);
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

  const handleAddToWatchlist = () => {
    setIsAddedToWatchlist(!isAddedToWatchlist);
    onAddToWatchlist?.();
  };

  return (
    <div className="bg-black text-white p-8 rounded-[2px] mb-8">
      {/* Price Section */}
      <div className="mb-6">
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
          onClick={handleAddToWatchlist}
          className={`w-full py-4 border font-medium text-sm uppercase tracking-widest rounded-[2px] transition-all flex items-center justify-center gap-2 ${
            isAddedToWatchlist
              ? "bg-white/20 border-white text-white"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white"
          }`}
        >
          <Heart
            size={18}
            fill={isAddedToWatchlist ? "currentColor" : "none"}
          />
          {isAddedToWatchlist ? "Added to Watchlist" : "Add to Watchlist"}
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
  );
}
