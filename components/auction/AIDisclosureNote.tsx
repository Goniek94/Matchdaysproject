"use client";

/**
 * Buyer-facing explainer that demystifies the AI confidence score.
 *
 * Why this exists — without it, a 45% AI score on a legitimate match-worn
 * jersey reads as "this might be fake" to a buyer who doesn't know that
 * tagless garments are normal in vintage / player-issue items. Vinted and
 * StockX both have similar disclosures next to their scoring widgets.
 *
 * Two display modes:
 *   • inline   — a single muted line that fits next to the score badge.
 *   • expanded — a small card with the full nuance for an auction detail
 *     page or a moderator decision panel.
 *
 * Update the copy here, not in inline JSX elsewhere — every page should
 * say the same thing about what the score means and doesn't mean.
 */
import React, { useState } from "react";
import { Info } from "lucide-react";

interface AIDisclosureNoteProps {
  variant?: "inline" | "expanded";
  /** Optional: surface the moderator's note that contextualises a low score. */
  moderatorNote?: string | null;
  className?: string;
}

export function AIDisclosureNote({
  variant = "inline",
  moderatorNote,
  className = "",
}: AIDisclosureNoteProps) {
  const [open, setOpen] = useState(variant === "expanded");

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={`inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700 cursor-pointer ${className}`}
      >
        <Info size={11} />
        <span>What does this score mean?</span>
        {open && (
          <span className="absolute mt-6 max-w-sm rounded-lg border border-gray-200 bg-white p-3 shadow-lg text-left text-[11px] text-gray-700 z-10">
            <ExplanationBody moderatorNote={moderatorNote} />
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-gray-50/60 p-3 ${className}`}
    >
      <div className="flex items-start gap-2">
        <Info size={14} className="text-gray-500 mt-0.5 shrink-0" />
        <div className="text-[12px] text-gray-700 leading-relaxed">
          <ExplanationBody moderatorNote={moderatorNote} />
        </div>
      </div>
    </div>
  );
}

function ExplanationBody({
  moderatorNote,
}: {
  moderatorNote?: string | null;
}) {
  return (
    <>
      <p>
        <strong>AI confidence</strong> is a probabilistic score based on what
        the AI can read from the photos &mdash; tags, stitching, materials,
        codes. It is <strong>not</strong> a guarantee of authenticity.
      </p>
      <p className="mt-2">
        A low score does <strong>not</strong> mean the item is fake. Common
        reasons for low scores on genuine items:
      </p>
      <ul className="mt-1 space-y-0.5 list-disc list-inside text-[11px]">
        <li>Match-worn jerseys often have tags removed by the club</li>
        <li>Pre-2005 vintage items predate hologram/RFID codes</li>
        <li>Blurry or reflective photo of a perfectly valid tag</li>
      </ul>
      <p className="mt-2">
        Every listing on Matchdays is reviewed by a moderator before going
        live, regardless of AI score.
      </p>
      {moderatorNote && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
            Moderator note
          </p>
          <p className="mt-1 italic">{moderatorNote}</p>
        </div>
      )}
    </>
  );
}
