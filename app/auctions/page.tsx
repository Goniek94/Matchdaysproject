"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import AuctionCard from "@/components/AuctionCard";
import Footer from "@/components/Footer";
import { mockAuctions } from "@/lib/mockData";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Trophy,
  Globe,
  Flag,
  X,
  Flame,
  Clock,
  ShoppingCart,
  Gavel,
  Check,
  Shirt,
  Footprints,
  Layers,
  CircleDot,
  Filter,
  Gamepad2,
  Car,
  Snowflake,
  Activity,
  Dumbbell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- DANE: SORTOWANIE / FILTROWANIE ---
const sortOptions = [
  { id: "recommended", label: "Recommended", icon: <Flame size={16} /> },
  { id: "ending_soon", label: "Ending Soon", icon: <Clock size={16} /> },
  { id: "buy_now", label: "Buy Now Only", icon: <ShoppingCart size={16} /> },
  { id: "auction", label: "Auctions Only", icon: <Gavel size={16} /> },
];

// --- DANE: TYP PRODUKTU ---
const productTypes = [
  { id: "all", label: "All Products", icon: <Globe size={16} /> },
  { id: "shirt", label: "Jerseys / Kits", icon: <Shirt size={16} /> },
  { id: "shoes", label: "Boots / Shoes", icon: <Footprints size={16} /> },
  { id: "pants", label: "Training / Tracksuits", icon: <Layers size={16} /> },
  {
    id: "accessory",
    label: "Accessories / Memorabilia",
    icon: <CircleDot size={16} />,
  },
];

