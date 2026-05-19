/**
 * Unified AI confidence display used wherever an auction surfaces its
 * AI-derived authenticity score.
 *
 * Trust policy this enforces (do NOT regress this in inline JSX):
 *   • Never says "Verified" — that word is reserved for items a moderator
 *     has explicitly stamped (see ModeratorVerifiedBadge for that signal).
 *   • Always surfaces the numeric score so the buyer sees the actual
 *     confidence, not a marketing label.
 *   • Low scores read as "Manual verification needed", not "Flagged" or
 *     "Suspicious" — a missing tag on a match-worn shirt is normal, not
 *     evidence of a counterfeit.
 *
 * If you find yourself building a one-off badge that calls AI output
 * "Verified" or "Authentic", import this instead.
 */
import React from "react";

export type AIConfidenceTier = "high" | "medium" | "low" | "none";

export function getAIConfidenceTier(score: number | null | undefined): AIConfidenceTier {
  if (score == null || score <= 0) return "none";
  if (score >= 80) return "high";
  if (score >= 50) return "medium";
  return "low";
}

interface AIConfidenceBadgeProps {
  score: number | null | undefined;
  /** Compact = just "AI 87%"; full = adds the descriptive label. */
  variant?: "compact" | "full";
  className?: string;
}

const TIER_LABELS: Record<AIConfidenceTier, string> = {
  high: "High confidence",
  medium: "Review recommended",
  low: "Manual verification",
  none: "Not analyzed",
};

const TIER_COLORS: Record<AIConfidenceTier, string> = {
  high: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  low: "bg-red-100 text-red-700 border-red-300",
  none: "bg-gray-100 text-gray-600 border-gray-300",
};

export function AIConfidenceBadge({
  score,
  variant = "compact",
  className = "",
}: AIConfidenceBadgeProps) {
  const tier = getAIConfidenceTier(score);
  const colorClass = TIER_COLORS[tier];

  if (tier === "none") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border ${colorClass} ${className}`}
      >
        {variant === "full" ? "Not yet analyzed" : "AI —"}
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border ${colorClass} ${className}`}
        title={TIER_LABELS[tier]}
      >
        AI {score}%
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${colorClass} ${className}`}
    >
      <span>AI {score}%</span>
      <span className="opacity-60">·</span>
      <span className="font-medium">{TIER_LABELS[tier]}</span>
    </span>
  );
}

/**
 * Separate badge for moderator-verified items. This is the ONLY badge that
 * should say "Verified" — and it only appears once a human moderator has
 * explicitly approved the listing (or, when post-MVP, marked it as
 * additionally verified beyond the standard approval flow).
 */
interface ModeratorVerifiedBadgeProps {
  className?: string;
}

export function ModeratorVerifiedBadge({
  className = "",
}: ModeratorVerifiedBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border bg-amber-100 text-amber-800 border-amber-300 ${className}`}
      title="Manually verified by a Matchdays moderator"
    >
      ✓ Verified by Matchdays
    </span>
  );
}
