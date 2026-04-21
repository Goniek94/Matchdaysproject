"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import {
  PlusCircle, Tag, ArrowRight, Trophy, TrendingUp, Eye, Gavel,
  Clock, ChevronRight, Crown, Star, Medal, TrendingDown, Minus,
  Heart, Zap, ScanLine, BarChart3, Sparkles, AlertCircle, Users,
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
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(v);
}

function formatCountdown(endTime: string): { label: string; urgent: boolean } {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return { label: "Ended", urgent: true };
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  if (days > 0) return { label: `${days}d ${hours}h left`, urgent: false };
  if (hours > 0) return { label: `${hours}h ${minutes}m left`, urgent: hours < 2 };
  return { label: `${minutes}m left`, urgent: true };
}

// ─── Loyalty tiers ────────────────────────────────────────────────────────────

const TIERS = [
  { name: "Rookie",     min: 0,    max: 499,      color: "#818CF8" },
  { name: "Collector",  min: 500,  max: 1499,     color: "#60A5FA" },
  { name: "Enthusiast", min: 1500, max: 3499,     color: "#34D399" },
  { name: "Veteran",    min: 3500, max: 7499,     color: "#A78BFA" },
  { name: "Legend",     min: 7500, max: Infinity, color: "#FBBF24" },
] as const;

function getTier(pts: number) { return TIERS.find((t) => pts >= t.min && pts <= t.max) ?? TIERS[0]; }
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

// ─── Subscription config ──────────────────────────────────────────────────────

const SUB_LABELS: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  free:    { label: "Free",    color: "#78716c", bg: "#f5f5f4",  icon: <Star size={9} /> },
  basic:   { label: "Basic",   color: "#1d4ed8", bg: "#dbeafe",  icon: <Star size={9} /> },
  premium: { label: "Premium", color: "#b45309", bg: "#fef3c7",  icon: <Crown size={9} /> },
  vip:     { label: "VIP",     color: "#6d28d9", bg: "#ede9fe",  icon: <Crown size={9} /> },
};

// ─── Rankings data ────────────────────────────────────────────────────────────

const GAME_RANKINGS = {
  weekly: [
    { game: "Tiki-Taka Toe", emoji: "⬡", color: "#7c3aed", leaders: [
      { rank: 1, username: "jersey_king",   score: 9, change:  0 },
      { rank: 2, username: "kit_collector", score: 8, change:  2 },
      { rank: 3, username: "ultras_fan",    score: 7, change: -1 },
    ]},
    { game: "Predictor", emoji: "📅", color: "#be185d", leaders: [
      { rank: 1, username: "match_hunter", score: 7, change:  1 },
      { rank: 2, username: "vintage_pro",  score: 6, change:  0 },
      { rank: 3, username: "jersey_king",  score: 5, change: -1 },
    ]},
  ],
  monthly: [
    { game: "Tiki-Taka Toe", emoji: "⬡", color: "#7c3aed", leaders: [
      { rank: 1, username: "ultras_fan",    score: 38, change:  3 },
      { rank: 2, username: "jersey_king",   score: 35, change:  0 },
      { rank: 3, username: "kit_collector", score: 31, change: -1 },
    ]},
    { game: "Predictor", emoji: "📅", color: "#be185d", leaders: [
      { rank: 1, username: "vintage_pro",  score: 28, change:  0 },
      { rank: 2, username: "match_hunter", score: 25, change:  2 },
      { rank: 3, username: "ultras_fan",   score: 22, change: -1 },
    ]},
  ],
};

const MEDAL_COLORS = ["#f59e0b", "#9ca3af", "#cd7f32"];

// ─── Rarity config ────────────────────────────────────────────────────────────

const RARITY: Record<string, { label: string; color: string; bg: string; border: string }> = {
  common:    { label: "Common",    color: "#78716c", bg: "#f5f5f4", border: "#e7e5e4" },
  rare:      { label: "Rare",      color: "#1d4ed8", bg: "#dbeafe", border: "#bfdbfe" },
  epic:      { label: "Epic",      color: "#6d28d9", bg: "#ede9fe", border: "#ddd6fe" },
  legendary: { label: "Legendary", color: "#b45309", bg: "#fef3c7", border: "#fde68a" },
};

// ─── AI Tools data ────────────────────────────────────────────────────────────

