"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useMyListings } from "@/lib/hooks/useMyListings";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DashboardSidebar,
  DashboardOverview,
  DashboardListings,
  DashboardMessages,
  DashboardAiTools,
  DashboardSettings,
  DashboardMobileNav,
} from "@/components/dashboard";
import type { DashboardTab } from "@/components/dashboard/DashboardSidebar";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [greeting, setGreeting] = useState("Good day");

  const {
    listings,
    stats: listingStats,
    loading: listingsLoading,
  } = useMyListings();

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-4 border-t-black animate-spin" />
          </div>
          <p className="text-gray-500 font-medium text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  // ── Not authenticated ──
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-3xl font-black mb-3 text-gray-900">
            Authentication Required
          </h2>
          <p className="text-gray-500 mb-6">
            Please log in to access your dashboard
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-bold shadow-lg"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const displayName = user.username || user.email || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  // ── Tab content renderer ──
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <DashboardOverview
            greeting={greeting}
            displayName={displayName}
            activeListings={listingStats.active}
            soldListings={listingStats.sold}
            totalListings={listingStats.total}
            listings={listings}
            listingsLoading={listingsLoading}
            onTabChange={handleTabChange}
          />
        );
      case "listings":
        return <DashboardListings />;
      case "messages":
        return <DashboardMessages />;
      case "aitools":
        return <DashboardAiTools />;
      case "favorites":
        return <FavoritesPlaceholder />;
      case "settings":
        return <DashboardSettings />;
      default:
        return null;
    }
  };

  return (
    // Full-height layout that sits below the navbar (pt-[80px] mobile / pt-[100px] desktop)
    <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] bg-gray-50 overflow-hidden">
      {/* ── Sidebar (desktop only) ── */}
      <div className="hidden lg:flex">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          username={user.username}
          initials={initials}
          role={user.role}
          onLogout={handleLogout}
        />
      </div>

      {/* ── Main content area ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="w-full px-6 py-8 pb-24 lg:pb-8">{renderContent()}</div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <DashboardMobileNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

// ─── Favorites placeholder ────────────────────────────────────────────────────

function FavoritesPlaceholder() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-black text-gray-900">Favorites</h2>
        <p className="text-xs text-gray-400 mt-0.5">Items you&apos;ve saved</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200/60 p-12 text-center">
        <span className="text-5xl mb-4 block">❤️</span>
        <p className="text-sm font-bold text-gray-400 mb-2">No favorites yet</p>
        <p className="text-xs text-gray-400">
          Browse auctions and save items you like
        </p>
        <Link
          href="/auctions"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors"
        >
          Browse Auctions
        </Link>
      </div>
    </div>
  );
}
