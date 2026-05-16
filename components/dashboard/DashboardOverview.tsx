"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Dashboard / Overview — editorial monochrome.
 *
 * Same business logic as before (listings / collection / favorites / bids
 * tabs, AI tools grid, daily spin, today's games, rankings, loyalty tier
 * progress), but stripped of decorative colour. The whole surface uses
 * black / white / gray; the only accents are:
 *
 *   • one emerald dot for "live" / "winning" status
 *   • one red dot for "ending soon" / "outbid"
 *   • medal gold/silver/bronze on rankings, because those colours mean
 *     something specific (1st / 2nd / 3rd) and removing them would lose
 *     information that the rank number alone doesn't convey at a glance.
 *
 * Everything else — tier badges, AI tool tiles, rarity chips, game tags —
 * is monochrome outline. Hierarchy through typography (size, weight,
 * tracking) and white space, not hue. Same design vocabulary as the
 * `/profile` redesign.
 */

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import {
  PlusCircle,
  Tag,
  ArrowRight,
  Trophy,
  TrendingUp,
  Eye,
  Gavel,
  Clock,
  ChevronRight,
  TrendingDown,
  Minus,
  Heart,
  Zap,
  ScanLine,
  BarChart3,
  Sparkles,
  AlertCircle,
  Users,
  Package,
  Calendar,
  ShieldCheck,
  Hexagon,
  Disc,
  Dice5,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import type { DashboardTab } from "./DashboardSidebar";
import { DailySpinModal } from "./spin-wheel/DailySpinModal";
import { useMyListings } from "@/lib/hooks/useMyListings";
import { getMyCollection, type CollectionItemDto } from "@/lib/api/collection";
import { getFavoriteIds } from "@/lib/api/auctions.api";
import apiClient from "@/lib/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardOverviewProps {
  greeting: string;
  displayName: string;
  onTabChange: (tab: DashboardTab) => void;
}

type ContentTab = "listings" | "collection" | "favorites" | "bids";

interface FavoriteAuction {
  id: string;
  title: string;
  currentBid: number;
  buyNowPrice?: number | null;
  endTime: string;
  status: string;
  images?: string[];
  team?: string;
  season?: string;
  listingType?: string;
  bidCount?: number;
}

