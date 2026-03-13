import {
  AUCTION_DURATIONS,
  CONDITIONS,
} from "@/lib/constants/listing.constants";
import type { SmartFormData } from "@/types/features/listing.types";

// ============================================
// DURATION & CONDITION HELPERS
// ============================================

/** Resolve human-readable label for auction duration */
export const getDurationLabel = (durationId: string): string => {
  const found = AUCTION_DURATIONS.find((d) => d.id === durationId);
  return found?.label ?? durationId;
};

/** Map condition value to short readable label */
export const getConditionLabel = (condition: string): string => {
  const found = CONDITIONS.find((c) => c.id === condition);
  if (found) return found.label;

  const lower = condition.toLowerCase();
  if (lower.startsWith("bnwt") || lower.includes("brand new with tags"))
    return "BNWT";
  if (lower.startsWith("bnwot") || lower.includes("brand new without tags"))
    return "BNWOT";
  if (lower.startsWith("excellent") || lower.includes("like new"))
    return "Excellent";
  if (lower.startsWith("good") || lower.includes("minor wear")) return "Good";
  if (lower.startsWith("fair") || lower.includes("visible wear")) return "Fair";
  if (lower.startsWith("poor") || lower.includes("heavy wear")) return "Poor";

  return condition.split(/[.\-,]/)[0].trim() || condition;
};

/** Get condition badge color classes */
export const getConditionColor = (condition: string): string => {
  const label = getConditionLabel(condition).toLowerCase();
  if (label === "bnwt" || label === "bnwot")
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (label === "excellent")
    return "bg-green-100 text-green-800 border-green-200";
  if (label === "good") return "bg-blue-100 text-blue-800 border-blue-200";
  if (label === "fair")
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (label === "poor") return "bg-red-100 text-red-800 border-red-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
};

// ============================================
// CATEGORY-SPECIFIC SPEC FIELDS
// ============================================

export interface SpecFieldConfig {
  key: string;
  label: string;
  getValue: (data: SmartFormData) => string | undefined | null;
}

/** Returns only the category-relevant detail rows (excluding condition & listing type) */
export const getCategoryDetailRows = (category: string): SpecFieldConfig[] => {
  const common: SpecFieldConfig[] = [
    { key: "brand", label: "Brand", getValue: (d) => d.brand },
  ];

  const map: Record<string, SpecFieldConfig[]> = {
    shirts: [
      { key: "model", label: "Model", getValue: (d) => d.model },
      { key: "club", label: "Club / Team", getValue: (d) => d.club },
      { key: "season", label: "Season", getValue: (d) => d.season },
      { key: "size", label: "Size", getValue: (d) => d.size },
      {
        key: "country",
        label: "Country",
        getValue: (d) => d.aiData?.countryOfProduction,
      },
      {
        key: "serialCode",
        label: "Serial Code",
        getValue: (d) => d.aiData?.serialCode,
      },
      {
        key: "playerName",
        label: "Player",
        getValue: (d) => d.aiData?.playerName,
      },
      {
        key: "playerNumber",
        label: "Number",
        getValue: (d) => d.aiData?.playerNumber,
      },
    ],
    footwear: [
      { key: "model", label: "Model", getValue: (d) => d.model },
      {
        key: "productionYear",
        label: "Production Year",
        getValue: (d) => d.aiData?.productionYear,
      },
      {
        key: "sizeEU",
        label: "Size (EU)",
        getValue: (d) => d.aiData?.sizeEU || d.size,
      },
      {
        key: "sizeUK",
        label: "Size (UK)",
        getValue: (d) => d.aiData?.sizeUK,
      },
      {
        key: "country",
        label: "Country",
        getValue: (d) => d.aiData?.countryOfProduction,
      },
      {
        key: "serialCode",
        label: "Style Code",
        getValue: (d) => d.aiData?.serialCode,
      },
    ],
    pants: [
      { key: "model", label: "Model", getValue: (d) => d.model },
      { key: "club", label: "Club / Team", getValue: (d) => d.club },
      { key: "season", label: "Season", getValue: (d) => d.season },
      { key: "size", label: "Size", getValue: (d) => d.size },
    ],
    jackets: [
      { key: "model", label: "Model", getValue: (d) => d.model },
      { key: "club", label: "Club / Team", getValue: (d) => d.club },
      { key: "season", label: "Season", getValue: (d) => d.season },
      { key: "size", label: "Size", getValue: (d) => d.size },
    ],
    accessories: [
      { key: "model", label: "Model", getValue: (d) => d.model },
      { key: "club", label: "Club / Team", getValue: (d) => d.club },
    ],
    equipment: [
      { key: "model", label: "Model", getValue: (d) => d.model },
      { key: "size", label: "Size", getValue: (d) => d.size },
    ],
  };

  const specific = map[category] ?? [
    { key: "model", label: "Model", getValue: (d) => d.model },
    { key: "club", label: "Club / Team", getValue: (d) => d.club },
    { key: "season", label: "Season", getValue: (d) => d.season },
    { key: "size", label: "Size", getValue: (d) => d.size },
  ];

  return [...common, ...specific];
};
