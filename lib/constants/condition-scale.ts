/**
 * 7-tier condition scale used across the marketplace.
 *
 * Single source of truth for the values themselves AND the human-readable
 * description criteria the AI uses to grade an item from photos. Keep the
 * tier codes stable — they're stored on Order.feeTier-like fields and
 * Auction.finalCondition; renaming silently re-grades historical data.
 *
 * Per-category criteria sit alongside the tier definition because what
 * "Excellent" means for a jersey (fading, pilling) differs from boots
 * (sole wear, scuffs) or helmets (powder coat scratches). The AI prompt
 * gets the relevant per-category criteria injected so it grades against
 * the right rubric.
 */
export const CONDITION_GRADES = [
  "NEW_WITH_TAGS",
  "LIKE_NEW",
  "EXCELLENT",
  "VERY_GOOD",
  "GOOD",
  "FAIR",
  "DAMAGED",
] as const;

export type ConditionGrade = (typeof CONDITION_GRADES)[number];

export interface ConditionDefinition {
  code: ConditionGrade;
  /** Display label (English; PL translation handled per-locale at render). */
  label: string;
  /** Short one-liner that always applies. */
  shortDescription: string;
  /** Color hint for badges/labels. Tailwind class names. */
  badgeColor: string;
}

export const CONDITION_DEFINITIONS: Record<ConditionGrade, ConditionDefinition> = {
  NEW_WITH_TAGS: {
    code: "NEW_WITH_TAGS",
    label: "New with tags",
    shortDescription: "Original retail tag attached, factory creases, zero wear.",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  LIKE_NEW: {
    code: "LIKE_NEW",
    label: "Like new",
    shortDescription: "No retail tag but zero visible wear, pristine.",
    badgeColor: "bg-green-100 text-green-700 border-green-300",
  },
  EXCELLENT: {
    code: "EXCELLENT",
    label: "Excellent",
    shortDescription: "1–2 minor signs of use, colors vibrant, all elements intact.",
    badgeColor: "bg-lime-100 text-lime-800 border-lime-300",
  },
  VERY_GOOD: {
    code: "VERY_GOOD",
    label: "Very good",
    shortDescription: "Mild fading, few wear marks, no tears or stains.",
    badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  GOOD: {
    code: "GOOD",
    label: "Good",
    shortDescription: "Visible fading, multiple wear marks, minor stains allowed.",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-300",
  },
  FAIR: {
    code: "FAIR",
    label: "Fair",
    shortDescription: "Significant wear, stains or small tears, still complete.",
    badgeColor: "bg-orange-200 text-orange-900 border-orange-400",
  },
  DAMAGED: {
    code: "DAMAGED",
    label: "Damaged",
    shortDescription: "Major holes, tears, missing parts, structurally compromised.",
    badgeColor: "bg-red-100 text-red-800 border-red-300",
  },
};

/**
 * Per-category visual criteria. Used in two places:
 *   1. AI prompt — injected so Gemini grades against the right rubric.
 *   2. Seller UI — shown as expandable hints when picking a condition.
 *
 * Keep the criteria observation-based ("visible fading") not judgmental
 * ("looks worn"). That way the AI's reasoning is reviewable.
 */
export const CONDITION_CRITERIA_BY_CATEGORY: Record<
  string,
  Partial<Record<ConditionGrade, string[]>>
> = {
  jersey_shirt: {
    NEW_WITH_TAGS: [
      "Original retail tag visible and attached",
      "Factory folds/creases present",
      "Zero wear marks anywhere",
      "Pristine colors, no fading",
    ],
    LIKE_NEW: [
      "No retail tag (washed once or tag removed)",
      "Zero visible wear marks",
      "Original colors intact",
      "All patches securely attached",
    ],
    EXCELLENT: [
      "1–2 minor signs of use (slight stretching, minor pilling)",
      "Colors still vibrant",
      "All elements intact",
    ],
    VERY_GOOD: [
      "Mild fading after multiple washes",
      "2–5 minor wear marks visible",
      "No tears, holes, or stains",
      "All patches still secure",
    ],
    GOOD: [
      "Visible fading, dulled colors",
      "Multiple wear marks (loose threads, pilling)",
      "1–2 minor stains acceptable",
      "Complete (all parts present)",
    ],
    FAIR: [
      "Significant wear, faded",
      "Multiple stains or marks",
      "Loose stitching but intact",
      "Small holes/tears acceptable",
    ],
    DAMAGED: [
      "Major holes, tears, missing patches",
      "Permanent stains",
      "Structurally compromised",
    ],
  },
  footwear: {
    NEW_WITH_TAGS: [
      "Original box, factory wrappers/papers intact",
      "Untouched soles (no wear)",
      "Original laces unused",
    ],
    LIKE_NEW: [
      "Worn 1–2 times indoors",
      "Sole shows nearly no wear",
      "Uppers spotless",
    ],
    EXCELLENT: [
      "Light sole wear",
      "Uppers clean, minimal creasing",
      "All original parts (insoles, laces) present",
    ],
    VERY_GOOD: [
      "Visible sole wear",
      "Minor scuffs on uppers",
      "All structurally sound",
    ],
    GOOD: [
      "Significant sole wear",
      "Multiple scuffs/scratches",
      "Some creasing on uppers",
    ],
    FAIR: [
      "Heavy wear on soles (no holes)",
      "Worn uppers, repairable",
      "Original laces may be missing",
    ],
    DAMAGED: [
      "Holes in soles",
      "Torn uppers",
      "Non-functional",
    ],
  },
  helmet: {
    NEW_WITH_TAGS: [
      "Visor protective film intact",
      "Original box and certificate",
      "Zero scratches on shell",
    ],
    LIKE_NEW: [
      "No box but pristine shell",
      "Visor scratch-free",
      "All padding intact",
    ],
    EXCELLENT: [
      "Minor scratches on visor (not blocking visibility)",
      "Shell paint intact",
    ],
    VERY_GOOD: [
      "Light scratches on coating",
      "Functional, no structural issues",
    ],
    GOOD: [
      "Multiple visible scratches",
      "Paint chips on edges",
      "Structurally sound",
    ],
    FAIR: [
      "Damaged paint coating",
      "Heavy visor scratching",
      "Padding worn",
    ],
    DAMAGED: [
      "Cracked shell",
      "Compromised safety integrity",
      "Should NOT be used for protection",
    ],
  },
  // Sensible default — falls back to jersey criteria for unknown categories.
  default: {
    NEW_WITH_TAGS: ["Original packaging/tags attached", "Zero wear"],
    LIKE_NEW: ["No tags but pristine", "Zero visible wear"],
    EXCELLENT: ["Minor signs of use", "All elements intact"],
    VERY_GOOD: ["Light wear visible", "No damage"],
    GOOD: ["Multiple wear signs", "Complete"],
    FAIR: ["Significant wear", "Stains/marks present"],
    DAMAGED: ["Major damage or missing parts"],
  },
};

/**
 * Look up criteria with a safe fallback to the default rubric.
 * Lower-cases input because category slugs aren't always normalised
 * server-side and we don't want a typo to render an empty hint list.
 */
export function getConditionCriteria(
  category: string | null | undefined,
  grade: ConditionGrade,
): string[] {
  const normalised = (category || "").toLowerCase();
  const perCategory = CONDITION_CRITERIA_BY_CATEGORY[normalised];
  if (perCategory && perCategory[grade]) return perCategory[grade]!;
  return CONDITION_CRITERIA_BY_CATEGORY.default[grade] || [];
}
