"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ShieldAlert,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import type { MyListing } from "@/types/features/listings.types";
import AIReportContent from "./AIReportContent";
import { cn } from "@/lib/utils";

/**
 * Single collapsed report row + inline expandable detail. Showing all reports
 * expanded by default would be a wall of cards; collapsed-first lets sellers
 * scan their portfolio of scores at a glance and dive into the ones they
 * care about (e.g. anything < 80).
 */
export default function AIReportCard({ listing }: { listing: MyListing }) {
  const [open, setOpen] = useState(false);

  const ai = listing.aiData;
  if (!ai) return null; // No report — caller should filter these out.

  const score = Math.round(ai.authenticityScore ?? 0);
  const defectsCount = ai.defects?.length ?? 0;

  // Label intentionally avoids "Verified" — every listing still goes
  // through a human moderator queue (/approvals), so even a high AI
  // score is just a recommendation, not a stamp of authenticity. Trust
  // language matches: "High AI confidence" vs "Review recommended" vs
  // "Potential issues". Buyer never sees this surface directly.
  const tier =
    score >= 80
      ? {
          label: "High AI confidence",
          icon: ShieldCheck,
          ring: "ring-emerald-200",
          chip: "bg-emerald-500 text-white",
          glow: "shadow-emerald-100",
        }
      : score >= 60
        ? {
            label: "Review recommended",
            icon: ShieldAlert,
            ring: "ring-amber-200",
            chip: "bg-amber-500 text-white",
            glow: "shadow-amber-100",
          }
        : {
            label: "Potential issues",
            icon: Shield,
            ring: "ring-red-200",
            chip: "bg-red-500 text-white",
            glow: "shadow-red-100",
          };

  const TierIcon = tier.icon;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all",
        open && `ring-2 ${tier.ring}`,
      )}
    >
      {/* Collapsed row — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50/60 transition-colors text-left"
      >
        {/* Thumbnail */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
          {listing.images?.[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">
              <Sparkles size={20} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">
            {listing.title}
          </p>
          <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-500">
            <span className="inline-flex items-center gap-1">
              {defectsCount === 0 ? (
                <>
                  <CheckCircle2 size={11} className="text-emerald-500" />
                  No defects
                </>
              ) : (
                <>
                  <AlertTriangle size={11} className="text-amber-500" />
                  {defectsCount} defect{defectsCount === 1 ? "" : "s"}
                </>
              )}
            </span>
            {ai.condition && (
              <span className="capitalize">· {ai.condition}</span>
            )}
            {ai.priceSuggested ? (
              <span>· €{ai.priceSuggested} suggested</span>
            ) : null}
          </div>
        </div>

        {/* Score chip */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-sm",
              tier.chip,
              tier.glow,
            )}
          >
            <TierIcon size={13} />
            {tier.label} {score}
          </div>
          {open ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded report */}
      {open && (
        <div className="border-t border-gray-100 bg-gray-50/30 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <AIReportContent
            aiData={ai}
            listingTitle={listing.title}
            generatedAt={listing.startTime}
          />
          <div className="mt-4 flex justify-end">
            <Link
              href={`/auction/${listing.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
            >
              Open listing
              <ExternalLink size={11} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
