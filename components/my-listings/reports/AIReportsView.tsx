"use client";

import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  Filter,
  ArrowDownUp,
  Info,
} from "lucide-react";
import type { MyListing } from "@/types/features/listings.types";
import AIReportCard from "./AIReportCard";
import { cn } from "@/lib/utils";

type SortMode = "newest" | "score_high" | "score_low";
type FilterTier = "all" | "verified" | "review" | "flagged";

const SORTS: { id: SortMode; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "score_high", label: "Score: high → low" },
  { id: "score_low", label: "Score: low → high" },
];

const TIERS: { id: FilterTier; label: string }[] = [
  { id: "all", label: "All reports" },
  { id: "verified", label: "Verified (80+)" },
  { id: "review", label: "Review (60-79)" },
  { id: "flagged", label: "Flagged (<60)" },
];

export default function AIReportsView({
  listings,
}: {
  listings: MyListing[];
}) {
  const [sort, setSort] = useState<SortMode>("newest");
  const [tier, setTier] = useState<FilterTier>("all");

  // Only listings with an AI analysis — manually-filled listings don't have one.
  const withReports = useMemo(
    () => listings.filter((l) => !!l.aiData),
    [listings],
  );

  const filtered = useMemo(() => {
    const items = withReports.filter((l) => {
      const s = Math.round(l.aiData?.authenticityScore ?? 0);
      if (tier === "verified") return s >= 80;
      if (tier === "review") return s >= 60 && s < 80;
      if (tier === "flagged") return s < 60;
      return true;
    });

    const sorted = [...items];
    if (sort === "newest") {
      sorted.sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      );
    } else if (sort === "score_high") {
      sorted.sort(
        (a, b) =>
          (b.aiData?.authenticityScore ?? 0) -
          (a.aiData?.authenticityScore ?? 0),
      );
    } else if (sort === "score_low") {
      sorted.sort(
        (a, b) =>
          (a.aiData?.authenticityScore ?? 0) -
          (b.aiData?.authenticityScore ?? 0),
      );
    }
    return sorted;
  }, [withReports, sort, tier]);

  // ─── Empty states ────────────────────────────────────────────────────────
  if (withReports.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Sparkles size={22} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-black text-gray-900 mb-1">
          No AI reports yet
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          When you publish a listing through the AI Smart flow, the full
          authenticity report — score, defects, positive findings, market
          price — gets saved here. Manually-filled listings don&apos;t generate
          a report.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <ShieldCheck size={14} className="text-emerald-500" />
          {filtered.length} of {withReports.length} report{withReports.length === 1 ? "" : "s"}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          {/* Tier filter */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <Filter size={12} className="text-gray-400 ml-2" />
            {TIERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTier(t.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors",
                  tier === t.id
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <ArrowDownUp size={12} className="text-gray-400 ml-2" />
            {SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors",
                  sort === s.id
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Helper note */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl">
        <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-[11px] text-blue-900 leading-relaxed">
          Click any row to view the full AI analysis — the same report you saw
          when listing the item. Reports are snapshots from the moment of
          publishing and won&apos;t re-scan.
        </p>
      </div>

      {/* Reports */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
          <p className="text-sm font-bold text-gray-700">
            No reports match this filter
          </p>
          <button
            onClick={() => {
              setTier("all");
              setSort("newest");
            }}
            className="text-xs text-gray-500 hover:text-black underline mt-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((l) => (
            <AIReportCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
