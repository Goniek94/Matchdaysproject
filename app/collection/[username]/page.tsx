"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getCollectionByUsername,
  getCollectionStats,
  type CollectionItemDto,
  type CollectionUserDto,
  type CollectionStatsDto,
} from "@/lib/api/collection";
import { useAuth } from "@/lib/context/AuthContext";
import {
  Trophy,
  Eye,
  Star,
  Shield,
  Package,
  Gem,
  Crown,
  Zap,
  Plus,
  ArrowRight,
  Globe,
} from "lucide-react";

// ─── Rarity config ────────────────────────────────────────────────────────────

const RARITY: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  common: {
    label: "Common",
    color: "text-gray-600",
    bg: "bg-gray-100",
    border: "border-gray-200",
    icon: <Package size={13} />,
  },
  rare: {
    label: "Rare",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: <Star size={13} />,
  },
  epic: {
    label: "Epic",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: <Zap size={13} />,
  },
  legendary: {
    label: "Legendary",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <Crown size={13} />,
  },
};

const rarity = (r: string) =>
  RARITY[r] ?? RARITY.common;

// ─── Item card ────────────────────────────────────────────────────────────────

function ItemCard({ item }: { item: CollectionItemDto }) {
  const r = rarity(item.rarity);
  return (
    <Link
      href={`/collection/item/${item.id}`}
      className={`group relative bg-white rounded-2xl border-2 ${r.border} overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {item.images?.[0] ? (
          <Image
            src={item.images[0]}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={40} className="text-gray-200" />
          </div>
        )}
        {/* Rarity badge */}
        <span
          className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${r.color} ${r.bg} border ${r.border}`}
        >
          {r.icon}
          {r.label}
        </span>
        {/* Vintage badge */}
        {item.isVintage && (
          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
            Vintage
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">
          {item.title}
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          {[item.team, item.season].filter(Boolean).join(" · ") || "—"}
        </p>

        <div className="flex items-center justify-between">
          {item.estimatedValue ? (
            <span className="text-sm font-bold text-gray-900">
              ~€{Number(item.estimatedValue).toLocaleString()}
            </span>
          ) : (
            <span className="text-xs text-gray-300">No estimate</span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Eye size={12} /> {item.views}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CollectionPage() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();

  const [collection, setCollection] = useState<CollectionUserDto | null>(null);
  const [stats, setStats] = useState<CollectionStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const isOwn = user?.username === username;

  useEffect(() => {
    if (!username) return;
    Promise.all([
      getCollectionByUsername(username as string),
      getCollectionStats(username as string),
    ])
      .then(([col, st]) => {
        if (col.success && col.data) setCollection(col.data);
        if (st.success && st.data) setStats(st.data);
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-2xl font-light mb-2">Collection not found</h2>
          <Link href="/auctions" className="text-black underline text-sm">
            Browse auctions
          </Link>
        </div>
      </div>
    );
  }

  const items = collection.collectionItems;
  const filtered =
    filter === "all" ? items : items.filter((i) => i.rarity === filter);

  const rarityFilters = ["all", "legendary", "epic", "rare", "common"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero banner ── */}
      <div className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-3xl font-black flex-shrink-0 overflow-hidden">
              {collection.avatar ? (
                <Image
                  src={collection.avatar}
                  alt={collection.username}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                collection.username[0].toUpperCase()
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-black tracking-tight">
                  {collection.username}
                </h1>
                {collection.isVerified && (
                  <Shield size={20} className="text-blue-400" />
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-white/60 text-sm">
                {collection.country && (
                  <span className="flex items-center gap-1">
                    <Globe size={13} /> {collection.country}
                  </span>
                )}
                <span>⭐ {collection.rating?.toFixed(1)} ({collection.reviews} reviews)</span>
                <span>Member since {new Date(collection.createdAt).getFullYear()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {isOwn ? (
                <Link
                  href="/collection/add"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} /> Add Item
                </Link>
              ) : (
                <Link
                  href={`/collection/mine`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white border border-white/20 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors"
                >
                  My Collection <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>

          {/* Stats row */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
              {[
                { label: "Items", value: stats.total, icon: <Package size={16} /> },
                { label: "Total views", value: stats.totalViews.toLocaleString(), icon: <Eye size={16} /> },
                { label: "Est. value", value: `€${stats.totalValue.toLocaleString()}`, icon: <Gem size={16} /> },
                {
                  label: "Legendaries",
                  value: stats.byRarity?.legendary ?? 0,
                  icon: <Crown size={16} />,
                },
              ].map(({ label, value, icon }) => (
                <div key={label}>
                  <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
                    {icon} {label}
                  </div>
                  <div className="text-2xl font-black">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Filter tabs */}
        {items.length > 0 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
            {rarityFilters.map((r) => {
              const cfg = r !== "all" ? rarity(r) : null;
              const count =
                r === "all"
                  ? items.length
                  : items.filter((i) => i.rarity === r).length;
              if (count === 0 && r !== "all") return null;
              return (
                <button
                  key={r}
                  onClick={() => setFilter(r)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    filter === r
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {cfg?.icon}
                  {r === "all" ? "All" : cfg?.label} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <Trophy size={52} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {isOwn ? "Your collection is empty" : "No items in this collection"}
            </h2>
            {isOwn && (
              <Link
                href="/collection/add"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Plus size={16} /> Add your first item
              </Link>
            )}
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {filtered.length === 0 && items.length > 0 && (
          <div className="text-center py-12 text-gray-400">
            No {filter} items in this collection.
          </div>
        )}
      </div>
    </div>
  );
}
