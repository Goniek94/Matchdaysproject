import { Shirt, Wind, Footprints, LucideIcon } from "lucide-react";

// Sport categories - each has different verification requirements
export const CATEGORIES: {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  verificationSteps: string[]; // What photos are required for this category
}[] = [
  {
    id: "shirts",
    label: "Shirts & Jerseys",
    desc: "Football shirts, Basketball jerseys, Match worn",
    icon: Shirt,
    verificationSteps: [
      "front",
      "back",
      "neckTag",
      "washTags",
      "logo",
      "sponsor",
    ],
  },
  {
    id: "jackets",
    label: "Jackets & Outerwear",
    desc: "Training jackets, Windbreakers, Team jackets",
    icon: Wind,
    verificationSteps: ["front", "back", "neckTag", "washTags", "logo"],
  },
  {
    id: "hoodies",
    label: "Hoodies & Sweatshirts",
    desc: "Team hoodies, Training tops, Crew necks",
    icon: Wind,
    verificationSteps: ["front", "back", "neckTag", "washTags", "logo"],
  },
  {
    id: "footwear",
    label: "Footwear",
    desc: "Football boots, Basketball shoes, Tennis shoes",
    icon: Footprints,
    verificationSteps: ["front", "side", "sole", "insole", "box"],
  },
];

export const CONDITIONS = [
  { id: "bnwt", label: "Brand New With Tags (BNWT)" },
  { id: "bnwot", label: "Brand New Without Tags (BNWOT)" },
  { id: "excellent", label: "Excellent - Like New" },
  { id: "good", label: "Good - Minor Wear" },
  { id: "fair", label: "Fair - Visible Wear" },
  { id: "poor", label: "Poor - Heavy Wear" },
];

export interface SmartFormData {
  category: string;
  photos: {
    front: string | null;
    neckTag: string | null;
    back: string | null;
    nameset: string | null;
    logo: string | null;
    sponsor: string | null;
    seams: string | null;
    backDetail: string | null;
    washTags: string | null;
    codeTag: string | null;
    defects: string[];
  };
  productCode: string;
  isVintage: boolean;
  isNoTag: boolean;
  hasDefects: boolean;
  condition: string;
  userNotes: string;
  galleryPhotos: string[];
  aiGenerated: {
    title: string;
    description: string;
    team: string;
    brand: string;
    model: string;
    year: string;
    size: string;
    dimensions: string;
    country: string;
    estimatedValue: string;
  };
  listingType: "auction" | "buy_now";
  price: string;
  duration: string; // NOWE POLE
}

export const INITIAL_STATE: SmartFormData = {
  category: "",
  photos: {
    front: null,
    neckTag: null,
    back: null,
    nameset: null,
    logo: null,
    sponsor: null,
    seams: null,
    backDetail: null,
    washTags: null,
    codeTag: null,
    defects: [],
  },
  productCode: "",
  isVintage: false,
  isNoTag: false,
  hasDefects: false,
  condition: "excellent",
  userNotes: "",
  galleryPhotos: [],
  aiGenerated: {
    title: "",
    description: "",
    team: "",
    brand: "",
    model: "",
    year: "",
    size: "",
    dimensions: "",
    country: "",
    estimatedValue: "",
  },
  listingType: "auction",
  price: "",
  duration: "7", // Domyślna długość aukcji
};