// --- COMPREHENSIVE CATEGORY TREE (UPDATED) ---
const categoryTree = [
  // 1. FOOTBALL
  {
    id: "national",
    title: "Football: National",
    icon: <Flag size={18} />,
    groups: [
      {
        id: "world-tournaments",
        label: "🏆 World Tournaments",
        countries: [
          {
            id: "world-cup",
            label: "FIFA World Cup",
            leagues: ["1930-1970", "1974-1990", "1994-2006", "2010-2022"],
          },
          {
            id: "olympics",
            label: "Olympic Games",
            leagues: ["1996-2008", "2012-2024"],
          },
        ],
      },
      {
        id: "europe-national",
        label: "🇪🇺 Europe",
        countries: [
          { id: "england-nat", label: "🏴 England", leagues: ["All Kits"] },
          { id: "france-nat", label: "🇫🇷 France", leagues: ["All Kits"] },
          { id: "germany-nat", label: "🇩🇪 Germany", leagues: ["All Kits"] },
          { id: "italy-nat", label: "🇮🇹 Italy", leagues: ["All Kits"] },
          { id: "spain-nat", label: "🇪🇸 Spain", leagues: ["All Kits"] },
          { id: "poland-nat", label: "🇵🇱 Poland", leagues: ["All Kits"] },
        ],
      },
      {
        id: "americas-national",
        label: "🌎 Americas",
        countries: [
          { id: "brazil-nat", label: "🇧🇷 Brazil", leagues: ["All Kits"] },
          {
            id: "argentina-nat",
            label: "🇦🇷 Argentina",
            leagues: ["All Kits"],
          },
        ],
      },
    ],
  },
  {
    id: "europe-clubs",
    title: "Football: Clubs",
    icon: <Trophy size={18} />,
    groups: [
      {
        id: "england-clubs",
        label: "🏴 England",
        countries: [
          {
            id: "premier-league",
            label: "Premier League",
            leagues: [
              "Man Utd",
              "Liverpool",
              "Arsenal",
              "Chelsea",
              "Man City",
              "All Teams",
            ],
          },
        ],
      },
      {
        id: "spain-clubs",
        label: "🇪🇸 Spain",
        countries: [
          {
            id: "la-liga",
            label: "La Liga",
            leagues: ["Real Madrid", "Barcelona", "Atlético", "All Teams"],
          },
        ],
      },
      {
        id: "italy-clubs",
        label: "🇮🇹 Italy",
        countries: [
          {
            id: "serie-a",
            label: "Serie A",
            leagues: ["Juventus", "AC Milan", "Inter", "Napoli", "All Teams"],
          },
        ],
      },
      {
        id: "germany-clubs",
        label: "🇩🇪 Germany",
        countries: [
          {
            id: "bundesliga",
            label: "Bundesliga",
            leagues: ["Bayern", "BVB", "All Teams"],
          },
        ],
      },
    ],
  },

  // 2. BASKETBALL
  {
    id: "basketball",
    title: "Basketball",
    icon: <Activity size={18} />,
    groups: [
      {
        id: "usa-basket",
        label: "🇺🇸 North America",
        countries: [
          {
            id: "nba",
            label: "NBA",
            leagues: [
              "Lakers",
              "Bulls",
              "Celtics",
              "Warriors",
              "Heat",
              "Knicks",
              "All Teams",
            ],
          },
        ],
      },
      {
        id: "euro-basket",
        label: "🇪🇺 European Leagues",
        countries: [
          {
            id: "euroleague",
            label: "EuroLeague",
            leagues: [
              "Real Madrid",
              "Barcelona",
              "Panathinaikos",
              "Olympiacos",
              "All Teams",
            ],
          },
          {
            id: "acb",
            label: "🇪🇸 Spain (ACB)",
            leagues: ["All Teams"],
          },
          {
            id: "bsl",
            label: "🇹🇷 Turkey (BSL)",
            leagues: ["Fenerbahçe", "Anadolu Efes", "All Teams"],
          },
          {
            id: "lba",
            label: "🇮🇹 Italy (LBA)",
            leagues: ["Olimpia Milano", "Virtus Bologna", "All Teams"],
          },
          {
            id: "plk",
            label: "🇵🇱 Poland (PLK)",
            leagues: ["Śląsk Wrocław", "Anwil Włocławek", "All Teams"],
          },
        ],
      },
    ],
  },

  // 3. HOCKEY
  {
    id: "hockey",
    title: "Ice Hockey",
    icon: <Snowflake size={18} />,
    groups: [
      {
        id: "usa-hockey",
        label: "🇺🇸 North America",
        countries: [
          {
            id: "nhl",
            label: "NHL",
            leagues: [
              "Rangers",
              "Bruins",
              "Maple Leafs",
              "Canadiens",
              "Blackhawks",
              "Red Wings",
              "All Teams",
            ],
          },
        ],
      },
      {
        id: "euro-hockey",
        label: "🇪🇺 European Leagues",
        countries: [
          {
            id: "shl",
            label: "🇸🇪 Sweden (SHL)",
            leagues: ["Färjestad", "Frölunda", "All Teams"],
          },
          {
            id: "liiga",
            label: "🇫🇮 Finland (Liiga)",
            leagues: ["Tappara", "HIFK", "All Teams"],
          },
          {
            id: "del",
            label: "🇩🇪 Germany (DEL)",
            leagues: ["Eisbären Berlin", "Red Bull Munich", "All Teams"],
          },
          {
            id: "nl",
            label: "🇨🇭 Switzerland (NL)",
            leagues: ["ZSC Lions", "SC Bern", "All Teams"],
          },
          {
            id: "extraliga",
            label: "🇨🇿 Czech Rep. (ELH)",
            leagues: ["Sparta Praha", "All Teams"],
          },
        ],
      },
    ],
  },

  // 4. F1
  {
    id: "f1",
    title: "Formula 1 & Motorsport",
    icon: <Car size={18} />,
    groups: [
      {
        id: "f1-teams",
        label: "🏎️ Formula 1 Teams",
        countries: [
          {
            id: "f1-constructors",
            label: "Constructors",
            leagues: [
              "Ferrari",
              "Red Bull Racing",
              "Mercedes-AMG",
              "McLaren",
              "Aston Martin",
              "Alpine",
              "Williams",
              "All Teams",
            ],
          },
          {
            id: "f1-drivers",
            label: "Drivers Merchandise",
            leagues: ["Verstappen", "Hamilton", "Leclerc", "Norris", "Alonso"],
          },
        ],
      },
      {
        id: "motogp",
        label: "🏍️ MotoGP",
        countries: [
          {
            id: "motogp-teams",
            label: "Teams",
            leagues: ["Ducati", "Yamaha", "Honda", "KTM"],
          },
        ],
      },
    ],
  },

  // 5. OTHERS
  {
    id: "others",
    title: "Other Sports",
    icon: <Dumbbell size={18} />,
    groups: [
      {
        id: "tennis",
        label: "🎾 Tennis",
        countries: [
          {
            id: "atp-wta",
            label: "Tournaments",
            leagues: [
              "Wimbledon",
              "Roland Garros",
              "US Open",
              "Australian Open",
            ],
          },
        ],
      },
      {
        id: "volleyball",
        label: "🏐 Volleyball",
        countries: [
          {
            id: "plusliga",
            label: "🇵🇱 PlusLiga",
            leagues: ["ZAKSA", "Jastrzębski Węgiel", "Resovia", "All Teams"],
          },
          {
            id: "serie-a-volley",
            label: "🇮🇹 Serie A1",
            leagues: ["Perugia", "Trentino", "Lube", "All Teams"],
          },
          {
            id: "national-volley",
            label: "National Teams",
            leagues: ["Poland", "Italy", "Brazil", "USA"],
          },
        ],
      },
      {
        id: "handball",
        label: "🤾 Handball",
        countries: [
          {
            id: "ehf",
            label: "Champions League",
            leagues: ["Barcelona", "Kiel", "Veszprém", "Kielce"],
          },
          {
            id: "bundesliga-hbl",
            label: "🇩🇪 Bundesliga",
            leagues: ["All Teams"],
          },
        ],
      },
    ],
  },

  // 6. E-SPORTS
  {
    id: "esports",
    title: "E-Sports",
    icon: <Gamepad2 size={18} />,
    groups: [
      {
        id: "esports-teams",
        label: "⚡ E-Sports Teams",
        countries: [
          {
            id: "fifa-esports",
            label: "FIFA/EA FC",
            leagues: ["Team Jerseys", "Player Kits"],
          },
        ],
      },
    ],
  },
];

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

