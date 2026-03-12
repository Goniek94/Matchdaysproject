/**
 * Category Constants
 * Definitions for all listing categories with their verification requirements
 */

import { Shirt, Wind, Footprints, Package, Trophy } from "lucide-react";
import type { Category } from "@/types/features/listing.types";

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
        "label",
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
