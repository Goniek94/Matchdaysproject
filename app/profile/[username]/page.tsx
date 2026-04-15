"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getPublicUserProfile,
  type PublicUserProfile,
  type PublicAuction,
  type PublicCollectionItem,
  type PublicReview,
} from "@/lib/api/users";
import {
  Star, Gavel, Package, ChevronRight,
  ThumbsUp, ThumbsDown, Minus, ShoppingBag, Clock,
  MessageSquare, LayoutGrid, AlertTriangle, Ban,
  BadgeCheck, ArrowLeft, Truck,
} from "lucide-react";

// ─── Rank system ──────────────────────────────────────────────────────────────

function getRank(sales: number, pos: number) {
  if (sales >= 100 && pos >= 98) return { label: "Top Seller", color: "#F59E0B", bg: "#FEF3C7", icon: "🏆" };
  if (sales >= 50)               return { label: "Pro",        color: "#8B5CF6", bg: "#EDE9FE", icon: "⚡" };
  if (sales >= 20 && pos >= 95)  return { label: "Trusted",    color: "#10B981", bg: "#D1FAE5", icon: "✓" };
  if (sales >= 5)                return { label: "Active",     color: "#3B82F6", bg: "#DBEAFE", icon: "↑" };
  return                                { label: "New",         color: "#6B7280", bg: "#F3F4F6", icon: "·" };
}

// ─── Trust bar ───────────────────────────────────────────────────────────────

function TrustBar({ pos, reviews }: { pos: number; reviews: number }) {
  const pct = Math.min(100, Math.max(0, pos));
  const color = pct >= 95 ? "#10B981" : pct >= 80 ? "#F59E0B" : "#EF4444";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-500">Seller trust</span>
        <span className="text-xs font-bold" style={{ color }}>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-[11px] text-gray-400">Based on {reviews} {reviews === 1 ? "review" : "reviews"}</p>
    </div>
  );
}

// ─── Star rating ──────────────────────────────────────────────────────────────

function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </span>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────

