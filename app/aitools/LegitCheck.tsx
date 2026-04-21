"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from "react";
import { analyzeListing } from "@/lib/api/ai";
import type { AIAnalysisResult } from "@/types/features/listing.types";
import {
  PhotoSlot,
  PhotoGrid,
  PhotoStepLayout,
  SubStepProgress,
  NavigationButtons,
} from "@/components/add-listing/smart-steps/photo-steps/shared";
import LegitCheckResult from "./LegitCheckResult";
import {
  getPhotoGroupsForCategory,
  type PhotoGroup,
} from "@/lib/constants/listing.constants";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadedPhoto {
  id: string;
  url: string;
  typeHint: string;
}

interface TagOptions {
  tagsCombined: boolean;
  serialMissing: boolean;
  serialMissingReason: "pre_2005" | "faded" | "cut_out" | "";
  tagCut: boolean;
}

interface PlayerOptions {
  noName: boolean;
  noNumber: boolean;
}

interface ConditionData {
  condition: string;
  size: string;
  hasDefect: boolean;
  defectDescription: string;
}

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "shirts", label: "Shirts & Jerseys", icon: "👕", desc: "Football shirts, training tops, match jerseys" },
  { id: "footwear", label: "Footwear", icon: "👟", desc: "Football boots, trainers, cleats" },
  { id: "pants", label: "Pants & Shorts", icon: "🩳", desc: "Football shorts, training pants" },
  { id: "jackets", label: "Jackets & Hoodies", icon: "🧥", desc: "Training jackets, hoodies, tracksuits" },
  { id: "accessories", label: "Accessories", icon: "🎒", desc: "Scarves, caps, bags, gloves" },
  { id: "equipment", label: "Equipment", icon: "⚽", desc: "Balls, shin guards, goalkeeper gear" },
];

const CONDITIONS = [
  { value: "new_with_tags", label: "New with tags", desc: "Unworn, original tags attached" },
  { value: "new_without_tags", label: "New without tags", desc: "Unworn but tags removed" },
  { value: "excellent", label: "Excellent", desc: "Like new, barely worn" },
  { value: "very_good", label: "Very Good", desc: "Light wear, no visible defects" },
  { value: "good", label: "Good", desc: "Normal wear, minor marks" },
  { value: "fair", label: "Fair", desc: "Visible wear, some flaws" },
  { value: "damaged", label: "Damaged", desc: "Significant defects or damage" },
];

const SHIRT_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "Youth XS", "Youth S", "Youth M", "Youth L"];
const FOOTWEAR_SIZES = Array.from({ length: 15 }, (_, i) => `EU ${i + 36}`);
const CLOTHING_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"];
const ACCESSORY_SIZES = ["One Size", "XS/S", "S/M", "M/L", "L/XL"];

function getSizesForCategory(category: string): string[] {
  if (category === "footwear") return FOOTWEAR_SIZES;
  if (category === "shirts") return SHIRT_SIZES;
  if (category === "accessories" || category === "equipment") return ACCESSORY_SIZES;
  return CLOTHING_SIZES;
}

// ─── Step 0: Category select ──────────────────────────────────────────────────

