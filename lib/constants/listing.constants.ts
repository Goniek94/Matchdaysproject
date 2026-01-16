/**
 * Listing Constants
 * All constant values used in listing creation and management
 */

import {
  Shirt,
  Wind,
  Footprints,
  Package,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { Category, PhotoTypeHint } from "@/types/features/listing.types";

// ============================================
// CATEGORIES
// ============================================

export const CATEGORIES: Category[] = [
  {
    id: "shirts",
    label: "Shirts & Jerseys",
    desc: "Club/national team shirts, player jerseys, retro editions",
    icon: Shirt,
    verification: {
      requiredPhotos: [
        "front_far",
        "front_close",
        "back_far",
        "sponsor",
        "brand",
        "size_tag",
        "country_tag",
        "serial_code",
        "seams",
        "club_logo",
      ],
      optionalPhotos: [
        "back_close",
        "player_name",
        "player_number",
        "barcode",
        "autograph",
        "defect",
      ],
      specificFields: {
        hasAutograph: false,
        isVintage: false,
        tagCondition: "intact",
        hasDefects: false,
        defectTypes: [],
      },
    },
  },
  {
    id: "footwear",
    label: "Sports Footwear",
    desc: "Football boots, basketball shoes, tennis shoes",
    icon: Footprints,
    verification: {
      requiredPhotos: [
        "front_far",
        "front_close",
        "back_far",
        "sole",
        "inside",
        "brand",
        "size_tag",
        "serial_code",
      ],
      optionalPhotos: ["box", "back_close", "defect"],
      specificFields: {
        hasDefects: false,
        defectTypes: [],
      },
    },
  },
  {
    id: "pants",
    label: "Pants & Shorts",
    desc: "Club training pants, match shorts, team tracksuits",
    icon: Wind,
    verification: {
      requiredPhotos: [
        "front_far",
        "back_far",
        "brand",
        "size_tag",
        "club_logo",
      ],
      optionalPhotos: ["front_close", "back_close", "defect"],
      specificFields: {
        tagCondition: "intact",
        hasDefects: false,
        defectTypes: [],
      },
    },
  },
  {
    id: "jackets",
    label: "Jackets & Hoodies",
    desc: "Training jackets, team hoodies, windbreakers",
    icon: Wind,
    verification: {
      requiredPhotos: [
        "front_far",
        "back_far",
        "brand",
        "size_tag",
        "club_logo",
      ],
      optionalPhotos: ["front_close", "back_close", "defect"],
      specificFields: {
        tagCondition: "intact",
        hasDefects: false,
        defectTypes: [],
      },
    },
  },
  {
    id: "accessories",
    label: "Accessories",
    desc: "Scarves, hats, gloves, bags",
    icon: Package,
    verification: {
      requiredPhotos: ["front_far", "detail"],
      optionalPhotos: ["brand", "defect"],
      specificFields: {
        hasDefects: false,
        defectTypes: [],
      },
    },
  },
  {
    id: "equipment",
    label: "Sports Equipment",
    desc: "Balls, shin guards, goalkeeper gloves",
    icon: Trophy,
    verification: {
      requiredPhotos: ["front_far", "detail"],
      optionalPhotos: ["box", "brand", "defect"],
      specificFields: {
        hasDefects: false,
        defectTypes: [],
      },
    },
  },
];

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

// ============================================
// PHOTO LIMITS
// ============================================

export const PHOTO_LIMITS = {
  MIN: 5,
  MAX: 15,
} as const;

// ============================================
// LISTING TYPES
// ============================================

export const LISTING_TYPES = {
  AUCTION: "auction",
  BUY_NOW: "buy_now",
} as const;

// ============================================
// AUCTION DURATIONS
// ============================================

export const AUCTION_DURATIONS = [
  { id: "24h", label: "24 hours" },
  { id: "3d", label: "3 days" },
  { id: "7d", label: "7 days" },
  { id: "14d", label: "14 days" },
] as const;
