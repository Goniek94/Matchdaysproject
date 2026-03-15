"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Shield,
  Flame,
  Star,
  Award,
  Clock,
  Gavel,
  Heart,
} from "lucide-react";

// ─── Jersey icon ──────────────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface Auction {
  id: string;
  title: string;
  price: number;
  currency: string;
  description: string;
  image: string;
  bids: number;
  likes?: number;
  endTime: string;
  verified: boolean;
  rare: boolean;
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
  badge?: {
    text: string;
    colors: string;
  };
}

// ─── Badge config ─────────────────────────────────────────────────────────────

const getBadgeConfig = (badgeText: string) => {
  const configs: Record<string, { icon: JSX.Element; gradient: string }> = {
    HOT: {
      icon: <Flame size={14} className="animate-pulse" />,
      gradient: "bg-gradient-to-r from-orange-500 to-red-600",
    },
    RARE: {
      icon: <Sparkles size={14} />,
      gradient: "bg-gradient-to-r from-purple-600 to-pink-600",
    },
    "BUY NOW": {
      icon: <Star size={14} />,
      gradient: "bg-gradient-to-r from-blue-600 to-cyan-600",
    },
    VERIFIED: {
      icon: <Shield size={14} />,
      gradient: "bg-gradient-to-r from-green-600 to-emerald-600",
    },
    UNIQUE: {
      icon: <Award size={14} />,
      gradient: "bg-gradient-to-r from-yellow-500 to-amber-600",
    },
  };

  return (
    configs[badgeText] || {
      icon: <Star size={14} />,
      gradient: "bg-gradient-to-r from-gray-600 to-gray-800",
    }
  );
};

// ─── Time helpers ─────────────────────────────────────────────────────────────

const parseTimeRemaining = (
  timeStr: string,
): { isEndingSoon: boolean; isUrgent: boolean } => {
  const hourMatch = timeStr.match(/(\d+)h/);
  const minuteMatch = timeStr.match(/(\d+)m/);
  const dayMatch = timeStr.match(/(\d+)d/);

  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
  const days = dayMatch ? parseInt(dayMatch[1]) : 0;

  const totalMinutes = days * 24 * 60 + hours * 60 + minutes;

  return {
    isEndingSoon: totalMinutes <= 120,
    isUrgent: totalMinutes <= 30,
  };
};

// ─── Frame colors based on rarity/verification ───────────────────────────────

