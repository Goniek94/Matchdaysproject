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

export interface AIAnalysisResult {
  recognition: {
    productType: string;
    brand: string;
    model: string;
    season: string;
    year: string;
    club: string;
    productionCountry: string;
    barcodeOrSku: string;
  };
  generatedContent: {
    title: string;
    description: string;
    bulletPoints: string[];
  };
  pricing: {
    marketMin: number;
    marketMax: number;
    suggestedPrice: number;
  };
  authenticity: {
    score: number;
    verdict: "very_high" | "high" | "medium" | "low";
    reasons: string[];
  };
  assets: {
    generatedModelImageUrl?: string;
  };
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