function CategorySelect({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <PhotoStepLayout>
      <div className="mb-8">
        <span className="inline-block text-[10px] font-black tracking-[0.2em] uppercase text-red-500 bg-red-50 px-2.5 py-1 rounded-full mb-3">
          Step 1 of 2 — Setup
        </span>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
          What are you verifying?
        </h2>
        <p className="text-sm text-gray-500">
          Select the item type. The verification steps are tailored for each category.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`flex items-start gap-4 py-4 px-5 rounded-2xl border-2 text-left transition-all ${
              value === cat.id
                ? "border-black bg-black text-white"
                : "border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <span className="text-2xl mt-0.5 flex-shrink-0">{cat.icon}</span>
            <div>
              <p className={`font-black text-sm ${value === cat.id ? "text-white" : "text-gray-900"}`}>
                {cat.label}
              </p>
              <p className={`text-xs mt-0.5 ${value === cat.id ? "text-gray-300" : "text-gray-400"}`}>
                {cat.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!value}
        className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Start Verification →
      </button>
    </PhotoStepLayout>
  );
}

// ─── Toggle switch helper ─────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
        checked ? "bg-black" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

// ─── Tag options panel (shirts + others) ──────────────────────────────────────

function TagOptionsPanel({
  tagOptions,
  onChange,
  category,
}: {
  tagOptions: TagOptions;
  onChange: (opts: TagOptions) => void;
  category: string;
}) {
  const isShirt = category === "shirts";

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Info size={14} className="text-amber-600" />
        <p className="text-xs font-black uppercase tracking-widest text-amber-700">
          Tag & Label Options
        </p>
      </div>

      {/* Combined tag toggle */}
      <label className="flex items-center justify-between cursor-pointer gap-4">
        <div>
          <p className="text-sm font-bold text-gray-800">Combined tag photo</p>
          <p className="text-xs text-gray-500">One photo covers size, country and serial together</p>
        </div>
        <Toggle
          checked={tagOptions.tagsCombined}
          onChange={(v) => onChange({ ...tagOptions, tagsCombined: v })}
        />
      </label>

      {/* Serial missing (shirts only) */}
      {isShirt && (
        <div className="space-y-3 border-t border-amber-200 pt-3">
          <label className="flex items-center justify-between cursor-pointer gap-4">
            <div>
              <p className="text-sm font-bold text-gray-800">Serial code tag missing</p>
              <p className="text-xs text-gray-500">Pre-2005 jersey, faded, or tag was removed</p>
            </div>
            <Toggle
              checked={tagOptions.serialMissing}
              onChange={(v) =>
                onChange({ ...tagOptions, serialMissing: v, serialMissingReason: v ? tagOptions.serialMissingReason : "" })
              }
            />
          </label>

          {tagOptions.serialMissing && (
            <div className="grid grid-cols-3 gap-2 pl-0">
              {(
                [
                  { value: "pre_2005", label: "Pre-2005", desc: "Era jersey — no code" },
                  { value: "faded", label: "Faded / Unreadable", desc: "Code worn off" },
                  { value: "cut_out", label: "Cut out", desc: "Tag removed" },
                ] as const
              ).map((reason) => (
                <button
                  key={reason.value}
                  onClick={() =>
                    onChange({
                      ...tagOptions,
                      serialMissingReason:
                        tagOptions.serialMissingReason === reason.value ? "" : reason.value,
                    })
                  }
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    tagOptions.serialMissingReason === reason.value
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <p className="font-bold leading-tight">{reason.label}</p>
                  <p className={`mt-0.5 text-[10px] ${tagOptions.serialMissingReason === reason.value ? "text-gray-300" : "text-gray-400"}`}>
                    {reason.desc}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tag cut out (for non-shirts or as additional option) */}
      {!isShirt && (
        <label className="flex items-center justify-between cursor-pointer gap-4 border-t border-amber-200 pt-3">
          <div>
            <p className="text-sm font-bold text-gray-800">Tag is cut out / removed</p>
            <p className="text-xs text-gray-500">Size or serial tag has been removed entirely</p>
          </div>
          <Toggle
            checked={tagOptions.tagCut}
            onChange={(v) => onChange({ ...tagOptions, tagCut: v })}
          />
        </label>
      )}
    </div>
  );
}

// ─── Player options panel (shirts back step) ──────────────────────────────────

function PlayerOptionsPanel({
  playerOptions,
  onChange,
}: {
  playerOptions: PlayerOptions;
  onChange: (opts: PlayerOptions) => void;
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Info size={14} className="text-gray-500" />
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">
          Player Print
        </p>
      </div>

      <label className="flex items-center justify-between cursor-pointer gap-4">
        <div>
          <p className="text-sm font-bold text-gray-800">No player name</p>
          <p className="text-xs text-gray-500">This is a blank jersey or the name is absent</p>
        </div>
        <Toggle checked={playerOptions.noName} onChange={(v) => onChange({ ...playerOptions, noName: v })} />
      </label>

      <label className="flex items-center justify-between cursor-pointer gap-4 border-t border-gray-200 pt-3">
        <div>
          <p className="text-sm font-bold text-gray-800">No squad number</p>
          <p className="text-xs text-gray-500">No number on the back of this jersey</p>
        </div>
        <Toggle checked={playerOptions.noNumber} onChange={(v) => onChange({ ...playerOptions, noNumber: v })} />
      </label>
    </div>
  );
}

// ─── Condition & Details step ─────────────────────────────────────────────────

function ConditionDetailsStep({
  conditionData,
  onChange,
  category,
}: {
  conditionData: ConditionData;
  onChange: (data: ConditionData) => void;
  category: string;
}) {
  const sizes = getSizesForCategory(category);
  const showSize = category !== "equipment";

  return (
    <div className="space-y-6">
      {/* AI auto-assessment notice */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <AlertTriangle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-800">AI will cross-check your assessment</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Based on the photos you uploaded, our AI will independently evaluate condition.
            Your input helps calibrate the result.
          </p>
        </div>
      </div>

      {/* Condition selector */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
          Item Condition
        </p>
        <div className="grid grid-cols-1 gap-2">
          {CONDITIONS.map((c) => (
            <button
              key={c.value}
              onClick={() => onChange({ ...conditionData, condition: c.value })}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                conditionData.condition === c.value
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div>
                <p className={`text-sm font-bold ${conditionData.condition === c.value ? "text-white" : "text-gray-800"}`}>
                  {c.label}
                </p>
                <p className={`text-xs ${conditionData.condition === c.value ? "text-gray-300" : "text-gray-400"}`}>
                  {c.desc}
                </p>
              </div>
              {conditionData.condition === c.value && (
                <CheckCircle2 size={16} className="text-white flex-shrink-0 ml-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      {showSize && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => onChange({ ...conditionData, size: s })}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                  conditionData.size === s
                    ? "border-black bg-black text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Defect */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-gray-800">Item has a defect</p>
            <p className="text-xs text-gray-500">Holes, stains, fading, print damage, etc.</p>
          </div>
          <Toggle
            checked={conditionData.hasDefect}
            onChange={(v) =>
              onChange({ ...conditionData, hasDefect: v, defectDescription: v ? conditionData.defectDescription : "" })
            }
          />
        </div>

        {conditionData.hasDefect && (
          <div className="mt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle size={12} className="text-amber-500" />
              <p className="text-xs font-bold text-amber-700">Describe the defect</p>
            </div>
            <textarea
              value={conditionData.defectDescription}
              onChange={(e) =>
                onChange({ ...conditionData, defectDescription: e.target.value })
              }
              placeholder="e.g. Small hole on left sleeve seam, faint yellow stain near sponsor logo..."
              rows={3}
              className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-amber-50 resize-none"
            />
            <p className="text-[11px] text-gray-400 mt-1.5">
              Be specific — this helps AI give a more accurate authenticity and value assessment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Analyzing screen ─────────────────────────────────────────────────────────

function AnalyzingScreen({ category }: { category: string }) {
  const catLabel = CATEGORIES.find((c) => c.id === category)?.label ?? "item";
  return (
    <PhotoStepLayout>
      <div className="py-16 text-center">
        <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-black mb-2">Analyzing your {catLabel}...</h2>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          Our AI is cross-referencing your photos with the authenticity database. This takes 10–20 seconds.
        </p>
        <div className="mt-8 flex flex-col gap-2 items-center text-xs text-gray-400">
          {["Checking stitching patterns", "Comparing badge geometry", "Reading serial code", "Evaluating condition"].map(
            (step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
                {step}
              </div>
            )
          )}
        </div>
      </div>
    </PhotoStepLayout>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LegitCheck() {
  const [stage, setStage] = useState<"category" | "photos" | "analyzing" | "result">("category");
  const [category, setCategory] = useState("shirts");
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [tagOptions, setTagOptions] = useState<TagOptions>({
    tagsCombined: false,
    serialMissing: false,
    serialMissingReason: "",
    tagCut: false,
  });
  const [playerOptions, setPlayerOptions] = useState<PlayerOptions>({
    noName: false,
    noNumber: false,
  });
  const [conditionData, setConditionData] = useState<ConditionData>({
    condition: "",
    size: "",
    hasDefect: false,
    defectDescription: "",
  });
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState("");

  // All groups including hasDetailsForm, exclude isExtra (they're last + optional)
  const allGroups: PhotoGroup[] = getPhotoGroupsForCategory(category);
  // Main steps: exclude isExtra for required flow (shown separately at end)
  const mainGroups = allGroups.filter((g) => !g.isExtra);
  const extraGroups = allGroups.filter((g) => g.isExtra);
  const photoGroups = [...mainGroups, ...extraGroups];

  const currentGroup = photoGroups[currentStep];
  const totalSteps = photoGroups.length;

  // ── File upload handlers ──

  const handleFileUpload = useCallback((files: FileList | null, photoType: string) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const newPhoto: UploadedPhoto = {
        id: `${Date.now()}-${Math.random()}`,
        url: e.target?.result as string,
        typeHint: photoType,
      };
      setPhotos((prev) => [...prev.filter((p) => p.typeHint !== photoType), newPhoto]);
    };
    reader.readAsDataURL(file);
  }, []);

  const removePhoto = useCallback((photoType: string) => {
    setPhotos((prev) => prev.filter((p) => p.typeHint !== photoType));
  }, []);

  const getPhotoByType = useCallback(
    (photoType: string | null | undefined) => {
      if (!photoType) return undefined;
      return photos.find((p) => p.typeHint === photoType);
    },
    [photos],
  );

  // ── Visible photos for current group (after applying toggles) ──

  const getVisiblePhotos = (group: PhotoGroup) => {
    if (!group?.photos) return [];
    return group.photos.filter((p) => {
      // Tags step: serial missing → hide serial_code photo
      if (group.hasTagQuestions && tagOptions.serialMissing && p.type === "serial_code") {
        return false;
      }
      // Tags step: combined → show only combined_tag if exists, else show all
      // (most groups don't have combined_tag type, so it falls through)
      if (group.hasTagQuestions && tagOptions.tagsCombined) {
        return p.type === "combined_tag";
      }
      // Tags step: tag cut → skip tag photos (non-shirts only)
      if (group.hasTagQuestions && tagOptions.tagCut && category !== "shirts") {
        return false;
      }
      // Back step: no name → hide player_name
      if (group.hasPlayerOptions && playerOptions.noName && p.type === "player_name") {
        return false;
      }
      // Back step: no number → hide player_number
      if (group.hasPlayerOptions && playerOptions.noNumber && p.type === "player_number") {
        return false;
      }
      return true;
    });
  };

  // ── Step completion check ──

  const isStepComplete = (group: PhotoGroup): boolean => {
    if (!group) return false;

    // Extra steps are always optional
    if (group.isExtra) return true;

    // Condition step
    if (group.hasDetailsForm) {
      const hasCondition = !!conditionData.condition;
      if (!hasCondition) return false;
      if (conditionData.hasDefect && !conditionData.defectDescription.trim()) return false;
      return true;
    }

    // Tags step: if tag is cut (non-shirts) or serialMissing with reason → passes
    if (group.hasTagQuestions) {
      if (category !== "shirts" && tagOptions.tagCut) return true;
      if (tagOptions.serialMissing && !tagOptions.serialMissingReason) return false;
    }

    const visiblePhotos = getVisiblePhotos(group);
    const required = visiblePhotos.filter((p) => !p.desc.includes("optional"));
    return required.every((p) => !!getPhotoByType(p.type));
  };

  // ── Navigation ──

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleAnalyze();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStage("category");
    }
  };

  const handleAnalyze = async () => {
    setStage("analyzing");
    setError("");
    try {
      const response = await analyzeListing(
        category,
        photos.map((p) => ({ url: p.url, typeHint: p.typeHint })),
      );
      if (response.success && response.data) {
        setResult(response.data);
        setStage("result");
      } else {
        setError("Analysis failed. Please try again.");
        setStage("photos");
      }
    } catch (err: any) {
      setError(err?.message || "Analysis failed. Please try again.");
      setStage("photos");
    }
  };

  const handleReset = () => {
    setStage("category");
    setCurrentStep(0);
    setPhotos([]);
    setTagOptions({ tagsCombined: false, serialMissing: false, serialMissingReason: "", tagCut: false });
    setPlayerOptions({ noName: false, noNumber: false });
    setConditionData({ condition: "", size: "", hasDefect: false, defectDescription: "" });
    setResult(null);
    setError("");
  };

  // ── Stage: category ──

  if (stage === "category") {
    return (
      <CategorySelect
        value={category}
        onChange={setCategory}
        onNext={() => {
          setCurrentStep(0);
          setPhotos([]);
          setConditionData({ condition: "", size: "", hasDefect: false, defectDescription: "" });
          setStage("photos");
        }}
      />
    );
  }

  if (stage === "analyzing") {
    return <AnalyzingScreen category={category} />;
  }

  if (stage === "result" && result) {
    return <LegitCheckResult result={result} onReset={handleReset} />;
  }

  // ── Stage: photos (multi-step) ──

  const visiblePhotos = getVisiblePhotos(currentGroup);
  const isLastStep = currentStep === totalSteps - 1;
  const isConditionStep = currentGroup?.hasDetailsForm;
  const isExtraStep = currentGroup?.isExtra;
  const canProceed = isStepComplete(currentGroup);

  return (
    <PhotoStepLayout>
      <SubStepProgress
        currentSubStep={currentStep}
        totalSubSteps={totalSteps}
        title={currentGroup?.title ?? ""}
        description={currentGroup?.description ?? ""}
      />

      {/* ── Condition step ── */}
      {isConditionStep && (
        <ConditionDetailsStep
          conditionData={conditionData}
          onChange={setConditionData}
          category={category}
        />
      )}

      {/* ── Tag options panel ── */}
      {currentGroup?.hasTagQuestions && !isConditionStep && (
        <TagOptionsPanel
          tagOptions={tagOptions}
          onChange={setTagOptions}
          category={category}
        />
      )}

      {/* ── Player options panel ── */}
      {currentGroup?.hasPlayerOptions && !isConditionStep && (
        <PlayerOptionsPanel
          playerOptions={playerOptions}
          onChange={setPlayerOptions}
        />
      )}

      {/* ── Photo grid ── */}
      {!isConditionStep && visiblePhotos.length > 0 && (
        <PhotoGrid
          isCritical={currentGroup?.id === "sole_inside"}
          criticalWarning="These photos are critical for authenticity verification — both are required."
        >
          {visiblePhotos.map((photoConfig) => (
            <PhotoSlot
              key={photoConfig.type!}
              typeKey={photoConfig.type!}
              label={photoConfig.label}
              desc={photoConfig.desc}
              isOptional={photoConfig.desc.includes("optional")}
              existingPhoto={
                getPhotoByType(photoConfig.type)
                  ? {
                      id: getPhotoByType(photoConfig.type)!.id,
                      url: getPhotoByType(photoConfig.type)!.url,
                      typeHint: photoConfig.type as any,
                    }
                  : undefined
              }
              onUpload={(files) => handleFileUpload(files, photoConfig.type!)}
              onRemove={() => removePhoto(photoConfig.type!)}
            />
          ))}
        </PhotoGrid>
      )}

      {/* ── Extra step (no required photos) ── */}
      {isExtraStep && !isConditionStep && visiblePhotos.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-3xl mb-3">📎</p>
          <p className="font-bold text-gray-700">Optional extra photos</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
            Add any additional photos that might help the AI analysis — packaging, receipts, certificates.
          </p>
        </div>
      )}

      {/* ── Extra step with photos ── */}
      {isExtraStep && !isConditionStep && visiblePhotos.length > 0 && (
        <PhotoGrid>
          {visiblePhotos.map((photoConfig) => (
            <PhotoSlot
              key={photoConfig.type!}
              typeKey={photoConfig.type!}
              label={photoConfig.label}
              desc={photoConfig.desc}
              isOptional
              existingPhoto={
                getPhotoByType(photoConfig.type)
                  ? {
                      id: getPhotoByType(photoConfig.type)!.id,
                      url: getPhotoByType(photoConfig.type)!.url,
                      typeHint: photoConfig.type as any,
                    }
                  : undefined
              }
              onUpload={(files) => handleFileUpload(files, photoConfig.type!)}
              onRemove={() => removePhoto(photoConfig.type!)}
            />
          ))}
        </PhotoGrid>
      )}

      {/* ── Tags step: no photos needed when tag cut (non-shirts) ── */}
      {currentGroup?.hasTagQuestions && category !== "shirts" && tagOptions.tagCut && (
        <div className="py-6 text-center bg-gray-50 rounded-2xl mb-4">
          <p className="text-sm font-bold text-gray-600">No tag photos needed</p>
          <p className="text-xs text-gray-400 mt-1">You indicated the tag was removed — continuing without it.</p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}

      <NavigationButtons
        onNext={handleNext}
        onBack={handleBack}
        isNextDisabled={!canProceed}
        isLastStep={isLastStep}
        nextLabel={isLastStep ? "🔍 Run Legit Check" : undefined}
      />
    </PhotoStepLayout>
  );
}
