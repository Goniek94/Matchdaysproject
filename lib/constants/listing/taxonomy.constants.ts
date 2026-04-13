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
