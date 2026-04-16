"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import {
  Package,
  PlusCircle,
  Tag,
  ArrowRight,
  Sparkles,
  Trophy,
  TrendingUp,
  Zap,
  Eye,
  Gavel,
  Clock,
  ShoppingBag,
  ChevronRight,
  MessageCircle,
  Layers,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import type { DashboardTab } from "./DashboardSidebar";
import { DailySpinModal } from "./spin-wheel/DailySpinModal";
import { useMyListings } from "@/lib/hooks/useMyListings";
import {
  getMyCollection,
  type CollectionItemDto,
  type CollectionRarity,
} from "@/lib/api/collection";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardOverviewProps {
  greeting: string;
  displayName: string;
  onTabChange: (tab: DashboardTab) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(value);
}

const RARITY_STYLES: Record<
  CollectionRarity,
  { label: string; bg: string; text: string; border: string }
> = {
  common: {
    label: "Common",
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-200",
  },
  rare: {
    label: "Rare",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  epic: {
    label: "Epic",
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
  },
  legendary: {
    label: "Legendary",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-300",
  },
};

// ─── Loyalty tiers ────────────────────────────────────────────────────────────

const TIERS = [
  { name: "Rookie",      min: 0,     max: 499,   color: "from-gray-400 to-gray-500",   text: "text-gray-400",   badge: "bg-gray-100 text-gray-500" },
  { name: "Collector",   min: 500,   max: 1499,  color: "from-blue-400 to-blue-600",   text: "text-blue-400",   badge: "bg-blue-100 text-blue-600" },
  { name: "Enthusiast",  min: 1500,  max: 3499,  color: "from-emerald-400 to-teal-500",text: "text-emerald-400",badge: "bg-emerald-100 text-emerald-600" },
  { name: "Veteran",     min: 3500,  max: 7499,  color: "from-violet-400 to-purple-600",text:"text-violet-400", badge: "bg-violet-100 text-violet-600" },
  { name: "Legend",      min: 7500,  max: Infinity, color: "from-amber-400 to-yellow-500", text: "text-amber-400", badge: "bg-amber-100 text-amber-600" },
] as const;

function getTier(points: number) {
  return TIERS.find((t) => points >= t.min && points <= t.max) ?? TIERS[0];
}

function getTierProgress(points: number) {
  const tier = getTier(points);
  if (tier.max === Infinity) return 100;
  const range = tier.max - tier.min + 1;
  return Math.min(100, Math.round(((points - tier.min) / range) * 100));
}

function formatCountdown(endTime: string): { label: string; urgent: boolean } {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return { label: "Ended", urgent: true };
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  if (days > 0) return { label: `${days}d ${hours}h left`, urgent: false };
  if (hours > 0)
    return { label: `${hours}h ${minutes}m left`, urgent: hours < 2 };
  return { label: `${minutes}m left`, urgent: true };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardOverview({
  greeting,
  displayName,
  onTabChange,
}: DashboardOverviewProps) {
  const { user } = useAuth();
  const { listings, stats, loading } = useMyListings();
  const [spinOpen, setSpinOpen] = useState(false);
  const [, setTick] = useState(0);
  const [collection, setCollection] = useState<CollectionItemDto[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(true);

  // Refresh countdowns every 30s
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  // Fetch collection preview
  useEffect(() => {
    getMyCollection()
      .then((res) => {
        if (res.success && res.data) setCollection(res.data);
      })
      .catch(() => {})
      .finally(() => setCollectionLoading(false));
  }, []);

  const totalBidsReceived = useMemo(
    () => listings.reduce((sum, l) => sum + (l.bidCount || 0), 0),
    [listings],
  );
  const totalViews = useMemo(
    () => listings.reduce((sum, l) => sum + (l.views || 0), 0),
    [listings],
  );

  const activeItems = listings
    .filter((l) => l.status === "active")
    .sort(
      (a, b) =>
        new Date(a.endTime).getTime() - new Date(b.endTime).getTime(),
    )
    .slice(0, 4);

  const collectionPreview = collection.slice(0, 5);
  const collectionTotalValue = collection.reduce(
    (sum, item) => sum + (item.estimatedValue ?? 0),
    0,
  );

  const endingSoon = activeItems.filter((l) => {
    const diff = new Date(l.endTime).getTime() - Date.now();
    return diff > 0 && diff < 3 * 3_600_000; // under 3 hours
  });

  return (
    <div className="space-y-5">
      {/* ── Hero: Welcome + Daily Spin ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {/* Welcome panel */}
        {(() => {
          const pts = user?.totalPoints ?? 0;
          const tier = getTier(pts);
          const progress = getTierProgress(pts);
          const nextTierIdx = TIERS.findIndex((t) => t.name === tier.name) + 1;
          const nextTier = nextTierIdx < TIERS.length ? TIERS[nextTierIdx] : null;
          const ptsToNext = nextTier ? nextTier.min - pts : 0;

          // Tier-specific accent colours for the card
          const tierAccents: Record<string, { glow: string; line: string; dot: string }> = {
            Rookie:     { glow: "rgba(148,163,184,0.18)", line: "rgba(148,163,184,0.5)", dot: "#94A3B8" },
            Collector:  { glow: "rgba(96,165,250,0.18)",  line: "rgba(96,165,250,0.5)",  dot: "#60A5FA" },
            Enthusiast: { glow: "rgba(52,211,153,0.18)",  line: "rgba(52,211,153,0.5)",  dot: "#34D399" },
            Veteran:    { glow: "rgba(167,139,250,0.18)", line: "rgba(167,139,250,0.5)", dot: "#A78BFA" },
            Legend:     { glow: "rgba(251,191,36,0.22)",  line: "rgba(251,191,36,0.6)",  dot: "#FBBF24" },
          };
          const accent = tierAccents[tier.name] ?? tierAccents.Rookie;

          return (
            <div
              className="sm:col-span-3 rounded-2xl relative overflow-hidden flex flex-col justify-between"
              style={{
                background: "linear-gradient(145deg, #0f0f14 0%, #141420 50%, #0d0d18 100%)",
                border: `1px solid ${accent.line}`,
                minHeight: 180,
              }}
            >
              {/* Background glows */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 80% 0%, ${accent.glow}, transparent 55%)` }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(99,102,241,0.10), transparent 50%)" }} />

              {/* Subtle grid texture */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

              <div className="relative z-10 p-6">
                {/* Top row: greeting + date */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {greeting}
                    </p>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
                      {displayName} <span className="text-2xl">👋</span>
                    </h1>
                    <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.28)" }}>
                      {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                  </div>

                  {/* Tier badge pill */}
                  <div
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-wide"
                    style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${accent.line}`, color: accent.dot }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: accent.dot, boxShadow: `0 0 6px ${accent.dot}` }} />
                    {tier.name.toUpperCase()}
                  </div>
                </div>

                {/* Loyalty points row */}
                <div className="mb-4">
                  <div className="flex items-end justify-between mb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white tabular-nums leading-none" style={{ letterSpacing: "-0.04em" }}>
                        {pts.toLocaleString()}
                      </span>
                      <span className="text-sm font-bold mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                        loyalty pts
                      </span>
                    </div>
                    {nextTier ? (
                      <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {ptsToNext.toLocaleString()} to <span style={{ color: accent.dot }}>{nextTier.name}</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold" style={{ color: accent.dot }}>Max rank ✦</span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${tier.color} transition-all duration-700`}
                      style={{ width: `${progress}%`, boxShadow: `0 0 8px ${accent.dot}` }}
                    />
                  </div>

                  {/* Tier steps */}
                  <div className="flex justify-between mt-1.5">
                    {TIERS.filter((t) => t.max !== Infinity).map((t) => (
                      <span key={t.name} className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: pts >= t.min ? accent.dot : "rgba(255,255,255,0.18)" }}>
                        {t.name}
                      </span>
                    ))}
                    <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: tier.name === "Legend" ? accent.dot : "rgba(255,255,255,0.18)" }}>
                      Legend
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/add-listing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
                  style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}
                >
                  <PlusCircle size={15} />
                  New Listing
                </Link>
              </div>
            </div>
          );
        })()}

        {/* Daily Spin — hero treatment */}
        <button
          onClick={() => setSpinOpen(true)}
          className="sm:col-span-2 group relative overflow-hidden rounded-2xl p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
            border: "1px solid rgba(245,158,11,0.35)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.14),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-2xl select-none group-hover:animate-spin"
                    style={{ animationDuration: "1.5s" }}
                  >
                    🎡
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-wider border border-amber-500/30">
                    FREE
                  </span>
                </div>
                <p className="text-base font-black text-white">Daily Spin</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  Win discounts, points
                  <br />
                  &amp; Premium Elite access
                </p>
              </div>
              {/* Pulsing indicator */}
              <span className="relative flex-shrink-0 mt-0.5">
                <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping opacity-75" />
                <span className="relative block w-2.5 h-2.5 rounded-full bg-amber-400" />
              </span>
            </div>
            <div className="mt-5 flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl bg-amber-500 text-gray-900 font-black text-sm group-hover:bg-amber-400 transition-colors">
              <Zap size={14} className="fill-current" />
              Spin now — it&apos;s free!
            </div>
          </div>
        </button>
      </div>

      {/* ── Stats: 4 key metrics ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Active Listings */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package size={15} className="text-blue-600" />
            </div>
            {stats.active > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-gray-900">
            {loading ? "–" : stats.active}
          </div>
          <div className="text-[11px] text-gray-400 font-medium mt-0.5">
            Active Listings
          </div>
        </div>

        {/* Bids Received */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Gavel size={15} className="text-purple-600" />
            </div>
            {totalBidsReceived > 0 && (
              <TrendingUp size={13} className="text-purple-400" />
            )}
          </div>
          <div className="text-2xl font-black text-gray-900">
            {loading ? "–" : totalBidsReceived}
          </div>
          <div className="text-[11px] text-gray-400 font-medium mt-0.5">
            Bids Received
          </div>
        </div>

        {/* Items Sold */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <ShoppingBag size={15} className="text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">
            {loading ? "–" : stats.sold}
          </div>
          <div className="text-[11px] text-gray-400 font-medium mt-0.5">
            Items Sold
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Eye size={15} className="text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">
            {loading ? "–" : totalViews}
          </div>
          <div className="text-[11px] text-gray-400 font-medium mt-0.5">
            Listing Views
          </div>
        </div>
      </div>

      {/* ── Main area: Active listings + sidebar ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Active listings — 3 of 5 cols */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Listings
            </h2>
            <button
              onClick={() => onTabChange("listings")}
              className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors"
            >
              View all
              <ArrowRight size={13} />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-xl bg-gray-50 animate-pulse"
                >
                  <div className="w-14 h-14 rounded-xl bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                    <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeItems.length === 0 ? (
            <div className="text-center py-10">
              <Package size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-400 mb-1">
                No active listings
              </p>
              <p className="text-xs text-gray-300 mb-4">
                List your first jersey and start selling
              </p>
              <Link
                href="/add-listing"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors"
              >
                <PlusCircle size={14} />
                Create listing
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {activeItems.map((listing) => {
                const thumbnail = listing.images?.[0] ?? null;
                const countdown = formatCountdown(listing.endTime);
                const bids = listing.bidCount || listing._count?.bids || 0;
                const isAuction =
                  listing.listingType === "auction" ||
                  listing.listingType === "auction_buy_now";
                return (
                  <Link
                    key={listing.id}
                    href={`/auction/${listing.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={listing.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Tag size={16} className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate leading-snug">
                        {listing.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {listing.team} · {listing.season}
                      </p>
                      {/* Stats pills */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            countdown.urgent
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Clock size={11} />
                          {countdown.label}
                        </span>
                        {isAuction && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              bids > 0
                                ? "bg-purple-100 text-purple-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <Gavel size={11} />
                            {bids} bid{bids !== 1 ? "s" : ""}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-[11px] font-bold text-gray-500">
                          <Eye size={11} />
                          {listing.views ?? 0}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-black text-gray-900">
                        {formatPrice(listing.currentBid)}
                      </p>
                      {listing.buyNowPrice && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-[10px] font-black text-emerald-600">
                          BIN {formatPrice(listing.buyNowPrice)}
                        </span>
                      )}
                    </div>

                    <ChevronRight
                      size={14}
                      className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 group-hover:translate-x-0.5 transition-all"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right sidebar — 2 of 5 cols */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Ending soon alert — only renders when relevant */}
          {endingSoon.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={13} className="text-red-500" />
                <span className="text-[11px] font-black text-red-700 uppercase tracking-wider">
                  Ending Soon
                </span>
              </div>
              {endingSoon.slice(0, 2).map((l) => (
                <Link
                  key={l.id}
                  href={`/auction/${l.id}`}
                  className="block mt-1.5 hover:opacity-80 transition-opacity"
                >
                  <p className="text-xs font-bold text-red-800 truncate">
                    {l.title}
                  </p>
                  <p className="text-[10px] text-red-500 mt-0.5">
                    {formatCountdown(l.endTime).label}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-200/60 p-4 flex-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">
              Quick Actions
            </p>
            <div className="space-y-1">
              <Link
                href="/add-listing"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <PlusCircle size={13} className="text-white" />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors flex-1">
                  New Listing
                </span>
                <ChevronRight
                  size={13}
                  className="text-gray-300 group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <button
                onClick={() => onTabChange("listings")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Package size={13} className="text-blue-600" />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors flex-1">
                  My Listings
                </span>
                <ChevronRight
                  size={13}
                  className="text-gray-300 group-hover:translate-x-0.5 transition-transform"
                />
              </button>
              <button
                onClick={() => onTabChange("aitools")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={13} className="text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors flex-1">
                  AI Tools
                </span>
                <ChevronRight
                  size={13}
                  className="text-gray-300 group-hover:translate-x-0.5 transition-transform"
                />
              </button>
              <button
                onClick={() => onTabChange("messages")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={13} className="text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors flex-1">
                  Messages
                </span>
                <ChevronRight
                  size={13}
                  className="text-gray-300 group-hover:translate-x-0.5 transition-transform"
                />
              </button>
            </div>
          </div>

          {/* AI Credits widget */}
          {(() => {
            const aiCredits = (user as any)?.aiCredits ?? 0;
            return (
              <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={13} className="text-indigo-600" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                      AI Credits
                    </p>
                  </div>
                  <button
                    onClick={() => onTabChange("aitools")}
                    className="text-[11px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    Buy more
                  </button>
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-900 tabular-nums">
                      {aiCredits}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">credits</span>
                  </div>
                  <Zap size={20} className={aiCredits === 0 ? "text-gray-200" : "text-amber-400"} />
                </div>
                {aiCredits === 0 ? (
                  <p className="text-[11px] text-amber-600 font-bold mt-2">
                    No credits — buy to use AI tools
                  </p>
                ) : aiCredits < 3 ? (
                  <p className="text-[11px] text-amber-500 font-bold mt-2">
                    Running low — consider topping up
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-400 mt-2">
                    Credits never expire
                  </p>
                )}
              </div>
            );
          })()}

          {/* Arena shortcut */}
          <Link
            href="/arena"
            className="group bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <Trophy size={16} className="text-yellow-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white">
                  Matchdays Arena
                </p>
                <p className="text-[11px] text-white/70 mt-0.5">
                  Predict · Compete · Win
                </p>
              </div>
              <ChevronRight
                size={14}
                className="text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* ── Collection preview ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Layers size={14} className="text-indigo-600" />
            </div>
            <h2 className="text-sm font-black text-gray-900">My Collection</h2>
            {!collectionLoading && collection.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-black text-gray-500">
                {collection.length} item{collection.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {collectionTotalValue > 0 && (
              <span className="text-xs font-bold text-gray-400">
                Est.{" "}
                <span className="text-gray-700">
                  {formatPrice(collectionTotalValue)}
                </span>
              </span>
            )}
            <button
              onClick={() => onTabChange("collection")}
              className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors"
            >
              View all
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {collectionLoading ? (
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[calc(20%-10px)] animate-pulse"
              >
                <div className="aspect-square rounded-xl bg-gray-100 mb-2" />
                <div className="h-2.5 bg-gray-100 rounded-full w-3/4 mb-1.5" />
                <div className="h-2 bg-gray-50 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : collection.length === 0 ? (
          <div className="flex items-center gap-4 py-2">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Layers size={20} className="text-gray-200" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400">
                Your collection is empty
              </p>
              <p className="text-xs text-gray-300 mt-0.5">
                Add jerseys you own to showcase your collection
              </p>
            </div>
            <button
              onClick={() => onTabChange("collection")}
              className="ml-auto flex-shrink-0 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors"
            >
              + Add item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {collectionPreview.map((item) => {
              const rarity = RARITY_STYLES[item.rarity] ?? RARITY_STYLES.common;
              const thumb = item.images?.[0] ?? null;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange("collection")}
                  className="group text-left"
                >
                  <div
                    className={`aspect-square rounded-xl overflow-hidden relative border ${rarity.border} mb-2`}
                  >
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="20vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <Tag size={18} className="text-gray-200" />
                      </div>
                    )}
                    {item.isVintage && (
                      <span className="absolute top-1.5 left-1.5 px-1 py-0.5 bg-black/70 text-white text-[8px] font-black rounded uppercase tracking-wider">
                        Vintage
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-gray-800 truncate leading-tight">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${rarity.bg} ${rarity.text}`}
                    >
                      {rarity.label}
                    </span>
                  </div>
                  {item.estimatedValue != null && item.estimatedValue > 0 && (
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      ~{formatPrice(item.estimatedValue)}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Daily Spin modal ─────────────────────────────────────────────── */}
      {spinOpen && <DailySpinModal onClose={() => setSpinOpen(false)} />}
    </div>
  );
}
