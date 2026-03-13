"use client";

/**
 * BoostListingModal
 * Modal for boosting / featuring a listing to increase visibility.
 * Offers different boost tiers with duration and price.
 */

import { useState, useEffect } from "react";
import { X, Zap, Star, Crown, CheckCircle2, Loader2 } from "lucide-react";
import type { MyListing } from "@/types/features/listings.types";

// ─── Boost tiers ──────────────────────────────────────────────────────────────

const BOOST_TIERS = [
  {
    id: "basic",
    label: "Basic Boost",
    icon: Zap,
    color: "blue",
    duration: "24 hours",
    price: 1.99,
    features: ["Top of search results", "Highlighted border"],
  },
  {
    id: "featured",
    label: "Featured",
    icon: Star,
    color: "amber",
    duration: "3 days",
    price: 4.99,
    features: [
      "Featured section placement",
      "Gold badge",
      "Priority in search",
    ],
    popular: true,
  },
  {
    id: "premium",
    label: "Premium Spotlight",
    icon: Crown,
    color: "purple",
    duration: "7 days",
    price: 9.99,
    features: [
      "Homepage banner",
      "Premium badge",
      "Email newsletter feature",
      "Social media share",
    ],
  },
] as const;

type BoostTierId = (typeof BOOST_TIERS)[number]["id"];

// ─── Color maps ───────────────────────────────────────────────────────────────

const COLOR_MAP = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    selectedBorder: "border-blue-500",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    selectedBorder: "border-amber-500",
    icon: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    button: "bg-amber-500 hover:bg-amber-600",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    selectedBorder: "border-purple-500",
    icon: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
    button: "bg-purple-600 hover:bg-purple-700",
  },
} as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface BoostListingModalProps {
  listing: MyListing;
  onClose: () => void;
  onBoost: (listingId: string, tier: BoostTierId) => Promise<boolean>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BoostListingModal({
  listing,
  onClose,
  onBoost,
}: BoostListingModalProps) {
  const [selected, setSelected] = useState<BoostTierId>("featured");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const selectedTier = BOOST_TIERS.find((t) => t.id === selected)!;
  const colors = COLOR_MAP[selectedTier.color];

  const handleBoost = async () => {
    setLoading(true);
    setError(null);

    const ok = await onBoost(listing.id, selected);

    setLoading(false);

    if (ok) {
      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } else {
      setError("Failed to boost listing. Please try again.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Zap size={20} className="text-yellow-400" />
              </div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight">
                  Boost Listing
                </h2>
                <p className="text-xs text-gray-400 truncate max-w-[220px]">
                  {listing.title}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              Increase visibility and get more bids
            </p>
          </div>

          {/* Tier selection */}
          <div className="p-6 space-y-3">
            {BOOST_TIERS.map((tier) => {
              const c = COLOR_MAP[tier.color];
              const Icon = tier.icon;
              const isSelected = selected === tier.id;

              return (
                <button
                  key={tier.id}
                  onClick={() => setSelected(tier.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? `${c.bg} ${c.selectedBorder} shadow-sm`
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? c.bg : "bg-gray-100"}`}
                      >
                        <Icon
                          size={18}
                          className={isSelected ? c.icon : "text-gray-400"}
                        />
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-gray-900">
                            {tier.label}
                          </span>
                          {"popular" in tier && tier.popular && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}
                            >
                              POPULAR
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {tier.duration}
                        </p>
                        <ul className="mt-1.5 space-y-0.5">
                          {tier.features.map((f) => (
                            <li
                              key={f}
                              className="flex items-center gap-1.5 text-xs text-gray-600"
                            >
                              <CheckCircle2
                                size={11}
                                className={
                                  isSelected ? c.icon : "text-gray-300"
                                }
                              />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <span className="text-lg font-black text-gray-900">
                        £{tier.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mx-6 mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-bold text-center">
              🚀 Listing boosted successfully!
            </div>
          )}

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={handleBoost}
              disabled={loading || success}
              className={`w-full py-4 rounded-2xl text-white font-black text-sm uppercase tracking-wide transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${colors.button}`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing…
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={18} />
                  Boosted!
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Boost for £{selectedTier.price.toFixed(2)}
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              Secure payment · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
