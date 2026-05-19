/**
 * Standardised display of an item's condition (NEW_WITH_TAGS … DAMAGED).
 *
 * Why a dedicated component:
 *   • Buyers see this on every listing card, auction detail, and order
 *     summary. Drifting between "Excellent" here, "Świetny" there, and
 *     a coloured dot on the third page erodes trust in the grade.
 *   • The colour palette signals quality at a glance (green=new,
 *     red=damaged) — keeping it in one file prevents per-page colour
 *     drift.
 *   • Condition codes are case-sensitive enum values; centralising the
 *     lookup means a typo in one render path can't silently show a
 *     blank badge.
 */
import React from "react";
import {
  CONDITION_DEFINITIONS,
  type ConditionGrade,
} from "@/lib/constants/condition-scale";

interface ConditionBadgeProps {
  grade: ConditionGrade | string | null | undefined;
  /** Include the short description as a second line. */
  showDescription?: boolean;
  className?: string;
}

export function ConditionBadge({
  grade,
  showDescription = false,
  className = "",
}: ConditionBadgeProps) {
  if (!grade) {
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold border bg-gray-100 text-gray-600 border-gray-300 ${className}`}
      >
        Not graded
      </span>
    );
  }

  const definition = CONDITION_DEFINITIONS[grade as ConditionGrade];

  if (!definition) {
    // Unknown grade — be honest about it rather than silently render
    // the wrong tier. Most likely cause: backend returned a legacy
    // free-text condition that wasn't migrated to the 7-tier enum.
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold border bg-gray-100 text-gray-700 border-gray-300 ${className}`}
        title={`Unknown condition: ${grade}`}
      >
        {String(grade)}
      </span>
    );
  }

  if (showDescription) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold border self-start ${definition.badgeColor}`}
        >
          {definition.label}
        </span>
        <p className="text-[11px] text-gray-600 leading-snug">
          {definition.shortDescription}
        </p>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold border ${definition.badgeColor} ${className}`}
      title={definition.shortDescription}
    >
      {definition.label}
    </span>
  );
}
