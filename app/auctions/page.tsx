"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import AuctionCard from "@/components/home/AuctionCard";
import { mockAuctions } from "@/lib/mockData";
import { getAuctions } from "@/lib/api/auctions.api";
import { adaptAuctionsForDisplay } from "@/lib/utils/auction-adapter";
import type { AuctionDisplayDto } from "@/lib/utils/auction-adapter";
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

const parseTimeLeft = (timeStr: string): number => {
  let totalMinutes = 0;
  const days = timeStr.match(/(\d+)d/);
  const hours = timeStr.match(/(\d+)h/);
  const minutes = timeStr.match(/(\d+)m/);
  if (days) totalMinutes += parseInt(days[1]) * 24 * 60;
  if (hours) totalMinutes += parseInt(hours[1]) * 60;
  if (minutes) totalMinutes += parseInt(minutes[1]);
  return totalMinutes || 999999;
};

export default function AuctionsPage(): JSX.Element {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [auctions, setAuctions] = useState<AuctionDisplayDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch from API whenever server-side filters change
  const fetchAuctions = useCallback(async (f: FilterState) => {
    try {
      setIsLoading(true);
      const result = await getAuctions({
        page: 1,
        limit: 60,
        category: f.sport !== "all" ? f.sport : undefined,
        itemType: f.itemCategory !== "all" ? f.itemCategory : undefined,
        league: f.league || undefined,
        listingType:
          f.listingType !== "all" ? (f.listingType as "auction" | "buy_now") : undefined,
      });

      if (result.success && result.data) {
        const adapted = adaptAuctionsForDisplay(result.data.auctions);
        setAuctions(adapted);
        setTotalCount(result.data.total);
      } else {
        setAuctions(mockAuctions as AuctionDisplayDto[]);
        setTotalCount(mockAuctions.length);
      }
    } catch {
      setAuctions(mockAuctions as AuctionDisplayDto[]);
      setTotalCount(mockAuctions.length);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Re-fetch when server-side filters change (sport, itemCategory, league, listingType)
  useEffect(() => {
    fetchAuctions(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.sport, filters.itemCategory, filters.league, filters.listingType]);

  // Client-side: search text + sort (no extra API call)
  const filteredAuctions = useMemo(() => {
    let result = [...auctions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.seller.name.toLowerCase().includes(q),
      );
    }

    if (filters.sort === "ending_soon") {
      result.sort((a, b) => parseTimeLeft(a.endTime) - parseTimeLeft(b.endTime));
    } else if (filters.sort === "newest") {
      // already newest-first from API (orderBy createdAt desc)
    }

    return result;
  }, [auctions, filters.search, filters.sort]);

  // Active filter tags
  const activeTags: { label: string; onRemove: () => void }[] = [];
  if (filters.sport !== "all")
    activeTags.push({
      label: SPORT_LABELS[filters.sport] ?? filters.sport,
      onRemove: () => setFilters((f) => ({ ...f, sport: "all", itemCategory: "all" })),
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
  if (filters.search)
    activeTags.push({
      label: `"${filters.search}"`,
      onRemove: () => setFilters((f) => ({ ...f, search: "" })),
    });

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <div className="flex-1 bg-white">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AuctionsSidebar
              filters={filters}
              onChange={setFilters}
              resultCount={filteredAuctions.length}
              isMobileOpen={isMobileFiltersOpen}
              onMobileClose={() => setIsMobileFiltersOpen(false)}
            />

            <div className="flex-1 w-full">
              {/* Header */}
              <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200">
                <div>
                  <h1 className="text-4xl font-black text-black tracking-tighter mb-2">
                    Marketplace
                  </h1>
                  <p className="text-gray-500">
                    {isLoading
                      ? "Loading..."
                      : `Showing ${filteredAuctions.length} of ${totalCount} items`}
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
              ) : filteredAuctions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAuctions.map((auction) => (
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
                    We couldn&apos;t find any items matching your current filters.
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
