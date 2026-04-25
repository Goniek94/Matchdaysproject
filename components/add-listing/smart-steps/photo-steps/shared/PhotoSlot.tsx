"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { Upload, X, CheckCircle2, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Photo } from "@/types/features/listing.types";

// Photo tips — shown on hover for each photo type
const PHOTO_TIPS: Record<string, { title: string; tips: string[] }> = {
  front_far: {
    title: "Full Front Shot",
    tips: [
      "Lay flat on a clean, light surface",
      "Step back ~1 metre — whole item in frame",
      "No shadows across the fabric",
    ],
  },
  front_close: {
    title: "Front Close-up",
    tips: [
      "Focus on the centre area",
      "Fabric weave should be visible",
      "Hold phone steady — no blur",
    ],
  },
  club_logo: {
    title: "Club Badge",
    tips: [
      "Fill the frame with just the badge",
      "Shoot straight-on, not at an angle",
      "Avoid reflections on embroidery",
    ],
  },
  sponsor: {
    title: "Sponsor Logo",
    tips: [
      "Capture the full sponsor text/logo",
      "Good lighting — no glare",
      "Sharp enough to read every letter",
    ],
  },
  brand: {
    title: "Brand Logo",
    tips: [
      "Nike swoosh / Adidas stripes / Puma cat",
      "Fill the frame — don't crop",
      "Shoot flat, not from the side",
    ],
  },
  seams: {
    title: "Seams & Stitching",
    tips: [
      "Turn the item inside-out",
      "Photograph the main seam along the side",
      "Stitch quality is key for authenticity",
    ],
  },
  size_tag: {
    title: "Size & Country Tag",
    tips: [
      "Usually one label inside the collar",
      "Shows size AND 'Made in...' country",
      "All text must be readable — macro mode if needed",
    ],
  },
  serial_code: {
    title: "Serial Code Tag",
    tips: [
      "Small tag, often near the hem or collar",
      "Product code like: GH7252 or BQ6580",
      "Can't find it? Type it manually below",
    ],
  },
  combined_tag: {
    title: "Combined Tag",
    tips: [
      "One photo covering size, country & serial",
      "All text must be sharp and readable",
      "Use macro/close-up mode on your camera",
    ],
  },
  back_far: {
    title: "Full Back Shot",
    tips: [
      "Lay flat — same surface as front",
      "Full item visible — no cropping",
      "Even lighting across entire back",
    ],
  },
  back_close: {
    title: "Back Close-up",
    tips: [
      "Focus on centre back area",
      "Good for showing fabric or print quality",
      "Optional but helps buyers",
    ],
  },
  player_number: {
    title: "Player Number",
    tips: [
      "Fill the frame with just the number",
      "Show the print quality clearly",
      "Check for peeling or cracking",
    ],
  },
  label: {
    title: "Care Label",
    tips: [
      "Usually sewn into the side seam or bottom hem",
      "Shows fabric composition (100% polyester etc.)",
      "Wash symbols and country info — all in one",
    ],
  },
  player_name: {
    title: "Player Name",
    tips: [
      "Capture all letters — don't crop",
      "Show print style (flock, heat press, etc.)",
      "Highlight any wear or damage if present",
    ],
  },
  sole: {
    title: "Sole",
    tips: [
      "Bottom of both shoes visible",
      "Show tread pattern clearly",
      "Good lighting — no shadows",
    ],
  },
  inside: {
    title: "Inside",
    tips: [
      "Interior of the shoe/item",
      "Show insole and inner lining",
      "Important for authenticity check",
    ],
  },
  detail: {
    title: "Toe / Front View",
    tips: [
      "Shoot from directly in front of both shoes",
      "Toe box shape must be fully visible",
      "Any front-facing branding or stitching in frame",
    ],
  },
  box: {
    title: "Original Box",
    tips: [
      "Show the full box with label",
      "Include barcode if visible",
      "Boosts buyer confidence",
    ],
  },
  barcode: {
    title: "Barcode",
    tips: [
      "Barcode label on box or tag",
      "Must be sharp and readable",
      "Helps with product verification",
    ],
  },
};

interface PhotoSlotProps {
  typeKey: string;
  label: string;
  desc: string;
  isOptional?: boolean;
  existingPhoto?: Photo;
  onUpload: (files: FileList | null) => void;
  onRemove: () => void;
}

/**
 * Reusable photo upload slot with drag & drop, preview, and tips.
 * Used across all category photo steps.
 */
export function PhotoSlot({
  typeKey,
  label,
  desc,
  isOptional,
  existingPhoto,
  onUpload,
  onRemove,
}: PhotoSlotProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const tip = PHOTO_TIPS[typeKey];

  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 transition-all duration-200",
        existingPhoto
          ? "border-green-400 bg-green-50/60"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
      )}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-bold text-gray-900 text-sm leading-tight">
              {label}
            </h3>
            {isOptional ? (
              <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded-full">
                optional
              </span>
            ) : (
              <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-full">
                required
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{desc}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {tip && (
            <div className="relative">
              <button
                onMouseEnter={() => setShowTip(true)}
                onMouseLeave={() => setShowTip(false)}
                onTouchStart={() => setShowTip((v) => !v)}
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
                aria-label="Photo tip"
              >
                <Camera size={12} className="text-gray-400" />
              </button>

              {showTip && (
                <div className="absolute right-0 top-8 z-50 w-56 bg-gray-900 text-white rounded-xl shadow-2xl p-3 text-left pointer-events-none">
                  <div className="absolute -top-1.5 right-2 w-3 h-3 bg-gray-900 rotate-45 rounded-sm" />
                  <p className="font-bold text-xs mb-2 text-white">
                    {tip.title}
                  </p>
                  <ul className="space-y-1.5">
                    {tip.tips.map((t, i) => (
                      <li
                        key={i}
                        className="flex gap-1.5 text-[11px] text-gray-300 leading-snug"
                      >
                        <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {existingPhoto && (
            <CheckCircle2 size={18} className="text-green-500" />
          )}
        </div>
      </div>

      {/* Photo upload area */}
      <div className="px-4 pb-4">
        {existingPhoto ? (
          <div className="relative rounded-xl overflow-hidden group" style={{ minHeight: "180px" }}>
            <img
              src={existingPhoto.url}
              alt={label}
              className="w-full object-cover rounded-xl"
              style={{ maxHeight: "260px", minHeight: "180px" }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-xl" />
            <button
              onClick={onRemove}
              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              onUpload(e.dataTransfer.files);
            }}
            className={cn(
              "relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all",
              isDragging
                ? "border-blue-400 bg-blue-50 scale-[1.01]"
                : "border-gray-200 hover:border-gray-400 hover:bg-gray-50/80",
            )}
            style={{ minHeight: "180px" }}
          >
            <input
              type="file"
              accept="image/*"
              onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
              onChange={(e) => onUpload(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors",
                isDragging ? "bg-blue-100" : "bg-gray-100",
              )}
            >
              <Upload
                size={24}
                className={isDragging ? "text-blue-500" : "text-gray-400"}
              />
            </div>
            <p className="text-sm font-bold text-gray-500">
              {isDragging ? "Drop it!" : "Click or drop photo"}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
}
