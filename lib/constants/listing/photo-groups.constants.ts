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
  hint?: string; // extended shooting instruction shown as tooltip / tip bar
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
    title: "Jersey — Front",
    description:
      "Lay the shirt flat on a plain, light-coloured surface. Good lighting, no shadows. Take each photo separately — one element per shot.",
    photos: [
      {
        type: "front_far",
        label: "Full Front View",
        desc: "Whole shirt in frame — step back ~1 m. All four edges visible.",
        hint: "Stand directly above the flat shirt. The entire jersey — collar to hem, both sleeves — must fit inside the frame with no cropping.",
      },
      {
        type: "front_close",
        label: "Front Close-up",
        desc: "Centre of the chest — fabric weave clearly visible.",
        hint: "Hold the camera ~20 cm above the chest area. You should be able to see the texture of the fabric. Avoid blur.",
      },
      {
        type: "club_logo",
        label: "Club Badge",
        desc: "Only the badge — centred, fills the frame, sharp.",
        hint: "Get close so the badge fills at least 80% of the frame. Every stitch, colour, and detail should be readable. No fingers, no shadows.",
      },
      {
        type: "sponsor",
        label: "Sponsor Logo",
        desc: "Main chest sponsor — fully legible, no glare.",
        hint: "Frame just the sponsor logo. All letters/symbols must be sharp and fully in frame. Avoid reflections if the print is glossy.",
      },
      {
        type: "brand",
        label: "Brand Logo",
        desc: "Manufacturer logo (Nike/Adidas/Puma etc.) — fills the frame.",
        hint: "Zoom in so the brand mark fills the shot. The logo stitching or print detail must be clearly visible — this is a primary authenticity check.",
      },
      {
        type: "seams",
        label: "Stitching / Seams",
        desc: "Turn inside-out — photograph the seam stitching up close.",
        hint: "Flip the shirt inside-out. Photograph the side or shoulder seam from ~10 cm. The thread count, colour, and stitch pattern must all be visible.",
      },
    ],
  },
  {
    id: "tags",
    title: "Labels & Serial Code",
    description:
      "Each label photographed separately, flat, well-lit. All text must be fully readable. Do not use flash directly on tags — it causes overexposure.",
    photos: [
      {
        type: "size_tag",
        label: "Size & Country Tag",
        desc: "Size label — all text readable. Usually shows size, country of manufacture.",
        hint: "Lay the tag flat. Every line of text — size, country, fabric composition — must be sharp and readable. Fill the frame with the tag.",
      },
      {
        type: "serial_code",
        label: "Serial Code Tag",
        desc: "Small tag with product/serial code — all characters fully readable. Required.",
        hint: "This is the most critical authenticity tag. The alphanumeric code must be completely legible — photograph from directly above with good light. No blur, no glare. If the tag is missing, use the toggle above to explain why.",
      },
      {
        type: "label",
        label: "Care Label",
        desc: "Large label (side seam or hem) — wash/fabric info. (optional)",
        hint: "Usually a longer label in the left side seam. Lay it flat and photograph the full label — both washing symbols and printed text must be visible.",
      },
    ],
    hasTagQuestions: true,
  },
  {
    id: "back",
    title: "Jersey — Back",
    description:
      "Lay flat, same clean surface. Capture the full back, then close-ups of name and number separately if present.",
    photos: [
      {
        type: "back_far",
        label: "Full Back View",
        desc: "Entire back in frame — collar to hem, both sleeves visible.",
        hint: "Mirror the full-front shot. Stand directly above. All four edges of the shirt must fit in the frame with no cropping.",
      },
      {
        type: "back_close",
        label: "Back Close-up",
        desc: "Centre of the back — fabric and print detail visible. (optional)",
        hint: "Focus on the middle of the back, ~20 cm above the shirt. Useful for showing print quality, fading, or any marks.",
      },
      {
        type: "player_number",
        label: "Player Number",
        desc: "Just the number — fills the frame, sharp. (optional — only if present)",
        hint: "Get close so the number fills the frame. The edge of each digit, the print texture, and any layering (e.g. raised lettering) should all be visible. Skip if the jersey has no number.",
      },
      {
        type: "player_name",
        label: "Player Name",
        desc: "Just the name — fully in frame, sharp. (optional — only if present)",
        hint: "Frame only the name. All letters must be sharp and fully visible. If the name spans the full width, step back slightly. Skip if the jersey has no name.",
      },
    ],
    hasPlayerOptions: true,
  },
  {
    id: "details",
    title: "Condition & Size",
    description: "Tell us about the shirt's condition. AI will cross-check against your photos.",
    photos: [],
    hasDetailsForm: true,
  },
  {
    id: "extra",
    title: "Additional Photos",
    description: "Any extra photos that support authenticity — receipts, certificates, original packaging. (optional)",
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
    title: "Exterior — All Angles",
    description:
      "Place both shoes on a clean, flat surface. Shoot each angle separately. Natural or consistent indoor light — no harsh shadows.",
    photos: [
      {
        type: "front_far",
        label: "Side View — Both Shoes",
        desc: "Both shoes side by side — full profile, toe to heel.",
        hint: "Shoot at shoe-level, not from above. Both shoes fully in frame — the complete profile from toe to heel and sole to collar must be visible.",
      },
      {
        type: "detail",
        label: "Toe / Front View",
        desc: "Front of both shoes — toe box shape and any front branding visible.",
        hint: "Shoot from directly in front. The shape of the toe box and any front-facing branding or stitching must be clearly visible. Important for identifying fakes.",
      },
      {
        type: "back_far",
        label: "Heel View",
        desc: "Both heels — heel counter, back collar and any heel branding.",
        hint: "Shoot from directly behind both shoes. The heel counter shape, back collar stitching, and any heel logo or text must all be visible.",
      },
      {
        type: "front_close",
        label: "Upper Material Close-up",
        desc: "Upper material texture — leather, synthetic, or mesh clearly visible.",
        hint: "Get ~15 cm from the upper. The material texture (grain pattern, mesh holes, stitching) must be visible. Key check — fake uppers often have a noticeably different texture.",
      },
      {
        type: "brand",
        label: "Brand Logo Close-up",
        desc: "Brand logo — fills the frame, every detail sharp.",
        hint: "Zoom in so the brand mark fills the frame. Swoosh, three stripes, etc. — stitching or embossing detail must be clearly visible. Primary authenticity marker.",
      },
    ],
  },
  {
    id: "sole_inside",
    title: "Sole, Tongue & Interior",
    description:
      "Critical authenticity checks — all three required. Fakes are most often exposed here.",
    photos: [
      {
        type: "sole",
        label: "Sole (Bottom)",
        desc: "Full sole — stud/traction pattern, moulded text all readable.",
        hint: "Hold each shoe sole-up under good light. The stud or traction pattern, all moulded text (size, model code, country), and overall sole condition must be clearly visible.",
      },
      {
        type: "inside",
        label: "Tongue — Both Shoes",
        desc: "Tongue of both shoes — tongue branding, label, and stitching visible.",
        hint: "Open the shoe wide and photograph the tongue directly. The brand logo/text on the tongue, any sewn label, and the stitching attaching the tongue must all be sharp. Fakes frequently get the tongue wrong.",
      },
      {
        type: "back_close",
        label: "Interior / Insole",
        desc: "Inside both shoes — insole print and inner lining visible.",
        hint: "Remove the insole if possible and photograph it separately. The insole print (brand, size, model) must be legible. Also photograph the inner lining material.",
      },
    ],
  },
  {
    id: "tags",
    title: "Labels & Serial Code",
    description:
      "Each label photographed individually, flat, well-lit. All text must be fully readable.",
    photos: [
      {
        type: "size_tag",
        label: "Size Label",
        desc: "Label inside the shoe — size, country, model code all readable.",
        hint: "Usually on the tongue or inside the collar. Open the shoe wide. Every character — EU size, UK size, country of manufacture, model number — must be sharp and legible.",
      },
      {
        type: "serial_code",
        label: "Serial / Product Code",
        desc: "Product code tag — all characters fully readable. Required.",
        hint: "The alphanumeric code must be completely legible. Photograph from directly above with good light. No blur, no glare. If the code is on the box instead, photograph that.",
      },
    ],
    hasTagQuestions: true,
  },
  {
    id: "box_laces",
    title: "Box & Laces",
    description:
      "Box and original laces significantly affect value and authenticity. Include photos if you have them.",
    photos: [
      {
        type: "box",
        label: "Original Shoe Box",
        desc: "Full box — brand logo and model label visible. (optional — only if box included)",
        hint: "Photograph the box on a flat surface. Both the brand logo and the model/size label on the side must be visible. Also shows the box condition (new, worn, damaged).",
      },
      {
        type: "barcode",
        label: "Box Barcode Label",
        desc: "Barcode sticker on the box end — size and model code readable. (optional)",
        hint: "The barcode label on the short end of the box. All printed text — EU size, colour code, model number — must be legible. Cross-references with the shoe tag.",
      },
      {
        type: "label",
        label: "Laces — Original",
        desc: "Both laces laid flat — colour, length, and aglet branding visible. (optional)",
        hint: "Lay both laces flat next to each other. The colour, any aglet (tip) branding, and overall condition should be visible. Original laces vs replacements affects value.",
      },
    ],
    isExtra: true,
  },
  {
    id: "details",
    title: "Condition & Size",
    description: "Tell us about the footwear's condition. AI will cross-check against your photos.",
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
    title: "Front & Back",
    description:
      "Lay flat on a clean surface. Legs together, waistband visible. No creases that hide details.",
    photos: [
      {
        type: "front_far",
        label: "Full Front",
        desc: "Complete front view — waistband to hem, both legs in frame.",
        hint: "Lay the item flat. Stand directly above. Waistband, full length, and both leg openings must be visible with no cropping.",
      },
      {
        type: "front_close",
        label: "Front Close-up",
        desc: "Waistband area and any front print — close-up, sharp. (optional)",
        hint: "Focus on the waistband or any front logo/print. Fabric weave and print quality should be clearly visible.",
      },
      {
        type: "back_far",
        label: "Full Back",
        desc: "Complete back view — waistband to hem, both legs in frame.",
        hint: "Flip and lay flat again. Same framing as the front — full item, no cropping.",
      },
      {
        type: "back_close",
        label: "Back Close-up",
        desc: "Back waistband or rear pockets — close-up detail. (optional)",
        hint: "Focus on any back branding, drawstring, or pocket detail. Sharp and well-lit.",
      },
    ],
  },
  {
    id: "logos",
    title: "Logos & Labels",
    description:
      "Each logo and label photographed separately. All text and graphics must be fully readable.",
    photos: [
      {
        type: "brand",
        label: "Brand Logo",
        desc: "Brand logo only — fills the frame, sharp.",
        hint: "Zoom in so the brand mark fills the frame. Every detail of the logo (stitching or print, colour, edges) must be clear.",
      },
      {
        type: "club_logo",
        label: "Club Badge / Print",
        desc: "Club badge or team print — fills the frame, all detail visible.",
        hint: "Frame only the badge or team print. Every line, colour, and detail must be sharp. This is a primary authenticity marker.",
      },
      {
        type: "size_tag",
        label: "Size Label",
        desc: "Size label — all text readable.",
        hint: "Usually in the waistband. Lay flat and photograph from directly above. Size, country of manufacture, and fabric composition must all be legible.",
      },
    ],
    hasTagQuestions: true,
  },
  {
    id: "details",
    title: "Condition & Size",
    description: "Tell us about the item's condition.",
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
    title: "Front & Back",
    description:
      "Lay flat or hang on a plain wall. Zip/buttons closed. All panels and logos must be unobstructed.",
    photos: [
      {
        type: "front_far",
        label: "Full Front",
        desc: "Full jacket front — collar to hem, both sleeves visible.",
        hint: "Full length shot from directly in front. Collar, zip/buttons, and both sleeves must all fit in frame. No limbs or objects obstructing the view.",
      },
      {
        type: "front_close",
        label: "Front Close-up",
        desc: "Chest area — fabric and any prints clearly visible.",
        hint: "Focus on the chest — show fabric texture and any chest print. Useful for showing material quality and print fidelity.",
      },
      {
        type: "back_far",
        label: "Full Back",
        desc: "Full jacket back — collar to hem, both sleeves visible.",
        hint: "Same framing as front. The full back — including any back print, hood, or large graphics — must be completely visible.",
      },
      {
        type: "back_close",
        label: "Back Close-up",
        desc: "Back print or hood detail — close-up, sharp. (optional)",
        hint: "If there is a back graphic or hood feature, photograph it close-up. All text or graphics must be fully legible.",
      },
    ],
  },
  {
    id: "logos",
    title: "Logos & Labels",
    description:
      "Each logo and label photographed individually. All text and prints must be fully readable.",
    photos: [
      {
        type: "brand",
        label: "Brand Logo",
        desc: "Brand logo only — fills the frame, sharp.",
        hint: "Zoom in so the brand mark fills the frame. Stitching or print detail, colour accuracy, and edges should all be clear.",
      },
      {
        type: "club_logo",
        label: "Club Badge / Embroidery",
        desc: "Badge or embroidered crest — fills the frame, all detail visible.",
        hint: "Get close to the crest. Every stitch, colour, and outline must be sharp. Embroidered badges are a key authenticity checkpoint.",
      },
      {
        type: "size_tag",
        label: "Size Label",
        desc: "Inside neck or seam label — all text readable.",
        hint: "Usually in the collar or side seam. Lay flat and photograph from above. Size, fabric, and country information must all be legible.",
      },
    ],
    hasTagQuestions: true,
  },
  {
    id: "details",
    title: "Condition & Size",
    description: "Tell us about the jacket's condition.",
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
    title: "Item Photos",
    description:
      "Clean surface, good light. Capture the complete item and any key detail separately.",
    photos: [
      {
        type: "front_far",
        label: "Full Item View",
        desc: "Complete item in frame — all edges visible, clean background.",
        hint: "Lay the item flat or hold it against a plain background. The entire item must fit in frame with no cropping. Even lighting, no heavy shadows.",
      },
      {
        type: "detail",
        label: "Key Detail Close-up",
        desc: "The most important detail — logo, clasp, embroidery — close-up and sharp.",
        hint: "Choose the single most important feature for authenticity (typically the brand mark or main graphic). It should fill the frame and be completely sharp.",
      },
      {
        type: "brand",
        label: "Brand Logo / Label",
        desc: "Brand mark or label — fully legible. (optional)",
        hint: "Zoom in on the brand logo or woven label. All text and graphic elements must be sharp and fully visible.",
      },
    ],
  },
  {
    id: "details",
    title: "Condition",
    description: "Tell us about the item's condition.",
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
    title: "Item Photos",
    description:
      "Place on a clean surface with even lighting. Capture the full item and any important markings separately.",
    photos: [
      {
        type: "front_far",
        label: "Full Item View",
        desc: "Complete item in frame — all sides visible, clean background.",
        hint: "The entire item must fit in frame. For large equipment (balls, bags) step back. For small items (gloves, guards) lay flat. Even light, no shadows.",
      },
      {
        type: "detail",
        label: "Key Detail / Marking",
        desc: "Main branding, model marking, or authenticity feature — close-up, sharp.",
        hint: "Focus on the single most important identifier — usually a brand badge, model stamp, or serial number. It should be completely legible.",
      },
      {
        type: "brand",
        label: "Brand Logo",
        desc: "Brand logo — fills frame, fully readable. (optional)",
        hint: "Zoom in on the brand mark. All letters, shapes, and colours must be sharp and accurate.",
      },
    ],
  },
  {
    id: "packaging",
    title: "Packaging",
    description: "Original packaging increases buyer confidence. (optional)",
    photos: [
      {
        type: "box",
        label: "Original Box",
        desc: "Box on clean surface — brand, model label in frame. (optional)",
        hint: "Photograph the box so the brand logo and model label are clearly visible. Box condition (new, worn, damaged) should be apparent.",
      },
    ],
    isExtra: true,
  },
  {
    id: "details",
    title: "Condition",
    description: "Tell us about the equipment's condition.",
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
        description: "Upload clear photos of your item on a clean, plain background.",
        photos: [
          {
            type: "front_far",
            label: "Main Photo",
            desc: "Full item in frame — clean background, even lighting.",
            hint: "The entire item must be visible. Use a plain background. Good, even lighting with no harsh shadows.",
          },
          {
            type: "detail",
            label: "Detail Shot",
            desc: "Close-up of the key identifying feature — sharp and fully visible. (optional)",
            hint: "Choose the most important detail (brand logo, badge, label). It should fill the frame and be completely in focus.",
          },
        ],
      },
      {
        id: "details",
        title: "Condition & Details",
        description: "Describe the condition and any defects.",
        photos: [],
        hasDetailsForm: true,
      },
    ]
  );
};
