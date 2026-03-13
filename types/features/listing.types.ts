/**
 * Listing Types
 * TypeScript type definitions for listing features
 */

import type { LucideIcon } from "lucide-react";

// ============================================
// PHOTO TYPES
// ============================================

export type PhotoTypeHint =
  | "front_far"
  | "front_close"
  | "back_far"
  | "back_close"
  | "sponsor"
  | "brand"
  | "size_tag"
  | "country_tag"
  | "serial_code"
  | "combined_tag" // single photo covering size + country + serial on one label
  | "player_name"
  | "player_number"
  | "seams"
  | "club_logo"
  | "label"
  | "detail"
  | "sole"
  | "inside"
  | "box"
  | "barcode"
  | "autograph"
  | "defect"
  // Footwear-specific photo types
  | "top_view" // both shoes from above
  | "medial_side" // inner side of shoe
  | "lateral_side" // outer side of shoe
  | "heel_back" // heel/back view close-up
  | "toe_box" // front toe box shape + perforations
  | "outsole" // full sole bottom + branding
  | "tongue_label_outside" // tongue exterior
  | "tongue_label_inside" // tongue interior label (CRITICAL for legit check)
  | "insole_top" // insole from top (logo, print)
  | "insole_bottom" // insole bottom (factory code)
  | "stitching_detail" // close-up of stitching/glue quality
  | "material_closeup" // mesh/leather/suede texture
  | "box_label" // box label with SKU/UPC/date/country
  | "lace_eyelets" // lace holes count + laces
  | "wings_logo" // Jordan Wings logo (embossing depth)
  | "jumpman" // Jumpman logo on tongue/heel/side
  | "collab_detail" // collaboration-specific detail (reversed Swoosh, etc.)
  | "studs_plate" // football boots: stud/cleat pattern
  | "upper_closeup" // upper material close-up (microfiber/knit)
  | null;

export interface Photo {
  id: string;
  url: string;
  typeHint: PhotoTypeHint;
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface CategoryVerificationRequirements {
  requiredPhotos: PhotoTypeHint[];
  optionalPhotos: PhotoTypeHint[];
  specificFields: {
    hasAutograph?: boolean;
    isVintage?: boolean;
    tagCondition?: "intact" | "cut" | "washed_out" | "missing";
    hasDefects?: boolean;
    defectTypes?: string[];
  };
}

export interface Category {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  verification: CategoryVerificationRequirements;
}

// ============================================
// AI ANALYSIS TYPES
// ============================================

/**
 * AI analysis result returned from the backend (/ai/analyze endpoint).
 * This is the flat structure returned by Gemini Vision via NestJS.
 * @see lib/api/ai.ts for the API function
 */
export interface AIAnalysisResult {
  title: string;
  description: string;
  brand: string;
  team: string;
  season: string;
  model: string;
  size: string;
  sizeEU?: string;
  sizeUK?: string;
  productionYear?: string;
  condition: string;
  countryOfProduction: string;
  serialCode: string;
  playerName?: string;
  playerNumber?: string;
  priceMin: number;
  priceSuggested: number;
  priceMax: number;
  authenticityScore: number;
  authenticityLabel: string;
  authenticityNotes: string;
  verificationRoute: "auto_publish" | "manual_review" | "expert_required";
}

// ============================================
// FORM DATA TYPES
// ============================================

export interface SmartFormData {
  // Step 1: Category Selection
  category: string;
  categorySlug: string;

  // Step 2: Completion Mode Selection
  completionMode: "AI" | "MANUAL" | null;

  // AI Features Selection
  aiFeatures: {
    autoTitle: boolean;
    autoDescription: boolean;
    autoPhotos: boolean;
    verification: boolean;
    pricing: boolean;
  };

  // Step 3: Photos
  photos: Photo[];

  // Step 4: Product Details
  title: string;
  description: string;
  brand: string;
  model: string;
  club: string;
  season: string;
  size: string;
  condition: string;

  // Verification fields
  verification: {
    hasAutograph: boolean;
    autographDetails: string;
    isVintage: boolean;
    vintageYear: string;
    tagCondition: "intact" | "cut" | "washed_out" | "missing";
    hasDefects: boolean;
    defects: Array<{
      type: string;
      description: string;
      photoId: string | null;
    }>;
    // Tag options - user can indicate all tag info is on one photo
    tagsCombined: boolean;
    // Player print options - user can indicate no player name/number on shirt
    noPlayerPrint: boolean;
  };

  // AI Analysis Data
  aiData: AIAnalysisResult | null;

  // Verification Status
  verificationStatus:
    | "NOT_AI_VERIFIED"
    | "AI_VERIFIED_HIGH"
    | "AI_VERIFIED_MEDIUM"
    | "FLAGGED";

  // Step 5: Pricing & Listing Type
  listingType: "auction" | "buy_now";
  price: string;
  startPrice: string;
  bidStep: string;
  duration: string;
}

// ============================================
// INITIAL STATE
// ============================================

export const INITIAL_FORM_STATE: SmartFormData = {
  category: "",
  categorySlug: "",
  completionMode: null,
  aiFeatures: {
    autoTitle: true,
    autoDescription: true,
    autoPhotos: true,
    verification: true,
    pricing: true,
  },
  photos: [],
  title: "",
  description: "",
  brand: "",
  model: "",
  club: "",
  season: "",
  size: "",
  condition: "excellent",
  verification: {
    hasAutograph: false,
    autographDetails: "",
    isVintage: false,
    vintageYear: "",
    tagCondition: "intact",
    hasDefects: false,
    defects: [],
    tagsCombined: false,
    noPlayerPrint: false,
  },
  aiData: null,
  verificationStatus: "NOT_AI_VERIFIED",
  listingType: "auction",
  price: "",
  startPrice: "",
  bidStep: "",
  duration: "7d",
};

// ============================================
// UTILITY TYPES
// ============================================

export type ListingType = "auction" | "buy_now";
export type VerificationStatus =
  | "NOT_AI_VERIFIED"
  | "AI_VERIFIED_HIGH"
  | "AI_VERIFIED_MEDIUM"
  | "FLAGGED";
export type TagCondition = "intact" | "cut" | "washed_out" | "missing";
export type CompletionMode = "AI" | "MANUAL" | null;
