/**
 * Product Options Constants
 * Conditions, sizes, defect types, and brand options
 */

// ============================================
// CONDITION OPTIONS
// ============================================

export const CONDITIONS = [
  { id: "bnwt", label: "Brand New With Tags (BNWT)" },
  { id: "bnwot", label: "Brand New Without Tags (BNWOT)" },
  { id: "excellent", label: "Excellent - Like New" },
  { id: "good", label: "Good - Minor Wear" },
  { id: "fair", label: "Fair - Visible Wear" },
  { id: "poor", label: "Poor - Heavy Wear" },
] as const;

// ============================================
// SHIRT SIZES
// ============================================

export const SHIRT_SIZES = [
  { id: "xxxs", label: "XXXS" },
  { id: "xxs", label: "XXS" },
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "xxl", label: "XXL" },
  { id: "xxxl", label: "XXXL" },
  { id: "xxxxl", label: "XXXXL" },
  // Youth sizes
  { id: "ys", label: "YS (Youth S)" },
  { id: "ym", label: "YM (Youth M)" },
  { id: "yl", label: "YL (Youth L)" },
  { id: "yxl", label: "YXL (Youth XL)" },
  // Age-based kids
  { id: "3-4y", label: "3-4 years" },
  { id: "5-6y", label: "5-6 years" },
  { id: "7-8y", label: "7-8 years" },
  { id: "9-10y", label: "9-10 years" },
  { id: "11-12y", label: "11-12 years" },
  { id: "13-14y", label: "13-14 years" },
  { id: "other", label: "Other (specify in description)" },
] as const;

// ============================================
// DEFECT TYPES
// ============================================

export const DEFECT_TYPES = [
  { id: "stain", label: "Stain" },
  { id: "hole", label: "Hole/Tear" },
  { id: "fade", label: "Fading/Discoloration" },
  { id: "pilling", label: "Pilling" },
  { id: "seam", label: "Loose Seam" },
  { id: "print", label: "Print Damage" },
  { id: "zipper", label: "Zipper Issue" },
  { id: "button", label: "Missing Button" },
  { id: "other", label: "Other" },
] as const;

// ============================================
// BRAND OPTIONS
// ============================================

export const BRANDS = [
  { id: "nike", label: "Nike" },
  { id: "adidas", label: "Adidas" },
  { id: "puma", label: "Puma" },
  { id: "umbro", label: "Umbro" },
  { id: "kappa", label: "Kappa" },
  { id: "macron", label: "Macron" },
  { id: "new_balance", label: "New Balance" },
  { id: "under_armour", label: "Under Armour" },
  { id: "reebok", label: "Reebok" },
  { id: "asics", label: "ASICS" },
  { id: "mizuno", label: "Mizuno" },
  { id: "diadora", label: "Diadora" },
  { id: "lotto", label: "Lotto" },
  { id: "joma", label: "Joma" },
  { id: "hummel", label: "Hummel" },
  { id: "le_coq_sportif", label: "Le Coq Sportif" },
  { id: "errea", label: "Errea" },
  { id: "jako", label: "Jako" },
  { id: "uhlsport", label: "Uhlsport" },
  { id: "erreà", label: "Erreà" },
  { id: "castore", label: "Castore" },
  { id: "other", label: "Other (specify in description)" },
] as const;
