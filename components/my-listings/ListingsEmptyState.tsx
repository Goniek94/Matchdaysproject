"use client";

/**
 * ListingsEmptyState Component
 * Shown when the user has no listings or no listings match the current filter
 */

import Link from "next/link";
import { Package, PlusCircle } from "lucide-react";
import type { ListingStatusFilter } from "@/types/features/listings.types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ListingsEmptyStateProps {
  filter: ListingStatusFilter;
}

// ─── Config per filter ────────────────────────────────────────────────────────

const EMPTY_CONFIG: Record<
  ListingStatusFilter,
  { title: string; description: string; showCta: boolean }
> = {
  all: {
    title: "No listings yet",
    description:
      "You haven't created any listings. Start selling your football jerseys and collectibles!",
    showCta: true,
  },
  active: {
    title: "No active listings",
    description: "You don't have any active auctions right now.",
    showCta: true,
  },
  upcoming: {
    title: "No upcoming listings",
    description: "You don't have any scheduled auctions.",
    showCta: true,
  },
  ended: {
    title: "No ended listings",
    description: "None of your listings have ended yet.",
    showCta: false,
  },
  sold: {
    title: "No sold items",
    description: "You haven't sold anything yet. Keep listing!",
    showCta: false,
  },
  cancelled: {
    title: "No cancelled listings",
    description: "You haven't cancelled any listings.",
    showCta: false,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListingsEmptyState({
  filter,
}: ListingsEmptyStateProps) {
  const config = EMPTY_CONFIG[filter];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <Package size={36} className="text-gray-300" />
      </div>

      {/* Text */}
      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">
        {config.title}
      </h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
        {config.description}
      </p>

      {/* CTA */}
      {config.showCta && (
        <Link
          href="/add-listing"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg uppercase tracking-wide text-sm"
        >
          <PlusCircle size={18} />
          Create Listing
        </Link>
      )}
    </div>
  );
}