const getFrameColors = (rare: boolean, verified: boolean) => {
  if (rare && verified) {
    return {
      outer: "from-purple-500 via-violet-500 to-purple-600",
      accent: "from-purple-500 to-violet-600",
      shadow: "shadow-[0_0_40px_rgba(168,85,247,0.5)]",
      hoverShadow: "hover:shadow-[0_0_60px_rgba(168,85,247,0.7)]",
      border: "border-purple-300/50",
      glow: "bg-purple-500/20",
    };
  } else if (rare) {
    return {
      outer: "from-amber-400 via-yellow-500 to-amber-600",
      accent: "from-amber-500 to-yellow-600",
      shadow: "shadow-[0_0_40px_rgba(251,191,36,0.5)]",
      hoverShadow: "hover:shadow-[0_0_60px_rgba(251,191,36,0.7)]",
      border: "border-amber-300/50",
      glow: "bg-amber-400/20",
    };
  } else if (verified) {
    return {
      outer: "from-blue-500 via-blue-400 to-blue-500",
      accent: "from-blue-500 to-blue-600",
      shadow: "shadow-[0_0_40px_rgba(59,130,246,0.5)]",
      hoverShadow: "hover:shadow-[0_0_60px_rgba(59,130,246,0.7)]",
      border: "border-blue-300/50",
      glow: "bg-blue-500/20",
    };
  } else {
    return {
      outer: "from-amber-700 via-amber-600 to-amber-700",
      accent: "from-amber-600 to-amber-700",
      shadow: "shadow-[0_10px_40px_rgba(0,0,0,0.12)]",
      hoverShadow: "hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)]",
      border: "border-amber-200/30",
      glow: "",
    };
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuctionCard({ auction, badge }: AuctionCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const initialPrice = auction.price || (auction as any).currentBid || 0;
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const [priceChanged, setPriceChanged] = useState(false);
  const prevPriceRef = useRef(initialPrice);

  useEffect(() => {
    const newPrice = auction.price || (auction as any).currentBid || 0;
    if (newPrice !== prevPriceRef.current) {
      setCurrentPrice(newPrice);
      setPriceChanged(true);
      prevPriceRef.current = newPrice;
      const timer = setTimeout(() => setPriceChanged(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [auction.price, (auction as any).currentBid]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const flagUrl = auction.country?.code
    ? `https://flagcdn.com/w20/${auction.country.code.toLowerCase()}.png`
    : `https://flagcdn.com/w20/pl.png`;
  const badgeConfig = badge ? getBadgeConfig(badge.text) : null;
  const timeStatus = parseTimeRemaining(auction.endTime);
  const frameColors = getFrameColors(auction.rare, auction.verified);

  return (
    <Link
      href={`/auction/${auction.id}`}
      className="group h-full relative block cursor-pointer"
    >
      {frameColors.glow && (
        <div
          className={`absolute inset-0 -z-10 rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-500 ${frameColors.glow}`}
        />
      )}

      <div
        className={`h-full flex flex-col bg-gradient-to-b from-amber-50/80 via-white to-white rounded-2xl ${frameColors.shadow} ${frameColors.hoverShadow} transition-all duration-500 hover:-translate-y-2 transform-gpu overflow-hidden border ${frameColors.border}`}
      >
        {/* ── IMAGE SECTION ─────────────────────────────────────────────── */}
        <div className="relative">
          {badge && badgeConfig && (
            <div
              className={`absolute top-2 right-2 sm:top-3 sm:right-3 ${badgeConfig.gradient} text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black shadow-lg flex items-center gap-1 sm:gap-1.5 ring-2 ring-white/50 z-20`}
            >
              {badgeConfig.icon}
              <span className="tracking-wider">{badge.text}</span>
            </div>
          )}

          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 left-2 sm:top-3 sm:left-3 p-2 sm:p-2.5 rounded-full shadow-lg ring-2 z-20 transition-all duration-300 transform hover:scale-110 active:scale-95 ${
              isFavorite
                ? "bg-gradient-to-br from-red-500 to-red-600 text-white ring-red-300"
                : "bg-white/90 backdrop-blur-sm text-slate-400 ring-white/50 hover:text-red-500"
            }`}
          >
            <JerseyIcon filled={isFavorite} className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <Image
              src={auction.image}
              alt={auction.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            <div
              className={`absolute bottom-2 left-2 sm:bottom-3 sm:left-3 backdrop-blur-md text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 shadow-lg ${
                timeStatus.isUrgent
                  ? "bg-red-600 text-white animate-pulse"
                  : timeStatus.isEndingSoon
                    ? "bg-red-500/90 text-white"
                    : "bg-black/60 text-white"
              }`}
            >
              <Clock
                size={12}
                className={
                  timeStatus.isEndingSoon ? "text-white" : "text-amber-400"
                }
              />
              <span className="font-semibold">{auction.endTime}</span>
            </div>
          </div>
        </div>

        {/* ── CONTENT SECTION ───────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Title + description */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
              {auction.title}
            </h3>
            <div className="w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-200 rounded-full mt-1.5 mb-1" />
            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed line-clamp-2">
              {auction.description}
            </p>
          </div>

          {/* Type badge + Price + bids/likes */}
          <div
            className={`flex flex-col gap-2 px-3 py-3 rounded-xl border transition-all duration-300 ${
              priceChanged
                ? "bg-amber-50 border-amber-300"
                : "bg-slate-50 border-slate-100"
            }`}
          >
            {/* Type badge */}
            <div className="flex items-center justify-between">
              {auction.type === "buy_now" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                  <Star size={9} />
                  Buy Now
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest">
                  <Gavel size={9} />
                  Auction
                </span>
              )}

              {/* Bids / likes pill */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-sm">
                {auction.type === "buy_now" ? (
                  <>
                    <Heart size={11} className="text-rose-400 fill-rose-400" />
                    <span className="text-[10px] font-bold text-slate-700">
                      {auction.likes ?? 0}
                    </span>
                    <span className="text-[10px] text-slate-400">likes</span>
                  </>
                ) : (
                  <>
                    <Gavel size={11} className="text-amber-500" />
                    <span className="text-[10px] font-bold text-slate-700">
                      {auction.bids}
                    </span>
                    <span className="text-[10px] text-slate-400">bids</span>
                  </>
                )}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-0.5">
                {auction.type === "buy_now" ? "Price" : "Current Bid"}
              </p>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-2xl font-black leading-none transition-all duration-300 ${
                    priceChanged ? "text-amber-600" : "text-slate-900"
                  }`}
                >
                  {currentPrice.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-slate-400">€</span>
              </div>
            </div>
          </div>

          {/* Spacer pushes seller to bottom */}
          <div className="flex-1" />

          {/* Seller row */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 min-w-0">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm shrink-0">
                {auction.seller.avatar ? (
                  <Image
                    src={auction.seller.avatar}
                    width={32}
                    height={32}
                    alt={auction.seller.name}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    {auction.seller.name[0]}
                  </span>
                )}
              </div>

              {/* Name + rating */}
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {auction.seller.name}
                  </span>
                  {auction.verified && (
                    <Shield
                      size={10}
                      className="text-emerald-500 fill-emerald-500 shrink-0"
                    />
                  )}
                </div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-bold text-slate-700">
                    {auction.seller.rating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({auction.seller.reviews})
                  </span>
                </div>
              </div>
            </div>

            {/* Country flag */}
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md shrink-0">
              <Image
                src={flagUrl}
                width={16}
                height={12}
                alt={auction.country?.name || "Poland"}
                className="rounded-sm"
              />
              <span className="text-[10px] font-medium text-slate-600">
                {auction.country?.code?.toUpperCase() || "PL"}
              </span>
            </div>
          </div>

          {/* Buyer protection */}
          {auction.verified && (
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg">
              <Shield size={11} className="shrink-0" />
              <span className="text-[10px] font-semibold">
                Buyer Protection
              </span>
            </div>
          )}

          {/* CTA button */}
          <button
            className={`w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${frameColors.accent} shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200`}
          >
            {auction.type === "buy_now" ? "Buy Now" : "Place Bid"}
          </button>
        </div>
      </div>
    </Link>
  );
}
