"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AuctionCard from "@/components/home/AuctionCard";
import { getAuctions } from "@/lib/api/auctions.api";
import { adaptAuctionsForDisplay } from "@/lib/utils/auction-adapter";
import type { AuctionDisplayDto } from "@/lib/utils/auction-adapter";
import type { AuctionSort } from "@/types/api/auction.types";
import { Search, Filter, X } from "lucide-react";
import AuctionsSidebar, {
  FilterState,
  EMPTY_FILTERS,
} from "@/components/auctions/AuctionsSidebar";
import {
  SPORTS,
  ITEM_CATEGORIES,
} from "@/lib/constants/listing/taxonomy.constants";

// Label lookups for filter tags
const SPORT_LABELS: Record<string, string> = Object.fromEntries(
  SPORTS.map((s) => [s.id, s.label]),
);
const ITEM_LABELS: Record<string, string> = Object.fromEntries(
  ITEM_CATEGORIES.map((c) => [c.id, c.label]),
);

const SORT_LABELS: Record<AuctionSort, string> = {
  recommended: "Recommended",
  newest: "Newest",
  ending_soon: "Ending Soon",
  price_low: "Price ↑",
  price_high: "Price ↓",
  most_bids: "Most Bids",
};

// Debounce hook — delays propagating a value until it stops changing
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function AuctionsPage(): JSX.Element {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [auctions, setAuctions] = useState<AuctionDisplayDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce search to avoid hitting the API on every keystroke
  const debouncedSearch = useDebounce(filters.search, 350);

  // Cancellation guard — if a newer fetch starts before the previous resolves,
  // ignore the stale response.
  const fetchSeq = useRef(0);

  const fetchAuctions = useCallback(
    async (f: FilterState, search: string) => {
      const mySeq = ++fetchSeq.current;
      try {
        setIsLoading(true);
        const result = await getAuctions({
          page: 1,
          limit: 60,
          q: search.trim() || undefined,
          category: f.sport !== "all" ? f.sport : undefined,
          itemType: f.itemCategory !== "all" ? f.itemCategory : undefined,
          league: f.league || undefined,
          listingType:
            f.listingType !== "all"
              ? (f.listingType as "auction" | "buy_now")
              : undefined,
          sort: f.sort,
        });

        // Stale response — newer fetch is in flight
        if (mySeq !== fetchSeq.current) return;

        if (result.success && result.data) {
          setAuctions(adaptAuctionsForDisplay(result.data.auctions));
          setTotalCount(result.data.total);
        } else {
          setAuctions([]);
          setTotalCount(0);
        }
      } catch {
        if (mySeq !== fetchSeq.current) return;
        setAuctions([]);
        setTotalCount(0);
      } finally {
        if (mySeq === fetchSeq.current) setIsLoading(false);
      }
    },
    [],
  );

  // Re-fetch on any server-side filter change (incl. debounced search and sort)
  useEffect(() => {
    fetchAuctions(filters, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.sport,
    filters.itemCategory,
    filters.league,
    filters.listingType,
    filters.sort,
    debouncedSearch,
  ]);

  // Active filter chips
  const activeTags: { label: string; onRemove: () => void }[] = [];
  if (filters.sport !== "all")
    activeTags.push({
      label: SPORT_LABELS[filters.sport] ?? filters.sport,
      onRemove: () =>
        setFilters((f) => ({ ...f, sport: "all", itemCategory: "all" })),
    });
  if (filters.itemCategory !== "all")
    activeTags.push({
      label: ITEM_LABELS[filters.itemCategory] ?? filters.itemCategory,
      onRemove: () => setFilters((f) => ({ ...f, itemCategory: "all" })),
    });
  if (filters.league)
    activeTags.push({
      label: filters.league,
      onRemove: () => setFilters((f) => ({ ...f, league: "" })),
    });
  if (filters.listingType !== "all")
    activeTags.push({
      label: filters.listingType === "buy_now" ? "Buy Now" : "Auction",
      onRemove: () => setFilters((f) => ({ ...f, listingType: "all" })),
    });
  if (filters.sort !== "recommended")
    activeTags.push({
      label: `Sort: ${SORT_LABELS[filters.sort]}`,
      onRemove: () => setFilters((f) => ({ ...f, sort: "recommended" })),
    });
  if (filters.search)
    activeTags.push({
      label: `"${filters.search}"`,
      onRemove: () => setFilters((f) => ({ ...f, search: "" })),
    });

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <div className="flex-1 bg-white">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AuctionsSidebar
              filters={filters}
              onChange={setFilters}
              resultCount={totalCount}
              isMobileOpen={isMobileFiltersOpen}
              onMobileClose={() => setIsMobileFiltersOpen(false)}
            />

            <div className="flex-1 w-full">
              {/* Header */}
              <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tighter mb-2">
                    Marketplace
                  </h1>
                  <p className="text-gray-500">
                    {isLoading
                      ? "Searching…"
                      : totalCount === 0
                        ? "No items found"
                        : `${totalCount.toLocaleString()} ${totalCount === 1 ? "item" : "items"} found`}
                  </p>
                </div>
              </div>

              {/* Active filter tags */}
              <div className="mb-6 flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-bold"
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </button>

                {activeTags.map((tag) => (
                  <span
                    key={tag.label}
                    className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2"
                  >
                    {tag.label}
                    <button onClick={tag.onRemove} className="hover:text-gray-300">
                      <X size={13} />
                    </button>
                  </span>
                ))}

                {activeTags.length > 1 && (
                  <button
                    onClick={() => setFilters(EMPTY_FILTERS)}
                    className="text-sm text-gray-400 hover:text-black font-medium transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-gray-100 animate-pulse h-72"
                    />
                  ))}
                </div>
              ) : auctions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {auctions.map((auction) => (
                    <AuctionCard
                      key={auction.id}
                      auction={auction}
                      badge={
                        auction.type === "buy_now"
                          ? { text: "BUY NOW", colors: "bg-blue-600 text-white" }
                          : auction.rare
                            ? { text: "RARE", colors: "bg-purple-600 text-white" }
                            : undefined
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Search size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No items found
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {filters.search
                      ? `Nothing matched "${filters.search}". Try a different keyword or remove some filters.`
                      : "We couldn't find any items matching your current filters."}
                  </p>
                  <button
                    onClick={() => setFilters(EMPTY_FILTERS)}
                    className="px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
