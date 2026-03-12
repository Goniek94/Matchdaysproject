/**
 * Photo Groups Constants
 * Photo configuration and groups for each listing category
 */

import type { PhotoTypeHint } from "@/types/features/listing.types";

// ============================================
// PHOTO GROUP TYPES
// ============================================

export interface PhotoConfig {
  type: PhotoTypeHint;
  label: string;
  desc: string;
}

export interface PhotoGroup {
  id: string;
  title: string;
  description: string;
  photos: PhotoConfig[];
  hasTagQuestions?: boolean;
  hasPlayerOptions?: boolean;
  hasDetailsForm?: boolean;
  isExtra?: boolean;
}

// ============================================
// SHIRTS & JERSEYS
// ============================================

const SHIRT_PHOTO_GROUPS: PhotoGroup[] = [
  {
    id: "front",
    title: "Jersey Photos",
    description:
      "Lay the shirt flat on a clean surface. Take each photo separately — one shot per detail for best results.",
    photos: [
      {
        type: "front_far",
        label: "Full Front",
        desc: "Entire shirt visible — step back ~1m. Clean background.",
      },
      {
        type: "front_close",
        label: "Front Close-up",
        desc: "Centre of the shirt — fabric texture should be visible.",
      },
      {
        type: "club_logo",
        label: "Club Badge",
        desc: "Just the badge — fill the frame.",
      },
      {
        type: "sponsor",
        label: "Sponsor Logo",
        desc: "Main chest sponsor — sharp, no glare.",
      },
      {
        type: "brand",
        label: "Brand Logo",
        desc: "Nike / Adidas / Puma logo — fill the frame.",
      },
      {
        type: "seams",
        label: "Seams / Stitching",
        desc: "Turn the shirt inside-out and photograph the stitching.",
      },
    ],
  },
  {
    id: "tags",
    title: "Labels & Serial Code",
    description:
      "Each label separately — clear and in focus. Serial code can be typed manually if the tag is unreadable.",
    photos: [
      {
        type: "size_tag",
        label: "Size & Country Tag",
        desc: "Usually one label — shows size and 'Made in...'",
      },
      {
        type: "serial_code",
        label: "Serial Code Tag",
        desc: "Product code label (optional if missing)",
      },
      {
        type: "label",
        label: "Care Label",
        desc: "Large label in side seam or hem — fabric & wash info (optional)",
      },
    ],
    hasTagQuestions: true,
  },
  {
    id: "back",
    title: "Back of Jersey",
    description: "Capture the back clearly — name and number if present.",
    photos: [
      { type: "back_far", label: "Back (Full)", desc: "Full back view" },
      {
        type: "back_close",
        label: "Back (Close-up)",
        desc: "Back details (optional)",
      },
      {
        type: "player_number",
        label: "Player Number",
        desc: "Number close-up (if present)",
      },
      {
        type: "player_name",
        label: "Player Name",
        desc: "Name close-up (if present)",
      },
    ],
    hasPlayerOptions: true,
  },
  {
    id: "details",
    title: "Condition & Details",
    description: "Tell us about the shirt's condition and history",
    photos: [],
    hasDetailsForm: true,
  },
  {
    id: "extra",
    title: "More Photos",
    description: "Add any additional photos (optional)",
    photos: [],
    isExtra: true,
  },
];

// ============================================
// SPORTS FOOTWEAR
// ============================================

const FOOTWEAR_PHOTO_GROUPS: PhotoGroup[] = [
  {
    id: "exterior",
    title: "Exterior Photos",
    description: "Capture both shoes from multiple angles",
    photos: [
      {
        type: "front_far",
        label: "Side View (Full)",
        desc: "Both shoes side by side",
      },
      {
        type: "front_close",
        label: "Side View (Close-up)",
        desc: "Close-up of upper material",
      },
      {
        type: "back_far",
        label: "Back View",
        desc: "Heel and back of both shoes",
      },
      { type: "brand", label: "Brand Logo", desc: "Brand logo close-up" },
    ],
  },
  {
    id: "sole_inside",
    title: "Sole & Inside",
    description: "These photos are critical for authenticity verification",
    photos: [
      { type: "sole", label: "Sole", desc: "Bottom of both shoes — required" },
      {
        type: "inside",
        label: "Inside",
        desc: "Interior of both shoes — required",
      },
    ],
  },
  {
    id: "tags",
    title: "Tags & Labels",
    description: "Photograph all tags for size and serial verification",
    photos: [
      {
        type: "size_tag",
        label: "Size Tag",
        desc: "Size label inside the shoe — required",
      },
      {
        type: "serial_code",
        label: "Serial Code",
        desc: "Product code on tag or box",
      },
    ],
    hasTagQuestions: true,
  },
  {
    id: "box",
    title: "Box & Packaging",
    description: "Include box photos if available — boosts buyer confidence",
    photos: [
      { type: "box", label: "Shoe Box", desc: "Original box (optional)" },
      {
        type: "barcode",
        label: "Box Barcode",
        desc: "Barcode label on box (optional)",
      },
    ],
    isExtra: true,
  },
  {
    id: "details",
    title: "Condition & Details",
    description: "Describe the condition and any defects",
    photos: [],
    hasDetailsForm: true,
  },
];

// ============================================
// PANTS & SHORTS
// ============================================

