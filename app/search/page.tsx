"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X, SlidersHorizontal, ArrowLeft, Clock, Gavel, ShoppingBag } from "lucide-react";
import { getAuctions } from "@/lib/api/auctions.api";
import { adaptAuctionsForDisplay } from "@/lib/utils/auction-adapter";
import type { AuctionDisplayDto } from "@/lib/utils/auction-adapter";

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ auction }: { auction: AuctionDisplayDto }) {
  const img = auction.image;
  const isBuyNow = auction.type === "buy_now";
  const timeLeft = auction.endTime;

  return (
    <Link href={`/auction/${auction.id}`}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all overflow-hidden flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {img
          ? <Image src={img} alt={auction.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🏷️</div>}

        {/* Badge */}
        <div className={`absolute top-2 left-2 text-[10px] font-black px-2 py-1 rounded-full border ${
          isBuyNow
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-blue-50 text-blue-700 border-blue-200"
        }`}>
          {isBuyNow ? "Buy Now" : "Auction"}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1">{auction.title}</p>

        {auction.seller?.name && (
          <p className="text-xs text-gray-400 mb-2">by {auction.seller.name}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-black text-gray-900">
              €{Number(auction.price ?? 0).toLocaleString("de-DE", { minimumFractionDigits: 2 })}
            </p>
            {!isBuyNow && (
              <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                <Gavel size={10}/> {auction.bids ?? 0} bids
              </p>
            )}
          </div>
          {!isBuyNow && timeLeft && (
            <p className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
              <Clock size={10}/> {timeLeft}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ResultSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-5 bg-gray-100 rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}

// ─── Main search ──────────────────────────────────────────────────────────────

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery]       = useState(initialQ);
  const [inputValue, setInputValue] = useState(initialQ);
  const [results, setResults]   = useState<AuctionDisplayDto[]>([]);
  const [loading, setLoading]   = useState(false);
  const [total, setTotal]       = useState(0);
  const [listingType, setListingType] = useState<"" | "buy_now" | "auction">("");
  const [sortBy, setSortBy]     = useState<"" | "price_asc" | "price_desc" | "newest">("newest");

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setTotal(0); return; }
    setLoading(true);
    try {
      const res = await getAuctions({
        q: q.trim(),
        limit: 48,
        ...(listingType ? { listingType } : {}),
      });
      if (res.success && res.data) {
        let adapted = adaptAuctionsForDisplay(res.data.auctions ?? []);
        // Client-side sort
        if (sortBy === "price_asc")  adapted = [...adapted].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        if (sortBy === "price_desc") adapted = [...adapted].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        setResults(adapted);
        setTotal(res.data.total ?? adapted.length);
      }
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, [listingType, sortBy]);

  // Run search whenever query or filters change
  useEffect(() => { doSearch(query); }, [query, listingType, sortBy, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    setQuery(trimmed);
    router.replace(`/search?q=${encodeURIComponent(trimmed)}`, { scroll: false });
  };

  const clearSearch = () => {
    setInputValue("");
    setQuery("");
    router.replace("/search", { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

        {/* Back */}
        <Link href="/auctions" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6 transition-colors font-medium">
          <ArrowLeft size={16}/> Browse all auctions
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative flex items-center">
            <Search size={20} className="absolute left-4 text-gray-400 pointer-events-none" />
            <input
              autoFocus
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Search jerseys, teams, leagues…"
              className="w-full pl-12 pr-12 py-4 text-lg bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 placeholder:text-gray-300"
            />
            {inputValue && (
              <button type="button" onClick={clearSearch}
                className="absolute right-14 text-gray-400 hover:text-gray-700 transition-colors">
                <X size={18}/>
              </button>
            )}
            <button type="submit"
              className="absolute right-3 px-4 py-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors">
              Search
            </button>
          </div>
        </form>

        {/* Filters bar */}
        {query && (
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <SlidersHorizontal size={14}/> Filters:
            </div>

            {/* Listing type */}
            {(["", "buy_now", "auction"] as const).map(t => (
              <button key={t} onClick={() => setListingType(t)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  listingType === t
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}>
                {t === "" ? "All" : t === "buy_now" ? "Buy Now" : "Auction"}
              </button>
            ))}

            <div className="w-px h-4 bg-gray-200 mx-1" />

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-gray-400 cursor-pointer">
              <option value="newest">Newest first</option>
              <option value="price_asc">Price: low → high</option>
              <option value="price_desc">Price: high → low</option>
            </select>
          </div>
        )}

        {/* Results header */}
        {query && !loading && (
          <div className="mb-4">
            <h1 className="text-2xl font-black text-gray-900">
              {total > 0
                ? <>{total} result{total !== 1 ? "s" : ""} for <span className="text-gray-500">&quot;{query}&quot;</span></>
                : <>No results for <span className="text-gray-500">&quot;{query}&quot;</span></>}
            </h1>
          </div>
        )}

        {/* Empty state — no query */}
        {!query && (
          <div className="py-24 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Search Matchdays</h2>
            <p className="text-gray-400 text-sm">Find jerseys, boots, scarves and more from sellers worldwide</p>
            <div className="mt-8 flex flex-wrap gap-2 justify-center">
              {["Barcelona", "Real Madrid", "Premier League", "Champions League", "Retro jersey", "Match worn"].map(tag => (
                <button key={tag}
                  onClick={() => { setInputValue(tag); setQuery(tag); router.replace(`/search?q=${encodeURIComponent(tag)}`); }}
                  className="text-sm px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-black hover:text-black transition-all font-medium">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <ResultSkeleton key={i} />)}
          </div>
        )}

        {/* No results */}
        {!loading && query && results.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-4xl mb-3">😔</p>
            <p className="text-gray-500 font-medium mb-1">No listings found for &quot;{query}&quot;</p>
            <p className="text-gray-400 text-sm mb-6">Try different keywords or browse all auctions</p>
            <Link href="/auctions"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm">
              <ShoppingBag size={16}/> Browse all listings
            </Link>
          </div>
        )}

        {/* Results grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map(a => <ResultCard key={a.id} auction={a} />)}
          </div>
        )}

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