function ReviewCard({ r }: { r: PublicReview }) {
  const sentimentIcon = r.sentiment === "positive"
    ? <span className="text-emerald-500"><ThumbsUp size={12} /></span>
    : r.sentiment === "negative"
    ? <span className="text-red-400"><ThumbsDown size={12} /></span>
    : <span className="text-gray-400"><Minus size={12} /></span>;

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      <Link href={`/profile/${r.reviewer.username}`}>
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 overflow-hidden flex-shrink-0">
          {r.reviewer.avatar
            ? <Image src={r.reviewer.avatar} alt="" width={36} height={36} className="object-cover w-full h-full" />
            : r.reviewer.username[0].toUpperCase()}
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Link href={`/profile/${r.reviewer.username}`} className="text-sm font-bold text-gray-900 hover:underline">
            {r.reviewer.username}
          </Link>
          <div className="flex items-center gap-1">{sentimentIcon}<Stars rating={r.rating} /></div>
          <span className="text-[11px] text-gray-400 ml-auto">
            {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
            {r.role === "buyer" ? <ShoppingBag size={9}/> : <Gavel size={9}/>}
            as {r.role === "buyer" ? "buyer" : "seller"}
          </span>
        </div>
        {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
        {r.auction && (
          <Link href={`/auction/${r.auction.id}`}
            className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-gray-400 hover:text-gray-700 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 max-w-full truncate">
            <Gavel size={9} className="flex-shrink-0"/>{r.auction.title}
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Auction row card ─────────────────────────────────────────────────────────

function AuctionCard({ a }: { a: PublicAuction }) {
  const img = a.images?.[0];
  return (
    <Link href={`/auction/${a.id}`}
      className="group flex gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-xl transition-colors">
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        {img
          ? <Image src={img} alt={a.title} width={56} height={56} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"/>
          : <div className="w-full h-full flex items-center justify-center"><Package size={18} className="text-gray-300"/></div>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{a.title}</p>
        <p className="text-base font-black text-gray-900 mt-0.5">€{Number(a.currentPrice ?? 0).toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
            a.listingType === "buy_now"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          }`}>
            {a.listingType === "buy_now" ? "Buy Now" : `${a.bidsCount} bids`}
          </span>
          {a.endTime && (
            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
              <Clock size={9}/>{new Date(a.endTime).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Collection card ──────────────────────────────────────────────────────────

const RARITY: Record<string, string> = {
  common: "bg-gray-100 text-gray-500 border-gray-200",
  rare: "bg-blue-50 text-blue-700 border-blue-200",
  epic: "bg-purple-50 text-purple-700 border-purple-200",
  legendary: "bg-amber-50 text-amber-700 border-amber-200",
};

function CollectionCard({ item }: { item: PublicCollectionItem }) {
  const img = item.images?.[0];
  return (
    <Link href={`/collection/item/${item.id}`}
      className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all">
      {img
        ? <Image src={img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300"/>
        : <div className="w-full h-full bg-gray-50 flex items-center justify-center"><Package size={22} className="text-gray-200"/></div>}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
      <span className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${RARITY[item.rarity] ?? RARITY.common} capitalize`}>
        {item.rarity}
      </span>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 animate-pulse space-y-6">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gray-200"/>
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-gray-200 rounded w-40"/>
          <div className="h-4 bg-gray-100 rounded w-24"/>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_,i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl"/>)}
      </div>
      <div className="h-2 bg-gray-100 rounded-full"/>
      <div className="space-y-4">
        {[...Array(3)].map((_,i) => <div key={i} className="h-16 bg-gray-50 rounded-xl"/>)}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type Tab = "reviews" | "listings" | "collection";

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<Tab>("reviews");
  const [sentimentFilter, setSentimentFilter] = useState<"all"|"positive"|"neutral"|"negative">("all");

  useEffect(() => {
    if (!username) return;
    getPublicUserProfile(username)
      .then(res => { if (res.success && res.data) setProfile(res.data); else setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="min-h-screen bg-white"><Skeleton/></div>;

  if (notFound || !profile) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-4xl mb-3">🔍</p>
        <h2 className="text-xl font-bold text-gray-900 mb-1">User not found</h2>
        <p className="text-gray-400 text-sm mb-5">This profile doesn't exist or has been removed</p>
        <Link href="/auctions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-black underline underline-offset-2">
          <ArrowLeft size={14}/> Back to auctions
        </Link>
      </div>
    </div>
  );

  const rating = Number(profile.rating ?? 0);
  const pos = Number(profile.positivePercentage ?? 100);
  const rank = getRank(profile.sales ?? 0, pos);
  const initial = profile.username?.[0]?.toUpperCase() ?? "?";

  const allReviews = profile.recentReviews ?? [];
  const positiveCount = allReviews.filter(r => r.sentiment === "positive").length;
  const neutralCount  = allReviews.filter(r => r.sentiment === "neutral").length;
  const negativeCount = allReviews.filter(r => r.sentiment === "negative").length;
  const visibleReviews = sentimentFilter === "all"
    ? allReviews
    : allReviews.filter(r => r.sentiment === sentimentFilter);

  const tabs = [
    { id: "reviews" as Tab,    label: "Reviews",    icon: <MessageSquare size={13}/>, count: profile.reviews },
    { id: "listings" as Tab,   label: "Listings",   icon: <Gavel size={13}/>,         count: profile.activeListings?.length },
    { id: "collection" as Tab, label: "Collection", icon: <LayoutGrid size={13}/>,    count: profile.collectionPreview?.length },
  ];

  const memberYear = new Date(profile.memberSince).getFullYear();
  const memberMonth = new Date(profile.memberSince).toLocaleDateString("en-GB", { month: "long" });

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: profile card ──────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Main card */}
            <div className="bg-white rounded-3xl p-7 shadow-sm">
              {/* Avatar + name */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center text-3xl font-black text-white overflow-hidden">
                    {profile.avatar
                      ? <Image src={profile.avatar} alt={profile.username} width={96} height={96} className="object-cover w-full h-full"/>
                      : initial}
                  </div>
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"/>
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <h1 className="text-xl font-black text-gray-900">{profile.username}</h1>
                  {profile.isVerified && <BadgeCheck size={18} className="text-blue-500"/>}
                </div>

                {profile.name && <p className="text-sm text-gray-400 mb-2">{profile.name}</p>}

                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full mb-3"
                  style={{ backgroundColor: rank.bg, color: rank.color }}>
                  {rank.icon} {rank.label}
                </span>

                <div className="flex items-center gap-1.5">
                  <Stars rating={rating} size={14}/>
                  <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({profile.reviews})</span>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Member since {memberMonth} {memberYear}
                  {profile.country && ` · ${profile.country}`}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-gray-50 rounded-2xl py-3 px-2 text-center">
                  <p className="text-xl font-black text-gray-900">{profile.sales ?? 0}</p>
                  <p className="text-[11px] font-semibold text-gray-400 mt-0.5 flex items-center justify-center gap-0.5">
                    <Truck size={10}/> Sold
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl py-3 px-2 text-center">
                  <p className="text-xl font-black" style={{ color: pos >= 95 ? "#10B981" : pos >= 80 ? "#F59E0B" : "#EF4444" }}>
                    {Math.round(pos)}%
                  </p>
                  <p className="text-[11px] font-semibold text-gray-400 mt-0.5 flex items-center justify-center gap-0.5">
                    <ThumbsUp size={10}/> Positive
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl py-3 px-2 text-center">
                  <p className="text-xl font-black text-gray-900">{profile.avgShippingTime ?? "—"}</p>
                  <p className="text-[11px] font-semibold text-gray-400 mt-0.5 flex items-center justify-center gap-0.5">
                    <Clock size={10}/> Shipping
                  </p>
                </div>
              </div>

              {/* Trust bar */}
              <TrustBar pos={pos} reviews={profile.reviews}/>
            </div>

            {/* Moderation alerts */}
            {((profile.warningCount ?? 0) > 0 || (profile.banCount ?? 0) > 0) && (
              <div className="bg-white rounded-3xl p-5 shadow-sm space-y-2">
                {(profile.warningCount ?? 0) > 0 && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                    <AlertTriangle size={14}/> {profile.warningCount} {profile.warningCount === 1 ? "warning" : "warnings"}
                  </div>
                )}
                {(profile.banCount ?? 0) > 0 && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                    <Ban size={14}/> {profile.banCount} {profile.banCount === 1 ? "ban" : "bans"} in history
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: tabs + content ────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold border-b-2 transition-all ${
                      tab === t.id
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-400 hover:text-gray-700"
                    }`}>
                    {t.icon} {t.label}
                    {(t.count ?? 0) > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                        tab === t.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
                      }`}>{t.count}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6">

                {/* Reviews */}
                {tab === "reviews" && (
                  <div>
                    {allReviews.length > 0 && (
                      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                        {([
                          { id: "all" as const,      label: `All (${allReviews.length})` },
                          { id: "positive" as const, label: `👍 Positive (${positiveCount})` },
                          { id: "neutral" as const,  label: `Neutral (${neutralCount})` },
                          { id: "negative" as const, label: `👎 Negative (${negativeCount})` },
                        ]).map(f => (
                          <button key={f.id} onClick={() => setSentimentFilter(f.id)}
                            className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                              sentimentFilter === f.id
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                            }`}>
                            {f.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {visibleReviews.length === 0 ? (
                      <div className="py-16 text-center">
                        <p className="text-4xl mb-3">💬</p>
                        <p className="text-gray-400 text-sm font-medium">
                          {allReviews.length === 0 ? "No reviews yet" : "No reviews in this category"}
                        </p>
                      </div>
                    ) : (
                      <div>{visibleReviews.map(r => <ReviewCard key={r.id} r={r}/>)}</div>
                    )}
                  </div>
                )}

                {/* Listings */}
                {tab === "listings" && (
                  <div>
                    {(profile.activeListings?.length ?? 0) === 0 ? (
                      <div className="py-16 text-center">
                        <p className="text-4xl mb-3">🏷️</p>
                        <p className="text-gray-400 text-sm font-medium">No active listings</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {profile.activeListings.map(a => <AuctionCard key={a.id} a={a}/>)}
                        </div>
                        <Link href={`/auctions?seller=${profile.username}`}
                          className="flex items-center justify-center gap-1.5 pt-5 text-sm text-gray-400 hover:text-gray-800 font-semibold transition-colors">
                          All listings <ChevronRight size={14}/>
                        </Link>
                      </>
                    )}
                  </div>
                )}

                {/* Collection */}
                {tab === "collection" && (
                  <div>
                    {(profile.collectionPreview?.length ?? 0) === 0 ? (
                      <div className="py-16 text-center">
                        <p className="text-4xl mb-3">📦</p>
                        <p className="text-gray-400 text-sm font-medium">No public items</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {profile.collectionPreview.map(item => <CollectionCard key={item.id} item={item}/>)}
                        </div>
                        <Link href={`/collection/${profile.username}`}
                          className="flex items-center justify-center gap-1.5 pt-5 text-sm text-gray-400 hover:text-gray-800 font-semibold transition-colors">
                          Full collection <ChevronRight size={14}/>
                        </Link>
                      </>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
