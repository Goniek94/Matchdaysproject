import {
  Shirt,
  Wind,
  Footprints,
  Package,
  Trophy,
  HardHat,
  Zap,
  Target,
  Gamepad2,
  CircleDot,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Sports ───────────────────────────────────────────────────────────────────

export type SportId =
  | "football"
  | "basketball"
  | "f1"
  | "tennis"
  | "hockey"
  | "rugby"
  | "baseball"
  | "cricket"
  | "esports"
  | "other";

export interface Sport {
  id: SportId;
  label: string;
  icon: LucideIcon;
  color: string; // tailwind text color
}

export const SPORTS: Sport[] = [
  { id: "football",   label: "Football",        icon: CircleDot,  color: "text-green-600" },
  { id: "basketball", label: "Basketball",       icon: CircleDot,  color: "text-orange-500" },
  { id: "f1",         label: "Formula 1",        icon: Zap,        color: "text-red-600" },
  { id: "tennis",     label: "Tennis",           icon: Target,     color: "text-yellow-500" },
  { id: "hockey",     label: "Ice Hockey",       icon: Footprints, color: "text-blue-500" },
  { id: "rugby",      label: "Rugby",            icon: CircleDot,  color: "text-amber-700" },
  { id: "baseball",   label: "Baseball",         icon: CircleDot,  color: "text-blue-700" },
  { id: "cricket",    label: "Cricket",          icon: CircleDot,  color: "text-lime-600" },
  { id: "esports",    label: "Esports",          icon: Gamepad2,   color: "text-purple-500" },
  { id: "other",      label: "Other Sport",      icon: Trophy,     color: "text-gray-500" },
];

// ─── Item Categories ───────────────────────────────────────────────────────────

export type ItemCategoryId =
  | "jersey_shirt"
  | "shorts_pants"
  | "boots_cleats"
  | "sneakers"
  | "jacket_hoodie"
  | "tracksuit"
  | "race_suit"
  | "helmet"
  | "racing_gloves"
  | "goalkeeper_gloves"
  | "gloves"
  | "stick"
  | "racket"
  | "bat"
  | "pads"
  | "cap"
  | "accessories"
  | "equipment";

export interface ItemCategory {
  id: ItemCategoryId;
  label: string;
  icon: LucideIcon;
  /** Which sports this item type belongs to. Empty = all sports ("other" fallback). */
  sports: SportId[];
}

export const ITEM_CATEGORIES: ItemCategory[] = [
  {
    id: "jersey_shirt",
    label: "Jersey / Shirt",
    icon: Shirt,
    sports: ["football", "basketball", "hockey", "rugby", "baseball", "cricket", "esports", "other"],
  },
  {
    id: "shorts_pants",
    label: "Shorts / Pants",
    icon: Wind,
    sports: ["football", "basketball", "hockey", "rugby", "baseball", "cricket", "tennis", "other"],
  },
  {
    id: "boots_cleats",
    label: "Boots / Cleats",
    icon: Footprints,
    sports: ["football", "rugby", "cricket", "baseball", "other"],
  },
  {
    id: "sneakers",
    label: "Sneakers / Shoes",
    icon: Footprints,
    sports: ["basketball", "tennis", "other"],
  },
  {
    id: "jacket_hoodie",
    label: "Jacket / Hoodie",
    icon: Wind,
    sports: ["football", "basketball", "hockey", "rugby", "baseball", "cricket", "esports", "f1", "tennis", "other"],
  },
  {
    id: "tracksuit",
    label: "Tracksuit",
    icon: Wind,
    sports: ["football", "basketball", "hockey", "rugby", "other"],
  },
  {
    id: "race_suit",
    label: "Race Suit",
    icon: Zap,
    sports: ["f1"],
  },
  {
    id: "helmet",
    label: "Helmet",
    icon: HardHat,
    sports: ["f1", "hockey", "baseball", "cricket"],
  },
  {
    id: "racing_gloves",
    label: "Racing Gloves",
    icon: Package,
    sports: ["f1"],
  },
  {
    id: "goalkeeper_gloves",
    label: "Goalkeeper Gloves",
    icon: Package,
    sports: ["football"],
  },
  {
    id: "gloves",
    label: "Gloves",
    icon: Package,
    sports: ["hockey", "baseball", "cricket", "other"],
  },
  {
    id: "stick",
    label: "Stick",
    icon: Trophy,
    sports: ["hockey"],
  },
  {
    id: "racket",
    label: "Racket",
    icon: Target,
    sports: ["tennis"],
  },
  {
    id: "bat",
    label: "Bat",
    icon: Trophy,
    sports: ["baseball", "cricket"],
  },
  {
    id: "pads",
    label: "Pads / Protection",
    icon: Package,
    sports: ["hockey", "cricket", "baseball", "football"],
  },
  {
    id: "cap",
    label: "Cap / Hat",
    icon: Package,
    sports: ["baseball", "cricket", "f1", "tennis", "other"],
  },
  {
    id: "accessories",
    label: "Accessories",
    icon: Package,
    sports: ["football", "basketball", "hockey", "rugby", "baseball", "cricket", "tennis", "f1", "esports", "other"],
  },
  {
    id: "equipment",
    label: "Equipment",
    icon: Trophy,
    sports: ["football", "basketball", "hockey", "rugby", "baseball", "cricket", "tennis", "f1", "esports", "other"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns item categories available for a given sport */
export function getItemCategoriesForSport(sportId: SportId): ItemCategory[] {
  return ITEM_CATEGORIES.filter((cat) => cat.sports.includes(sportId));
}

/** Human-readable breadcrumb: "Football / Jersey" */
export function getCategoryBreadcrumb(sportId: string, itemCategoryId: string): string {
  const sport = SPORTS.find((s) => s.id === sportId);
  const item = ITEM_CATEGORIES.find((c) => c.id === itemCategoryId);
  if (!sport && !item) return "Other";
  if (!item) return sport?.label ?? "Other";
  if (!sport) return item.label;
  return `${sport.label} / ${item.label}`;
}

/** All valid item category IDs for AI prompt validation */
export const ALL_ITEM_CATEGORY_IDS: ItemCategoryId[] = ITEM_CATEGORIES.map((c) => c.id);

/** All valid sport IDs for AI prompt validation */
export const ALL_SPORT_IDS: SportId[] = SPORTS.map((s) => s.id);

// ─── Sizing options per category ──────────────────────────────────────────────
// Pre-analysis size picker — we show only the size groups that make sense
// for the item the seller is listing. No more EU shoe sizes on a jersey card.

export interface SizeGroup {
  /** Section header shown above the chip row. */
  label: string;
  /** Chips. Strings shown verbatim, persisted to `data.size` on pick. */
  sizes: string[];
}

const APPAREL_LETTER_GROUPS: SizeGroup[] = [
  { label: "Adult", sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] },
  { label: "Youth", sizes: ["YS", "YM", "YL", "YXL"] },
  {
    label: "Kids age",
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y"],
  },
];

const FOOTWEAR_GROUPS: SizeGroup[] = [
  {
    label: "EU",
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47"],
  },
  { label: "UK", sizes: ["5", "6", "7", "8", "9", "10", "11", "12"] },
];

const SIZE_GROUPS_BY_CATEGORY: Partial<Record<ItemCategoryId, SizeGroup[]>> = {
  jersey_shirt: APPAREL_LETTER_GROUPS,
  shorts_pants: APPAREL_LETTER_GROUPS,
  jacket_hoodie: APPAREL_LETTER_GROUPS,
  tracksuit: APPAREL_LETTER_GROUPS,
  race_suit: [
    { label: "Adult", sizes: ["XS", "S", "M", "L", "XL", "XXL"] },
    { label: "Numeric EU", sizes: ["46", "48", "50", "52", "54", "56", "58"] },
  ],
  boots_cleats: FOOTWEAR_GROUPS,
  sneakers: FOOTWEAR_GROUPS,
  helmet: [
    { label: "Adult", sizes: ["XS", "S", "M", "L", "XL"] },
    {
      label: "Circumference (cm)",
      sizes: ["54", "55", "56", "57", "58", "59", "60", "61", "62"],
    },
  ],
  goalkeeper_gloves: [
    { label: "Glove size", sizes: ["5", "6", "7", "8", "9", "10", "11", "12"] },
  ],
  racing_gloves: [
    { label: "Adult", sizes: ["XS", "S", "M", "L", "XL"] },
    { label: "Numeric", sizes: ["8", "9", "10", "11", "12"] },
  ],
  gloves: [{ label: "Size", sizes: ["XS", "S", "M", "L", "XL"] }],
  cap: [{ label: "Type", sizes: ["Adjustable", "S/M", "L/XL"] }],
  pads: [{ label: "Adult", sizes: ["XS", "S", "M", "L", "XL"] }],
  // Stick / racket / bat / accessories / equipment are free-form — sellers
  // type the size themselves via "Type custom" mode.
};

export function getSizeGroupsForCategory(
  categoryId: string | null | undefined,
): SizeGroup[] | null {
  if (!categoryId) return null;
  return SIZE_GROUPS_BY_CATEGORY[categoryId as ItemCategoryId] ?? null;
}

// ─── Measurement fields per category ──────────────────────────────────────────
// What buyers actually want to verify with a tape measure varies wildly by
// item. A pair of boots needs insole length, a jersey needs chest+length —
// no point asking for "chest" on a helmet.

export interface MeasurementField {
  /** Stable key — used for parsing/serialising the joined string. */
  key: string;
  /** Label shown to the seller. */
  label: string;
  /** Unit suffix. Most measurements are cm; helmets can be cm circumference. */
  unit: string;
  /** Optional hint shown under the input. */
  hint?: string;
}

const APPAREL_TOP_FIELDS: MeasurementField[] = [
  { key: "chest", label: "Chest", unit: "cm", hint: "pit-to-pit, laid flat" },
  { key: "length", label: "Length", unit: "cm", hint: "top of collar to hem" },
  { key: "sleeve", label: "Sleeve", unit: "cm", hint: "shoulder seam to cuff" },
];

const MEASUREMENT_FIELDS_BY_CATEGORY: Partial<
  Record<ItemCategoryId, MeasurementField[]>
> = {
  jersey_shirt: APPAREL_TOP_FIELDS,
  jacket_hoodie: [
    ...APPAREL_TOP_FIELDS,
    { key: "shoulder", label: "Shoulder", unit: "cm", hint: "seam-to-seam" },
  ],
  tracksuit: [
    ...APPAREL_TOP_FIELDS,
    { key: "waist", label: "Waist", unit: "cm" },
    { key: "inseam", label: "Inseam", unit: "cm" },
  ],
  shorts_pants: [
    { key: "waist", label: "Waist", unit: "cm", hint: "laid flat × 2" },
    { key: "inseam", label: "Inseam", unit: "cm", hint: "crotch to hem" },
    { key: "length", label: "Length", unit: "cm", hint: "waistband to hem" },
  ],
  race_suit: [
    { key: "chest", label: "Chest", unit: "cm" },
    { key: "waist", label: "Waist", unit: "cm" },
    { key: "inseam", label: "Inseam", unit: "cm" },
    { key: "sleeve", label: "Sleeve", unit: "cm" },
  ],
  boots_cleats: [
    {
      key: "insole",
      label: "Insole length",
      unit: "cm",
      hint: "heel to toe, inside",
    },
  ],
  sneakers: [
    {
      key: "insole",
      label: "Insole length",
      unit: "cm",
      hint: "heel to toe, inside",
    },
  ],
  helmet: [
    {
      key: "circumference",
      label: "Circumference",
      unit: "cm",
      hint: "widest part of the head opening",
    },
  ],
  goalkeeper_gloves: [
    { key: "palm", label: "Palm width", unit: "cm" },
    { key: "length", label: "Total length", unit: "cm" },
  ],
  racing_gloves: [
    { key: "palm", label: "Palm width", unit: "cm" },
    { key: "length", label: "Total length", unit: "cm" },
  ],
  gloves: [
    { key: "palm", label: "Palm width", unit: "cm" },
    { key: "length", label: "Total length", unit: "cm" },
  ],
  pads: [
    { key: "length", label: "Length", unit: "cm" },
    { key: "width", label: "Width", unit: "cm" },
  ],
  cap: [{ key: "circumference", label: "Inner circumference", unit: "cm" }],
};

export function getMeasurementFieldsForCategory(
  categoryId: string | null | undefined,
): MeasurementField[] | null {
  if (!categoryId) return null;
  return MEASUREMENT_FIELDS_BY_CATEGORY[categoryId as ItemCategoryId] ?? null;
}
