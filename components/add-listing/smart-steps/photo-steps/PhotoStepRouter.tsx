"use client";

import { useMemo, useState } from "react";
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
  ExitModal,
  PhotoSlot,
  PhotoGrid,
  ExtraPhotosUpload,
} from "./shared";
import { TagsForm, DetailsForm, PlayerOptionsForm } from "./forms";

interface PhotoStepRouterProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

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
  const [showExitModal, setShowExitModal] = useState(false);

  // Get photo groups config for the selected category
  const photoGroups = useMemo(
    () => getPhotoGroupsForCategory(data.category),
    [data.category],
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

  // Handle back — show exit modal on first sub-step
  const handleBackAction = () => {
    if (isFirstStep) {
      setShowExitModal(true);
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

      {/* Exit modal */}
      <ExitModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onSaveDraft={() => {
          alert("Draft saving coming soon!");
          setShowExitModal(false);
        }}
        onDiscard={() => {
          setShowExitModal(false);
          if (onBack) onBack();
        }}
      />
    </PhotoStepLayout>
  );
}
