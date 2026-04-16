"use client";

import Link from "next/link";
import { Trophy, Plus, Crown, Star, Zap, Package, ArrowRight } from "lucide-react";

const RARITY_STYLE: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  common:    { label: "Common",    color: "text-gray-500 bg-gray-100",    icon: <Package size={12}/> },
  rare:      { label: "Rare",      color: "text-blue-700 bg-blue-50",     icon: <Star size={12}/> },
  epic:      { label: "Epic",      color: "text-purple-700 bg-purple-50", icon: <Zap size={12}/> },
  legendary: { label: "Legendary", color: "text-amber-700 bg-amber-50",   icon: <Crown size={12}/> },
};

export function DashboardCollection() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-900">My Collection</h2>
          <p className="text-xs text-gray-400 mt-0.5">Your personal trophy cabinet</p>
        </div>
        <Link
          href="/collection/add"
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
        >
          <Plus size={14}/> Add Item
        </Link>
      </div>

      {/* Rarity legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(RARITY_STYLE).map(([key, { label, color, icon }]) => (
          <div key={key} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>
              {icon} {label}
            </span>
            <p className="text-2xl font-black text-gray-900 mt-3">—</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">items</p>
          </div>
        ))}
      </div>

      {/* CTA to full page */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <Trophy size={32} className="text-amber-600" />
        </div>
        <h3 className="font-black text-gray-900 mb-1">Build your cabinet</h3>
        <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
          Track every jersey, signed item and rare collectible you own. Rank by rarity, make them public or private, list directly to auction.
        </p>
        <Link
          href="/collection/mine"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors"
        >
          Open My Collection <ArrowRight size={15}/>
        </Link>
      </div>
    </div>
  );
}
