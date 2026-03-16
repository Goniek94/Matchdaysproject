"use client";

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadedPhoto {
  id: string;
  url: string;
  typeHint: string;
}

interface TagOptions {
  tagsCombined: boolean;
  tagCut: boolean;
}

interface PlayerOptions {
  noPlayerPrint: boolean;
}

// ─── Category selector ────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "shirts", label: "Shirts & Jerseys", icon: "👕" },
  { id: "footwear", label: "Footwear", icon: "👟" },
  { id: "pants", label: "Pants & Shorts", icon: "🩳" },
  { id: "jackets", label: "Jackets & Hoodies", icon: "🧥" },
  { id: "accessories", label: "Accessories", icon: "🎒" },
  { id: "equipment", label: "Equipment", icon: "⚽" },
];

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
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-red-500">
          Step 1
        </span>
        <h2 className="text-3xl font-black mt-1 mb-1">Select Category</h2>
        <p className="text-sm text-gray-500">
          Choose the type of item you want to verify.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`flex items-center gap-3 py-3.5 px-4 rounded-2xl border-2 text-left transition-all font-semibold text-sm ${
              value === cat.id
                ? "border-black bg-black text-white"
                : "border-gray-200 text-gray-700 hover:border-gray-400"
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-900 transition-all"
      >
        Continue →
      </button>
    </PhotoStepLayout>
  );
}

// ─── Tag options step ─────────────────────────────────────────────────────────

function TagOptionsStep({
  tagOptions,
  onChange,
}: {
  tagOptions: TagOptions;
  onChange: (opts: TagOptions) => void;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
        Tag Options
      </p>

      <label className="flex items-center justify-between cursor-pointer">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Combined tag photo
          </p>
          <p className="text-xs text-gray-500">
            One photo covers size, country & serial
          </p>
        </div>
        <button
          onClick={() =>
            onChange({ ...tagOptions, tagsCombined: !tagOptions.tagsCombined })
          }
          className={`w-11 h-6 rounded-full transition-colors relative ${
            tagOptions.tagsCombined ? "bg-black" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
              tagOptions.tagsCombined ? "left-6" : "left-1"
            }`}
          />
        </button>
      </label>

      <label className="flex items-center justify-between cursor-pointer">
        <div>
          <p className="text-sm font-semibold text-gray-800">Tag is cut out</p>
          <p className="text-xs text-gray-500">
            Size or serial tag has been removed
          </p>
        </div>
        <button
          onClick={() =>
            onChange({ ...tagOptions, tagCut: !tagOptions.tagCut })
          }
          className={`w-11 h-6 rounded-full transition-colors relative ${
            tagOptions.tagCut ? "bg-black" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
              tagOptions.tagCut ? "left-6" : "left-1"
            }`}
          />
        </button>
      </label>
    </div>
  );
}

// ─── Player options step ──────────────────────────────────────────────────────

function PlayerOptionsStep({
  playerOptions,
  onChange,
}: {
  playerOptions: PlayerOptions;
  onChange: (opts: PlayerOptions) => void;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 mb-6">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
        Player Print Options
      </p>

      <label className="flex items-center justify-between cursor-pointer">
        <div>
          <p className="text-sm font-semibold text-gray-800">No player print</p>
          <p className="text-xs text-gray-500">
            This is a blank jersey — no name or number
          </p>
        </div>
        <button
          onClick={() =>
            onChange({ noPlayerPrint: !playerOptions.noPlayerPrint })
          }
          className={`w-11 h-6 rounded-full transition-colors relative ${
            playerOptions.noPlayerPrint ? "bg-black" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
              playerOptions.noPlayerPrint ? "left-6" : "left-1"
            }`}
          />
        </button>
      </label>
    </div>
  );
}

// ─── Analyzing screen ─────────────────────────────────────────────────────────

function AnalyzingScreen() {
  return (
    <PhotoStepLayout>
      <div className="py-16 text-center">
        <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-black mb-2">Analyzing your item...</h2>
        <p className="text-sm text-gray-500">
          Our AI is checking authenticity. This takes a few seconds.
        </p>
      </div>
    </PhotoStepLayout>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LegitCheck() {
  const [stage, setStage] = useState<
    "category" | "photos" | "analyzing" | "result"
  >("category");
  const [category, setCategory] = useState("shirts");
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [tagOptions, setTagOptions] = useState<TagOptions>({
    tagsCombined: false,
    tagCut: false,
  });
  const [playerOptions, setPlayerOptions] = useState<PlayerOptions>({
    noPlayerPrint: false,
  });
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState("");

  // Get photo groups for selected category, filter out hasDetailsForm steps
  const photoGroups: PhotoGroup[] = getPhotoGroupsForCategory(category).filter(
    (g) => !g.hasDetailsForm,
  );

  const currentGroup = photoGroups[currentStep];
  const totalSteps = photoGroups.length;

  const handleFileUpload = useCallback(
    (files: FileList | null, photoType: string) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: UploadedPhoto = {
          id: `${Date.now()}-${Math.random()}`,
          url: e.target?.result as string,
          typeHint: photoType,
        };
        setPhotos((prev) => {
          const filtered = prev.filter((p) => p.typeHint !== photoType);
          return [...filtered, newPhoto];
        });
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const removePhoto = useCallback((photoType: string) => {
    setPhotos((prev) => prev.filter((p) => p.typeHint !== photoType));
  }, []);

  const getPhotoByType = useCallback(
    (photoType: string) => photos.find((p) => p.typeHint === photoType),
    [photos],
  );

  // Check if current group has required photos filled
  const isCurrentGroupComplete = (): boolean => {
    if (!currentGroup) return false;
    if (currentGroup.isExtra) return true;

    // Tags step
    if (currentGroup.hasTagQuestions) {
      if (tagOptions.tagsCombined) {
        return !!getPhotoByType("combined_tag");
      }
      if (tagOptions.tagCut) return true;
    }

    // Back step with player options
    if (currentGroup.hasPlayerOptions && playerOptions.noPlayerPrint) {
      const requiredPhotos = currentGroup.photos.filter(
        (p) =>
          !p.desc.includes("optional") &&
          p.type !== "player_name" &&
          p.type !== "player_number",
      );
      return requiredPhotos.every((p) => !!getPhotoByType(p.type));
    }

    const requiredPhotos = currentGroup.photos.filter(
      (p) => !p.desc.includes("optional"),
    );
    return requiredPhotos.every((p) => !!getPhotoByType(p.type));
  };

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
        photos.map((p) => ({ url: p.url, typeHint: p.typeHint as any })),
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
    setTagOptions({ tagsCombined: false, tagCut: false });
    setPlayerOptions({ noPlayerPrint: false });
    setResult(null);
    setError("");
  };

  // ── Renders ──

  if (stage === "category") {
    return (
      <CategorySelect
        value={category}
        onChange={setCategory}
        onNext={() => setStage("photos")}
      />
    );
  }

  if (stage === "analyzing") {
    return <AnalyzingScreen />;
  }

  if (stage === "result" && result) {
    return <LegitCheckResult result={result} onReset={handleReset} />;
  }

  // ── Photos stage ──

  const showTagOptions = currentGroup?.hasTagQuestions;
  const showPlayerOptions = currentGroup?.hasPlayerOptions;

  // Filter photos based on options
  const visiblePhotos =
    currentGroup?.photos.filter((p) => {
      if (showTagOptions && tagOptions.tagsCombined) {
        return p.type === "combined_tag";
      }
      if (showTagOptions && tagOptions.tagCut) {
        return false; // tag is cut, skip all tag photos
      }
      if (
        showPlayerOptions &&
        playerOptions.noPlayerPrint &&
        (p.type === "player_name" || p.type === "player_number")
      ) {
        return false;
      }
      return true;
    }) ?? [];

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <PhotoStepLayout>
      <SubStepProgress
        currentSubStep={currentStep}
        totalSubSteps={totalSteps}
        title={currentGroup?.title ?? ""}
        description={currentGroup?.description ?? ""}
      />

      {/* Tag options */}
      {showTagOptions && (
        <TagOptionsStep tagOptions={tagOptions} onChange={setTagOptions} />
      )}

      {/* Player options */}
      {showPlayerOptions && (
        <PlayerOptionsStep
          playerOptions={playerOptions}
          onChange={setPlayerOptions}
        />
      )}

      {/* Photo grid */}
      {visiblePhotos.length > 0 && (
        <PhotoGrid
          isCritical={currentGroup?.id === "sole_inside"}
          criticalWarning="These photos are critical for authenticity verification — required."
        >
          {visiblePhotos.map((photoConfig) => (
            <PhotoSlot
              key={photoConfig.type}
              typeKey={photoConfig.type}
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
              onUpload={(files) => handleFileUpload(files, photoConfig.type)}
              onRemove={() => removePhoto(photoConfig.type)}
            />
          ))}
        </PhotoGrid>
      )}

      {/* Extra/optional step */}
      {currentGroup?.isExtra && visiblePhotos.length === 0 && (
        <div className="py-8 text-center text-gray-400">
          <p className="text-4xl mb-3">📎</p>
          <p className="font-semibold text-gray-600">Optional step</p>
          <p className="text-sm mt-1">
            You can skip this or add extra photos if you have them.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}

      <NavigationButtons
        onNext={handleNext}
        onBack={handleBack}
        isNextDisabled={!isCurrentGroupComplete() && !currentGroup?.isExtra}
        isLastStep={isLastStep}
        nextLabel={isLastStep ? "🔍 Run Legit Check" : undefined}
      />
    </PhotoStepLayout>
  );
}
