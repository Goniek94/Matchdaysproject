"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/context/AuthContext";
import {
  getMyCollection,
  deleteCollectionItem,
  updateCollectionItem,
  type CollectionItemDto,
} from "@/lib/api/collection";
import {
  Plus,
  Package,
  Eye,
  EyeOff,
  Trash2,
  Gavel,
  Crown,
  Zap,
  Star,
  Globe,
  Pencil,
} from "lucide-react";

// ─── Rarity helpers ───────────────────────────────────────────────────────────

const RARITY_COLOR: Record<string, string> = {
  common: "text-gray-500 bg-gray-100 border-gray-200",
  rare: "text-blue-700 bg-blue-50 border-blue-200",
  epic: "text-purple-700 bg-purple-50 border-purple-200",
  legendary: "text-amber-700 bg-amber-50 border-amber-200",
};
const RARITY_ICON: Record<string, React.ReactNode> = {
  common: <Package size={12} />,
  rare: <Star size={12} />,
  epic: <Zap size={12} />,
  legendary: <Crown size={12} />,
};

// ─── Card ─────────────────────────────────────────────────────────────────────

function ItemCard({
  item,
  onDelete,
  onToggleVisibility,
}: {
  item: CollectionItemDto;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
}) {
  const router = useRouter();
  const rarityClass = RARITY_COLOR[item.rarity] ?? RARITY_COLOR.common;
  const rarityIcon = RARITY_ICON[item.rarity] ?? RARITY_ICON.common;

  const handleListOnAuction = () => {
    // Pre-fill add-listing form via URL params
    const params = new URLSearchParams({
      title: item.title,
      description: item.description ?? "",
      team: item.team ?? "",
      season: item.season ?? "",
      category: item.category ?? "",
      itemType: item.itemType ?? "shirt",
      condition: item.condition ?? "",
      manufacturer: item.manufacturer ?? "",
      playerName: item.playerName ?? "",
      fromCollection: item.id,
    });
    router.push(`/add-listing?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
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
            <Package size={32} className="text-gray-200" />
          </div>
        )}
        {/* Visibility badge */}
        <button
          onClick={() => onToggleVisibility(item.id, !item.isPublic)}
          title={item.isPublic ? "Make private" : "Make public"}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-colors ${
            item.isPublic
              ? "bg-emerald-100/90 text-emerald-700 hover:bg-emerald-200/90"
              : "bg-gray-100/90 text-gray-500 hover:bg-gray-200/90"
          }`}
        >
          {item.isPublic ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>
        {/* Rarity badge */}
        <span
          className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${rarityClass}`}
        >
          {rarityIcon}
          {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">
          {item.title}
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          {[item.team, item.season].filter(Boolean).join(" · ") || "—"}
        </p>

        <div className="flex items-center justify-between mb-3">
          {item.estimatedValue ? (
            <span className="text-sm font-bold text-gray-900">
              ~€{Number(item.estimatedValue).toLocaleString()}
            </span>
          ) : (
            <span className="text-xs text-gray-300">No estimate</span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Eye size={11} /> {item.views}
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleListOnAuction}
            className="w-full flex items-center justify-center gap-2 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors"
          >
            <Gavel size={13} /> List on Auction
          </button>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/collection/item/${item.id}/edit`}
              className="flex items-center justify-center gap-1 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl hover:border-gray-400 transition-colors"
            >
              <Pencil size={12} /> Edit
            </Link>
            <button
              onClick={() => onDelete(item.id)}
              className="flex items-center justify-center gap-1 py-2 border border-red-100 text-red-500 text-xs font-semibold rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyCollectionPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<CollectionItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getMyCollection()
      .then((res) => {
        if (res.success && res.data) setItems(res.data);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this item from your collection?")) return;
    const res = await deleteCollectionItem(id);
    if (res.success) setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleToggleVisibility = async (id: string, isPublic: boolean) => {
    const res = await updateCollectionItem(id, { isPublic });
    if (res.success)
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isPublic } : i)),
      );
  };

  const filtered = items.filter((i) => {
    if (filter === "public") return i.isPublic;
    if (filter === "private") return !i.isPublic;
    return true;
  });

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-light tracking-tight mb-1">
              My Collection
            </h1>
            <p className="text-gray-500 text-sm">
              {items.length} items ·{" "}
              <Link
                href={`/collection/${user?.username}`}
                className="text-black underline"
              >
                View public showcase →
              </Link>
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href={`/collection/${user?.username}`}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:border-gray-400 transition-colors"
            >
              <Globe size={15} /> Public view
            </Link>
            <Link
              href="/collection/add"
              className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              <Plus size={15} /> Add Item
            </Link>
          </div>
        </div>

        {/* Filter tabs */}
        {items.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {(["all", "public", "private"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  filter === f
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} (
                {f === "all"
                  ? items.length
                  : f === "public"
                    ? items.filter((i) => i.isPublic).length
                    : items.filter((i) => !i.isPublic).length}
                )
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 py-24 text-center">
            <Package size={56} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Your collection is empty
            </h2>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              Start adding jerseys, boots, signed items — anything you want to
              show off.
            </p>
            <Link
              href="/collection/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} /> Add first item
            </Link>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
