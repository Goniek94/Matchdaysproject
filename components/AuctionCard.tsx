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
  // Eye usunięte, nie jest już potrzebne
} from "lucide-react";

// Custom Jersey/Shirt icon for favorites
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

// Interfaces
interface Auction {
  id: string;
  title: string;
  price: number;
  currency: string;
  description: string;
  image: string;
  bids: number;
  likes?: number; // Zmiana: Teraz mamy likes zamiast views
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

// Badge configuration with icons
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

// Helper function to parse time string and check if ending soon
const parseTimeRemaining = (
  timeStr: string
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

export default function AuctionCard({ auction, badge }: AuctionCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(auction.price);
  const [priceChanged, setPriceChanged] = useState(false);
  const prevPriceRef = useRef(auction.price);

  // Detect price changes (simulating live updates)
  useEffect(() => {
    if (auction.price !== prevPriceRef.current) {
      setCurrentPrice(auction.price);
      setPriceChanged(true);
      prevPriceRef.current = auction.price;
      const timer = setTimeout(() => setPriceChanged(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [auction.price]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const shortDesc = truncateText(auction.description, 100);
  const flagUrl = `https://flagcdn.com/w20/${auction.country.code.toLowerCase()}.png`;
  const badgeConfig = badge ? getBadgeConfig(badge.text) : null;
  const timeStatus = parseTimeRemaining(auction.endTime);

  // Frame color based on rarity - with shadow box colors
  const getFrameColors = () => {
    if (auction.rare && auction.verified) {
      // LEGENDARY
      return {
        outer: "from-purple-500 via-violet-500 to-purple-600",
        accent: "from-purple-500 to-violet-600",
        shadow: "shadow-[0_0_40px_rgba(168,85,247,0.5)]",
        hoverShadow: "hover:shadow-[0_0_60px_rgba(168,85,247,0.7)]",
        border: "border-purple-300/50",
        glow: "bg-purple-500/20",
      };
    } else if (auction.rare) {
      // RARE
      return {
        outer: "from-amber-400 via-yellow-500 to-amber-600",
        accent: "from-amber-500 to-yellow-600",
        shadow: "shadow-[0_0_40px_rgba(251,191,36,0.5)]",
        hoverShadow: "hover:shadow-[0_0_60px_rgba(251,191,36,0.7)]",
        border: "border-amber-300/50",
        glow: "bg-amber-400/20",
      };
    } else if (auction.verified) {
      // VERIFIED
      return {
        outer: "from-blue-500 via-blue-400 to-blue-500",
        accent: "from-blue-500 to-blue-600",
        shadow: "shadow-[0_0_40px_rgba(59,130,246,0.5)]",
        hoverShadow: "hover:shadow-[0_0_60px_rgba(59,130,246,0.7)]",
        border: "border-blue-300/50",
        glow: "bg-blue-500/20",
      };
    } else {
      // COMMON
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

  const frameColors = getFrameColors();

  return (
    <Link
      href={`/auctions/${auction.id}`}
      className="group h-full relative block cursor-pointer"
    >
      {/* Ambient glow effect behind card */}
      {frameColors.glow && (
        <div
          className={`absolute inset-0 -z-10 rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-500 ${frameColors.glow}`}
        ></div>
      )}

      {/* Main Card */}
      <div
        className={`h-full flex flex-col bg-gradient-to-b from-amber-50/80 via-white to-white rounded-2xl ${frameColors.shadow} ${frameColors.hoverShadow} transition-all duration-500 hover:-translate-y-2 transform-gpu overflow-hidden border ${frameColors.border}`}
      >
        {/* IMAGE SECTION */}
        <div className="relative">
          {/* Premium Badge */}
          {badge && badgeConfig && (
            <div
              className={`absolute top-3 right-3 ${badgeConfig.gradient} text-white px-3 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 ring-2 ring-white/50 z-20`}
            >
              {badgeConfig.icon}
              <span className="tracking-wider">{badge.text}</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 left-3 p-2.5 rounded-full shadow-lg ring-2 z-20 transition-all duration-300 transform hover:scale-110 active:scale-95 ${
              isFavorite
                ? "bg-gradient-to-br from-red-500 to-red-600 text-white ring-red-300"
                : "bg-white/90 backdrop-blur-sm text-slate-400 ring-white/50 hover:text-red-500"
            }`}
          >
            <JerseyIcon filled={isFavorite} className="w-5 h-5" />
          </button>

          {/* Image container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <Image
              src={auction.image}
              alt={auction.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>

            {/* Time Badge */}
            <div
              className={`absolute bottom-3 left-3 backdrop-blur-md text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg ${
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

        {/* CONTENT SECTION */}
        <div className="relative flex flex-col flex-1 p-4">
          {/* Title & Description */}
          <div className="mb-2">
            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
              {auction.title}
            </h3>
            <div className="w-10 h-0.5 bg-gradient-to-r from-amber-400 to-amber-200 rounded-full my-1.5"></div>
            <p className="text-[13px] text-slate-500 leading-snug line-clamp-2">
              {shortDesc}
            </p>
          </div>

          {/* Price Section */}
          <div
            className={`rounded-xl p-3 mb-4 border h-[5.5rem] flex flex-col justify-center transition-all duration-300 ${
              priceChanged
                ? "bg-gradient-to-r from-amber-100 to-amber-50 border-amber-300 scale-[1.02]"
                : "bg-gradient-to-r from-amber-50/80 to-white border-amber-200/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-amber-700 uppercase font-bold tracking-wider mb-0.5">
                  {auction.type === "buy_now" ? "Price" : "Current Bid"}
                </p>
                <div
                  className={`flex items-baseline gap-1 transition-all duration-300 ${
                    priceChanged ? "animate-pulse" : ""
                  }`}
                >
                  <span className="text-2xl font-black text-amber-700 tracking-tight">
                    {currentPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-amber-600">
                    {auction.currency}
                  </span>
                </div>
              </div>

              {/* ZMIANA: Logika Bids vs Likes (Koszulka) */}
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-amber-200/50 shadow-sm">
                {auction.type === "buy_now" ? (
                  // Wariant dla Buy Now (Liczba Polubień/Koszulek)
                  <>
                    <JerseyIcon
                      filled={true}
                      className="w-3.5 h-3.5 text-amber-500"
                    />
                    <span className="text-sm font-bold text-slate-700">
                      {auction.likes || 0}
                    </span>
                    <span className="text-xs text-slate-400">likes</span>
                  </>
                ) : (
                  // Wariant dla Aukcji (Oferty/Bids)
                  <>
                    <Gavel size={14} className="text-amber-500" />
                    <span className="text-sm font-bold text-slate-700">
                      {auction.bids}
                    </span>
                    <span className="text-xs text-slate-400">bids</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1"></div>

          {/* Seller Info */}
          <div className="pt-3 border-t border-slate-200/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden border-2 border-white shadow-md shrink-0">
                  {auction.seller.avatar ? (
                    <Image
                      src={auction.seller.avatar}
                      width={36}
                      height={36}
                      alt={auction.seller.name}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-slate-600">
                      {auction.seller.name[0]}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-700 leading-tight">
                      {auction.seller.name}
                    </span>
                    {auction.verified && (
                      <Shield
                        size={12}
                        className="text-emerald-500 fill-emerald-500"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-700">
                      {auction.seller.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({auction.seller.reviews})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md text-slate-600 shrink-0">
                <Image
                  src={flagUrl}
                  width={16}
                  height={12}
                  alt={auction.country.name}
                  className="rounded-sm"
                />
                <span className="text-xs font-medium">
                  {auction.country.code.toUpperCase()}
                </span>
              </div>
            </div>

            {auction.verified && (
              <div className="mt-2 flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                <Shield size={11} />
                <span className="text-[10px] font-semibold">
                  Buyer Protection
                </span>
              </div>
            )}
          </div>

          <button
            className={`mt-4 w-full py-3 bg-gradient-to-r ${frameColors.accent} text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transform-gpu`}
          >
            {auction.type === "buy_now" ? "Buy Now" : "Place Bid"}
          </button>
        </div>
      </div>
    </Link>
  );
}