export default function AuctionsPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedProductType, setSelectedProductType] = useState("all");

  const [expandedRegions, setExpandedRegions] = useState<
    Record<string, boolean>
  >({
    "europe-clubs": true,
    basketball: false,
  });

  const [expandedCountries, setExpandedCountries] = useState<
    Record<string, boolean>
  >({});

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const toggleRegion = (id: string) =>
    setExpandedRegions((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleCountry = (id: string) =>
    setExpandedCountries((prev) => ({ ...prev, [id]: !prev[id] }));

  // --- LOGIKA FILTROWANIA ---
  const filteredAuctions = useMemo(() => {
    let result = [...mockAuctions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.seller.name.toLowerCase().includes(query)
      );
    }

    if (selectedProductType !== "all") {
      result = result.filter((item) => item.itemType === selectedProductType);
    }

    if (sortBy === "buy_now") {
      result = result.filter((item) => item.type === "buy_now");
    } else if (sortBy === "auction") {
      result = result.filter((item) => item.type === "auction");
    } else if (sortBy === "ending_soon") {
      result.sort(
        (a, b) => parseTimeLeft(a.endTime) - parseTimeLeft(b.endTime)
      );
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, selectedProductType]);

  return (
    <main className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* HEADER MINI */}
      <div className="pt-24 pb-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container-max text-center" />
      </div>

      <div className="flex-1 bg-white">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* --- SIDEBAR --- */}
            <aside
              className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 lg:relative lg:transform-none lg:w-64 lg:flex-shrink-0 lg:block lg:z-0 ${
                isMobileFiltersOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0"
              }`}
            >
              <div className="h-full overflow-y-auto lg:overflow-visible p-6 lg:p-0 lg:sticky lg:top-28 scrollbar-hide space-y-6">
                {/* Mobile Header */}
                <div className="flex justify-between items-center mb-6 lg:hidden">
                  <h2 className="text-2xl font-bold">Filters</h2>
                  <button onClick={() => setIsMobileFiltersOpen(false)}>
                    <X size={24} />
                  </button>
                </div>

                {/* Filter Container */}
                <div className="lg:bg-white lg:border lg:border-gray-200 lg:rounded-xl lg:shadow-sm lg:p-5 space-y-6">
                  {/* Header dla Sidebar */}
                  <div className="hidden lg:flex items-center gap-2 pb-4 border-b border-gray-100">
                    <Filter size={18} className="text-black" />
                    <span className="font-bold text-lg">Filters</span>
                    <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {filteredAuctions.length}
                    </span>
                  </div>

                  {/* SEARCH */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>

                  {/* --- SEKCJA 1: PRODUCT TYPE --- */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                      Product Type
                    </h3>
                    <div className="space-y-1">
                      {productTypes.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedProductType(option.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedProductType === option.id
                              ? "bg-black text-white shadow-md"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {option.icon}
                            <span>{option.label}</span>
                          </div>
                          {selectedProductType === option.id && (
                            <Check size={14} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* --- SEKCJA 2: SORT & LISTING TYPE --- */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                      Sort & Listing
                    </h3>
                    <div className="space-y-1">
                      {sortOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSortBy(option.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            sortBy === option.id
                              ? "bg-gray-100 text-black font-bold"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {option.icon}
                            <span>{option.label}</span>
                          </div>
                          {sortBy === option.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-black" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* --- SEKCJA 3: LIGI I KRAJE (Accordion) --- */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                      Categories
                    </h3>

                    {/* All Items Btn */}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 mb-2 rounded-lg text-sm font-bold transition-all ${
                        selectedCategory === "all"
                          ? "bg-gray-100 text-black"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Globe size={16} /> All Items
                    </button>

                    {/* Regions */}
                    <div className="space-y-1">
                      {categoryTree.map((region) => (
                        <div
                          key={region.id}
                          className="border-b border-gray-50 last:border-0 pb-1"
                        >
                          {/* Region Header */}
                          <button
                            onClick={() => toggleRegion(region.id)}
                            className="w-full flex items-center justify-between px-2 py-2 text-gray-900 font-bold hover:bg-gray-50 rounded-md group text-sm transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-gray-500 group-hover:text-black transition-colors">
                                {region.icon}
                              </span>
                              <span>{region.title}</span>
                            </div>
                            <ChevronDown
                              size={14}
                              className={`text-gray-400 transition-transform duration-200 ${
                                expandedRegions[region.id] ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {expandedRegions[region.id] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-2 pt-1 pb-2 space-y-4">
                                  {region.groups.map((group) => (
                                    <div key={group.id}>
                                      {/* Group Header */}
                                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 mt-2 px-2">
                                        {group.label}
                                      </h4>

                                      {/* Countries */}
                                      <div className="space-y-0.5 border-l-2 border-gray-100 ml-2 pl-2">
                                        {group.countries.map((country) => (
                                          <div key={country.id}>
                                            <button
                                              onClick={() =>
                                                toggleCountry(country.id)
                                              }
                                              className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                                            >
                                              <span>{country.label}</span>
                                              {expandedCountries[country.id] ? (
                                                <ChevronDown size={12} />
                                              ) : (
                                                <ChevronRight size={12} />
                                              )}
                                            </button>

                                            {/* Leagues (Deepest Level) */}
                                            <AnimatePresence>
                                              {expandedCountries[
                                                country.id
                                              ] && (
                                                <motion.div
                                                  initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                  }}
                                                  animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                  }}
                                                  exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                  }}
                                                  className="overflow-hidden"
                                                >
                                                  <div className="pl-3 mt-0.5 mb-1 space-y-0.5">
                                                    {country.leagues.map(
                                                      (league: string) => (
                                                        <button
                                                          key={league}
                                                          onClick={() => {
                                                            setSelectedCategory(
                                                              league
                                                            );
                                                            setIsMobileFiltersOpen(
                                                              false
                                                            );
                                                          }}
                                                          className={`w-full text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                                            selectedCategory ===
                                                            league
                                                              ? "bg-black text-white"
                                                              : "text-gray-500 hover:text-black hover:bg-gray-100"
                                                          }`}
                                                        >
                                                          {league}
                                                        </button>
                                                      )
                                                    )}
                                                  </div>
                                                </motion.div>
                                              )}
                                            </AnimatePresence>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="fixed inset-0 bg-black/20 -z-10 lg:hidden"
                onClick={() => setIsMobileFiltersOpen(false)}
              />
            </aside>

            {/* --- GRID (RIGHT SIDE) --- */}
            <div className="flex-1 w-full">
              {/* TOP HEADER ABOVE GRID */}
              <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200">
                <div>
                  <h1 className="text-4xl font-black text-black tracking-tighter mb-2">
                    Marketplace Explore
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
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
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
                  className="lg:hidden p-2 bg-black text-white rounded-lg"
                >
                  <Filter size={20} />
                </button>

                {selectedCategory !== "all" && (
                  <span className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="hover:text-gray-300"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}

                {selectedProductType !== "all" && (
                  <span className="bg-gray-100 text-black border border-gray-200 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                    {
                      productTypes.find((p) => p.id === selectedProductType)
                        ?.icon
                    }
                    {
                      productTypes.find((p) => p.id === selectedProductType)
                        ?.label
                    }
                    <button
                      onClick={() => setSelectedProductType("all")}
                      className="hover:text-gray-500"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>

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
                    filters. Try adjusting your search or categories.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSortBy("recommended");
                      setSelectedProductType("all");
                    }}
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

      <Footer />
    </main>
  );
}
