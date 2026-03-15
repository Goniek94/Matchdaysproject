"use client";

import Link from "next/link";
import { Bell, Settings, PlusCircle, Search } from "lucide-react";

interface DashboardHeaderProps {
  greeting: string;
  displayName: string;
}

export function DashboardHeader({
  greeting,
  displayName,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 tracking-wide">
            {greeting}
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mt-1">
            {displayName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <button className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-500 transition-colors min-w-[200px]">
            <Search size={15} />
            <span>Search…</span>
            <kbd className="ml-auto text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <button className="relative w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </button>

          {/* Settings */}
          <Link
            href="/settings"
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
          >
            <Settings size={18} />
          </Link>

          {/* New Listing CTA */}
          <Link
            href="/add-listing"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-bold text-sm shadow-sm hover:shadow-md"
          >
            <PlusCircle size={16} />
            <span>New Listing</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
