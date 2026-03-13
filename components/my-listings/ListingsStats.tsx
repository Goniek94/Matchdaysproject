"use client";

/**
 * ListingsStats Component
 * Displays summary statistics for the user's listings
 */

import {
  Package,
  CheckCircle2,
  Hourglass,
  Clock,
  ShoppingBag,
  Ban,
} from "lucide-react";
import type {
  ListingStats,
  ListingStatusFilter,
} from "@/types/features/listings.types";

// ─── Stat card config ─────────────────────────────────────────────────────────

const STAT_CARDS: {
  key: keyof ListingStats;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  filter: ListingStatusFilter;
}[] = [
  {
    key: "total",
    label: "Total",
    icon: <Package size={18} />,
    color: "text-gray-700",
    bg: "bg-gray-100",
    filter: "all",
  },
  {
    key: "active",
    label: "Active",
    icon: <CheckCircle2 size={18} />,
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    filter: "active",
  },
  {
    key: "upcoming",
    label: "Upcoming",
    icon: <Hourglass size={18} />,
    color: "text-blue-700",
    bg: "bg-blue-100",
    filter: "upcoming",
  },
  {
    key: "ended",
    label: "Ended",
    icon: <Clock size={18} />,
    color: "text-gray-500",
    bg: "bg-gray-100",
    filter: "ended",
  },
  {
    key: "sold",
    label: "Sold",
    icon: <ShoppingBag size={18} />,
    color: "text-purple-700",
    bg: "bg-purple-100",
    filter: "sold",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    icon: <Ban size={18} />,
    color: "text-red-600",
    bg: "bg-red-100",
    filter: "cancelled",
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface ListingsStatsProps {
  stats: ListingStats;
  activeFilter: ListingStatusFilter;
  onFilterChange: (filter: ListingStatusFilter) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListingsStats({
  stats,
  activeFilter,
  onFilterChange,
}: ListingsStatsProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {STAT_CARDS.map((card) => {
        const isActive = activeFilter === card.filter;
        const count = stats[card.key];

        return (
          <button
            key={card.key}
            onClick={() => onFilterChange(card.filter)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
              isActive
                ? "border-black bg-black text-white shadow-lg scale-[1.02]"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isActive ? "bg-white/20" : card.bg
              }`}
            >
              <span className={isActive ? "text-white" : card.color}>
                {card.icon}
              </span>
            </div>
            <div className="text-center">
              <div
                className={`text-xl font-black leading-none ${
                  isActive ? "text-white" : "text-gray-900"
                }`}
              >
                {count}
              </div>
              <div
                className={`text-xs font-semibold mt-0.5 ${
                  isActive ? "text-white/80" : "text-gray-500"
                }`}
              >
                {card.label}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
