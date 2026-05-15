"use client";

/**
 * DashboardScoring — sidebar tab that surfaces every saved AI authenticity
 * report for the user's listings.
 *
 * Pure projection over the same data `My Listings` uses — no extra fetching,
 * no duplicate state. The seller gets back the report they saw at publish
 * time (score, green/red flags, condition, defects, price estimate) without
 * the AI re-scanning. Manual listings without an AI run are filtered out.
 */

import { ShieldCheck, AlertCircle } from "lucide-react";
import { useMyListings } from "@/lib/hooks/useMyListings";
import AIReportsView from "@/components/my-listings/reports/AIReportsView";

export function DashboardScoring() {
  const { filteredListings, loading, error, refresh } = useMyListings();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-200">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              AI Scoring Reports
            </h1>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            Every authenticity report from the AI Smart listing flow lives
            here. Click a row to see the green flags, red flags, defects and
            price estimate AI produced at the moment of listing. Reports are
            snapshots — they don&apos;t re-scan.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800">
              Failed to load reports
            </p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
          <button
            onClick={refresh}
            className="text-xs font-bold text-red-700 hover:text-red-900 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Skeleton */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white rounded-2xl border border-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <AIReportsView listings={filteredListings} />
      )}
    </div>
  );
}

export default DashboardScoring;
