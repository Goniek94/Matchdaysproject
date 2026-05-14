"use client";

import { Truck, Zap, MapPin, Info } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useShippingEstimate } from "@/lib/hooks/useShippingEstimate";
import {
  formatShippingDays,
  formatShippingRange,
} from "@/lib/api/shipping";
import { cn } from "@/lib/utils";

interface ShippingEstimateProps {
  /** Seller's country (auction.shippingFrom) */
  fromCountry: string | null | undefined;
  /** Item taxonomy category (auction.itemType) — affects weight */
  itemCategory?: string | null;
  /** Optional override for the buyer country (otherwise auth.user.country) */
  toCountryOverride?: string | null;
  /** Compact variant for AuctionCard (single line) */
  variant?: "compact" | "full";
  className?: string;
}

/**
 * Live shipping estimate displayed near the bid panel / on the card.
 * Logged-in users see the rate from seller → their own country; guests
 * see "Shipping from XX — sign in for a personal estimate".
 */
export default function ShippingEstimate({
  fromCountry,
  itemCategory,
  toCountryOverride,
  variant = "full",
  className,
}: ShippingEstimateProps) {
  const { user, isAuthenticated } = useAuth();
  const toCountry =
    toCountryOverride?.trim() || user?.country?.trim() || null;

  const { estimate, loading } = useShippingEstimate({
    fromCountry: fromCountry || undefined,
    toCountry: toCountry || fromCountry || undefined,
    itemCategory,
    enabled: !!fromCountry,
  });

  if (!fromCountry) return null;

  // No buyer country resolved — show a soft prompt (compact mode hides this).
  if (!toCountry) {
    if (variant === "compact") {
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] text-gray-500",
            className,
          )}
        >
          <Truck size={11} />+ shipping from {fromCountry.toUpperCase()}
        </span>
      );
    }
    return (
      <div
        className={cn(
          "flex items-start gap-2.5 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100",
          className,
        )}
      >
        <Info size={14} className="text-gray-400 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-600 leading-relaxed">
          Ships from <span className="font-semibold">{fromCountry.toUpperCase()}</span>.
          {" "}
          {!isAuthenticated ? (
            <>Sign in to see the cost to your country.</>
          ) : (
            <>Set your country in profile to see the shipping estimate.</>
          )}
        </p>
      </div>
    );
  }

  if (loading && !estimate) {
    if (variant === "compact") {
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] text-gray-400",
            className,
          )}
        >
          <Truck size={11} />+ shipping…
        </span>
      );
    }
    return (
      <div
        className={cn(
          "h-14 bg-gray-50 rounded-xl border border-gray-100 animate-pulse",
          className,
        )}
      />
    );
  }

  if (!estimate) return null;

  // ─── Compact (auction card) ──────────────────────────────────────────────
  if (variant === "compact") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500",
          className,
        )}
        title={`Estimate ${formatShippingRange(estimate.standard)} via ${estimate.standard.carrier}, ${formatShippingDays(estimate.standard)}.`}
      >
        <Truck size={11} className="text-gray-400" />
        + ~{formatShippingRange(estimate.standard)} shipping to {estimate.toCountry}
      </span>
    );
  }

  // ─── Full (auction detail / bid panel) ────────────────────────────────────
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-50 bg-gray-50/40">
        <Truck size={14} className="text-gray-500" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
          Estimated shipping
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold text-gray-400">
          <MapPin size={10} />
          {estimate.fromCountry} → {estimate.toCountry}
        </span>
      </div>

      <div className="divide-y divide-gray-50">
        {/* Standard */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            <Truck size={14} className="text-gray-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              Standard
            </p>
            <p className="text-[11px] text-gray-500 truncate">
              {estimate.standard.carrier} · {formatShippingDays(estimate.standard)}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-extrabold text-gray-900 tabular-nums">
              ~{formatShippingRange(estimate.standard)}
            </p>
          </div>
        </div>

        {/* Express */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Zap size={14} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              Express
            </p>
            <p className="text-[11px] text-gray-500 truncate">
              {estimate.express.carrier} · {formatShippingDays(estimate.express)}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-extrabold text-gray-900 tabular-nums">
              ~{formatShippingRange(estimate.express)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 border-t border-gray-50 flex items-start gap-1.5">
        <Info size={11} className="text-gray-400 mt-0.5 shrink-0" />
        <p className="text-[10px] text-gray-400 leading-relaxed">
          {estimate.disclaimer}
        </p>
      </div>
    </div>
  );
}
