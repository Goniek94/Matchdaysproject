"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
  Filter,
  Flame,
  Clock,
  ShoppingCart,
  Gavel,
  Check,
  Trophy,
} from "lucide-react";
import {
  SPORTS,
  ITEM_CATEGORIES,
  getItemCategoriesForSport,
  type SportId,
} from "@/lib/constants/listing/taxonomy.constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortType = "recommended" | "ending_soon" | "newest";

export interface FilterState {
  search: string;
  sport: string;        // "all" | SportId
  itemCategory: string; // "all" | ItemCategoryId
  league: string;       // "" | "Premier League" | etc.
  listingType: "all" | "auction" | "buy_now";
  sort: SortType;
}

export const EMPTY_FILTERS: FilterState = {
  search: "",
  sport: "all",
  itemCategory: "all",
  league: "",
  listingType: "all",
  sort: "recommended",
};

interface AuctionsSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const POPULAR_LEAGUES: Record<string, string[]> = {
  all: ["Premier League", "La Liga", "Bundesliga", "Serie A", "NBA", "Formula 1"],
  football: [
    "Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1",
    "Eredivisie", "Liga Portugal", "MLS", "Champions League", "Europa League",
  ],
  basketball: ["NBA", "EuroLeague", "NCAA", "WNBA"],
  f1: ["Formula 1", "Formula 2", "Formula E"],
  tennis: ["ATP", "WTA", "Grand Slam"],
  hockey: ["NHL", "KHL", "SHL"],
  rugby: ["Six Nations", "Rugby World Cup", "Premiership Rugby"],
  baseball: ["MLB", "NPB"],
  cricket: ["IPL", "The Ashes", "ICC World Cup"],
  esports: ["LEC", "LCS", "LCK", "LPL", "Valorant Champions"],
  other: [],
};

const sortOptions: { id: SortType; label: string; icon: React.ReactNode }[] = [
  { id: "recommended", label: "Recommended", icon: <Flame size={15} /> },
  { id: "ending_soon", label: "Ending Soon", icon: <Clock size={15} /> },
  { id: "newest", label: "Newest First", icon: <Trophy size={15} /> },
];

const listingTypeOptions = [
  { id: "all" as const, label: "All Listings", icon: <Filter size={15} /> },
  { id: "auction" as const, label: "Auctions Only", icon: <Gavel size={15} /> },
  { id: "buy_now" as const, label: "Buy Now Only", icon: <ShoppingCart size={15} /> },
];

// ─── League Dropdown ──────────────────────────────────────────────────────────

function LeagueInput({
  value,
  onChange,
  suggestions,
}: {
  value: string;
  onChange: (val: string) => void;
  suggestions: string[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  // Sync query when value cleared externally
  useEffect(() => {
    if (!value) setQuery("");
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search size={13} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="e.g. Premier League, NBA..."
          className="w-full pl-8 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
        />
        {value && (
          <button
            onClick={() => { onChange(""); setQuery(""); }}
            className="absolute right-3 top-3 text-gray-400 hover:text-black"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="max-h-44 overflow-y-auto">
            {filtered.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setQuery(opt); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                  value === opt
                    ? "bg-black text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {opt}
                {value === opt && <Check size={13} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuctionsSidebar({
  filters,
  onChange,
  resultCount,
  isMobileOpen,
  onMobileClose,
}: AuctionsSidebarProps) {
  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  // Item categories to show: filter by selected sport (or show all)
  const visibleCategories =
    filters.sport === "all"
      ? ITEM_CATEGORIES
      : getItemCategoriesForSport(filters.sport as SportId);

  const leagueSuggestions =
    POPULAR_LEAGUES[filters.sport] ?? POPULAR_LEAGUES.all;

  const activeFilterCount = [
    filters.search,
    filters.sport !== "all",
    filters.itemCategory !== "all",
    filters.league,
    filters.listingType !== "all",
    filters.sort !== "recommended",
  ].filter(Boolean).length;

  const clearAll = () => onChange(EMPTY_FILTERS);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300
          lg:relative lg:inset-auto lg:z-0 lg:w-64 lg:transform-none lg:flex-shrink-0
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="h-full overflow-y-auto lg:overflow-visible p-5 lg:p-0 lg:sticky lg:top-28">
          <div className="bg-white lg:border lg:border-gray-200 lg:rounded-2xl lg:shadow-sm lg:p-5 space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-black" />
                <span className="font-black text-base">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-black text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {resultCount}
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-gray-400 hover:text-black font-medium transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button onClick={onMobileClose} className="lg:hidden">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* SEARCH */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search items, teams..."
                value={filters.search}
                onChange={(e) => update({ search: e.target.value })}
                className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
              {filters.search && (
                <button
                  onClick={() => update({ search: "" })}
                  className="absolute right-3 top-3 text-gray-400 hover:text-black"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* SPORT */}
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                Sport
              </h3>
              <div className="space-y-0.5">
                <button
                  onClick={() => update({ sport: "all", itemCategory: "all" })}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    filters.sport === "all"
                      ? "bg-black text-white font-bold shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base">🏆</span>
                  <span>All Sports</span>
                  {filters.sport === "all" && <Check size={13} className="ml-auto" />}
                </button>
                {SPORTS.filter((s) => s.id !== "other").map((s) => (
                  <button
                    key={s.id}
                    onClick={() => update({ sport: s.id, itemCategory: "all" })}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      filters.sport === s.id
                        ? "bg-black text-white font-bold shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <s.icon size={15} className={filters.sport === s.id ? "text-white" : s.color} />
                    <span>{s.label}</span>
                    {filters.sport === s.id && <Check size={13} className="ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* ITEM TYPE — the "browse by category" feature */}
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Item Type
              </h3>
              {filters.sport === "all" && (
                <p className="text-[10px] text-gray-400 mb-2.5">Browse across all sports</p>
              )}
              <div className="space-y-0.5">
                <button
                  onClick={() => update({ itemCategory: "all" })}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    filters.itemCategory === "all"
                      ? "bg-gray-100 text-black font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Types
                </button>
                {visibleCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => update({ itemCategory: cat.id })}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      filters.itemCategory === cat.id
                        ? "bg-gray-100 text-black font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <cat.icon size={14} className="text-gray-400 flex-shrink-0" />
                      <span>{cat.label}</span>
                    </div>
                    {filters.itemCategory === cat.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* LEAGUE */}
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                League / Competition
              </h3>
              <LeagueInput
                value={filters.league}
                onChange={(val) => update({ league: val })}
                suggestions={leagueSuggestions}
              />
              {/* Quick-pick chips */}
              {!filters.league && leagueSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {leagueSuggestions.slice(0, 4).map((l) => (
                    <button
                      key={l}
                      onClick={() => update({ league: l })}
                      className="text-[11px] font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* LISTING TYPE */}
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                Listing Type
              </h3>
              <div className="space-y-0.5">
                {listingTypeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => update({ listingType: opt.id })}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      filters.listingType === opt.id
                        ? "bg-gray-100 text-black font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {opt.icon}
                      <span>{opt.label}</span>
                    </div>
                    {filters.listingType === opt.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-black" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* SORT */}
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                Sort By
              </h3>
              <div className="space-y-0.5">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => update({ sort: opt.id })}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      filters.sort === opt.id
                        ? "bg-gray-100 text-black font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {opt.icon}
                      <span>{opt.label}</span>
                    </div>
                    {filters.sort === opt.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-black" />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </aside>
    </>
  );
}
