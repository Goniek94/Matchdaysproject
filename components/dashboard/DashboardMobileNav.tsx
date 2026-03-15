"use client";

import {
  LayoutDashboard,
  List,
  MessageCircle,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { DashboardTab } from "./DashboardSidebar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardMobileNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

interface NavItem {
  id: DashboardTab;
  icon: LucideIcon;
  label: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "overview", icon: LayoutDashboard, label: "Home" },
  { id: "listings", icon: List, label: "Listings" },
  { id: "messages", icon: MessageCircle, label: "Messages" },
  { id: "aitools", icon: Sparkles, label: "AI" },
  { id: "settings", icon: Settings, label: "Settings" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardMobileNav({
  activeTab,
  onTabChange,
}: DashboardMobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 lg:hidden z-50">
      <div className="grid grid-cols-5 h-[64px]">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-bold uppercase tracking-wide">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
