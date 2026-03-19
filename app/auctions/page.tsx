"use client";

import { useState, useMemo, useEffect } from "react";
import AuctionCard from "@/components/home/AuctionCard";
import { mockAuctions } from "@/lib/mockData";
import { getSportsListings } from "@/lib/api/listings.api";
import { adaptAuctionsForDisplay } from "@/lib/utils/auction-adapter";
import { Search, Filter, X } from "lucide-react";
import AuctionsSidebar, {
  FilterState,
} from "@/components/auctions/AuctionsSidebar";

// Helper: Parsowanie czasu
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

const sortOptions = [
  { id: "recommended", label: "Recommended" },
  { id: "ending_soon", label: "Ending Soon" },
  { id: "buy_now", label: "Buy Now Only" },
  { id: "auction", label: "Auctions Only" },
];

export default function AuctionsPage(): JSX.Element {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sport: "all",
    category: "all",
    country: "",
    sort: "recommended",
    itemType: "all",
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [_isLoading, setIsLoading] = useState(true);

  // Fetch auctions from API
  useEffect(() => {
    async function fetchAuctions() {
      try {
        setIsLoading(true);
        const result = await getSportsListings({ page: 1, limit: 50 });
        if (result.success && result.data) {
          console.log("✅ Pobrano aukcje z API:", result.data.length);
          const adaptedAuctions = adaptAuctionsForDisplay(result.data);
          setAuctions(adaptedAuctions);
        } else {
          console.warn("⚠️ Brak aukcji z API, używam mock data");
          setAuctions(mockAuctions);
        }
      } catch (err) {
        console.error("❌ Błąd pobierania aukcji:", err);
        setAuctions(mockAuctions);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAuctions();
  }, []);

  // --- LOGIKA FILTROWANIA ---
  const filteredAuctions = useMemo(() => {
    const sourceAuctions = auctions.length > 0 ? auctions : mockAuctions;
    let result = [...sourceAuctions];

    // Search po tytule, teamie i sprzedawcy
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.team && item.team.toLowerCase().includes(q)) ||
          item.seller.name.toLowerCase().includes(q),
      );
    }

    // Sport
    if (filters.sport !== "all") {
      result = result.filter((item) => item.sport === filters.sport);
    }

    // Category
    if (filters.category !== "all") {
      result = result.filter((item) => item.category === filters.category);
    }

    // Country
    if (filters.country) {
      result = result.filter(
        (item) =>
          item.country?.name.toLowerCase() === filters.country.toLowerCase(),
      );
    }

    // Item type
    if (filters.itemType !== "all") {
      result = result.filter((item) => item.itemType === filters.itemType);
    }

    // Sort
    if (filters.sort === "buy_now") {
      result = result.filter((item) => item.type === "buy_now");
    } else if (filters.sort === "auction") {
      result = result.filter((item) => item.type === "auction");
    } else if (filters.sort === "ending_soon") {
      result.sort(
        (a, b) => parseTimeLeft(a.endTime) - parseTimeLeft(b.endTime),
      );
    }

    return result;
  }, [auctions, filters]);

  // Aktywne filtry jako tagi
  const activeTags: { label: string; onRemove: () => void }[] = [];
  if (filters.sport !== "all")
    activeTags.push({
      label: filters.sport,
      onRemove: () =>
        setFilters((f) => ({
          ...f,
          sport: "all",
          category: "all",
          country: "",
        })),
    });
  if (filters.category !== "all")
    activeTags.push({
      label: filters.category,
      onRemove: () =>
        setFilters((f) => ({ ...f, category: "all", country: "" })),
    });
  if (filters.country)
    activeTags.push({
      label: filters.country,
      onRemove: () => setFilters((f) => ({ ...f, country: "" })),
    });
  if (filters.itemType !== "all")
    activeTags.push({
      label: filters.itemType,
      onRemove: () => setFilters((f) => ({ ...f, itemType: "all" })),
    });

  const clearAll = () =>
    setFilters({
      search: "",
      sport: "all",
      category: "all",
      country: "",
      sort: "recommended",
      itemType: "all",
    });

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <div className="flex-1 bg-white">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* --- SIDEBAR --- */}
            <AuctionsSidebar
              filters={filters}
              onChange={setFilters}
              resultCount={filteredAuctions.length}
              isMobileOpen={isMobileFiltersOpen}
              onMobileClose={() => setIsMobileFiltersOpen(false)}
            />

            {/* --- GRID (RIGHT SIDE) --- */}
            <div className="flex-1 w-full">
              {/* TOP HEADER */}
              <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200">
                <div>
                  <h1 className="text-4xl font-black text-black tracking-tighter mb-2">
                    Marketplace
                  </h1>
                  <p className="text-gray-500">
                    Discover {filteredAuctions.length} rare items across all
                    categories.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400">
                    Sort by:
                  </span>
                  <select
                    value={filters.sort}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        sort: e.target.value as FilterState["sort"],
                      }))
                    }
                    className="bg-gray-50 border border-gray-200 text-sm font-bold rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ACTIVE FILTERS BAR */}
              <div className="mb-6 flex items-center gap-3 flex-wrap">
                {/* Mobile Trigger */}
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
                    <button
                      onClick={tag.onRemove}
                      className="hover:text-gray-300"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}

                {activeTags.length > 1 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-gray-400 hover:text-black font-medium transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* GRID */}
              {filteredAuctions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredAuctions.map((auction) => (
                    <AuctionCard
                      key={auction.id}
                      auction={auction}
                      badge={
                        auction.type === "buy_now"
                          ? {
                              text: "BUY NOW",
                              colors: "bg-blue-600 text-white",
                            }
                          : auction.rare
                            ? {
                                text: "RARE",
                                colors: "bg-purple-600 text-white",
                              }
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
                    We couldn&apos;t find any items matching your current
                    filters.
                  </p>
                  <button
                    onClick={clearAll}
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
