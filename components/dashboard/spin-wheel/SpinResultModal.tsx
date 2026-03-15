"use client";

import { useEffect } from "react";
import { X, Trophy, Tag, Star, Gift, RefreshCw } from "lucide-react";
import type { SpinResult } from "@/types/features/spin-wheel.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpinResultModalProps {
  result: SpinResult;
  onDismiss: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryStyles(category: string): {
  bg: string;
  border: string;
  badge: string;
  badgeText: string;
  icon: React.ReactNode;
} {
  switch (category) {
    case "premium":
      return {
        bg: "from-amber-500/20 via-yellow-400/10 to-transparent",
        border: "border-amber-400/40",
        badge: "bg-amber-500",
        badgeText: "GRAND PRIZE",
        icon: <Trophy size={20} className="text-amber-400" />,
      };
    case "subscription":
      return {
        bg: "from-orange-500/20 via-orange-400/10 to-transparent",
        border: "border-orange-400/40",
        badge: "bg-orange-500",
        badgeText: "SUBSCRIPTION",
        icon: <Gift size={20} className="text-orange-400" />,
      };
    case "discount":
      return {
        bg: "from-purple-500/20 via-pink-400/10 to-transparent",
        border: "border-purple-400/40",
        badge: "bg-purple-500",
        badgeText: "DISCOUNT",
        icon: <Tag size={20} className="text-purple-400" />,
      };
    case "loyalty":
      return {
        bg: "from-blue-500/20 via-cyan-400/10 to-transparent",
        border: "border-blue-400/40",
        badge: "bg-blue-500",
        badgeText: "LOYALTY POINTS",
        icon: <Star size={20} className="text-blue-400" />,
      };
    default:
      return {
        bg: "from-gray-500/20 to-transparent",
        border: "border-gray-400/40",
        badge: "bg-gray-500",
        badgeText: "RESULT",
        icon: <RefreshCw size={20} className="text-gray-400" />,
      };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SpinResultModal({ result, onDismiss }: SpinResultModalProps) {
  const { prize } = result;
  const styles = getCategoryStyles(prize.category);
  const isTryAgain = prize.category === "try_again";

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDismiss]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onDismiss}
    >
      {/* Modal card */}
      <div
        className={`relative w-full max-w-sm bg-gray-900 rounded-3xl border ${styles.border} overflow-hidden shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${styles.bg} pointer-events-none`}
        />

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 p-8 text-center">
          {/* Badge */}
          <span
            className={`inline-block px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-5 ${styles.badge}`}
          >
            {styles.badgeText}
          </span>

          {/* Emoji */}
          <div className="text-7xl mb-4 leading-none select-none">
            {prize.emoji}
          </div>

          {/* Prize name */}
          <h2 className="text-2xl font-black text-white mb-2">{prize.label}</h2>

          {/* Description */}
          <p className="text-sm text-gray-400 mb-6">{prize.description}</p>

          {/* Divider */}
          <div className="border-t border-white/10 mb-6" />

          {/* Info row */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6">
            {styles.icon}
            <span>
              {isTryAgain
                ? "Your next spin is available tomorrow"
                : "Reward has been added to your account"}
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={onDismiss}
            className={`w-full py-3 rounded-2xl font-bold text-sm transition-all ${
              isTryAgain
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
            }`}
          >
            {isTryAgain ? "Got it" : "Awesome! 🎉"}
          </button>
        </div>
      </div>
    </div>
  );
}