interface MyBidEntry {
  bidId: string;
  myBidAmount: number;
  currentBid: number;
  isWinning: boolean;
  isWon: boolean;
  auction: {
    id: string;
    title: string;
    status: string;
    endTime: string;
    image: string | null;
    listingType: string;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(v: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(v);
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

// ─── Loyalty tiers ────────────────────────────────────────────────────────────

const TIERS = [
  { name: "Rookie", min: 0, max: 499 },
  { name: "Collector", min: 500, max: 1499 },
  { name: "Enthusiast", min: 1500, max: 3499 },
  { name: "Veteran", min: 3500, max: 7499 },
  { name: "Legend", min: 7500, max: Infinity },
] as const;

function getTier(pts: number) {
  return TIERS.find((t) => pts >= t.min && pts <= t.max) ?? TIERS[0];
}
function getTierProgress(pts: number) {
  const t = getTier(pts);
  if (t.max === Infinity) return 100;
  return Math.min(100, Math.round(((pts - t.min) / (t.max - t.min + 1)) * 100));
}
function getDaysLeft(expiry: string | null | undefined): number | null {
  if (!expiry) return null;
  const diff = new Date(expiry).getTime() - Date.now();
  return diff <= 0 ? 0 : Math.ceil(diff / 86_400_000);
}

// ─── Rankings data ────────────────────────────────────────────────────────────

const GAME_RANKINGS = {
  weekly: [
    {
      game: "Tiki-Taka Toe",
      icon: Hexagon,
      leaders: [
        { rank: 1, username: "jersey_king", score: 9, change: 0 },
        { rank: 2, username: "kit_collector", score: 8, change: 2 },
        { rank: 3, username: "ultras_fan", score: 7, change: -1 },
      ],
    },
    {
      game: "Predictor",
      icon: Calendar,
      leaders: [
        { rank: 1, username: "match_hunter", score: 7, change: 1 },
        { rank: 2, username: "vintage_pro", score: 6, change: 0 },
        { rank: 3, username: "jersey_king", score: 5, change: -1 },
      ],
    },
  ],
  monthly: [
    {
      game: "Tiki-Taka Toe",
      icon: Hexagon,
      leaders: [
        { rank: 1, username: "ultras_fan", score: 38, change: 3 },
        { rank: 2, username: "jersey_king", score: 35, change: 0 },
        { rank: 3, username: "kit_collector", score: 31, change: -1 },
      ],
    },
    {
      game: "Predictor",
      icon: Calendar,
      leaders: [
        { rank: 1, username: "vintage_pro", score: 28, change: 0 },
        { rank: 2, username: "match_hunter", score: 25, change: 2 },
        { rank: 3, username: "ultras_fan", score: 22, change: -1 },
      ],
    },
  ],
} as const;

// Medals get to keep their colour — gold/silver/bronze IS the information.
const MEDAL_COLORS = ["#b8923c", "#9ca3af", "#a16d4d"];

// ─── Rarity config — labels only ─────────────────────────────────────────────

const RARITY_LABEL: Record<string, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

// ─── AI Tools data ────────────────────────────────────────────────────────────

const AI_TOOLS = [
  {
    id: "legit-check",
    icon: ScanLine,
    name: "Legit Check",
    desc: "Upload photos — AI returns authenticity score in 10s",
    credits: 1,
    href: "/ai/verify",
    available: true,
  },
  {
    id: "valuation",
    icon: BarChart3,
    name: "Price Oracle",
    desc: "Real market price based on thousands of recent sales",
    credits: 1,
    href: "/ai/verify",
    available: true,
  },
  {
    id: "smart-listing",
    icon: Sparkles,
    name: "Smart Listing",
    desc: "Photo → SEO title, description & tags automatically",
    credits: 2,
    href: "/add-listing",
    available: true,
  },
  {
    id: "expert",
    icon: Users,
    name: "Expert",
    desc: "Connect with a verified authenticator or collector",
    credits: 5,
    href: "#",
    available: false,
  },
] as const;

// ─── Today's Games data ──────────────────────────────────────────────────────

const TODAY_GAMES = [
  {
    icon: Hexagon,
    label: "Tiki-Taka Toe",
    sub: "9 squares · 500 pts",
    tag: "Daily",
    href: "/arena/games/tiki-taka-toe",
  },
  {
    icon: Disc,
    label: "Football Bingo",
    sub: "Mark live events",
    tag: "Live",
    href: "/arena",
  },
  {
    icon: Dice5,
    label: "Predictor",
    sub: "8 matches · tip now",
    tag: "Weekly",
    href: "/arena",
  },
] as const;

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
  const [collectionLoading, setColLoading] = useState(true);
  const [rankTab, setRankTab] = useState<"weekly" | "monthly">("weekly");
  const [contentTab, setContentTab] = useState<ContentTab>("listings");

  const [favorites, setFavorites] = useState<FavoriteAuction[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  const [favFetched, setFavFetched] = useState(false);

  const [activeBids, setActiveBids] = useState<MyBidEntry[]>([]);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [bidsFetched, setBidsFetched] = useState(false);

  // Tick every 30 s to keep countdowns fresh.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    getMyCollection()
      .then((res) => {
        if (res.success && res.data) setCollection(res.data);
      })
      .catch(() => {})
      .finally(() => setColLoading(false));
  }, []);

  // Lazy-load favorites when their tab opens.
  useEffect(() => {
    if (contentTab !== "favorites" || favFetched) return;
    setFavFetched(true);
    setFavLoading(true);
    getFavoriteIds()
      .then(async (ids) => {
        if (!ids.length) {
          setFavorites([]);
          return;
        }
        const fetched = await Promise.all(
          ids.slice(0, 6).map((id) =>
            apiClient
              .get<{ success: boolean; data: FavoriteAuction }>(
                `/auctions/${id}`,
              )
              .then((r) => r.data.data)
              .catch(() => null),
          ),
        );
        setFavorites(fetched.filter(Boolean) as FavoriteAuction[]);
      })
      .catch(() => setFavorites([]))
      .finally(() => setFavLoading(false));
  }, [contentTab, favFetched]);

  // Lazy-load active bids likewise.
  useEffect(() => {
    if (contentTab !== "bids" || bidsFetched) return;
    setBidsFetched(true);
    setBidsLoading(true);
    apiClient
      .get<{ success: boolean; data: MyBidEntry[] }>("/bids/my")
      .then((res) => {
        if (res.data.success)
          setActiveBids(
            (res.data.data ?? []).filter((b) => b.auction.status === "active"),
          );
      })
      .catch(() => {})
      .finally(() => setBidsLoading(false));
  }, [contentTab, bidsFetched]);

  // Derived state
  const totalBidsReceived = useMemo(
    () => listings.reduce((s, l) => s + (l.bidCount || 0), 0),
    [listings],
  );
  const activeItems = listings
    .filter((l) => l.status === "active")
    .sort(
      (a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime(),
    )
    .slice(0, 5);
  const collectionPreview = collection.slice(0, 6);
  const collectionTotalValue = collection.reduce(
    (s, i) => s + (i.estimatedValue ?? 0),
    0,
  );
  const endingSoon = activeItems.filter((l) => {
    const d = new Date(l.endTime).getTime() - Date.now();
    return d > 0 && d < 3 * 3_600_000;
  });

  const pts = user?.totalPoints ?? 0;
  const aiCredits = (user as any)?.aiCredits ?? 0;
  const isVerified = (user as any)?.isVerified ?? false;
  const tier = getTier(pts);
  const progress = getTierProgress(pts);
  const tierIdx = TIERS.findIndex((t) => t.name === tier.name);
  const nextTier = tierIdx + 1 < TIERS.length ? TIERS[tierIdx + 1] : null;
  const ptsToNext = nextTier ? nextTier.min - pts : 0;
  const subTier = (user?.subscriptionTier ?? "free").toLowerCase();
  const daysLeft = getDaysLeft(user?.subscriptionExpiry ?? null);
  const isPaid = subTier !== "free";
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7;
  const rankData = GAME_RANKINGS[rankTab];

  const TAB_LABELS: Record<ContentTab, string> = {
    listings: `Active listings${!loading && stats.active > 0 ? ` · ${stats.active}` : ""}`,
    collection: `My collection${collection.length > 0 ? ` · ${collection.length}` : ""}`,
    favorites: "Favorites",
    bids: "My bids",
  };

  return (
    <div className="bg-white min-h-full">
      {/* ═══════════════════════════════════════════════════════════════════
           HERO — monochrome, no gradient text, no glow
        ═══════════════════════════════════════════════════════════════════ */}
      <header className="border-b border-gray-200">
        <div className="relative flex flex-col lg:flex-row">
          {/* LEFT: identity */}
          <div className="flex-1 px-6 lg:px-8 py-7 flex flex-col gap-5 min-w-0">
            {/* Top row — date + actions */}
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold tracking-wider uppercase text-gray-400">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <div className="flex items-center gap-2">
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 text-gray-700 text-[10px] font-semibold uppercase tracking-wider">
                    <ShieldCheck size={10} />
                    Verified
                  </span>
                ) : (
                  <Link
                    href="/settings"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 text-gray-900 text-[10px] font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    <AlertCircle size={10} />
                    Verify account
                  </Link>
                )}
                <Link
                  href="/add-listing"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-900 text-white text-[11px] font-semibold hover:bg-black transition-colors"
                >
                  <PlusCircle size={12} /> New listing
                </Link>
              </div>
            </div>

            {/* Greeting — single flat color, no gradient */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 leading-[1.05]">
              {greeting},
              <br />
              <span className="text-gray-900">{displayName}</span>
            </h1>

            {/* Info strip: plan · loyalty · ai credits */}
            <div className="flex items-center gap-5 flex-wrap text-sm">
              {/* Plan */}
              {isPaid ? (
                <span className="inline-flex items-center gap-1.5 text-xs">
                  <span className="font-semibold text-gray-900">
                    {subTier.charAt(0).toUpperCase() + subTier.slice(1)}
                  </span>
                  {daysLeft !== null && (
                    <span
                      className={
                        isExpiringSoon ? "text-amber-700" : "text-gray-500"
                      }
                    >
                      · {daysLeft}d left{isExpiringSoon ? " — renew soon" : ""}
                    </span>
                  )}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-xs">
                  <span className="text-gray-500">Free account</span>
                  <Link
                    href="/pricing"
                    className="font-semibold text-gray-900 underline underline-offset-4 hover:text-black transition-colors"
                  >
                    Upgrade
                  </Link>
                </span>
              )}

              <span className="h-3 w-px bg-gray-200" />

              {/* Loyalty */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline gap-2 text-xs">
                  <span className="text-base font-semibold tabular-nums text-gray-900">
                    {pts.toLocaleString()}
                  </span>
                  <span className="text-gray-500">{tier.name}</span>
                  {nextTier && (
                    <span className="text-gray-400">
                      · {ptsToNext.toLocaleString()} to {nextTier.name}
                    </span>
                  )}
                </div>
                <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <span className="h-3 w-px bg-gray-200" />

              {/* AI credits */}
              <span className="inline-flex items-center gap-1.5 text-xs">
                <Zap size={11} className="text-gray-400" />
                <span className="font-semibold tabular-nums text-gray-900">
                  {aiCredits}
                </span>
                <span className="text-gray-500">credits</span>
                <Link
                  href="/rewards"
                  className="text-gray-500 hover:text-gray-900 underline underline-offset-4 transition-colors"
                >
                  Rewards →
                </Link>
              </span>
            </div>
          </div>

          {/* RIGHT: 2×2 stats grid */}
          <div className="lg:w-[42%] grid grid-cols-2 lg:border-l border-t lg:border-t-0 border-gray-200">
            {[
              {
                label: "Active listings",
                value: loading ? "—" : stats.active,
                note: "currently live",
                live: !loading && stats.active > 0,
              },
              {
                label: "Bids received",
                value: loading ? "—" : totalBidsReceived,
                note: "on your items",
              },
              {
                label: "Items sold",
                value: loading ? "—" : stats.sold,
                note: "all time",
              },
              {
                label: "AI credits",
                value: aiCredits,
                note: aiCredits === 0 ? "buy credits →" : "never expire",
              },
            ].map((s, i) => (
              <div
                key={s.label}
                className={[
                  "px-5 py-5 flex flex-col justify-between min-h-[110px]",
                  i % 2 === 1 ? "border-l border-gray-200" : "",
                  i >= 2 ? "border-t border-gray-200" : "",
                ].join(" ")}
              >
                <div className="flex items-center gap-1.5">
                  {s.live && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {s.label}
                  </p>
                </div>
                <p className="text-[40px] font-semibold tabular-nums leading-none tracking-tight text-gray-900">
                  {typeof s.value === "number"
                    ? s.value.toLocaleString()
                    : s.value}
                </p>
                <p className="text-[10px] text-gray-400">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
           MAIN GRID — left content + right rail
        ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* ── LEFT ─────────────────────────────────────────────────────── */}
        <section className="lg:col-span-3 lg:border-r border-gray-200">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-6 pt-5 overflow-x-auto scrollbar-hide">
            {(["listings", "collection", "favorites", "bids"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setContentTab(tab)}
                  className={[
                    "px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors",
                    contentTab === tab
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {TAB_LABELS[tab]}
                </button>
              ),
            )}
          </div>
          <div className="mx-6 mt-4 h-px bg-gray-100" />

          <div className="px-6 py-5">
            {/* ── Active Listings ── */}
            {contentTab === "listings" && (
              <>
                {loading ? (
                  <SkeletonRows />
                ) : activeItems.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="No active listings yet"
                    subtitle="List your first jersey and start selling."
                    cta={{ label: "Create listing", href: "/add-listing" }}
                  />
                ) : (
                  <div>
                    {activeItems.map((listing, idx) => {
                      const thumb = listing.images?.[0] ?? null;
                      const countdown = formatCountdown(listing.endTime);
                      const bids =
                        listing.bidCount || (listing as any)._count?.bids || 0;
                      const isAuction =
                        listing.listingType === "auction" ||
                        listing.listingType === "auction_buy_now";
                      return (
                        <Link
                          key={listing.id}
                          href={`/auction/${listing.id}`}
                          className={[
                            "group flex items-center gap-4 py-4 -mx-2 px-2 rounded-md hover:bg-gray-50 transition-colors",
                            idx > 0 ? "border-t border-gray-100" : "",
                          ].join(" ")}
                        >
                          {/* Accent strip: red when urgent, gray otherwise */}
                          <div
                            className={[
                              "w-0.5 h-12 rounded-full flex-shrink-0",
                              countdown.urgent ? "bg-red-500" : "bg-gray-300",
                            ].join(" ")}
                          />
                          <ThumbBox thumb={thumb} fallback={Tag} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {listing.title}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {listing.team}
                              {listing.season ? ` · ${listing.season}` : ""}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                              <span
                                className={
                                  countdown.urgent
                                    ? "text-red-600 font-semibold"
                                    : ""
                                }
                              >
                                <Clock size={9} className="inline mr-0.5 -mt-px" />
                                {countdown.label}
                              </span>
                              {isAuction && (
                                <span>
                                  <Gavel size={9} className="inline mr-0.5 -mt-px" />
                                  {bids}
                                </span>
                              )}
                              <span>
                                <Eye size={9} className="inline mr-0.5 -mt-px" />
                                {listing.views ?? 0}
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-base font-semibold tabular-nums text-gray-900">
                              {formatPrice(listing.currentBid)}
                            </p>
                            {listing.buyNowPrice && (
                              <p className="text-[10px] text-gray-500 mt-0.5 tabular-nums">
                                BIN {formatPrice(listing.buyNowPrice)}
                              </p>
                            )}
                          </div>
                          <ChevronRight
                            size={13}
                            className="text-gray-300 flex-shrink-0 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all"
                          />
                        </Link>
                      );
                    })}
                    {endingSoon.length > 0 && (
                      <div className="flex items-center gap-2 pt-3 mt-1 border-t border-gray-100">
                        <Clock size={10} className="text-red-500" />
                        <p className="text-xs font-semibold text-red-600">
                          {endingSoon.length} listing
                          {endingSoon.length > 1 ? "s" : ""} ending within 3 hours
                        </p>
                      </div>
                    )}
                    <ViewAllButton
                      onClick={() => onTabChange("listings")}
                      label="View all listings"
                    />
                  </div>
                )}
              </>
            )}

            {/* ── My Collection ── */}
            {contentTab === "collection" && (
              <>
                {collectionLoading ? (
                  <SkeletonGrid />
                ) : collection.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="Your collection is empty"
                    subtitle="Add jerseys you own to showcase your collection."
                    cta={{
                      label: "Add item",
                      onClick: () => onTabChange("collection"),
                    }}
                  />
                ) : (
                  <>
                    {collectionTotalValue > 0 && (
                      <p className="text-xs text-gray-500 mb-4">
                        {collection.length} items · Est.{" "}
                        <span className="font-semibold text-gray-900 tabular-nums">
                          {formatPrice(collectionTotalValue)}
                        </span>
                      </p>
                    )}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {collectionPreview.map((item) => {
                        const thumb = item.images?.[0] ?? null;
                        const rarityLabel =
                          RARITY_LABEL[item.rarity] ?? "Common";
                        return (
                          <button
                            key={item.id}
                            onClick={() => onTabChange("collection")}
                            className="group text-left"
                          >
                            <div className="aspect-[3/4] rounded-md overflow-hidden relative mb-2 bg-gray-50 border border-gray-200 transition-all group-hover:-translate-y-0.5 group-hover:shadow-sm">
                              {thumb ? (
                                <Image
                                  src={thumb}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                  sizes="120px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Tag size={18} className="text-gray-300" />
                                </div>
                              )}
                              {(item as any).isVintage && (
                                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-white border border-gray-200 text-gray-700 text-[8px] font-semibold rounded uppercase tracking-wider">
                                  Vintage
                                </span>
                              )}
                              <div className="absolute bottom-1.5 left-1.5">
                                <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-white/95 border border-gray-200 text-gray-700 uppercase tracking-wide">
                                  {rarityLabel}
                                </span>
                              </div>
                            </div>
                            <p className="text-[11px] font-medium truncate leading-tight text-gray-900">
                              {item.title}
                            </p>
                            {item.estimatedValue != null &&
                              item.estimatedValue > 0 && (
                                <p className="text-[10px] text-gray-500 mt-0.5 tabular-nums">
                                  ~{formatPrice(item.estimatedValue)}
                                </p>
                              )}
                          </button>
                        );
                      })}
                    </div>
                    <ViewAllButton
                      onClick={() => onTabChange("collection")}
                      label="View full collection"
                    />
                  </>
                )}
              </>
            )}

            {/* ── Favorites ── */}
            {contentTab === "favorites" && (
              <>
                {favLoading ? (
                  <SkeletonRows />
                ) : favorites.length === 0 ? (
                  <EmptyState
                    icon={Heart}
                    title="No favorites yet"
                    subtitle="Heart listings you love to save them here."
                    cta={{ label: "Browse listings", href: "/auctions" }}
                  />
                ) : (
                  <div>
                    {favorites.map((item, idx) => {
                      const thumb = item.images?.[0] ?? null;
                      const countdown = formatCountdown(item.endTime);
                      return (
                        <Link
                          key={item.id}
                          href={`/auction/${item.id}`}
                          className={[
                            "group flex items-center gap-4 py-4 -mx-2 px-2 rounded-md hover:bg-gray-50 transition-colors",
                            idx > 0 ? "border-t border-gray-100" : "",
                          ].join(" ")}
                        >
                          <div className="w-0.5 h-12 rounded-full bg-gray-300 flex-shrink-0" />
                          <ThumbBox thumb={thumb} fallback={Heart} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {item.team}
                              {item.season ? ` · ${item.season}` : ""}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                              <span
                                className={
                                  countdown.urgent
                                    ? "text-red-600 font-semibold"
                                    : ""
                                }
                              >
                                <Clock size={9} className="inline mr-0.5 -mt-px" />
                                {countdown.label}
                              </span>
                              {item.bidCount != null && (
                                <span>
                                  <Gavel size={9} className="inline mr-0.5 -mt-px" />
                                  {item.bidCount}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-base font-semibold tabular-nums text-gray-900">
                              {formatPrice(item.currentBid)}
                            </p>
                            {item.buyNowPrice && (
                              <p className="text-[10px] text-gray-500 mt-0.5 tabular-nums">
                                BIN {formatPrice(item.buyNowPrice)}
                              </p>
                            )}
                          </div>
                          <ChevronRight
                            size={13}
                            className="text-gray-300 flex-shrink-0 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all"
                          />
                        </Link>
                      );
                    })}
                    <ViewAllButton
                      onClick={() => onTabChange("collection")}
                      label="Browse more"
                    />
                  </div>
                )}
              </>
            )}

            {/* ── My Bids ── */}
            {contentTab === "bids" && (
              <>
                {bidsLoading ? (
                  <SkeletonRows />
                ) : activeBids.length === 0 ? (
                  <EmptyState
                    icon={Gavel}
                    title="No active bids"
                    subtitle="Auctions you're currently bidding on will appear here."
                    cta={{ label: "Browse auctions", href: "/auctions" }}
                  />
                ) : (
                  <div>
                    {activeBids.map((entry, idx) => {
                      const countdown = formatCountdown(entry.auction.endTime);
                      const gap = entry.currentBid - entry.myBidAmount;
                      return (
                        <Link
                          key={entry.bidId}
                          href={`/auction/${entry.auction.id}`}
                          className={[
                            "group flex items-center gap-4 py-4 -mx-2 px-2 rounded-md hover:bg-gray-50 transition-colors",
                            idx > 0 ? "border-t border-gray-100" : "",
                          ].join(" ")}
                        >
                          <div
                            className={[
                              "w-0.5 h-12 rounded-full flex-shrink-0",
                              entry.isWinning ? "bg-emerald-500" : "bg-red-500",
                            ].join(" ")}
                          />
                          <ThumbBox
                            thumb={entry.auction.image}
                            fallback={Gavel}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {entry.auction.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {entry.isWinning ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                                  <TrendingUp size={9} />
                                  Winning
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600">
                                  <AlertCircle size={9} />
                                  Outbid +{formatPrice(gap)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                              <span
                                className={
                                  countdown.urgent
                                    ? "text-red-600 font-semibold"
                                    : ""
                                }
                              >
                                <Clock size={9} className="inline mr-0.5 -mt-px" />
                                {countdown.label}
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">
                              My bid
                            </p>
                            <p className="text-base font-semibold tabular-nums text-gray-900">
                              {formatPrice(entry.myBidAmount)}
                            </p>
                            {!entry.isWinning && (
                              <p className="text-[10px] text-red-600 mt-0.5 tabular-nums">
                                Now {formatPrice(entry.currentBid)}
                              </p>
                            )}
                          </div>
                          <ChevronRight
                            size={13}
                            className="text-gray-300 flex-shrink-0 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all"
                          />
                        </Link>
                      );
                    })}
                    <ViewAllButton
                      onClick={() => onTabChange("bids")}
                      label="View full bid history"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── AI Tools section ── */}
          <div className="border-t border-gray-200">
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-gray-400" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  AI tools
                </p>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border border-gray-200 text-gray-600 tabular-nums">
                  {aiCredits} credits
                </span>
              </div>
              <button
                onClick={() => onTabChange("aitools")}
                className="text-xs font-medium text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 transition-colors"
              >
                All tools <ArrowRight size={11} />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 pb-6">
              {AI_TOOLS.map((tool) => {
                const canAfford = aiCredits >= tool.credits;
                const disabled = !tool.available || !canAfford;
                const Icon = tool.icon;
                const tile = (
                  <div
                    key={tool.id}
                    className={[
                      "group relative rounded-xl flex flex-col justify-between p-4 border transition-all aspect-square",
                      disabled
                        ? "border-gray-200 bg-gray-50/60 cursor-not-allowed"
                        : "border-gray-200 bg-white hover:border-gray-400 hover:-translate-y-0.5",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center">
                        <Icon size={16} className="text-gray-900" strokeWidth={1.75} />
                      </div>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold tabular-nums text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                        <Zap size={8} />
                        {tool.credits}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight mb-1">
                        {tool.name}
                      </p>
                      <p className="text-[10px] text-gray-500 leading-snug mb-2">
                        {tool.desc}
                      </p>
                      {tool.available ? (
                        canAfford ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-900 group-hover:gap-1.5 transition-all">
                            Use now
                            <ArrowRight size={9} />
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-400">
                            <Zap size={8} /> Need {tool.credits} cr.
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] text-gray-400">
                          Coming soon
                        </span>
                      )}
                    </div>
                  </div>
                );
                if (disabled) return <div key={tool.id}>{tile}</div>;
                return (
                  <Link key={tool.id} href={tool.href}>
                    {tile}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── RIGHT RAIL — games + rankings ────────────────────────────── */}
        <aside className="lg:col-span-2 flex flex-col">
          {/* Daily spin card */}
          <div className="px-6 pt-6 pb-3">
            <button
              onClick={() => setSpinOpen(true)}
              className="group w-full text-left rounded-xl p-5 bg-gray-900 hover:bg-black transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <Disc size={20} className="text-white" />
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border border-white/20 text-white/70">
                  Free · Daily
                </span>
              </div>
              <p className="text-sm font-semibold text-white mb-1">
                Daily spin
              </p>
              <p className="text-[11px] text-gray-400 mb-3">
                Win points &amp; prizes every day
              </p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white">
                Spin now <ArrowRight size={11} />
              </span>
            </button>
          </div>

          {/* Today's games */}
          <div className="px-6 py-4 border-b border-gray-200">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Today&apos;s games
            </p>
            <div className="space-y-0.5">
              {TODAY_GAMES.map((g) => {
                const Icon = g.icon;
                return (
                  <Link
                    key={g.label}
                    href={g.href}
                    className="group flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-gray-700" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-tight">
                        {g.label}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{g.sub}</p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">
                      {g.tag}
                    </span>
                  </Link>
                );
              })}
            </div>
            <Link
              href="/arena"
              className="group mt-4 flex items-center gap-3 px-4 py-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Trophy size={14} className="text-gray-700 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900">
                  Matchdays Arena
                </p>
                <p className="text-[10px] text-gray-500">
                  Predict · Compete · Win
                </p>
              </div>
              <ChevronRight
                size={13}
                className="text-gray-300 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          </div>

          {/* Rankings */}
          <div className="px-6 py-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 inline-flex items-center gap-1.5">
                <Trophy size={11} />
                Rankings
              </h3>
              <div className="flex rounded-md border border-gray-200 overflow-hidden">
                {(["weekly", "monthly"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setRankTab(tab)}
                    className={[
                      "px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                      rankTab === tab
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-500 hover:text-gray-900",
                    ].join(" ")}
                  >
                    {tab === "weekly" ? "Week" : "Month"}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {rankData.map((gd) => {
                const GameIcon = gd.icon;
                return (
                  <div key={gd.game}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2 inline-flex items-center gap-1.5">
                      <GameIcon size={10} className="text-gray-400" />
                      {gd.game}
                    </p>
                    <div className="space-y-px">
                      {gd.leaders.map((p) => (
                        <div
                          key={p.rank}
                          className="flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-4 flex items-center justify-center flex-shrink-0">
                            {p.rank <= 3 ? (
                              <Trophy
                                size={11}
                                style={{ color: MEDAL_COLORS[p.rank - 1] }}
                              />
                            ) : (
                              <span className="text-[10px] font-semibold text-gray-400 tabular-nums">
                                {p.rank}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-medium flex-1 truncate text-gray-900">
                            {p.username}
                          </span>
                          <span className="text-xs font-semibold tabular-nums text-gray-900">
                            {p.score}
                          </span>
                          <span className="w-3.5 flex items-center justify-center">
                            {p.change > 0 ? (
                              <TrendingUp size={9} className="text-emerald-600" />
                            ) : p.change < 0 ? (
                              <TrendingDown size={9} className="text-red-500" />
                            ) : (
                              <Minus size={9} className="text-gray-300" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-700">
                You · <span className="font-semibold tabular-nums">{pts.toLocaleString()}</span> pts
              </span>
              <Link
                href="/arena"
                className="text-[11px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Full ranking →
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {spinOpen && <DailySpinModal onClose={() => setSpinOpen(false)} />}
    </div>
  );
}

// ─── Small atoms ─────────────────────────────────────────────────────────────

function ThumbBox({
  thumb,
  fallback: Fallback,
}: {
  thumb: string | null | undefined;
  fallback: typeof Tag;
}) {
  return (
    <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 relative bg-gray-100 border border-gray-200">
      {thumb ? (
        <Image
          src={thumb}
          alt=""
          fill
          className="object-cover"
          sizes="56px"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Fallback size={16} className="text-gray-300" />
        </div>
      )}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  subtitle,
  cta,
}: {
  icon: typeof Package;
  title: string;
  subtitle: string;
  cta?: { label: string; href?: string; onClick?: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
        <Icon size={20} className="text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
      <p className="text-xs text-gray-500 mb-5 max-w-xs">{subtitle}</p>
      {cta && (
        cta.href ? (
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            <PlusCircle size={12} /> {cta.label}
          </Link>
        ) : (
          <button
            onClick={cta.onClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            <PlusCircle size={12} /> {cta.label}
          </button>
        )
      )}
    </div>
  );
}

function ViewAllButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="mt-5 w-full py-2.5 rounded-md border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
    >
      {label} →
    </button>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-0.5 h-14 rounded-full flex-shrink-0 bg-gray-200" />
          <div className="w-14 h-14 rounded-md flex-shrink-0 bg-gray-100" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3.5 rounded bg-gray-100 w-3/4" />
            <div className="h-2.5 rounded bg-gray-100 w-1/2" />
            <div className="h-2 rounded bg-gray-100 w-1/3" />
          </div>
          <div className="w-14 space-y-1.5 pt-1">
            <div className="h-5 rounded bg-gray-100 w-full" />
            <div className="h-2.5 rounded bg-gray-100 w-2/3 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] rounded-md bg-gray-100 mb-2" />
          <div className="h-2.5 rounded bg-gray-100 w-3/4 mb-1" />
          <div className="h-2 rounded bg-gray-100 w-1/2" />
        </div>
      ))}
    </div>
  );
}
