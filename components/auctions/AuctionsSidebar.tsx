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
  ChevronDown,
  Check,
} from "lucide-react";

// --- TYPY ---
export type SportType =
  | "all"
  | "football"
  | "basketball"
  | "hockey"
  | "f1"
  | "tennis"
  | "esports";
export type CategoryType =
  | "all"
  | "clubs"
  | "national"
  | "collaboration"
  | "player"
  | "team"
  | "driver";
export type SortType = "recommended" | "ending_soon" | "buy_now" | "auction";
export type ItemType = "all" | "shirt" | "shoes" | "pants" | "accessory";

export interface FilterState {
  search: string;
  sport: SportType;
  category: CategoryType;
  country: string;
  sort: SortType;
  itemType: ItemType;
}

interface AuctionsSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

// --- KONFIGURACJA SPORTÓW ---
const sports: { id: SportType; label: string; emoji: string }[] = [
  { id: "all", label: "All Sports", emoji: "🏆" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "hockey", label: "Ice Hockey", emoji: "🏒" },
  { id: "f1", label: "Formula 1", emoji: "🏎️" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "esports", label: "E-Sports", emoji: "🎮" },
];

// Typy kategorii dostępne per sport
const categoriesPerSport: Record<
  SportType,
  { id: CategoryType; label: string }[]
> = {
  all: [],
  football: [
    { id: "clubs", label: "Clubs" },
    { id: "national", label: "National" },
    { id: "collaboration", label: "Collaboration" },
    { id: "player", label: "Player" },
  ],
  basketball: [
    { id: "team", label: "Team" },
    { id: "player", label: "Player" },
    { id: "collaboration", label: "Collaboration" },
  ],
  hockey: [
    { id: "clubs", label: "Clubs" },
    { id: "national", label: "National" },
    { id: "player", label: "Player" },
    { id: "collaboration", label: "Collaboration" },
  ],
  f1: [
    { id: "team", label: "Team" },
    { id: "driver", label: "Driver" },
    { id: "collaboration", label: "Collaboration" },
  ],
  tennis: [
    { id: "player", label: "Player" },
    { id: "collaboration", label: "Collaboration" },
  ],
  esports: [
    { id: "team", label: "Team" },
    { id: "player", label: "Player" },
    { id: "collaboration", label: "Collaboration" },
  ],
};

// Kraje per sport (dla Clubs/National)
const countriesPerSport: Record<string, string[]> = {
  football: [
    "England",
    "Spain",
    "Germany",
    "Italy",
    "France",
    "Netherlands",
    "Portugal",
    "Brazil",
    "Argentina",
    "Belgium",
    "Poland",
    "Turkey",
    "Scotland",
    "Russia",
    "Ukraine",
    "Croatia",
    "Denmark",
    "Sweden",
    "Norway",
    "Switzerland",
    "Austria",
    "Greece",
    "Serbia",
    "Romania",
    "Czech Republic",
    "Hungary",
    "USA",
    "Mexico",
    "Japan",
    "South Korea",
  ],
  hockey: [
    "Canada",
    "USA",
    "Russia",
    "Sweden",
    "Finland",
    "Czech Republic",
    "Slovakia",
    "Switzerland",
    "Germany",
    "Latvia",
  ],
  basketball: [
    "USA",
    "Spain",
    "Greece",
    "Turkey",
    "Italy",
    "France",
    "Germany",
    "Lithuania",
    "Serbia",
    "Australia",
  ],
};

const sortOptions: { id: SortType; label: string; icon: React.ReactNode }[] = [
  { id: "recommended", label: "Recommended", icon: <Flame size={15} /> },
  { id: "ending_soon", label: "Ending Soon", icon: <Clock size={15} /> },
  { id: "buy_now", label: "Buy Now Only", icon: <ShoppingCart size={15} /> },
  { id: "auction", label: "Auctions Only", icon: <Gavel size={15} /> },
];

const itemTypes: { id: ItemType; label: string; emoji: string }[] = [
  { id: "all", label: "All Items", emoji: "📦" },
  { id: "shirt", label: "Jerseys / Kits", emoji: "👕" },
  { id: "shoes", label: "Boots / Shoes", emoji: "👟" },
  { id: "pants", label: "Tracksuits", emoji: "🩲" },
  { id: "accessory", label: "Accessories", emoji: "🏅" },
];

// --- SEARCHABLE DROPDOWN ---
function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 transition-all"
      >
        <span className={value ? "text-black font-semibold" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1.5">
          {value && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="text-gray-400 hover:text-black"
            >
              <X size={13} />
            </button>
          )}
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-2.5 text-gray-400"
              />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-4">
                No results
              </p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                    value === opt
                      ? "bg-black text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {opt}
                  {value === opt && <Check size={13} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- GŁÓWNY KOMPONENT ---
export default function AuctionsSidebar({
  filters,
  onChange,
  resultCount,
  isMobileOpen,
  onMobileClose,
}: AuctionsSidebarProps) {
  const update = (partial: Partial<FilterState>) => {
    onChange({ ...filters, ...partial });
  };

  const categories = categoriesPerSport[filters.sport] || [];
  const showCountryFilter =
    filters.sport !== "all" &&
    ["clubs", "national"].includes(filters.category) &&
    countriesPerSport[filters.sport];

  const activeFilterCount = [
    filters.search,
    filters.sport !== "all" && filters.sport,
    filters.category !== "all" && filters.category,
    filters.country,
    filters.itemType !== "all" && filters.itemType,
    filters.sort !== "recommended" && filters.sort,
  ].filter(Boolean).length;

  const clearAll = () =>
    onChange({
      search: "",
      sport: "all",
      category: "all",
      country: "",
      sort: "recommended",
      itemType: "all",
    });

  return (
    <>
      {/* Mobile Overlay */}
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
              <Search
                size={14}
                className="absolute left-3 top-3 text-gray-400"
              />
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
                {sports.map((s) => (
                  <button
                    key={s.id}
                    onClick={() =>
                      update({ sport: s.id, category: "all", country: "" })
                    }
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      filters.sport === s.id
                        ? "bg-black text-white font-bold shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-base">{s.emoji}</span>
                    <span>{s.label}</span>
                    {filters.sport === s.id && (
                      <Check size={13} className="ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CATEGORY (tylko gdy wybrany sport) */}
            {categories.length > 0 && (
              <>
                <div className="h-px bg-gray-100" />
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                    Category
                  </h3>
                  <div className="space-y-0.5">
                    <button
                      onClick={() => update({ category: "all", country: "" })}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        filters.category === "all"
                          ? "bg-gray-100 text-black font-bold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() =>
                          update({ category: cat.id, country: "" })
                        }
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          filters.category === cat.id
                            ? "bg-gray-100 text-black font-bold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {cat.label}
                        {filters.category === cat.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-black" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* COUNTRY DROPDOWN */}
            {showCountryFilter && (
              <>
                <div className="h-px bg-gray-100" />
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                    Country
                  </h3>
                  <SearchableDropdown
                    options={countriesPerSport[filters.sport] || []}
                    value={filters.country}
                    onChange={(val) => update({ country: val })}
                    placeholder="Select country..."
                  />
                </div>
              </>
            )}

            <div className="h-px bg-gray-100" />

            {/* ITEM TYPE */}
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                Item Type
              </h3>
              <div className="space-y-0.5">
                {itemTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => update({ itemType: t.id })}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      filters.itemType === t.id
                        ? "bg-black text-white font-bold shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                    {filters.itemType === t.id && (
                      <Check size={13} className="ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* SORT */}
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                Sort & Listing
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
