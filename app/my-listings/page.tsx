"use client";

/**
 * My Listings Page
 * Displays all auctions created by the currently authenticated user
 * with filtering, stats and management actions (cancel, delete)
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PlusCircle,
  RefreshCw,
  Package,
  AlertCircle,
  List,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useMyListings } from "@/lib/hooks/useMyListings";
import {
  ListingCard,
  ListingsStats,
  ListingsEmptyState,
} from "@/components/my-listings";

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyListingsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

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
    relist,
  } = useMyListings();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  // ── Auth loading ────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-black mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // ── Not authenticated ───────────────────────────────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-3xl font-black mb-3 text-gray-900 uppercase">
            Sign in required
          </h2>
          <p className="text-gray-500 mb-6">
            Please log in to view your listings.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-bold shadow-lg uppercase"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // ── Handle actions ──────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    await remove(id);
  };

  const handleCancel = async (id: string) => {
    await cancel(id);
  };

  const handleUpdate = async (
    id: string,
    payload: import("@/types/features/listings.types").UpdateListingPayload,
  ): Promise<boolean> => {
    return update(id, payload);
  };

  const handleRelist = async (
    id: string,
    payload: import("@/components/my-listings/RelistAuctionModal").RelistPayload,
  ): Promise<boolean> => {
    return relist(id, payload);
  };

  // Boost is a future payment feature — placeholder returns true for now
  const handleBoost = async (
    _listingId: string,
    _tier: string,
  ): Promise<boolean> => {
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 lg:pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                <List size={20} className="text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                My Listings
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">
              Manage all your auction listings in one place
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh */}
            <button
              onClick={refresh}
              disabled={loading}
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              title="Refresh listings"
            >
              <RefreshCw
                size={18}
                className={`text-gray-600 ${loading ? "animate-spin" : ""}`}
              />
            </button>

            {/* Add listing CTA */}
            <Link
              href="/add-listing"
              className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg uppercase text-sm tracking-wide"
            >
              <PlusCircle size={18} />
              <span>New Listing</span>
            </Link>
          </div>
        </div>

        {/* ── Stats / Filter Tabs ──────────────────────────────────────────── */}
        <div className="mb-6">
          <ListingsStats
            stats={stats}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </div>

        {/* ── Error state ──────────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl mb-6">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-800">
                Failed to load listings
              </p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
            <button
              onClick={refresh}
              className="ml-auto text-xs font-bold text-red-700 hover:text-red-900 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Content ──────────────────────────────────────────────────────── */}
        {loading ? (
          /* Loading skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm">
            <ListingsEmptyState filter={statusFilter} />
          </div>
        ) : (
          /* Listings grid */
          <>
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 font-medium">
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {filteredListings.length}
                </span>{" "}
                {filteredListings.length === 1 ? "listing" : "listings"}
                {statusFilter !== "all" && (
                  <span className="text-gray-400"> · {statusFilter}</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onDelete={handleDelete}
                  onCancel={handleCancel}
                  onUpdate={handleUpdate}
                  onBoost={handleBoost}
                  onRelist={handleRelist}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Mobile Bottom Navigation ─────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
        <div className="grid grid-cols-4 h-20">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-black transition-colors"
          >
            <Package size={22} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase">Dashboard</span>
          </Link>
          <Link
            href="/my-listings"
            className="flex flex-col items-center justify-center gap-1 text-black bg-gray-50"
          >
            <List size={22} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase">Listings</span>
          </Link>
          <Link
            href="/add-listing"
            className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-black transition-colors"
          >
            <PlusCircle size={22} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase">Add</span>
          </Link>
          <Link
            href="/auctions"
            className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-black transition-colors"
          >
            <Package size={22} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase">Browse</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
