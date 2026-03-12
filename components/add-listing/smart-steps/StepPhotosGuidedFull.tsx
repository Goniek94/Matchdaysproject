"use client";

import { useMemo, useState } from "react";
import { SmartFormData, Photo, DEFECT_TYPES } from "./types";
import {
  getPhotoGroupsForCategory,
  SHIRT_SIZES,
} from "@/lib/constants/listing.constants";
import {
  Upload,
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  AlertTriangle,
  BookmarkPlus,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

// Photo tips — shown on hover for each photo type
const PHOTO_TIPS: Record<string, { title: string; tips: string[] }> = {
  front_far: {
    title: "Full Front Shot",
    tips: [
      "Lay flat on a clean, light surface",
      "Step back ~1 metre — whole shirt in frame",
      "No shadows across the fabric",
    ],
  },
  front_close: {
    title: "Front Close-up",
    tips: [
      "Focus on the centre chest area",
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
      "Turn the shirt inside-out",
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
      "Full shirt visible — no cropping",
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
};

function PhotoSlot({
  typeKey,
  label,
  desc,
  isOptional,
  existingPhoto,
  onUpload,
  onRemove,
}: {
  typeKey: string;
  label: string;
  desc: string;
  isOptional?: boolean;
  existingPhoto?: Photo;
  onUpload: (files: FileList | null) => void;
  onRemove: () => void;
}) {
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
            {isOptional && (
              <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded-full">
                optional
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
          <div className="relative aspect-video rounded-xl overflow-hidden group">
            <img
              src={existingPhoto.url}
              alt={label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={14} />
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
              "relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all",
              isDragging
                ? "border-blue-400 bg-blue-50 scale-[1.01]"
                : "border-gray-200 hover:border-gray-400 hover:bg-gray-50",
            )}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onUpload(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-colors",
                isDragging ? "bg-blue-100" : "bg-gray-100",
              )}
            >
              <Upload
                size={16}
                className={isDragging ? "text-blue-500" : "text-gray-400"}
              />
            </div>
            <p className="text-xs font-semibold text-gray-400">
              {isDragging ? "Drop it!" : "Click or drop"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StepPhotosGuidedFull({
  data,
  update,
  onNext,
  onBack,
}: StepProps) {
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);

  const photoGroups = useMemo(
    () => getPhotoGroupsForCategory(data.category),
    [data.category],
  );

  const currentGroup = photoGroups[currentSubStep];
  const totalSubSteps = photoGroups.length;

  const handleFileUpload = (files: FileList | null, photoType: string) => {
    if (!files) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const newPhoto: Photo = {
        id: `photo-${Date.now()}-${Math.random()}`,
        url: e.target?.result as string,
        typeHint: photoType as any,
      };
      const existingIndex = data.photos.findIndex(
        (p) => p.typeHint === photoType,
      );
      if (existingIndex >= 0) {
        const updatedPhotos = [...data.photos];
        updatedPhotos[existingIndex] = newPhoto;
        update("photos", updatedPhotos);
      } else {
        update("photos", [...data.photos, newPhoto]);
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (photoType: string) => {
    update(
      "photos",
      data.photos.filter((p) => p.typeHint !== photoType),
    );
  };

  const getPhotoByType = (photoType: string) => {
    return data.photos.find((p) => p.typeHint === photoType);
  };

  const updateVerification = (field: string, value: any) => {
    update("verification", { ...data.verification, [field]: value });
  };

  const isGroupComplete = () => {
    if (currentGroup.hasDetailsForm || currentGroup.isExtra) return true;

    if (currentGroup.id === "tags") {
      if (data.verification.tagsCombined) {
        return !!getPhotoByType("combined_tag");
      }
      return true;
    }

    if (currentGroup.id === "back") {
      const requiredPhotos = currentGroup.photos.filter((p) => {
        if (!p.type || p.desc.includes("optional")) return false;
        if (
          data.verification.noPlayerPrint &&
          (p.type === "player_name" || p.type === "player_number")
        )
          return false;
        return true;
      });
      return requiredPhotos.every((p) => p.type && getPhotoByType(p.type));
    }

    const requiredPhotos = currentGroup.photos.filter(
      (p) => p.type && !p.desc.includes("optional"),
    );
    return requiredPhotos.every((p) => p.type && getPhotoByType(p.type));
  };

  const addDefect = () => {
    updateVerification("defects", [
      ...data.verification.defects,
      { type: "", description: "", photoId: null },
    ]);
  };

  const removeDefect = (index: number) => {
    updateVerification(
      "defects",
      data.verification.defects.filter((_, i) => i !== index),
    );
  };

  const updateDefect = (index: number, field: string, value: any) => {
    const newDefects = [...data.verification.defects];
    newDefects[index] = { ...newDefects[index], [field]: value };
    updateVerification("defects", newDefects);
  };

  const handleNextSubStep = () => {
    if (currentSubStep < totalSubSteps - 1) {
      setCurrentSubStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (onNext) {
      onNext();
    }
  };

  const handleBackSubStep = () => {
    if (currentSubStep > 0) {
      setCurrentSubStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
        {/* Header & progress */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-1">
                {currentGroup.title}
              </h2>
              <p className="text-sm text-gray-500 font-medium max-w-lg">
                {currentGroup.description}
              </p>
            </div>
            <span className="text-xs font-bold text-gray-400 mt-1 shrink-0 ml-4">
              PART {currentSubStep + 1}/{totalSubSteps}
            </span>
          </div>

          <div className="flex gap-1.5">
            {photoGroups.map((_: any, index: number) => (
              <div
                key={index}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-500",
                  index < currentSubStep
                    ? "bg-green-500"
                    : index === currentSubStep
                      ? "bg-black"
                      : "bg-gray-100",
                )}
              />
            ))}
          </div>
        </div>

        {/* ── TAGS STEP ── */}
        {currentGroup.hasTagQuestions ? (
          <div className="space-y-6">
            {/* Combined tag toggle */}
            <div
              className={cn(
                "flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all select-none",
                data.verification.tagsCombined
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300",
              )}
              onClick={() =>
                updateVerification(
                  "tagsCombined",
                  !data.verification.tagsCombined,
                )
              }
            >
              <div
                className={cn(
                  "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                  data.verification.tagsCombined
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-400",
                )}
              >
                {data.verification.tagsCombined && (
                  <CheckCircle2 size={13} className="text-white" />
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  All tag info is on one label
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Puma / Adidas / Nike often combine size, country and serial
                  code on a single tag
                </p>
              </div>
            </div>

            {/* Tag photos */}
            {data.verification.tagsCombined ? (
              <div className="max-w-xs">
                <PhotoSlot
                  typeKey="combined_tag"
                  label="Combined Tag Photo"
                  desc="One photo — size, country & serial code"
                  existingPhoto={getPhotoByType("combined_tag")}
                  onUpload={(files) => handleFileUpload(files, "combined_tag")}
                  onRemove={() => removePhoto("combined_tag")}
                />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {currentGroup.photos.map((photoConfig) => {
                  const typeKey = photoConfig.type ?? photoConfig.label;
                  return (
                    <PhotoSlot
                      key={typeKey}
                      typeKey={typeKey}
                      label={photoConfig.label}
                      desc={photoConfig.desc}
                      isOptional={photoConfig.desc.includes("optional")}
                      existingPhoto={getPhotoByType(typeKey)}
                      onUpload={(files) => handleFileUpload(files, typeKey)}
                      onRemove={() => removePhoto(typeKey)}
                    />
                  );
                })}
              </div>
            )}

            {/* Serial code manual input */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <label className="font-bold text-gray-900 text-sm">
                  Serial Code
                </label>
                <span className="text-[10px] text-gray-400 font-medium bg-gray-200 px-1.5 py-0.5 rounded-full">
                  optional
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Can't read the tag? Type the product code manually — e.g.{" "}
                <span className="font-mono text-gray-700 bg-gray-200 px-1 rounded">
                  GH7252
                </span>
              </p>
              <input
                type="text"
                value={(data.verification as any).serialCode || ""}
                onChange={(e) =>
                  updateVerification("serialCode", e.target.value)
                }
                placeholder="e.g. GH7252 or BQ6580-100"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none text-sm font-mono tracking-wider bg-white"
              />
            </div>

            {/* Tag info section */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                Tag Information
              </h3>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    Vintage item? (Pre-2005)
                  </p>
                  <p className="text-xs text-gray-500">
                    Items manufactured before 2005
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateVerification(
                      "isVintage",
                      !data.verification.isVintage,
                    )
                  }
                  className={cn(
                    "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                    data.verification.isVintage ? "bg-black" : "bg-gray-200",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                      data.verification.isVintage
                        ? "translate-x-6"
                        : "translate-x-1",
                    )}
                  />
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900 text-sm mb-3">
                  Tag Condition
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { value: "intact", label: "Intact", emoji: "✓" },
                    { value: "cut", label: "Cut Out", emoji: "✂️" },
                    { value: "washed_out", label: "Washed Out", emoji: "💧" },
                    { value: "missing", label: "Missing", emoji: "❌" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateVerification("tagCondition", option.value)
                      }
                      className={cn(
                        "p-3 rounded-xl border-2 text-center transition-all",
                        data.verification.tagCondition === option.value
                          ? "border-black bg-white shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-white",
                      )}
                    >
                      <div className="text-lg mb-1">{option.emoji}</div>
                      <div className="text-xs font-semibold text-gray-700">
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : /* ── DETAILS FORM ── */
        currentGroup.hasDetailsForm ? (
          <div className="space-y-6">
            <div>
              <label className="block font-bold text-gray-900 mb-2 text-sm">
                Item History{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={data.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Where did you get it? Any special memories? Match worn?"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none resize-none text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-900 mb-2 text-sm">
                Condition
              </label>
              <select
                value={data.condition}
                onChange={(e) => update("condition", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-medium text-sm"
              >
                <option value="">Select condition...</option>
                <option value="bnwt">Brand New With Tags (BNWT)</option>
                <option value="bnwot">Brand New Without Tags (BNWOT)</option>
                <option value="excellent">Excellent — Like New</option>
                <option value="good">Good — Minor Wear</option>
                <option value="fair">Fair — Visible Wear</option>
                <option value="poor">Poor — Heavy Wear</option>
              </select>
            </div>

            {/* Size selector — shown for shirts */}
            {data.category === "shirts" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-gray-900 text-sm">
                    Size
                  </label>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
                    override tag if unreadable
                  </span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                  {SHIRT_SIZES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() =>
                        update("size", s.id === data.size ? "" : s.id)
                      }
                      className={`py-2 px-1 rounded-xl border-2 text-xs font-bold transition-all ${
                        data.size === s.id
                          ? "border-black bg-black text-white shadow-md"
                          : "border-gray-200 text-gray-600 hover:border-gray-400 bg-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    Any defects?
                  </p>
                  <p className="text-xs text-gray-500">
                    Stains, holes, fading, etc.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newValue = !data.verification.hasDefects;
                    updateVerification("hasDefects", newValue);
                    if (newValue && data.verification.defects.length === 0)
                      addDefect();
                  }}
                  className={cn(
                    "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                    data.verification.hasDefects ? "bg-red-500" : "bg-gray-200",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                      data.verification.hasDefects
                        ? "translate-x-6"
                        : "translate-x-1",
                    )}
                  />
                </button>
              </div>

              {data.verification.hasDefects && (
                <div className="mt-3 space-y-3">
                  {data.verification.defects.map((defect, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white rounded-xl border border-red-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-red-800">
                          Defect #{index + 1}
                        </span>
                        <button
                          onClick={() => removeDefect(index)}
                          className="p-1 hover:bg-red-100 rounded"
                        >
                          <X size={13} className="text-red-500" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <select
                          value={defect.type}
                          onChange={(e) =>
                            updateDefect(index, "type", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs"
                        >
                          <option value="">Select defect type...</option>
                          {DEFECT_TYPES.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <textarea
                          value={defect.description}
                          onChange={(e) =>
                            updateDefect(index, "description", e.target.value)
                          }
                          placeholder="Describe the defect..."
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs resize-none"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addDefect}
                    className="w-full py-2 border-2 border-dashed border-red-300 rounded-xl text-red-500 text-xs font-semibold hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Add Another Defect
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : /* ── EXTRA PHOTOS ── */
        currentGroup.isExtra ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Upload size={24} className="text-gray-400" />
            </div>
            <p className="font-bold text-gray-900 mb-1">Add more photos</p>
            <p className="text-sm text-gray-500 mb-6">
              Optional — any extra angles or details
            </p>
            <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 transition-colors cursor-pointer">
              <p className="text-sm text-gray-400">
                Click to upload additional photos
              </p>
            </div>
          </div>
        ) : (
          /* ── DEFAULT PHOTO GRID ── */
          <div className="space-y-4 mb-6">
            {currentGroup.hasPlayerOptions && (
              <div
                className={cn(
                  "flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all select-none",
                  data.verification.noPlayerPrint
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300",
                )}
                onClick={() =>
                  updateVerification(
                    "noPlayerPrint",
                    !data.verification.noPlayerPrint,
                  )
                }
              >
                <div
                  className={cn(
                    "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                    data.verification.noPlayerPrint
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-400",
                  )}
                >
                  {data.verification.noPlayerPrint && (
                    <CheckCircle2 size={13} className="text-white" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    No player name or number
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Plain/blank shirt — skip player photos
                  </p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {currentGroup.photos.map((photoConfig) => {
                const typeKey = photoConfig.type ?? photoConfig.label;
                const isPlayerPhoto =
                  photoConfig.type === "player_name" ||
                  photoConfig.type === "player_number";
                const isHidden =
                  currentGroup.hasPlayerOptions &&
                  data.verification.noPlayerPrint &&
                  isPlayerPhoto;
                if (isHidden) return null;

                const isOptional =
                  photoConfig.desc.includes("optional") ||
                  (currentGroup.hasPlayerOptions && isPlayerPhoto);

                return (
                  <PhotoSlot
                    key={typeKey}
                    typeKey={typeKey}
                    label={photoConfig.label}
                    desc={photoConfig.desc}
                    isOptional={isOptional}
                    existingPhoto={getPhotoByType(typeKey)}
                    onUpload={(files) => handleFileUpload(files, typeKey)}
                    onRemove={() => removePhoto(typeKey)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Tip bar */}
        {!currentGroup.hasDetailsForm && !currentGroup.isExtra && (
          <div className="mt-6 p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Camera size={13} className="text-amber-600" />
            </div>
            <p className="text-xs text-amber-800">
              <strong>Tip:</strong> Hover the camera icon on each slot for photo
              instructions.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
          <button
            onClick={
              currentSubStep === 0
                ? () => setShowExitModal(true)
                : handleBackSubStep
            }
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={handleNextSubStep}
            disabled={!isGroupComplete()}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white text-sm transition-all",
              isGroupComplete()
                ? "bg-black hover:bg-gray-800 hover:scale-[1.02] active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed",
            )}
          >
            {currentSubStep < totalSubSteps - 1 ? "Next Part" : "Complete"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Exit modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowExitModal(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-5">
              <div className="p-4 bg-amber-100 rounded-2xl">
                <AlertTriangle size={28} className="text-amber-600" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 text-center mb-2">
              Leave this step?
            </h3>
            <p className="text-gray-500 text-center mb-8 text-sm leading-relaxed">
              Your uploaded photos{" "}
              <strong className="text-gray-800">will not be saved</strong>.
              You'll lose everything added here.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  alert("Draft saving coming soon!");
                  setShowExitModal(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all text-sm"
              >
                <BookmarkPlus size={16} /> Save as Draft
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  if (onBack) onBack();
                }}
                className="w-full px-6 py-3.5 border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all text-sm"
              >
                Leave anyway — discard photos
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full px-6 py-3 text-gray-400 rounded-xl font-medium hover:bg-gray-50 transition-all text-xs"
              >
                Continue editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