const PANTS_PHOTO_GROUPS: PhotoGroup[] = [
  {
    id: "exterior",
    title: "Exterior Photos",
    description: "Capture the pants/shorts from front and back",
    photos: [
      {
        type: "front_far",
        label: "Front (Full)",
        desc: "Full front view — required",
      },
      {
        type: "front_close",
        label: "Front (Close-up)",
        desc: "Close-up of front details (optional)",
      },
      {
        type: "back_far",
        label: "Back (Full)",
        desc: "Full back view — required",
      },
      {
        type: "back_close",
        label: "Back (Close-up)",
        desc: "Back details (optional)",
      },
    ],
  },
  {
    id: "logos",
    title: "Logos & Tags",
    description: "Photograph brand and club logos, plus size tag",
    photos: [
      {
        type: "brand",
        label: "Brand Logo",
        desc: "Brand logo close-up — required",
      },
      {
        type: "club_logo",
        label: "Club Badge",
        desc: "Club badge or print — required",
      },
      { type: "size_tag", label: "Size Tag", desc: "Size label — required" },
    ],
    hasTagQuestions: true,
  },
  {
    id: "details",
    title: "Condition & Details",
    description: "Describe the condition and any defects",
    photos: [],
    hasDetailsForm: true,
  },
];

// ============================================
// JACKETS & HOODIES
// ============================================

const JACKET_PHOTO_GROUPS: PhotoGroup[] = [
  {
    id: "exterior",
    title: "Exterior Photos",
    description: "Capture the jacket/hoodie from front and back",
    photos: [
      {
        type: "front_far",
        label: "Front (Full)",
        desc: "Full front view — required",
      },
      {
        type: "front_close",
        label: "Front (Close-up)",
        desc: "Close-up of front details (optional)",
      },
      {
        type: "back_far",
        label: "Back (Full)",
        desc: "Full back view — required",
      },
      {
        type: "back_close",
        label: "Back (Close-up)",
        desc: "Back details (optional)",
      },
    ],
  },
  {
    id: "logos",
    title: "Logos & Tags",
    description: "Photograph brand and club logos, plus size tag",
    photos: [
      {
        type: "brand",
        label: "Brand Logo",
        desc: "Brand logo close-up — required",
      },
      {
        type: "club_logo",
        label: "Club Badge",
        desc: "Club badge or embroidery — required",
      },
      { type: "size_tag", label: "Size Tag", desc: "Size label — required" },
    ],
    hasTagQuestions: true,
  },
  {
    id: "details",
    title: "Condition & Details",
    description: "Describe the condition and any defects",
    photos: [],
    hasDetailsForm: true,
  },
];

// ============================================
// ACCESSORIES
// ============================================

const ACCESSORIES_PHOTO_GROUPS: PhotoGroup[] = [
  {
    id: "main",
    title: "Main Photos",
    description: "Capture the item clearly from all relevant angles",
    photos: [
      {
        type: "front_far",
        label: "Full View",
        desc: "Full item view — required",
      },
      {
        type: "detail",
        label: "Detail Shot",
        desc: "Close-up of key details — required",
      },
      {
        type: "brand",
        label: "Brand Logo",
        desc: "Brand logo or label (optional)",
      },
    ],
  },
  {
    id: "details",
    title: "Condition & Details",
    description: "Describe the condition and any defects",
    photos: [],
    hasDetailsForm: true,
  },
];

// ============================================
// SPORTS EQUIPMENT
// ============================================

const EQUIPMENT_PHOTO_GROUPS: PhotoGroup[] = [
  {
    id: "main",
    title: "Main Photos",
    description: "Capture the equipment clearly from all angles",
    photos: [
      {
        type: "front_far",
        label: "Full View",
        desc: "Full item view — required",
      },
      {
        type: "detail",
        label: "Detail Shot",
        desc: "Close-up of key details — required",
      },
      {
        type: "brand",
        label: "Brand Logo",
        desc: "Brand logo or label (optional)",
      },
    ],
  },
  {
    id: "packaging",
    title: "Box & Packaging",
    description: "Include packaging photos if available",
    photos: [
      {
        type: "box",
        label: "Original Box",
        desc: "Original packaging (optional)",
      },
    ],
    isExtra: true,
  },
  {
    id: "details",
    title: "Condition & Details",
    description: "Describe the condition and any defects",
    photos: [],
    hasDetailsForm: true,
  },
];

// ============================================
// CATEGORY → PHOTO GROUPS MAPPING
// ============================================

export const CATEGORY_PHOTO_GROUPS: Record<string, PhotoGroup[]> = {
  shirts: SHIRT_PHOTO_GROUPS,
  footwear: FOOTWEAR_PHOTO_GROUPS,
  pants: PANTS_PHOTO_GROUPS,
  jackets: JACKET_PHOTO_GROUPS,
  accessories: ACCESSORIES_PHOTO_GROUPS,
  equipment: EQUIPMENT_PHOTO_GROUPS,
};

/**
 * Get photo groups for a specific category with fallback defaults
 */
export const getPhotoGroupsForCategory = (categoryId: string): PhotoGroup[] => {
  return (
    CATEGORY_PHOTO_GROUPS[categoryId] ?? [
      {
        id: "main",
        title: "Photos",
        description: "Upload photos of your item",
        photos: [
          {
            type: "front_far",
            label: "Main Photo",
            desc: "Main view of the item — required",
          },
          {
            type: "detail",
            label: "Detail Shot",
            desc: "Close-up details (optional)",
          },
        ],
      },
      {
        id: "details",
        title: "Condition & Details",
        description: "Describe the condition and any defects",
        photos: [],
        hasDetailsForm: true,
      },
    ]
  );
};
