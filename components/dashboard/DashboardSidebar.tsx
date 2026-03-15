"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  List,
  MessageCircle,
  Sparkles,
  Heart,
  Settings,
  PlusCircle,
  LogOut,
  type LucideIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DashboardTab =
  | "overview"
  | "listings"
  | "messages"
  | "aitools"
  | "favorites"
  | "settings";

interface NavItem {
  id: DashboardTab;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  username: string | undefined;
  initials: string;
  role: string | undefined;
  onLogout: () => void;
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "listings", icon: List, label: "My Listings" },
  { id: "messages", icon: MessageCircle, label: "Messages" },
  { id: "aitools", icon: Sparkles, label: "AI Tools" },
  { id: "favorites", icon: Heart, label: "Favorites" },
  { id: "settings", icon: Settings, label: "Settings" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardSidebar({
  activeTab,
  onTabChange,
  username,
  initials,
  role,
  onLogout,
}: DashboardSidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link
          href="/"
          className="text-xl font-black tracking-widest uppercase text-black hover:opacity-70 transition-opacity"
        >
          MatchDays
        </Link>
        <p className="text-[11px] text-gray-400 font-medium mt-0.5 uppercase tracking-wider">
          Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, icon: Icon, label, badge }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                size={17}
                className={
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-700"
                }
              />
              <span>{label}</span>
              {badge !== undefined && badge > 0 && (
                <span
                  className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="px-3 pb-2">
        <div className="border-t border-gray-100 pt-3">
          {/* New Listing CTA */}
          <Link
            href="/add-listing"
            className="flex items-center gap-2.5 w-full px-3 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors mb-2"
          >
            <PlusCircle size={16} />
            <span>New Listing</span>
          </Link>
        </div>
      </div>

      {/* User footer */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {username}
            </p>
            {role === "admin" && (
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Admin
              </p>
            )}
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
