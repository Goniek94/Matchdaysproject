"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import { Images, ListChecks } from "lucide-react";
import type { SmartFormData } from "@/types/features/listing.types";
import { getPhotoGroupsForCategory } from "@/lib/constants/listing.constants";
import {
  usePhotoUpload,
  useSubStepNavigation,
  usePhotoValidation,
} from "./hooks";
import {
  PhotoStepLayout,
  SubStepProgress,
  NavigationButtons,
  PhotoSlot,
  PhotoGrid,
  ExtraPhotosUpload,
} from "./shared";
import { TagsForm, DetailsForm, PlayerOptionsForm } from "./forms";
import BulkPhotoUpload from "./BulkPhotoUpload";

interface PhotoStepRouterProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

// Maps taxonomy itemCategory IDs → photo group category IDs used by getPhotoGroupsForCategory
const ITEM_TO_PHOTO_GROUP: Record<string, string> = {
  jersey_shirt: "shirts",
  shorts_pants: "pants",
  boots_cleats: "footwear",
  sneakers: "footwear",
  jacket_hoodie: "jackets",
  tracksuit: "jackets",
  race_suit: "jackets",
  helmet: "accessories",
  racing_gloves: "accessories",
  goalkeeper_gloves: "accessories",
  gloves: "accessories",
  stick: "equipment",
  racket: "equipment",
  bat: "equipment",
  pads: "equipment",
  cap: "accessories",
  accessories: "accessories",
  equipment: "equipment",
};

/**
 * Universal photo step router for all categories.
 * Reads photo groups from listing.constants and renders the appropriate
 * sub-step content (photo grid, tags form, details form, extra photos).
 *
 * Replaces the old monolithic StepPhotosGuidedFull component.
 */
export default function PhotoStepRouter({
  data,
  update,
  onNext,
  onBack,
}: PhotoStepRouterProps) {
  // null = mode not chosen yet, "guided" = step-by-step, "bulk" = upload all at once
  const [uploadMode, setUploadMode] = useState<"guided" | "bulk" | null>(null);

  // Resolve correct photo group key: itemCategory takes priority over legacy category (sport ID)
  const photoGroupKey =
    ITEM_TO_PHOTO_GROUP[data.itemCategory ?? ""] ?? data.category;

  // Get photo groups config for the selected category
  const photoGroups = useMemo(
    () => getPhotoGroupsForCategory(photoGroupKey),
    [photoGroupKey],
  );

  // Hooks
  const { handleFileUpload, removePhoto, getPhotoByType } = usePhotoUpload(
    data,
    update,
  );
  const { currentSubStep, handleNext, handleBack, isFirstStep, isLastStep } =
    useSubStepNavigation(photoGroups.length, onNext);
  const { isGroupComplete } = usePhotoValidation(data, getPhotoByType);

  const currentGroup = photoGroups[currentSubStep];

  // Handle back — go back to mode selection on first sub-step
  const handleBackAction = () => {
    if (isFirstStep) {
      setUploadMode(null);
    } else {
      handleBack();
    }
  };

  // Render the content for the current sub-step group
  const renderGroupContent = () => {
    // Tags step
    if (currentGroup.hasTagQuestions) {
      return (
        <TagsForm
          data={data}
          update={update}
          currentGroup={currentGroup}
          getPhotoByType={getPhotoByType}
          handleFileUpload={handleFileUpload}
          removePhoto={removePhoto}
        />
      );
    }

    // Details / condition form
    if (currentGroup.hasDetailsForm) {
      return <DetailsForm data={data} update={update} />;
    }

    // Extra photos (optional)
    if (currentGroup.isExtra) {
      return <ExtraPhotosUpload />;
    }

    // Default: photo grid with optional player options
    return (
      <PhotoGrid
        showTipBar={!currentGroup.hasDetailsForm && !currentGroup.isExtra}
      >
        {/* Player options toggle (shirts back step) */}
        {currentGroup.hasPlayerOptions && (
          <div className="col-span-full">
            <PlayerOptionsForm data={data} update={update} />
          </div>
        )}

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
      </PhotoGrid>
    );
  };

  // ── Mode selection screen ─────────────────────────────────────────────────
  if (uploadMode === null) {
    return (
      <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-1">
              Add photos
            </h2>
            <p className="text-base text-gray-400 font-medium">
              How would you like to upload?
            </p>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-4">
            {/* Guided */}
            <button
              onClick={() => setUploadMode("guided")}
              className="group relative flex flex-col items-start gap-4 p-6 rounded-2xl border-2 border-gray-200 bg-gray-50 text-left hover:border-black hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <ListChecks size={24} className="text-gray-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Step-by-step guide</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We&apos;ll walk you through each photo type one by one — front, back, labels, details. Best for highest authenticity score.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-auto">Recommended</span>
            </button>

            {/* Bulk */}
            <button
              onClick={() => setUploadMode("bulk")}
              className="group relative flex flex-col items-start gap-4 p-6 rounded-2xl border-2 border-gray-200 bg-gray-50 text-left hover:border-black hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <Images size={24} className="text-gray-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Upload all at once</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Drop all your photos in one go. We&apos;ll tell you what to include so our AI can still verify your listing.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-auto">Quick & easy</span>
            </button>
          </div>

          <div className="px-8 pb-8 flex justify-start">
            <button
              onClick={onBack}
              className="text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Bulk upload mode ──────────────────────────────────────────────────────
  if (uploadMode === "bulk") {
    return (
      <BulkPhotoUpload
        data={data}
        update={update}
        onNext={onNext ?? (() => {})}
        onBack={() => setUploadMode(null)}
      />
    );
  }

  return (
    <PhotoStepLayout>
      {/* Header & progress */}
      <SubStepProgress
        currentSubStep={currentSubStep}
        totalSubSteps={photoGroups.length}
        title={currentGroup.title}
        description={currentGroup.description}
      />

      {/* Dynamic content based on group type */}
      {renderGroupContent()}

      {/* Navigation */}
      <NavigationButtons
        onNext={handleNext}
        onBack={handleBackAction}
        isNextDisabled={!isGroupComplete(currentGroup)}
        isLastStep={isLastStep}
      />

    </PhotoStepLayout>
  );
}
