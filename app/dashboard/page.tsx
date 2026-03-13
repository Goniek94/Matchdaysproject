"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useMyListings } from "@/lib/hooks/useMyListings";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Settings,
  Heart,
  Package,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Receipt,
  Crown,
  PlusCircle,
  User,
  History,
  MessageCircle,
  List,
  Gavel,
  ShoppingBag,
  ExternalLink,
  Tag,
} from "lucide-react";
import Image from "next/image";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
  }).format(value);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Fetch user's listings for real stats
  const {
    listings,
    stats: listingStats,
    loading: listingsLoading,
  } = useMyListings();

  // Redirect to home if not authenticated after loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-900">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your dashboard
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-lg"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Real stats from listings
  const stats = [
    {
      label: "Active Listings",
      value: listingsLoading ? "…" : String(listingStats.active),
      icon: <Package size={20} />,
      color: "bg-blue-500",
    },
    {
      label: "Total Listings",
      value: listingsLoading ? "…" : String(listingStats.total),
      icon: <List size={20} />,
      color: "bg-gray-700",
    },
    {
      label: "Sold Items",
      value: listingsLoading ? "…" : String(listingStats.sold),
      icon: <ShoppingBag size={20} />,
      color: "bg-purple-500",
    },
    {
      label: "Success Rate",
      value:
        listingsLoading || listingStats.total === 0
          ? "—"
          : `${Math.round((listingStats.sold / listingStats.total) * 100)}%`,
      icon: <CheckCircle2 size={20} />,
      color: "bg-green-500",
    },
  ];

  // Get display name from user data
  const displayName = user.username || user.email || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  // Recent listings (last 3)
  const recentListings = listings.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 lg:pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-semibold">{displayName}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {initials}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {user.username}
                  </h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              {/* Verification Status */}
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-4 bg-green-50 border border-green-200">
                <CheckCircle2 className="text-green-600" size={20} />
                <span className="text-sm font-semibold text-green-900">
                  Verified Account
                </span>
              </div>

              {/* Role Badge */}
              {user.role === "admin" && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className="text-purple-600" size={20} />
                    <span className="font-bold text-purple-900 capitalize">
                      Admin
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {listingsLoading ? "…" : listingStats.total}
                  </div>
                  <div className="text-xs text-gray-600">Listings</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {listingsLoading ? "…" : listingStats.sold}
                  </div>
                  <div className="text-xs text-gray-600">Sold</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/add-listing"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  <PlusCircle size={20} />
                  <span>Add Listing</span>
                </Link>
                <Link
                  href="/my-listings"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-semibold text-gray-700"
                >
                  <List size={20} />
                  <span>My Listings</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-semibold text-gray-700"
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </Link>
                <Link
                  href="/messages"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-semibold text-blue-700"
                >
                  <MessageCircle size={20} />
                  <span>Messages</span>
                </Link>
              </div>
            </div>

            {/* AI Verification */}
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={24} />
                <h3 className="font-bold text-lg">AI Verification</h3>
              </div>
              <p className="text-white/90 text-sm mb-4">
                Verify authenticity of jerseys using our AI-powered tool
              </p>
              <Link
                href="/aitools"
                className="block w-full px-4 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-center"
              >
                Verify Jersey →
              </Link>
            </div>
          </div>

          {/* Right Column - Stats & Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-white mb-3`}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* My Listings - Recent */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <List size={22} className="text-gray-700" />
                  <h3 className="text-xl font-bold text-gray-900">
                    My Listings
                  </h3>
                </div>
                <Link
                  href="/my-listings"
                  className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All
                  <ExternalLink size={14} />
                </Link>
              </div>

              {listingsLoading ? (
                /* Skeleton */
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-3 rounded-xl bg-gray-50 animate-pulse"
                    >
                      <div className="w-14 h-14 rounded-lg bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentListings.length === 0 ? (
                /* Empty */
                <div className="text-center py-10 text-gray-400">
                  <Package size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No listings yet</p>
                  <Link
                    href="/add-listing"
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <PlusCircle size={16} />
                    Create your first listing
                  </Link>
                </div>
              ) : (
                /* Recent listings list */
                <div className="space-y-3">
                  {recentListings.map((listing) => {
                    const thumbnail = listing.images?.[0] ?? null;
                    const bidCount =
                      listing._count?.bids ?? listing.bidCount ?? 0;

                    return (
                      <Link
                        key={listing.id}
                        href={`/auction/${listing.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                          {thumbnail ? (
                            <Image
                              src={thumbnail}
                              alt={listing.title}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Tag size={20} className="text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate group-hover:text-black">
                            {listing.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {listing.team} · {listing.season}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-bold text-gray-900">
                              {formatPrice(listing.currentBid)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Gavel size={11} />
                              {bidCount}
                            </span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                            listing.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : listing.status === "sold"
                                ? "bg-purple-100 text-purple-700"
                                : listing.status === "upcoming"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {listing.status}
                        </span>
                      </Link>
                    );
                  })}

                  {/* Show more link if there are more */}
                  {listings.length > 3 && (
                    <Link
                      href="/my-listings"
                      className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-gray-500 hover:text-black border border-dashed border-gray-200 rounded-xl hover:border-gray-400 transition-all"
                    >
                      +{listings.length - 3} more listings
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Payment History placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Receipt size={24} className="text-gray-700" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Payment History
                  </h3>
                </div>
              </div>
              <div className="text-center py-8 text-gray-400">
                <Receipt size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No payment history yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
        <div className="grid grid-cols-4 h-20">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center gap-1 transition-colors text-black bg-gray-50"
          >
            <User size={24} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase">Dashboard</span>
          </Link>

          <Link
            href="/my-listings"
            className="flex flex-col items-center justify-center gap-1 transition-colors text-gray-400 hover:text-black"
          >
            <List size={24} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase">Listings</span>
          </Link>

          <Link
            href="/settings"
            className="flex flex-col items-center justify-center gap-1 transition-colors text-gray-400 hover:text-black"
          >
            <Settings size={24} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase">Settings</span>
          </Link>

          <Link
            href="/history"
            className="flex flex-col items-center justify-center gap-1 transition-colors text-gray-400 hover:text-black"
          >
            <History size={24} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase">History</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
