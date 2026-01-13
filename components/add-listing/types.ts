import {
  Shirt,
  Wind,
  Footprints,
  Package,
  Sparkles,
  Trophy,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

// Main product categories with specific fields for each
export const CATEGORIES: {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  requiredPhotos: {
    id: string;
    label: string;
    description: string;
    required: boolean;
  }[];
  specificFields: {
    id: string;
    label: string;
    type: "text" | "select" | "number";
    options?: string[];
    required: boolean;
    aiDetectable: boolean;
  }[];
}[] = [
  {
    id: "shirts",
    name: "Shirts & Jerseys",
    icon: Shirt,
    description: "Club/national team shirts, player jerseys, retro editions",
    requiredPhotos: [
      {
        id: "front",
        label: "Front",
        description: "Front view photo",
        required: false,
      },
      {
        id: "back",
        label: "Back",
        description: "Back view (with number if present)",
        required: false,
      },
      {
        id: "neckTag",
        label: "Neck Tag",
        description: "Close-up of manufacturer tag",
        required: false,
      },
      {
        id: "washTags",
        label: "Wash Tags",
        description: "Care instruction tags",
        required: false,
      },
      {
        id: "logo",
        label: "Club Logo",
        description: "Close-up of club badge/logo",
        required: false,
      },
      {
        id: "sponsor",
        label: "Sponsor",
        description: "Close-up of sponsor logo",
        required: false,
      },
    ],
    specificFields: [
      {
        id: "team",
        label: "Club/Team",
        type: "text",
        required: true,
        aiDetectable: true,
      },
      {
        id: "league",
        label: "League",
        type: "select",
        options: [
          "Premier League",
          "La Liga",
          "Serie A",
          "Bundesliga",
          "Ligue 1",
          "Ekstraklasa",
          "Other",
        ],
        required: false,
        aiDetectable: true,
      },
      {
        id: "season",
        label: "Season",
        type: "text",
        required: true,
        aiDetectable: true,
      },
      {
        id: "type",
        label: "Type",
        type: "select",
        options: ["Home", "Away", "Third", "Goalkeeper", "Training"],
        required: true,
        aiDetectable: true,
      },
      {
        id: "manufacturer",
        label: "Manufacturer",
        type: "select",
        options: [
          "Nike",
          "Adidas",
          "Puma",
          "Umbro",
          "New Balance",
          "Kappa",
          "Macron",
          "Other",
        ],
        required: true,
        aiDetectable: true,
      },
      {
        id: "playerName",
        label: "Player Name",
        type: "text",
        required: false,
        aiDetectable: true,
      },
      {
        id: "playerNumber",
        label: "Player Number",
        type: "text",
        required: false,
        aiDetectable: true,
      },
      {
        id: "size",
        label: "Size",
        type: "select",
        options: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        required: true,
        aiDetectable: true,
      },
      {
        id: "fit",
        label: "Fit",
        type: "select",
        options: ["Slim Fit", "Regular Fit", "Loose Fit"],
        required: false,
        aiDetectable: false,
      },
    ],
  },
  {
    id: "footwear",
    name: "Sports Footwear",
    icon: Footprints,
    description:
      "Football boots, basketball shoes (Jordans), tennis shoes, indoor sports footwear",
    requiredPhotos: [
      {
        id: "front",
        label: "Front",
        description: "Front view",
        required: false,
      },
      { id: "side", label: "Side", description: "Side view", required: false },
      {
        id: "sole",
        label: "Sole",
        description: "Sole photo",
        required: false,
      },
      {
        id: "insole",
        label: "Insole",
        description: "Insole with size",
        required: false,
      },
      {
        id: "box",
        label: "Box",
        description: "Original box (if available)",
        required: false,
      },
      {
        id: "tags",
        label: "Tags",
        description: "Internal tags",
        required: false,
      },
    ],
    specificFields: [
      {
        id: "brand",
        label: "Brand",
        type: "select",
        options: [
          "Nike",
          "Adidas",
          "Puma",
          "New Balance",
          "Asics",
          "Mizuno",
          "Under Armour",
          "Other",
        ],
        required: true,
        aiDetectable: true,
      },
      {
        id: "model",
        label: "Model",
        type: "text",
        required: true,
        aiDetectable: true,
      },
      {
        id: "colorway",
        label: "Colorway",
        type: "text",
        required: true,
        aiDetectable: true,
      },
      {
        id: "size",
        label: "Size",
        type: "text",
        required: true,
        aiDetectable: true,
      },
      {
        id: "sizeSystem",
        label: "Size System",
        type: "select",
        options: ["EU", "US", "UK"],
        required: true,
        aiDetectable: false,
      },
      {
        id: "studType",
        label: "Stud Type",
        type: "select",
        options: [
          "FG (Firm Ground)",
          "SG (Soft Ground)",
          "AG (Artificial Grass)",
          "IC (Indoor)",
          "TF (Turf)",
          "N/A",
        ],
        required: false,
        aiDetectable: false,
      },
    ],
  },
  {
    id: "pants",
    name: "Pants & Shorts",
    icon: Wind,
    description: "Club training pants, match shorts, team tracksuits",
    requiredPhotos: [
      {
        id: "front",
        label: "Front",
        description: "Front view",
        required: false,
      },
      { id: "back", label: "Back", description: "Back view", required: false },
      {
        id: "waistTag",
        label: "Waist Tag",
        description: "Size tag",
        required: false,
      },
      {
        id: "logo",
        label: "Logo",
        description: "Club/brand logo",
        required: false,
      },
    ],
    specificFields: [
      {
        id: "team",
        label: "Club/Team",
        type: "text",
        required: false,
        aiDetectable: true,
      },
      {
        id: "manufacturer",
        label: "Manufacturer",
        type: "select",
        options: [
          "Nike",
          "Adidas",
          "Puma",
          "Umbro",
          "Kappa",
          "Macron",
          "Other",
        ],
        required: true,
        aiDetectable: true,
      },
      {
        id: "type",
        label: "Type",
        type: "select",
        options: ["Training Pants", "Match Shorts", "Tracksuit", "Leggings"],
        required: true,
        aiDetectable: true,
      },
      {
        id: "size",
        label: "Size",
        type: "select",
        options: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        required: true,
        aiDetectable: true,
      },
      {
        id: "season",
        label: "Season",
        type: "text",
        required: false,
        aiDetectable: true,
      },
    ],
  },
  {
    id: "jackets",
    name: "Jackets & Hoodies",
    icon: Wind,
    description: "Club training jackets, team hoodies, windbreakers",
    requiredPhotos: [
      {
        id: "front",
        label: "Front",
        description: "Front view",
        required: false,
      },
      { id: "back", label: "Back", description: "Back view", required: false },
      {
        id: "neckTag",
        label: "Tag",
        description: "Manufacturer tag",
        required: false,
      },
      {
        id: "logo",
        label: "Logo",
        description: "Club/brand logo",
        required: false,
      },
    ],
    specificFields: [
      {
        id: "team",
        label: "Club/Team",
        type: "text",
        required: false,
        aiDetectable: true,
      },
      {
        id: "manufacturer",
        label: "Manufacturer",
        type: "select",
        options: [
          "Nike",
          "Adidas",
          "Puma",
          "Umbro",
          "Kappa",
          "Macron",
          "Other",
        ],
        required: true,
        aiDetectable: true,
      },
      {
        id: "type",
        label: "Type",
        type: "select",
        options: [
          "Training Jacket",
          "Hoodie",
          "Windbreaker",
          "Softshell",
          "Winter Jacket",
        ],
        required: true,
        aiDetectable: true,
      },
      {
        id: "size",
        label: "Size",
        type: "select",
        options: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        required: true,
        aiDetectable: true,
      },
      {
        id: "season",
        label: "Season",
        type: "text",
        required: false,
        aiDetectable: true,
      },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: Package,
    description: "Scarves, hats, gloves, bags",
    requiredPhotos: [
      {
        id: "front",
        label: "Front",
        description: "Main view",
        required: false,
      },
      {
        id: "back",
        label: "Back/Details",
        description: "Additional photo",
        required: false,
      },
      {
        id: "tags",
        label: "Tags",
        description: "Tags (if available)",
        required: false,
      },
    ],
    specificFields: [
      {
        id: "team",
        label: "Club/Team",
        type: "text",
        required: false,
        aiDetectable: true,
      },
      {
        id: "type",
        label: "Type",
        type: "select",
        options: [
          "Scarf",
          "Hat",
          "Gloves",
          "Bag",
          "Backpack",
          "Headband",
          "Other",
        ],
        required: true,
        aiDetectable: true,
      },
      {
        id: "manufacturer",
        label: "Manufacturer",
        type: "text",
        required: false,
        aiDetectable: true,
      },
    ],
  },
  {
    id: "equipment",
    name: "Sports Equipment",
    icon: Trophy,
    description: "Balls, shin guards, goalkeeper gloves",
    requiredPhotos: [
      {
        id: "front",
        label: "Main Photo",
        description: "Main view",
        required: false,
      },
      {
        id: "details",
        label: "Details",
        description: "Close-up of details",
        required: false,
      },
      {
        id: "tags",
        label: "Tags/Logo",
        description: "Tags or logo",
        required: false,
      },
    ],
    specificFields: [
      {
        id: "brand",
        label: "Brand",
        type: "text",
        required: true,
        aiDetectable: true,
      },
      {
        id: "model",
        label: "Model",
        type: "text",
        required: false,
        aiDetectable: true,
      },
      {
        id: "type",
        label: "Type",
        type: "select",
        options: ["Ball", "Shin Guards", "Goalkeeper Gloves", "Pump", "Other"],
        required: true,
        aiDetectable: true,
      },
      {
        id: "size",
        label: "Size",
        type: "text",
        required: false,
        aiDetectable: true,
      },
    ],
  },
];

// Condition options (same for all categories)
export const CONDITIONS = [
  {
    id: "bnwt",
    label: "Brand New With Tags (BNWT)",
    description: "New with tags",
  },
  {
    id: "bnwot",
    label: "Brand New Without Tags (BNWOT)",
    description: "New without tags",
  },
  { id: "excellent", label: "Excellent", description: "Excellent - like new" },
  {
    id: "good",
    label: "Good",
    description: "Good - minimal signs of wear",
  },
  {
    id: "fair",
    label: "Fair",
    description: "Fair - visible signs of wear",
  },
  {
    id: "poor",
    label: "Poor",
    description: "Poor - significant signs of wear",
  },
];

// Form data interface
export interface ListingFormData {
  // Category
  category: string;

  // Photos
  photos: Record<string, string | null>;
  additionalPhotos: string[]; // Optional additional photos (Step 6)

  // AI or Manual
  useAI: boolean;
  aiCreditsAvailable: number;

  // AI Generated (if useAI = true)
  aiGenerated: {
    title: string;
    description: string;
    confidence: number;
    detectedFields: Record<string, string>;
    estimatedValue: { min: number; max: number };
  } | null;

  // Manual/Editable fields
  title: string;
  description: string;
  specificFields: Record<string, string>;

  // Common fields
  condition: string;
  defects: string[];
  userNotes: string;

  // Shirt-specific defect fields
  hasDefects: boolean;
  defectPhotos: string[];
  serialCode: string;
  tagCondition: "normal" | "no_tag" | "cut_tag" | "faded_tag" | "pre_2005";

  // Pricing
  listingType: "auction" | "buy_now";
  startingBid?: number;
  bidIncrement?: number;
  buyNowPrice?: number;
  duration?: number; // days

  // Shipping
  shippingCost: number;
  shippingTime: string;
  shippingFrom: string;
}

export const INITIAL_FORM_DATA: ListingFormData = {
  category: "",
  photos: {},
  additionalPhotos: [],
  useAI: false,
  aiCreditsAvailable: 0,
  aiGenerated: null,
  title: "",
  description: "",
  specificFields: {},
  condition: "excellent",
  defects: [],
  userNotes: "",
  hasDefects: false,
  defectPhotos: [],
  serialCode: "",
  tagCondition: "normal",
  listingType: "auction",
  startingBid: 0,
  bidIncrement: 50,
  buyNowPrice: 0,
  duration: 7,
  shippingCost: 20,
  shippingTime: "3-5 business days",
  shippingFrom: "Poland",
};