const AI_TOOLS = [
  {
    id: "legit-check",
    icon: ScanLine,
    name: "Legit Check",
    desc: "Upload photos — AI returns authenticity score in 10s",
    credits: 1,
    grad: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    glow: "rgba(59,130,246,0.25)",
    href: "/ai/verify",
    available: true,
  },
  {
    id: "valuation",
    icon: BarChart3,
    name: "Price Oracle",
    desc: "Real market price based on thousands of recent sales",
    credits: 1,
    grad: "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
    glow: "rgba(16,185,129,0.22)",
    href: "/ai/verify",
    available: true,
  },
  {
    id: "smart-listing",
    icon: Sparkles,
    name: "Smart Listing",
    desc: "Photo → SEO title, description & tags automatically",
    credits: 2,
    grad: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
    glow: "rgba(139,92,246,0.22)",
    href: "/add-listing",
    available: true,
  },
  {
    id: "expert",
    icon: Users,
    name: "Expert",
    desc: "Connect with a verified authenticator or collector",
    credits: 5,
    grad: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    glow: "rgba(245,158,11,0.2)",
    href: "#",
    available: false,
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardOverview({ greeting, displayName, onTabChange }: DashboardOverviewProps) {
  const { user } = useAuth();
  const { listings, stats, loading } = useMyListings();

  const [spinOpen, setSpinOpen]           = useState(false);
  const [, setTick]                        = useState(0);
  const [collection, setCollection]       = useState<CollectionItemDto[]>([]);
  const [collectionLoading, setColLoading] = useState(true);
  const [rankTab, setRankTab]             = useState<"weekly" | "monthly">("weekly");
  const [contentTab, setContentTab]       = useState<ContentTab>("listings");

  // Favorites
  const [favorites, setFavorites]         = useState<FavoriteAuction[]>([]);
  const [favLoading, setFavLoading]       = useState(false);
  const [favFetched, setFavFetched]       = useState(false);

  // Active bids
  const [activeBids, setActiveBids]       = useState<MyBidEntry[]>([]);
  const [bidsLoading, setBidsLoading]     = useState(false);
  const [bidsFetched, setBidsFetched]     = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    getMyCollection()
      .then((res) => { if (res.success && res.data) setCollection(res.data); })
      .catch(() => {})
      .finally(() => setColLoading(false));
  }, []);

  // Lazy-load favorites when tab is opened
  useEffect(() => {
    if (contentTab !== "favorites" || favFetched) return;
    setFavFetched(true);
    setFavLoading(true);
    getFavoriteIds()
      .then(async (ids) => {
        if (!ids.length) { setFavorites([]); return; }
        const fetched = await Promise.all(
          ids.slice(0, 6).map((id) =>
            apiClient
              .get<{ success: boolean; data: FavoriteAuction }>(`/auctions/${id}`)
              .then((r) => r.data.data)
              .catch(() => null),
          ),
        );
        setFavorites(fetched.filter(Boolean) as FavoriteAuction[]);
      })
      .catch(() => setFavorites([]))
      .finally(() => setFavLoading(false));
  }, [contentTab, favFetched]);

  // Lazy-load bids when tab is opened
  useEffect(() => {
    if (contentTab !== "bids" || bidsFetched) return;
    setBidsFetched(true);
    setBidsLoading(true);
    apiClient
      .get<{ success: boolean; data: MyBidEntry[] }>("/bids/my")
      .then((res) => {
        if (res.data.success) setActiveBids((res.data.data ?? []).filter((b) => b.auction.status === "active"));
      })
      .catch(() => {})
      .finally(() => setBidsLoading(false));
  }, [contentTab, bidsFetched]);

  // ── derived ──────────────────────────────────────────────────────────────
  const totalBidsReceived = useMemo(() => listings.reduce((s, l) => s + (l.bidCount || 0), 0), [listings]);
  const activeItems = listings
    .filter((l) => l.status === "active")
    .sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
    .slice(0, 5);
  const collectionPreview = collection.slice(0, 6);
  const collectionTotalValue = collection.reduce((s, i) => s + (i.estimatedValue ?? 0), 0);
  const endingSoon = activeItems.filter((l) => {
    const d = new Date(l.endTime).getTime() - Date.now();
    return d > 0 && d < 3 * 3_600_000;
  });

  const pts       = user?.totalPoints ?? 0;
  const aiCredits = (user as any)?.aiCredits ?? 0;
  const isVerified = (user as any)?.isVerified ?? false;
  const tier      = getTier(pts);
  const progress  = getTierProgress(pts);
  const tierIdx   = TIERS.findIndex((t) => t.name === tier.name);
  const nextTier  = tierIdx + 1 < TIERS.length ? TIERS[tierIdx + 1] : null;
  const ptsToNext = nextTier ? nextTier.min - pts : 0;
  const subTier   = (user?.subscriptionTier ?? "free").toLowerCase();
  const daysLeft  = getDaysLeft(user?.subscriptionExpiry ?? null);
  const isPaid    = subTier !== "free";
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7;
  const dot       = tier.color;
  const sub       = SUB_LABELS[subTier] ?? SUB_LABELS.free;
  const rankData  = GAME_RANKINGS[rankTab];

  const TAB_LABELS: Record<ContentTab, string> = {
    listings:   `Active Listings${!loading && stats.active > 0 ? ` · ${stats.active}` : ""}`,
    collection: `My Collection${collection.length > 0 ? ` · ${collection.length}` : ""}`,
    favorites:  "Favorites",
    bids:       "My Bids",
  };

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#f9f8f6", minHeight: "100%" }}>

      {/* ═══ HERO — dark ════════════════════════════════════════════════════ */}
      <header
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0f0e0b 0%, #16121e 55%, #100e0b 100%)",
          borderBottom: "1px solid #1f1e1b",
        }}
      >
        {/* Ambient glows */}
        <div className="absolute pointer-events-none" style={{ top: -100, right: -60, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)" }} />
        <div className="absolute pointer-events-none" style={{ top: 20, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ bottom: -40, right: "35%", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)" }} />

        <div className="relative flex items-stretch">
          {/* ── LEFT: identity ── */}
          <div className="flex-1 flex flex-col px-6 py-6 min-w-0 gap-5">

            {/* Row 1: date + actions */}
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
                {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <div className="flex items-center gap-2">
                {isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold" style={{ color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)", background: "rgba(74,222,128,0.08)" }}>
                    ✓ Account Verified
                  </span>
                ) : (
                  <Link href="/settings" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold hover:opacity-80" style={{ color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)", background: "rgba(251,146,60,0.08)" }}>
                    ⚠ Verify account
                  </Link>
                )}
                <Link href="/add-listing" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-black text-white hover:opacity-90" style={{ background: "#dc2626" }}>
                  <PlusCircle size={12} /> New Listing
                </Link>
              </div>
            </div>

            {/* Row 2: greeting */}
            <div className="flex flex-col gap-4">
              <h1 className="font-black leading-none" style={{ fontSize: "clamp(2.2rem,4.8vw,3.6rem)", letterSpacing: "-0.04em", color: "rgba(255,255,255,0.88)" }}>
                {greeting},<br />
                <span style={{
                  background: "linear-gradient(90deg, #fbbf24 0%, #f97316 45%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  {displayName}
                </span>
              </h1>

              {/* Single info strip: plan · loyalty · ai credits */}
              <div className="flex items-center gap-3 flex-wrap">

                {/* Plan */}
                {isPaid ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-full" style={{ background: sub.bg, color: sub.color }}>
                    {sub.icon} {sub.label}{daysLeft !== null ? ` · ${daysLeft}d` : ""}{isExpiringSoon ? " ⚠" : ""}
                  </span>
                ) : (
                  <>
                    <span className="text-[11px] font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}>
                      Free account
                    </span>
                    <Link href="/pricing" className="inline-flex items-center gap-1 text-[11px] font-black px-3 py-1.5 rounded-full transition-all hover:opacity-90" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                      <Zap size={10} /> Upgrade
                    </Link>
                  </>
                )}

                <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

                {/* Loyalty */}
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-black tabular-nums" style={{ color: dot }}>{pts.toLocaleString()}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${dot}20`, color: dot }}>{tier.name}</span>
                  {nextTier && <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.22)" }}>{ptsToNext.toLocaleString()} to {nextTier.name}</span>}
                </div>

                <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

                {/* AI Credits */}
                <div className="flex items-center gap-2">
                  <Zap size={10} style={{ color: aiCredits === 0 ? "#f87171" : "#38bdf8" }} />
                  <span className="text-[14px] font-black tabular-nums" style={{ color: aiCredits === 0 ? "#f87171" : "#38bdf8" }}>{aiCredits}</span>
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.28)" }}>credits</span>
                  <Link href="/rewards"
                    className="text-[10px] font-black px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                    style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>
                    Check rewards →
                  </Link>
                </div>

              </div>
            </div>

          </div>

          {/* ── RIGHT: stats ── */}
          <div className="flex-shrink-0 w-[42%] grid grid-cols-2" style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { label: "Active Listings", value: loading ? "–" : stats.active,      color: "#4ade80", note: "currently live",    pulse: true  },
              { label: "Bids Received",   value: loading ? "–" : totalBidsReceived, color: "#a78bfa", note: "on your items",     pulse: false },
              { label: "Items Sold",      value: loading ? "–" : stats.sold,        color: "#f87171", note: "all time",          pulse: false },
              { label: "AI Credits",      value: aiCredits,                          color: aiCredits === 0 ? "#f87171" : "#38bdf8", note: aiCredits === 0 ? "buy credits →" : "never expire", pulse: false },
            ].map((s, i) => (
              <div key={s.label} className="flex flex-col justify-between px-5 py-5 relative"
                style={{ borderTop: i >= 2 ? "1px solid rgba(255,255,255,0.07)" : undefined, borderLeft: i % 2 === 1 ? "1px solid rgba(255,255,255,0.07)" : undefined }}>
                <div className="flex items-center gap-1.5 mb-3">
                  {s.pulse && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />}
                  <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</p>
                </div>
                <p className="text-[2.6rem] font-black tabular-nums leading-none" style={{ color: s.color, letterSpacing: "-0.05em" }}>
                  {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
                </p>
                <p className="text-[9px] mt-2 font-medium" style={{ color: "rgba(255,255,255,0.2)" }}>{s.note}</p>
                <div className="absolute bottom-0 left-5 right-5 h-px rounded-full opacity-30" style={{ background: s.color }} />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ═══ MAIN GRID ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-0">

        {/* LEFT — tabbed ───────────────────────────────────────────────────── */}
        <section className="lg:col-span-3" style={{ borderRight: "1px solid #e6e3da" }}>

          {/* Tabs */}
          <div className="flex items-center gap-0.5 px-6 pt-5 pb-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {(["listings", "collection", "favorites", "bids"] as const).map((tab) => (
              <button key={tab} onClick={() => setContentTab(tab)}
                className="px-3.5 py-2 rounded-xl text-[11px] font-black tracking-wide transition-all whitespace-nowrap"
                style={contentTab === tab ? { background: "#0d0c09", color: "#fff" } : { background: "transparent", color: "#a8a49a" }}>
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
          <div className="mx-6 mt-3" style={{ height: 1, background: "#edeae2" }} />

          <div className="px-6 py-5">

            {/* ── Active Listings ── */}
            {contentTab === "listings" && (
              <>
                {loading ? (
                  <div className="space-y-5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-0.5 h-14 rounded-full flex-shrink-0 bg-gray-200" />
                        <div className="w-14 h-14 rounded-xl flex-shrink-0 bg-gray-100" />
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
                ) : activeItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="text-5xl mb-4">📦</div>
                    <p className="text-sm font-black mb-1" style={{ color: "#0d0c09" }}>No active listings yet</p>
                    <p className="text-xs mb-5" style={{ color: "#a8a49a" }}>List your first jersey and start selling</p>
                    <Link href="/add-listing" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white hover:opacity-90" style={{ background: "#dc2626" }}>
                      <PlusCircle size={14} /> Create listing
                    </Link>
                  </div>
                ) : (
                  <div>
                    {activeItems.map((listing, idx) => {
                      const thumb = listing.images?.[0] ?? null;
                      const countdown = formatCountdown(listing.endTime);
                      const bids = listing.bidCount || (listing as any)._count?.bids || 0;
                      const isAuction = listing.listingType === "auction" || listing.listingType === "auction_buy_now";
                      return (
                        <Link key={listing.id} href={`/auction/${listing.id}`}
                          className="group flex items-center gap-4 py-4 -mx-2 px-2 rounded-2xl transition-all hover:bg-white hover:shadow-sm"
                          style={{ borderTop: idx > 0 ? "1px solid #f0ede6" : undefined }}>
                          <div className="w-0.5 h-12 rounded-full flex-shrink-0" style={{ background: countdown.urgent ? "#dc2626" : "#16a34a" }} />
                          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative bg-gray-100">
                            {thumb ? <Image src={thumb} alt={listing.title} fill className="object-cover" sizes="56px" />
                              : <div className="w-full h-full flex items-center justify-center"><Tag size={16} className="text-gray-300" /></div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black truncate" style={{ color: "#0d0c09" }}>{listing.title}</p>
                            <p className="text-[11px] mt-0.5" style={{ color: "#a8a49a" }}>{listing.team}{listing.season ? ` · ${listing.season}` : ""}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-[10px]" style={{ color: "#c0bbb4" }}>
                              <span className={countdown.urgent ? "text-red-600 font-bold" : ""}><Clock size={9} className="inline mr-0.5 -mt-px" />{countdown.label}</span>
                              {isAuction && <span><Gavel size={9} className="inline mr-0.5 -mt-px" />{bids}</span>}
                              <span><Eye size={9} className="inline mr-0.5 -mt-px" />{listing.views ?? 0}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-base font-black" style={{ color: "#0d0c09", letterSpacing: "-0.03em" }}>{formatPrice(listing.currentBid)}</p>
                            {listing.buyNowPrice && <p className="text-[10px] font-black mt-0.5" style={{ color: "#16a34a" }}>BIN {formatPrice(listing.buyNowPrice)}</p>}
                          </div>
                          <ChevronRight size={13} className="flex-shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: "#d1cec7" }} />
                        </Link>
                      );
                    })}
                    {endingSoon.length > 0 && (
                      <div className="flex items-center gap-2 pt-3 mt-1" style={{ borderTop: "1px solid #f0ede6" }}>
                        <Clock size={10} className="text-red-500 flex-shrink-0" />
                        <p className="text-xs font-bold text-red-600">{endingSoon.length} listing{endingSoon.length > 1 ? "s" : ""} ending within 3 hours</p>
                      </div>
                    )}
                    <button onClick={() => onTabChange("listings")}
                      className="mt-5 w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all hover:bg-gray-900 hover:text-white"
                      style={{ border: "1px solid #e6e3da", color: "#a8a49a" }}>
                      View all listings →
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── My Collection ── */}
            {contentTab === "collection" && (
              <>
                {collectionLoading ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {[1,2,3,4,5,6].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-[3/4] rounded-xl bg-gray-100 mb-2" />
                        <div className="h-2.5 rounded bg-gray-100 w-3/4 mb-1" />
                        <div className="h-2 rounded bg-gray-100 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : collection.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="text-5xl mb-4">🎽</div>
                    <p className="text-sm font-black mb-1" style={{ color: "#0d0c09" }}>Your collection is empty</p>
                    <p className="text-xs mb-5" style={{ color: "#a8a49a" }}>Add jerseys you own to showcase your collection</p>
                    <button onClick={() => onTabChange("collection")} className="px-5 py-2.5 rounded-xl text-xs font-black text-white" style={{ background: "#0d0c09" }}>+ Add item</button>
                  </div>
                ) : (
                  <>
                    {collectionTotalValue > 0 && (
                      <p className="text-xs font-bold mb-4" style={{ color: "#a8a49a" }}>
                        {collection.length} items · Est. <span className="font-black" style={{ color: "#0d0c09" }}>{formatPrice(collectionTotalValue)}</span>
                      </p>
                    )}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {collectionPreview.map((item) => {
                        const r = RARITY[item.rarity] ?? RARITY.common;
                        const thumb = item.images?.[0] ?? null;
                        return (
                          <button key={item.id} onClick={() => onTabChange("collection")} className="group text-left">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden relative mb-2 bg-gray-100 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md" style={{ border: `1.5px solid ${r.border}` }}>
                              {thumb ? <Image src={thumb} alt={item.title} fill className="object-cover" sizes="120px" />
                                : <div className="w-full h-full flex items-center justify-center text-2xl">🎽</div>}
                              {(item as any).isVintage && <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 text-white text-[7px] font-black rounded uppercase tracking-wider">Vintage</span>}
                              <div className="absolute bottom-1.5 left-1.5">
                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full" style={{ background: r.bg, color: r.color }}>{r.label}</span>
                              </div>
                            </div>
                            <p className="text-[11px] font-black truncate leading-tight" style={{ color: "#0d0c09" }}>{item.title}</p>
                            {item.estimatedValue != null && item.estimatedValue > 0 && <p className="text-[10px] mt-0.5" style={{ color: "#a8a49a" }}>~{formatPrice(item.estimatedValue)}</p>}
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={() => onTabChange("collection")} className="mt-5 w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all hover:bg-gray-900 hover:text-white" style={{ border: "1px solid #e6e3da", color: "#a8a49a" }}>
                      View full collection →
                    </button>
                  </>
                )}
              </>
            )}

            {/* ── Favorites ── */}
            {contentTab === "favorites" && (
              <>
                {favLoading ? (
                  <div className="space-y-4">
                    {[1,2,3].map((i) => (
                      <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-0.5 h-14 rounded-full flex-shrink-0 bg-gray-200" />
                        <div className="w-14 h-14 rounded-xl flex-shrink-0 bg-gray-100" />
                        <div className="flex-1 space-y-2 pt-1"><div className="h-3.5 rounded bg-gray-100 w-3/4" /><div className="h-2.5 rounded bg-gray-100 w-1/2" /></div>
                      </div>
                    ))}
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#fce7f3" }}>
                      <Heart size={22} className="text-pink-500" />
                    </div>
                    <p className="text-sm font-black mb-1" style={{ color: "#0d0c09" }}>No favorites yet</p>
                    <p className="text-xs mb-6" style={{ color: "#a8a49a" }}>Heart listings you love to save them here</p>
                    <Link href="/auctions" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white hover:opacity-90" style={{ background: "#0d0c09" }}>
                      Browse listings <ArrowRight size={12} />
                    </Link>
                  </div>
                ) : (
                  <div>
                    {favorites.map((item, idx) => {
                      const thumb = item.images?.[0] ?? null;
                      const countdown = formatCountdown(item.endTime);
                      return (
                        <Link key={item.id} href={`/auction/${item.id}`}
                          className="group flex items-center gap-4 py-4 -mx-2 px-2 rounded-2xl transition-all hover:bg-white hover:shadow-sm"
                          style={{ borderTop: idx > 0 ? "1px solid #f0ede6" : undefined }}>
                          <div className="w-0.5 h-12 rounded-full flex-shrink-0" style={{ background: "#f472b6" }} />
                          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative bg-gray-100">
                            {thumb ? <Image src={thumb} alt={item.title} fill className="object-cover" sizes="56px" />
                              : <div className="w-full h-full flex items-center justify-center"><Heart size={16} className="text-pink-300" /></div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black truncate" style={{ color: "#0d0c09" }}>{item.title}</p>
                            <p className="text-[11px] mt-0.5" style={{ color: "#a8a49a" }}>{item.team}{item.season ? ` · ${item.season}` : ""}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-[10px]" style={{ color: "#c0bbb4" }}>
                              <span className={countdown.urgent ? "text-red-600 font-bold" : ""}><Clock size={9} className="inline mr-0.5 -mt-px" />{countdown.label}</span>
                              {item.bidCount != null && <span><Gavel size={9} className="inline mr-0.5 -mt-px" />{item.bidCount}</span>}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-base font-black" style={{ color: "#0d0c09", letterSpacing: "-0.03em" }}>{formatPrice(item.currentBid)}</p>
                            {item.buyNowPrice && <p className="text-[10px] font-black mt-0.5" style={{ color: "#16a34a" }}>BIN {formatPrice(item.buyNowPrice)}</p>}
                          </div>
                          <ChevronRight size={13} className="flex-shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: "#d1cec7" }} />
                        </Link>
                      );
                    })}
                    <button onClick={() => onTabChange("collection")} className="mt-5 w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all hover:bg-gray-900 hover:text-white" style={{ border: "1px solid #e6e3da", color: "#a8a49a" }}>
                      Browse more →
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── My Bids ── */}
            {contentTab === "bids" && (
              <>
                {bidsLoading ? (
                  <div className="space-y-4">
                    {[1,2,3].map((i) => (
                      <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-0.5 h-14 rounded-full flex-shrink-0 bg-gray-200" />
                        <div className="w-14 h-14 rounded-xl flex-shrink-0 bg-gray-100" />
                        <div className="flex-1 space-y-2 pt-1"><div className="h-3.5 rounded bg-gray-100 w-3/4" /><div className="h-2.5 rounded bg-gray-100 w-1/2" /></div>
                        <div className="w-16 space-y-1.5 pt-1"><div className="h-4 rounded bg-gray-100" /><div className="h-3 rounded bg-gray-100 w-2/3 ml-auto" /></div>
                      </div>
                    ))}
                  </div>
                ) : activeBids.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#ede9fe" }}>
                      <Gavel size={22} className="text-violet-500" />
                    </div>
                    <p className="text-sm font-black mb-1" style={{ color: "#0d0c09" }}>No active bids</p>
                    <p className="text-xs mb-6" style={{ color: "#a8a49a" }}>Auctions you&apos;re currently bidding on will appear here</p>
                    <Link href="/auctions" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white hover:opacity-90" style={{ background: "#0d0c09" }}>
                      Browse auctions <ArrowRight size={12} />
                    </Link>
                  </div>
                ) : (
                  <div>
                    {activeBids.map((entry, idx) => {
                      const countdown = formatCountdown(entry.auction.endTime);
                      const gap = entry.currentBid - entry.myBidAmount;
                      return (
                        <Link key={entry.bidId} href={`/auction/${entry.auction.id}`}
                          className="group flex items-center gap-4 py-4 -mx-2 px-2 rounded-2xl transition-all hover:bg-white hover:shadow-sm"
                          style={{ borderTop: idx > 0 ? "1px solid #f0ede6" : undefined }}>
                          <div className="w-0.5 h-12 rounded-full flex-shrink-0" style={{ background: entry.isWinning ? "#16a34a" : "#dc2626" }} />
                          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative bg-gray-100">
                            {entry.auction.image
                              ? <Image src={entry.auction.image} alt={entry.auction.title} fill className="object-cover" sizes="56px" />
                              : <div className="w-full h-full flex items-center justify-center"><Gavel size={16} className="text-gray-300" /></div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black truncate" style={{ color: "#0d0c09" }}>{entry.auction.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {entry.isWinning
                                ? <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><TrendingUp size={9} />Winning</span>
                                : <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full"><AlertCircle size={9} />Outbid +{formatPrice(gap)}</span>}
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-[10px]" style={{ color: "#c0bbb4" }}>
                              <span className={countdown.urgent ? "text-red-600 font-bold" : ""}><Clock size={9} className="inline mr-0.5 -mt-px" />{countdown.label}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-[10px] font-bold mb-0.5" style={{ color: "#a8a49a" }}>My bid</p>
                            <p className="text-base font-black" style={{ color: "#0d0c09", letterSpacing: "-0.03em" }}>{formatPrice(entry.myBidAmount)}</p>
                            {!entry.isWinning && <p className="text-[10px] font-black mt-0.5" style={{ color: "#dc2626" }}>Now {formatPrice(entry.currentBid)}</p>}
                          </div>
                          <ChevronRight size={13} className="flex-shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: "#d1cec7" }} />
                        </Link>
                      );
                    })}
                    <button onClick={() => onTabChange("bids")} className="mt-5 w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all hover:bg-gray-900 hover:text-white" style={{ border: "1px solid #e6e3da", color: "#a8a49a" }}>
                      View full bid history →
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

          {/* ── AI Tools — inside left column, flush after content ── */}
          <div style={{ borderTop: "1px solid #edeae2" }}>
            <div className="flex items-center justify-between px-6 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Sparkles size={10} className="text-white" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: "#78766e" }}>AI Tools</p>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: "#ede9fe", color: "#6d28d9" }}>
                  {aiCredits} credits
                </span>
              </div>
              <button
                onClick={() => onTabChange("aitools")}
                className="text-[11px] font-bold flex items-center gap-1 transition-colors hover:text-black"
                style={{ color: "#a8a49a" }}
              >
                All tools <ArrowRight size={11} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 px-5 py-4" style={{ borderTop: "1px solid #edeae2", background: "#f9f8f6" }}>
              {AI_TOOLS.map((tool) => {
                const canAfford = aiCredits >= tool.credits;
                const tile = (
                  <div
                    className="group relative overflow-hidden rounded-2xl flex flex-col justify-between p-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{
                      background: tool.grad,
                      boxShadow: `0 4px 20px ${tool.glow}`,
                      aspectRatio: "1",
                      opacity: tool.available ? 1 : 0.7,
                    }}
                  >
                    {/* Shine overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />

                    {/* Top: icon + credits */}
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                        <tool.icon size={16} className="text-white" />
                      </div>
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.8)" }}>
                        <Zap size={7} />
                        {tool.credits}
                      </span>
                    </div>

                    {/* Bottom: name + tagline + cta */}
                    <div>
                      <p className="text-[13px] font-black text-white leading-tight mb-1">{tool.name}</p>
                      <p className="text-[9px] leading-snug mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>{tool.desc}</p>
                      {tool.available ? (
                        canAfford ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black text-white/80 group-hover:text-white transition-colors">
                            Use now <ArrowRight size={8} className="transition-transform group-hover:translate-x-0.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold" style={{ color: "rgba(255,255,255,0.55)" }}>
                            <Zap size={8} /> Need {tool.credits} cr.
                          </span>
                        )
                      ) : (
                        <span className="text-[9px] font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>Coming soon</span>
                      )}
                    </div>
                  </div>
                );
                if (!tool.available || !canAfford) return <div key={tool.id}>{tile}</div>;
                return <Link key={tool.id} href={tool.href}>{tile}</Link>;
              })}
            </div>
          </div>

        </section>

        {/* RIGHT — games + rankings ───────────────────────────────────────── */}
        <aside className="lg:col-span-2 flex flex-col">
          <div className="px-5 pt-6 pb-2">
            <button onClick={() => setSpinOpen(true)}
              className="group w-full text-left rounded-2xl p-5 transition-all hover:opacity-[0.97] active:scale-[0.99]"
              style={{ background: "linear-gradient(140deg, #111010 0%, #1e1c18 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-[1.75rem] leading-none select-none">🎡</span>
                <span className="text-[9px] font-black px-2 py-1 rounded-full" style={{ background: "#fef3c7", color: "#b45309" }}>FREE · DAILY</span>
              </div>
              <p className="text-[15px] font-black text-white mb-1">Daily Spin</p>
              <p className="text-[11px] mb-4" style={{ color: "#666" }}>Win points &amp; prizes every day</p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black" style={{ color: "#fbbf24" }}>Spin now <ArrowRight size={11} /></span>
            </button>
          </div>

          <div className="px-5 py-4" style={{ borderBottom: "1px solid #e6e3da" }}>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: "#b0aa9f" }}>Today&apos;s Games</p>
            <div className="space-y-0.5">
              {([
                { emoji: "⬡",  label: "Tiki-Taka Toe",  sub: "9 squares · 500 pts",  tag: "DAILY",  tagBg: "#ede9fe", tagColor: "#6d28d9", href: "/arena/games/tiki-taka-toe" },
                { emoji: "⚽", label: "Football Bingo",  sub: "Mark live events",      tag: "LIVE",   tagBg: "#dcfce7", tagColor: "#15803d", href: "/arena" },
                { emoji: "📅", label: "Predictor",       sub: "8 matches · tip now",   tag: "WEEKLY", tagBg: "#fce7f3", tagColor: "#be185d", href: "/arena" },
              ] as const).map((g) => (
                <Link key={g.label} href={g.href} className="group flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-xl transition-all hover:bg-white hover:shadow-sm">
                  <span className="text-lg w-7 text-center flex-shrink-0 leading-none select-none">{g.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black leading-tight" style={{ color: "#0d0c09" }}>{g.label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#a8a49a" }}>{g.sub}</p>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: g.tagBg, color: g.tagColor }}>{g.tag}</span>
                </Link>
              ))}
            </div>
            <Link href="/arena" className="group mt-4 flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-gray-50" style={{ border: "1px solid #e6e3da" }}>
              <Trophy size={14} className="text-amber-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black" style={{ color: "#0d0c09" }}>Matchdays Arena</p>
                <p className="text-[10px]" style={{ color: "#a8a49a" }}>Predict · Compete · Win</p>
              </div>
              <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" style={{ color: "#c0bbb4" }} />
            </Link>
          </div>

          <div className="px-5 py-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5" style={{ color: "#78766e" }}>
                <Trophy size={11} className="text-amber-500" /> Rankings
              </h3>
              <div className="flex gap-px rounded-lg overflow-hidden" style={{ border: "1px solid #e6e3da" }}>
                {(["weekly", "monthly"] as const).map((tab) => (
                  <button key={tab} onClick={() => setRankTab(tab)}
                    className="px-3 py-1 text-[10px] font-black uppercase tracking-wide transition-all"
                    style={rankTab === tab ? { background: "#0d0c09", color: "#fff" } : { background: "#fff", color: "#a8a49a" }}>
                    {tab === "weekly" ? "Week" : "Month"}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {rankData.map((gd) => (
                <div key={gd.game}>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] mb-2" style={{ color: gd.color }}>{gd.emoji} {gd.game}</p>
                  <div className="space-y-px">
                    {gd.leaders.map((p) => (
                      <div key={p.rank} className="flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-lg transition-colors hover:bg-white">
                        <div className="w-4 flex items-center justify-center flex-shrink-0">
                          {p.rank <= 3 ? <Medal size={11} style={{ color: MEDAL_COLORS[p.rank - 1] }} /> : <span className="text-[10px] font-black" style={{ color: "#c0bbb4" }}>{p.rank}</span>}
                        </div>
                        <span className="text-xs font-bold flex-1 truncate" style={{ color: "#0d0c09" }}>{p.username}</span>
                        <span className="text-[11px] font-black tabular-nums" style={{ color: gd.color }}>{p.score}</span>
                        <span className="w-3.5 flex items-center justify-center">
                          {p.change > 0 ? <TrendingUp size={9} className="text-emerald-600" /> : p.change < 0 ? <TrendingDown size={9} className="text-red-500" /> : <Minus size={9} className="text-gray-300" />}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid #edeae2" }}>
              <span className="text-[10px] font-bold flex items-center gap-1.5" style={{ color: "#7c3aed" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />You · {pts.toLocaleString()} pts
              </span>
              <Link href="/arena" className="text-[10px] font-bold transition-colors hover:text-black" style={{ color: "#a8a49a" }}>Full ranking →</Link>
            </div>
          </div>
        </aside>
      </div>

      {spinOpen && <DailySpinModal onClose={() => setSpinOpen(false)} />}
    </div>
  );
}
