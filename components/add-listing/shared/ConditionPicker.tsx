"use client";

/**
 * 7-tier condition picker for the listing flow.
 *
 * Two display modes:
 *   • Standalone — seller picks the grade from scratch.
 *   • With AI suggestion — AI returns a recommended grade with reasoning;
 *     we pre-select it and show the seller WHY. If the seller disagrees,
 *     they can change it but must justify the change in a free-text field.
 *
 * The justification matters because the moderator arbitrates AI vs seller.
 * "Sleeves are perfect, only minor pilling under arms" is a useful note.
 * "Better than AI says" is not, and we surface that emptiness to the
 * moderator so they can push back.
 *
 * Per-category criteria are pulled lazily — passing `category` swaps the
 * hint text in the expandable details without re-rendering the whole list.
 */
import React, { useState } from "react";
import {
  CONDITION_GRADES,
  CONDITION_DEFINITIONS,
  getConditionCriteria,
  type ConditionGrade,
} from "@/lib/constants/condition-scale";

interface ConditionPickerProps {
  /** Item category — used to inject per-category criteria into hints. */
  category: string | null | undefined;
  /** Current selection. */
  value: ConditionGrade | null;
  onChange: (grade: ConditionGrade) => void;

  /** AI-suggested grade, if AI ran. Shown as a recommendation. */
  aiSuggestion?: ConditionGrade | null;
  /** AI's reasoning notes — shown under the suggestion. */
  aiReasoning?: string | null;

  /** Free-text justification when seller overrides AI. */
  overrideJustification?: string;
  onJustificationChange?: (value: string) => void;
}

export function ConditionPicker({
  category,
  value,
  onChange,
  aiSuggestion,
  aiReasoning,
  overrideJustification = "",
  onJustificationChange,
}: ConditionPickerProps) {
  const [expanded, setExpanded] = useState<ConditionGrade | null>(null);

  const isOverridingAI =
    aiSuggestion != null && value != null && value !== aiSuggestion;

  return (
    <div className="space-y-3">
      {aiSuggestion && (
        <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3">
          <p className="text-xs font-semibold text-blue-900">
            🤖 AI suggested: {CONDITION_DEFINITIONS[aiSuggestion].label}
          </p>
          {aiReasoning && (
            <p className="text-[11px] text-blue-800/80 mt-1 leading-snug">
              {aiReasoning}
            </p>
          )}
          <p className="text-[11px] text-blue-700/70 mt-1.5">
            You can change this — a moderator will review your override.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CONDITION_GRADES.map((grade) => {
          const def = CONDITION_DEFINITIONS[grade];
          const isSelected = value === grade;
          const isAISuggested = aiSuggestion === grade;
          const isOpen = expanded === grade;

          return (
            <div
              key={grade}
              className={`rounded-lg border transition-colors ${
                isSelected
                  ? "border-black ring-2 ring-black"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <button
                type="button"
                onClick={() => onChange(grade)}
                className="w-full text-left p-3 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${def.badgeColor}`}
                  >
                    {def.label}
                  </span>
                  {isAISuggested && (
                    <span className="text-[10px] text-blue-600 font-semibold">
                      AI pick
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-600 mt-1.5 leading-snug">
                  {def.shortDescription}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : grade)}
                className="w-full text-left px-3 pb-2 text-[10px] text-gray-500 hover:text-gray-700"
              >
                {isOpen ? "Hide criteria" : "What does this mean for this item?"}
              </button>

              {isOpen && (
                <div className="px-3 pb-3 border-t border-gray-100">
                  <ul className="mt-2 space-y-1">
                    {getConditionCriteria(category, grade).map((line, i) => (
                      <li
                        key={i}
                        className="text-[11px] text-gray-700 flex gap-1.5 leading-snug"
                      >
                        <span className="text-gray-400">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isOverridingAI && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 space-y-2">
          <p className="text-xs font-semibold text-amber-900">
            You&apos;re overriding the AI suggestion
          </p>
          <p className="text-[11px] text-amber-800/80 leading-snug">
            Write briefly WHY this item deserves a different grade than the AI
            picked. Moderators read this to settle the disagreement.
          </p>
          <textarea
            value={overrideJustification}
            onChange={(e) => onJustificationChange?.(e.target.value)}
            placeholder="e.g. Only the sleeves show fading — the front is perfect."
            rows={2}
            className="w-full px-2 py-1.5 rounded-md border border-amber-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
            maxLength={500}
          />
          <p className="text-[10px] text-amber-700/70 text-right">
            {overrideJustification.length}/500
          </p>
        </div>
      )}
    </div>
  );
}
