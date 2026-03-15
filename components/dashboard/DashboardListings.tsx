"use client";

import Link from "next/link";
import { PlusCircle, RefreshCw, AlertCircle } from "lucide-react";
import { useMyListings } from "@/lib/hooks/useMyListings";
import {
  ListingCard,
  ListingsStats,
  ListingsEmptyState,
} from "@/components/my-listings";
import type { UpdateListingPayload } from "@/types/features/listings.types";

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-8 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardListings() {
  const {
    filteredListings,
    stats,
    statusFilter,
    loading,
    error,
    setStatusFilter,
    refresh,
    remove,
    cancel,
    update,
  } = useMyListings();

  const handleDelete = async (id: string) => {
    await remove(id);
  };

  const handleCancel = async (id: string) => {
    await cancel(id);
  };

  const handleUpdate = async (
    id: string,
    payload: UpdateListingPayload,
  ): Promise<boolean> => {
    return update(id, payload);
  };

  const handleBoost = async (
    _listingId: string,
    _tier: string,
  ): Promise<boolean> => {
    return true;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-900">My Listings</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage all your auction listings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw
              size={16}
              className={`text-gray-600 ${loading ? "animate-spin" : ""}`}
            />
          </button>
          <Link
            href="/add-listing"
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors"
          >
            <PlusCircle size={15} />
            New Listing
          </Link>
        </div>
      </div>

      {/* Stats / Filter tabs */}
      <ListingsStats
        stats={stats}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800">
              Failed to load listings
            </p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
          <button
            onClick={refresh}
            className="text-xs font-bold text-red-700 hover:text-red-900 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200">
          <ListingsEmptyState filter={statusFilter} />
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 font-medium">
            Showing{" "}
            <span className="font-bold text-gray-700">
              {filteredListings.length}
            </span>{" "}
            {filteredListings.length === 1 ? "listing" : "listings"}
            {statusFilter !== "all" && (
              <span className="text-gray-400"> · {statusFilter}</span>
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onDelete={handleDelete}
                onCancel={handleCancel}
                onUpdate={handleUpdate}
                onBoost={handleBoost}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
