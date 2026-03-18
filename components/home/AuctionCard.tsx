"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Shield,
  Flame,
  Star,
  Gem,
  Clock,
  Gavel,
  Heart,
  TrendingUp,
  AlarmClock,
} from "lucide-react";
import { useWatchlist } from "@/lib/context/WatchlistContext";

const JerseyIcon = ({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.5}
  >
    <path d="M6.5 2L2 6.5V8.5L4 10V22H20V10L22 8.5V6.5L17.5 2H14.5L12 4.5L9.5 2H6.5Z" />
    <path d="M9.5 2L12 5L14.5 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

// ─── Time helpers ─────────────────────────────────────────────────────────────

const parseTimeRemaining = (timeStr: string) => {
  const hourMatch = timeStr.match(/(\d+)h/);
  const minuteMatch = timeStr.match(/(\d+)m/);
  const dayMatch = timeStr.match(/(\d+)d/);
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
  const days = dayMatch ? parseInt(dayMatch[1]) : 0;
  const totalMinutes = days * 24 * 60 + hours * 60 + minutes;
  return {
    isLastCall: totalMinutes <= 60, // ≤ 1h — LAST CALL
    isUrgent: totalMinutes <= 30, // ≤ 30min — pulsuje
    totalMinutes,
  };
};

// ─── Theme resolver ───────────────────────────────────────────────────────────

const getTheme = (auction: Auction, isLastCall: boolean) => {
  // LAST CALL — nadpisuje wszystko gdy ≤ 1h
  if (isLastCall && auction.type === "auction") {
    return {
      badgeIcon: <AlarmClock size={11} className="animate-pulse" />,
      badgeText: "LAST CALL",
      badgeClass: "bg-red-600 text-white animate-pulse",
      cardBorder: "border-red-300",
      cardShadow: "shadow-[0_2px_20px_rgba(220,38,38,0.20)]",
      hoverShadow: "hover:shadow-[0_8px_40px_rgba(220,38,38,0.35)]",
      priceBg: "bg-gradient-to-r from-red-50 to-rose-50 border border-red-200",
      priceColor: "text-red-600",
      priceLabel: "text-red-400",
      euroColor: "text-red-400",
      accentLine: "bg-gradient-to-r from-red-500 to-rose-600",
      btnClass:
        "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white animate-pulse",
    };
  }

  if (auction.rare) {
    return {
      badgeIcon: <Sparkles size={11} />,
      badgeText: "RARE",
      badgeClass: "bg-gradient-to-r from-violet-600 to-purple-700 text-white",
      cardBorder: "border-amber-200",
      cardShadow: "shadow-[0_2px_20px_rgba(245,158,11,0.12)]",
      hoverShadow: "hover:shadow-[0_8px_40px_rgba(245,158,11,0.22)]",
      priceBg:
        "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100",
      priceColor: "text-amber-600",
      priceLabel: "text-amber-400",
      euroColor: "text-amber-400",
      accentLine: "bg-gradient-to-r from-amber-400 to-yellow-500",
      btnClass:
        "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white",
    };
  }

  if (auction.featured) {
    return {
      badgeIcon: <Gem size={11} />,
      badgeText: "GEM",
      badgeClass: "bg-gradient-to-r from-blue-500 to-cyan-600 text-white",
      cardBorder: "border-blue-200",
      cardShadow: "shadow-[0_2px_20px_rgba(59,130,246,0.12)]",
      hoverShadow: "hover:shadow-[0_8px_40px_rgba(59,130,246,0.22)]",
      priceBg:
        "bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100",
      priceColor: "text-blue-700",
      priceLabel: "text-blue-400",
      euroColor: "text-blue-400",
      accentLine: "bg-gradient-to-r from-blue-500 to-cyan-500",
      btnClass:
        "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white",
    };
  }

  const isHot = (auction.views ?? 0) > 50 || auction.bids > 5;
  if (isHot && auction.type === "auction") {
    return {
      badgeIcon: <Flame size={11} className="animate-pulse" />,
      badgeText: "HOT",
      badgeClass: "bg-gradient-to-r from-orange-500 to-red-600 text-white",
      cardBorder: "border-orange-100",
      cardShadow: "shadow-[0_2px_16px_rgba(249,115,22,0.10)]",
      hoverShadow: "hover:shadow-[0_8px_36px_rgba(249,115,22,0.20)]",
      priceBg:
        "bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100",
      priceColor: "text-orange-600",
      priceLabel: "text-orange-400",
      euroColor: "text-orange-400",
      accentLine: "bg-gradient-to-r from-orange-400 to-red-500",
      btnClass:
        "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white",
    };
  }

  if (auction.type === "buy_now") {
    return {
      badgeIcon: <Star size={11} />,
      badgeText: "BUY NOW",
      badgeClass: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
      cardBorder: "border-emerald-100",
      cardShadow: "shadow-[0_2px_16px_rgba(16,185,129,0.08)]",
      hoverShadow: "hover:shadow-[0_8px_36px_rgba(16,185,129,0.18)]",
      priceBg:
        "bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100",
      priceColor: "text-emerald-700",
      priceLabel: "text-emerald-500",
      euroColor: "text-emerald-400",
      accentLine: "bg-gradient-to-r from-emerald-400 to-teal-500",
      btnClass:
        "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white",
    };
  }

  // Zwykła aukcja — czerwony motyw
  return {
    badgeIcon: <Gavel size={11} />,
    badgeText: "AUCTION",
    badgeClass: "bg-gradient-to-r from-red-500 to-rose-600 text-white",
    cardBorder: "border-red-100",
    cardShadow: "shadow-[0_2px_16px_rgba(220,38,38,0.08)]",
    hoverShadow: "hover:shadow-[0_8px_36px_rgba(220,38,38,0.18)]",
    priceBg: "bg-gradient-to-r from-red-50 to-rose-50 border border-red-100",
    priceColor: "text-red-600",
    priceLabel: "text-red-400",
    euroColor: "text-red-400",
    accentLine: "bg-gradient-to-r from-red-400 to-rose-500",
    btnClass:
      "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white",
  };
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuctionCard({ auction }: AuctionCardProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const initialPrice = auction.price || (auction as any).currentBid || 0;
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const [priceChanged, setPriceChanged] = useState(false);
  const [watchlistFeedback, setWatchlistFeedback] = useState<string | null>(
    null,
  );
  const prevPriceRef = useRef(initialPrice);
  const isFavorite = isInWatchlist(auction.id);

  useEffect(() => {
    const newPrice = auction.price || (auction as any).currentBid || 0;
    if (newPrice !== prevPriceRef.current) {
      setCurrentPrice(newPrice);
      setPriceChanged(true);
      prevPriceRef.current = newPrice;
      const timer = setTimeout(() => setPriceChanged(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [auction.price, (auction as any).currentBid]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWatchlist({
      id: auction.id,
      title: auction.title,
      currentBid: auction.type === "auction" ? auction.price : undefined,
      buyNowPrice: auction.type === "buy_now" ? auction.price : undefined,
      image: auction.image,
      listingType: auction.type === "buy_now" ? "buy_now" : "auction",
    });
    setWatchlistFeedback(added ? "Added to favorites!" : "Removed");
    setTimeout(() => setWatchlistFeedback(null), 2000);
  };

  const flagUrl = auction.country?.code
    ? `https://flagcdn.com/w20/${auction.country.code.toLowerCase()}.png`
    : `https://flagcdn.com/w20/pl.png`;

  const timeStatus = parseTimeRemaining(auction.endTime);
  const theme = getTheme(auction, timeStatus.isLastCall);

  return (
    <Link
      href={`/auction/${auction.id}`}
      className="group h-full relative block cursor-pointer"
    >
      {watchlistFeedback && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 bg-black/80 text-white text-[11px] font-semibold rounded-full whitespace-nowrap shadow-lg pointer-events-none">
          {watchlistFeedback}
        </div>
      )}

      <div
        className={`h-full flex flex-col bg-white rounded-2xl border ${theme.cardBorder} ${theme.cardShadow} ${theme.hoverShadow} transition-all duration-300 hover:-translate-y-1.5 transform-gpu overflow-hidden`}
      >
        {/* ── IMAGE ──────────────────────────────────────────────────────── */}
        <div className="relative">
          {theme.badgeText && (
            <div
              className={`absolute top-3 right-3 ${theme.badgeClass} px-2.5 py-1 rounded-full text-[10px] font-black shadow-md flex items-center gap-1 z-20`}
            >
              {theme.badgeIcon}
              <span className="tracking-wider">{theme.badgeText}</span>
            </div>
          )}

          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 left-3 p-2 rounded-full z-20 transition-all duration-200 hover:scale-110 active:scale-95 ${
              isFavorite
                ? "bg-red-500 text-white shadow-lg shadow-red-200"
                : "bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 shadow-sm"
            }`}
          >
            <JerseyIcon filled={isFavorite} className="w-4 h-4" />
          </button>

          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <Image
              src={auction.image}
              alt={auction.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            {/* Timer */}
            <div
              className={`absolute bottom-3 left-3 text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold shadow-sm ${
                timeStatus.isUrgent
                  ? "bg-red-600 text-white animate-pulse"
                  : timeStatus.isLastCall
                    ? "bg-red-500 text-white"
                    : "bg-black/65 text-white backdrop-blur-sm"
              }`}
            >
              <Clock size={10} />
              {timeStatus.isLastCall ? (
                <span className="font-black">⚡ {auction.endTime}</span>
              ) : (
                auction.endTime
              )}
            </div>
          </div>
        </div>

        {/* ── CONTENT ────────────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 px-4 pt-4 pb-4 gap-3">
          {/* PRICE */}
          <div
            className={`flex items-center justify-between rounded-xl px-3 py-3 ${theme.priceBg}`}
          >
            <div>
              <p
                className={`text-[9px] uppercase tracking-[0.14em] font-bold mb-1 ${theme.priceLabel}`}
              >
                {auction.type === "buy_now" ? "Price" : "Current Bid"}
              </p>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-[32px] font-black leading-none tracking-tighter transition-colors duration-300 ${priceChanged ? "text-orange-500" : theme.priceColor}`}
                >
                  {currentPrice.toLocaleString()}
                </span>
                <span className={`text-base font-extrabold ${theme.euroColor}`}>
                  €
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center bg-white rounded-xl px-3 py-2 shadow-sm border border-white/80 min-w-[52px]">
              {auction.type === "buy_now" ? (
                <>
                  <Heart
                    size={14}
                    className="text-rose-400 fill-rose-400 mb-1"
                  />
                  <span className="text-sm font-black text-slate-800 leading-none">
                    {auction.likes ?? 0}
                  </span>
                  <span className="text-[9px] text-slate-400 leading-none mt-0.5">
                    likes
                  </span>
                </>
              ) : (
                <>
                  <Gavel size={14} className="text-amber-500 mb-1" />
                  <span className="text-sm font-black text-slate-800 leading-none">
                    {auction.bids}
                  </span>
                  <span className="text-[9px] text-slate-400 leading-none mt-0.5">
                    bids
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Accent line */}
          <div className={`h-[3px] w-10 rounded-full ${theme.accentLine}`} />

          {/* Title */}
          <h3 className="text-[13px] font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-slate-600 transition-colors tracking-tight">
            {auction.title}
          </h3>

          {/* Description */}
          <p className="text-[12px] text-slate-500 leading-[1.65] line-clamp-4 flex-1">
            {auction.description}
          </p>

          {/* ── SELLER ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm shrink-0">
                {auction.seller.avatar ? (
                  <Image
                    src={auction.seller.avatar}
                    width={28}
                    height={28}
                    alt={auction.seller.name}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-slate-600 uppercase">
                    {auction.seller.name[0]}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-700 truncate">
                    {auction.seller.name}
                  </span>
                  {auction.verified && (
                    <Shield
                      size={9}
                      className="text-emerald-500 fill-emerald-500 shrink-0"
                    />
                  )}
                </div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <Star size={9} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-bold text-slate-600">
                    {auction.seller.rating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({auction.seller.reviews})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md shrink-0">
              <Image
                src={flagUrl}
                width={14}
                height={10}
                alt={auction.country?.name || "Poland"}
                className="rounded-sm"
              />
              <span className="text-[10px] font-semibold text-slate-500">
                {auction.country?.code?.toUpperCase() || "PL"}
              </span>
            </div>
          </div>

          {/* Buyer protection */}
          {auction.verified && (
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
              <Shield size={11} className="shrink-0" />
              <span className="text-[11px] font-bold">Buyer Protection</span>
              <TrendingUp size={11} className="ml-auto text-emerald-400" />
            </div>
          )}

          {/* CTA */}
          <button
            className={`w-full py-3 rounded-xl text-sm font-black tracking-wide shadow-sm hover:shadow-lg active:scale-[0.98] transition-all duration-200 ${theme.btnClass}`}
          >
            {auction.type === "buy_now" ? "Buy Now" : "Place Bid"}
          </button>
        </div>
      </div>
    </Link>
  );
}
