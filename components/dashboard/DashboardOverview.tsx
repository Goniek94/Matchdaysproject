import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Package,
  ShoppingBag,
  MessageCircle,
  PlusCircle,
  Tag,
  ArrowRight,
  Sparkles,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { DashboardTab } from "./DashboardSidebar";
import { DailySpinModal } from "./spin-wheel/DailySpinModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Listing {
  id: string | number;
  title: string;
  team?: string;
  season?: string;
  currentBid: number;
  status: string;
  images?: string[];
}

interface DashboardOverviewProps {
  greeting: string;
  displayName: string;
  activeListings: number;
  soldListings: number;
  totalListings: number;
  listings: Listing[];
  listingsLoading: boolean;
  onTabChange: (tab: DashboardTab) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
  }).format(value);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardOverview({
  greeting,
  displayName,
  activeListings,
  soldListings,
  totalListings,
  listings,
  listingsLoading,
  onTabChange,
}: DashboardOverviewProps) {
  const activeItems = listings.filter((l) => l.status === "active").slice(0, 4);
  const [spinOpen, setSpinOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* ── Welcome banner ── */}
      <div className="bg-gray-900 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(236,72,153,0.1),transparent_60%)]" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{greeting}</p>
            <h1 className="text-2xl font-black text-white mt-1 tracking-tight">
              {displayName} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Here&apos;s what&apos;s happening with your account today.
            </p>
          </div>
          <Link
            href="/add-listing"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <PlusCircle size={16} />
            New Listing
          </Link>
        </div>
      </div>

      {/* ── Daily Spin card ── */}
      <button
        onClick={() => setSpinOpen(true)}
        className="group w-full relative overflow-hidden rounded-2xl p-5 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
        style={{
          background:
            "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
          border: "1px solid rgba(245,158,11,0.3)",
          boxShadow: "0 0 30px rgba(245,158,11,0.08)",
        }}
      >
        {/* Animated glow on hover */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          {/* Wheel icon */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
              <span
                className="text-2xl select-none group-hover:animate-spin"
                style={{ animationDuration: "2s" }}
              >
                🎡
              </span>
            </div>
            {/* Pulse dot */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-gray-900">
              <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75" />
            </span>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-base font-black text-white">Daily Spin</p>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-wider border border-amber-500/30">
                FREE
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Spin the wheel once a day — win discounts, points & Premium Elite!
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-gray-900 font-black text-xs group-hover:bg-amber-400 transition-colors shadow-md">
            <Zap size={13} className="fill-current" />
            Spin!
          </div>
        </div>
      </button>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white mb-3">
            <Package size={18} />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {listingsLoading ? "–" : activeListings}
          </div>
          <div className="text-xs text-gray-400 font-medium mt-0.5">
            Active Listings
          </div>
          {activeListings > 0 && (
            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp size={11} />
              Live now
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
          <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white mb-3">
            <ShoppingBag size={18} />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {listingsLoading ? "–" : soldListings}
          </div>
          <div className="text-xs text-gray-400 font-medium mt-0.5">
            Items Sold
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white mb-3">
            <Tag size={18} />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {listingsLoading ? "–" : totalListings}
          </div>
          <div className="text-xs text-gray-400 font-medium mt-0.5">
            Total Listings
          </div>
        </div>
      </div>

      {/* ── Active listings preview ── */}
      <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900">Active Listings</h2>
          <button
            onClick={() => onTabChange("listings")}
            className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors"
          >
            View all
            <ArrowRight size={13} />
          </button>
        </div>

        {listingsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-xl bg-gray-50 animate-pulse"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : activeItems.length === 0 ? (
          <div className="text-center py-8">
            <Package size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400 font-medium mb-3">
              No active listings
            </p>
            <Link
              href="/add-listing"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors"
            >
              <PlusCircle size={14} />
              Create your first listing
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {activeItems.map((listing) => {
              const thumbnail = listing.images?.[0] ?? null;
              return (
                <Link
                  key={listing.id}
                  href={`/auction/${listing.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag size={16} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {listing.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {listing.team} · {listing.season}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-gray-900">
                      {formatPrice(listing.currentBid)}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">
                      Active
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bottom row: AI Tools + Arena ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* AI Tools shortcut */}
        <button
          onClick={() => onTabChange("aitools")}
          className="group bg-gray-900 rounded-2xl p-5 text-left hover:bg-black transition-colors relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.2),transparent_60%)]" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3">
              <Sparkles size={18} className="text-white" />
            </div>
            <h3 className="text-base font-black text-white">AI Tools</h3>
            <p className="text-xs text-gray-400 mt-1">
              Authenticate, price & describe your items with AI
            </p>
            <div className="flex items-center gap-1 mt-3 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
              Open tools
              <ArrowRight
                size={13}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </div>
          </div>
        </button>

        {/* Arena shortcut */}
        <Link
          href="/arena"
          className="group bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
              <Trophy size={18} className="text-yellow-300" />
            </div>
            <h3 className="text-base font-black text-white">Matchdays Arena</h3>
            <p className="text-xs text-white/70 mt-1">
              Predict results, climb the leaderboard & win prizes
            </p>
            <div className="flex items-center gap-1 mt-3 text-xs font-bold text-white/80 group-hover:text-white transition-colors">
              Enter Arena
              <ArrowRight
                size={13}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </div>
          </div>
        </Link>
      </div>

      {/* ── Messages shortcut ── */}
      <button
        onClick={() => onTabChange("messages")}
        className="w-full flex items-center gap-4 bg-white rounded-2xl border border-gray-200/60 p-5 hover:border-gray-300 transition-colors group text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
          <MessageCircle size={18} className="text-gray-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">Messages</p>
          <p className="text-xs text-gray-400">View your conversations</p>
        </div>
        <ArrowRight
          size={16}
          className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all"
        />
      </button>

      {/* ── Daily Spin modal ── */}
      {spinOpen && <DailySpinModal onClose={() => setSpinOpen(false)} />}
    </div>
  );
}
