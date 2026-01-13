import {
  Shirt,
  Wind,
  Footprints,
  Package,
  Trophy,
  LucideIcon,
} from "lucide-react";

// ============================================
// PHOTO TYPES
// ============================================

export type PhotoTypeHint =
  | "front_far" // Zdjęcie z przodu z daleka
  | "front_close" // Zdjęcie z przodu z bliska
  | "back_far" // Zdjęcie z tyłu z daleka
  | "back_close" // Zdjęcie z tyłu z bliska
  | "sponsor" // Zdjęcie sponsora
  | "brand" // Zdjęcie marki (Nike, Adidas, etc.)
  | "size_tag" // Rozmiarówka
  | "country_tag" // Kraj produkcji
  | "serial_code" // Kod seryjny
  | "player_name" // Tytuł/nazwisko (jeśli jest)
  | "player_number" // Numer (jeśli jest)
  | "seams" // Szwy
  | "club_logo" // Logo klubu
  | "label" // Metka ogólna
  | "detail" // Szczegół
  | "sole" // Podeszwa (dla butów)
  | "inside" // Wnętrze (dla butów)
  | "box" // Pudełko
  | "barcode" // Kod kreskowy
  | "autograph" // Autograf
  | "defect" // Defekt
  | null;

export interface Photo {
  id: string;
  url: string;
  typeHint: PhotoTypeHint;
}

// ============================================
// CATEGORY VERIFICATION REQUIREMENTS
// ============================================

export interface CategoryVerificationRequirements {
  requiredPhotos: PhotoTypeHint[];
  optionalPhotos: PhotoTypeHint[];
  specificFields: {
    hasAutograph?: boolean;
    isVintage?: boolean; // Pre-2005
    tagCondition?: "intact" | "cut" | "washed_out" | "missing";
    hasDefects?: boolean;
    defectTypes?: string[];
  };
}

// ============================================
// CATEGORY DEFINITIONS
// ============================================

export interface Category {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  verification: CategoryVerificationRequirements;
}

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
        "front_far", // Buty z przodu z daleka
        "front_close", // Buty z przodu z bliska
        "back_far", // Buty z tyłu
        "sole", // Podeszwa (ważne dla weryfikacji)
        "inside", // Wnętrze buta (metka, rozmiar)
        "brand", // Logo marki na bucie
        "size_tag", // Metka z rozmiarem wewnątrz
        "serial_code", // Kod seryjny (jeśli jest)
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
];

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
];

// ============================================
// BRAND OPTIONS
// ============================================

export const BRANDS = [
  // Major Sports Brands
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
];

// ============================================
// AI ANALYSIS RESULT
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
    score: number; // 0-100
    verdict: "very_high" | "high" | "medium" | "low";
    reasons: string[];
  };
  assets: {
    generatedModelImageUrl?: string;
  };
}

// ============================================
// FORM DATA STRUCTURE
// ============================================

export interface SmartFormData {
  // Step 1: Category Selection
  category: string;
  categorySlug: string;

  // Step 2: Completion Mode Selection (BEFORE photos)
  completionMode: "AI" | "MANUAL" | null;

  // AI Features Selection (what AI should help with)
  aiFeatures: {
    autoTitle: boolean;
    autoDescription: boolean;
    autoPhotos: boolean; // AI photo analysis
    verification: boolean; // Authenticity check
    pricing: boolean; // Price suggestion
  };

  // Step 3: Photos (min 5, max 15)
  photos: Photo[];

  // Step 4: Product Details (AI or Manual)
  title: string;
  description: string;
  brand: string;
  model: string;
  club: string;
  season: string;
  size: string;
  condition: string;

  // Category-specific verification fields
  verification: {
    hasAutograph: boolean;
    autographDetails: string;
    isVintage: boolean; // Pre-2005
    vintageYear: string;
    tagCondition: "intact" | "cut" | "washed_out" | "missing";
    hasDefects: boolean;
    defects: Array<{
      type: string;
      description: string;
      photoId: string | null;
    }>;
  };

  // AI Analysis Data (only if AI mode)
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
  startPrice: string; // For auctions
  bidStep: string; // For auctions
  duration: string; // For auctions: 24h, 3d, 7d
}

// ============================================
// INITIAL STATE
// ============================================

export const INITIAL_STATE: SmartFormData = {
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
// HELPER FUNCTIONS
// ============================================

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find((cat) => cat.id === id);
};

export const getRequiredPhotosForCategory = (
  categoryId: string
): PhotoTypeHint[] => {
  const category = getCategoryById(categoryId);
  return category?.verification.requiredPhotos || [];
};

export const getOptionalPhotosForCategory = (
  categoryId: string
): PhotoTypeHint[] => {
  const category = getCategoryById(categoryId);
  return category?.verification.optionalPhotos || [];
};

export const hasRequiredPhotos = (
  photos: Photo[],
  categoryId: string
): boolean => {
  const required = getRequiredPhotosForCategory(categoryId);
  const photoTypes = photos.map((p) => p.typeHint).filter(Boolean);

  return required.every((reqType) => photoTypes.includes(reqType));
};

export const getPublicationStatus = (
  authenticityScore: number
): "PUBLISHED" | "UNDER_REVIEW" | "FLAGGED" => {
  if (authenticityScore >= 90) return "PUBLISHED";
  if (authenticityScore >= 70) return "UNDER_REVIEW";
  return "FLAGGED";
};
