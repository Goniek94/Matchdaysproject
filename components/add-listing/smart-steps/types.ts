import {
  Shirt,
  Hexagon,
  Footprints,
  Trophy,
  Layers,
  Disc,
  LucideIcon,
} from "lucide-react";

// Siatka 3x2 (6 elementów) - Idealna na jeden ekran
export const CATEGORIES: {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  {
    id: "tops",
    label: "Tops & Kits",
    desc: "Jerseys, T-shirts",
    icon: Shirt,
  },
  {
    id: "outerwear",
    label: "Outerwear",
    desc: "Jackets, Hoodies",
    icon: Layers,
  },
  {
    id: "bottoms",
    label: "Bottoms",
    desc: "Shorts, Pants",
    icon: Hexagon,
  },
  {
    id: "footwear",
    label: "Footwear",
    desc: "Cleats, Sneakers",
    icon: Footprints,
  },
  {
    id: "accessories",
    label: "Accessories",
    desc: "Balls, Scarves",
    icon: Trophy,
  },
  {
    id: "other",
    label: "Other",
    desc: "Memorabilia & more",
    icon: Disc,
  },
];

export const CONDITIONS = [
  { id: "bnwt", label: "Brand New With Tags (BNWT)" },
  { id: "bnwot", label: "Brand New Without Tags (BNWOT)" },
  { id: "excellent", label: "Excellent Condition" },
  { id: "good", label: "Good Condition" },
  { id: "fair", label: "Fair Condition" },
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
};
