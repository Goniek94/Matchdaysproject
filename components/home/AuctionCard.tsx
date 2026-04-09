"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Star,
  Clock,
  Gavel,
  Heart,
  Eye,
  Sparkles,
  Zap,
} from "lucide-react";
import { useWatchlist } from "@/lib/context/WatchlistContext";
import AuctionPreviewModal from "@/components/home/AuctionPreviewModal";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Auction {
  id: string;
  title: string;
  price: number;
  currency: string;
  description: string;
  image: string;
  bids: number;
  likes?: number;
  views?: number;
  endTime: string;
  verified: boolean;
  rare: boolean;
  featured?: boolean;
  type: "auction" | "buy_now";
  seller: {
    name: string;
    avatar?: string;
    rating: number;
    reviews: number;
  };
  country: {
    name: string;
    code: string;
  };
}

interface AuctionCardProps {
  auction: Auction;
  badge?: { text: string; colors: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isLastCall = (timeStr: string) => {
  const h = timeStr.match(/(\d+)h/);
  const m = timeStr.match(/(\d+)m/);
  const d = timeStr.match(/(\d+)d/);
  const total =
    (d ? parseInt(d[1]) * 1440 : 0) +
    (h ? parseInt(h[1]) * 60 : 0) +
    (m ? parseInt(m[1]) : 0);
  return total <= 60;
};

// ─── Card ─────────────────────────────────────────────────────────────────────

export default function AuctionCard({ auction }: AuctionCardProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const initialPrice = auction.price || (auction as any).currentBid || 0;
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const [priceFlash, setPriceFlash] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const prevPrice = useRef(initialPrice);
  const isFav = isInWatchlist(auction.id);
  const supportsModal = auction.id?.includes("-") ?? false;
  const ending = isLastCall(auction.endTime);
  const isBuyNow = auction.type === "buy_now";

  useEffect(() => {
    const next = auction.price || (auction as any).currentBid || 0;
    if (next !== prevPrice.current) {
      setCurrentPrice(next);
      setPriceFlash(true);
      prevPrice.current = next;
      const t = setTimeout(() => setPriceFlash(false), 1000);
      return () => clearTimeout(t);
    }
  }, [auction.price, (auction as any).currentBid]);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWatchlist({
      id: auction.id,
      title: auction.title,
      currentBid: !isBuyNow ? auction.price : undefined,
      buyNowPrice: isBuyNow ? auction.price : undefined,
      image: auction.image,
      listingType: isBuyNow ? "buy_now" : "auction",
    });
    setFeedbackMsg(added ? "Added!" : "Removed");
    setTimeout(() => setFeedbackMsg(null), 1500);
  };

  const flagUrl = `https://flagcdn.com/w20/${(auction.country?.code || "pl").toLowerCase()}.png`;

  return (
    <>
      {modalOpen && supportsModal && (
        <AuctionPreviewModal
          auctionId={auction.id}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div className="group relative h-full">
        {/* Feedback toast */}
        {feedbackMsg && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-black/80 text-white text-[11px] font-semibold rounded-full whitespace-nowrap pointer-events-none">
            {feedbackMsg}
          </div>
        )}

        <div className={`h-full flex flex-col bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
          ending
            ? "border-red-200 shadow-[0_2px_16px_rgba(220,38,38,0.15)] hover:shadow-[0_8px_32px_rgba(220,38,38,0.25)]"
            : "border-gray-100 shadow-sm hover:shadow-lg"
        }`}>

          {/* ── IMAGE ──────────────────────────────────────────────────────── */}
          <div className="relative">

            {/* Heart */}
            <button
              onClick={handleFav}
              className={`absolute top-3 left-3 z-20 p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${
                isFav
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 shadow-sm"
              }`}
            >
              <Heart size={14} className={isFav ? "fill-white" : ""} />
            </button>

            {/* Badges top-right */}
            <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
              {auction.rare && (
                <span className="flex items-center gap-1 bg-violet-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  <Sparkles size={9} />
                  RARE
                </span>
              )}
              {ending && (
                <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                  <Zap size={9} />
                  LAST CALL
                </span>
              )}
              {isBuyNow && !ending && (
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  BUY NOW
                </span>
              )}
            </div>

            {/* Quick view */}
            {supportsModal && (
              <button
                onClick={() => setModalOpen(true)}
                className="absolute bottom-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Eye size={10} />
                Quick View
              </button>
            )}

            <Link href={`/auction/${auction.id}`} className="block">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <Image
                  src={auction.image}
                  alt={auction.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                {/* Timer */}
                <div
                  className={`absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    ending
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-black/60 text-white backdrop-blur-sm"
                  }`}
                >
                  <Clock size={10} />
                  {auction.endTime}
                </div>
              </div>
            </Link>
          </div>

          {/* ── CONTENT ────────────────────────────────────────────────────── */}
          <Link href={`/auction/${auction.id}`} className="flex flex-col flex-1 p-4 gap-3">

            {/* Price row */}
            <div className="flex items-end justify-between">
              <div>
                <p className={`text-[10px] uppercase tracking-widest font-bold mb-0.5 ${ending ? "text-red-400" : "text-gray-400"}`}>
                  {isBuyNow ? "Price" : "Current Bid"}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-3xl font-black leading-none tracking-tight transition-colors duration-300 ${
                      priceFlash ? "text-orange-500" : ending ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {currentPrice.toLocaleString()}
                  </span>
                  <span className={`text-base font-bold ${ending ? "text-red-400" : "text-gray-400"}`}>€</span>
                </div>
              </div>

              {/* Bids / Likes */}
              <div className={`flex flex-col items-center rounded-xl px-3 py-2 min-w-[48px] border ${
                ending ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"
              }`}>
                {isBuyNow ? (
                  <>
                    <Heart size={13} className="text-rose-400 fill-rose-400 mb-1" />
                    <span className="text-sm font-black text-gray-800 leading-none">{auction.likes ?? 0}</span>
                    <span className="text-[9px] text-gray-400 mt-0.5">likes</span>
                  </>
                ) : (
                  <>
                    <Gavel size={13} className={`mb-1 ${ending ? "text-red-400" : "text-gray-500"}`} />
                    <span className="text-sm font-black text-gray-800 leading-none">{auction.bids}</span>
                    <span className="text-[9px] text-gray-400 mt-0.5">bids</span>
                  </>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Title */}
            <h3 className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors">
              {auction.title}
            </h3>

            {/* Description */}
            <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-3 flex-1">
              {auction.description}
            </p>

            {/* Seller row */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden ring-1 ring-gray-200 shrink-0">
                  {auction.seller.avatar ? (
                    <Image
                      src={auction.seller.avatar}
                      width={28}
                      height={28}
                      alt={auction.seller.name}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                      {auction.seller.name?.[0] ?? "?"}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-gray-700 truncate">
                      {auction.seller.name}
                    </span>
                    {auction.verified && (
                      <Shield size={9} className="text-emerald-500 fill-emerald-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Star size={9} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-gray-600">
                      {auction.seller.rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      ({auction.seller.reviews})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg shrink-0">
                <Image
                  src={flagUrl}
                  width={14}
                  height={10}
                  alt={auction.country?.name || ""}
                  className="rounded-sm"
                />
                <span className="text-[10px] font-semibold text-gray-500">
                  {auction.country?.code?.toUpperCase() || "PL"}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`w-full py-3 rounded-xl text-sm font-black tracking-wide text-center transition-colors ${
                ending
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : isBuyNow
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-gray-900 hover:bg-black text-white"
              }`}
            >
              {isBuyNow ? "Buy Now" : "Place Bid"}
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
