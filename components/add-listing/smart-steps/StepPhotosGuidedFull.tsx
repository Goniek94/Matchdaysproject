"use client";

import { useState } from "react";
import { SmartFormData, Photo, getCategoryById, DEFECT_TYPES } from "./types";
import {
  Upload,
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext?: () => void;
}

// Photo groups for shirts
const SHIRT_PHOTO_GROUPS = [
  {
    id: "front",
    title: "Front Photos",
    description: "Take photos of the front of the shirt",
    photos: [
      {
        type: "front_far",
        label: "Front (Far)",
        desc: "Full shirt from distance",
      },
      { type: "front_close", label: "Front (Close)", desc: "Close-up details" },
      { type: "club_logo", label: "Club Logo", desc: "Team badge close-up" },
      { type: "sponsor", label: "Sponsor", desc: "Sponsor logo" },
      { type: "brand", label: "Brand", desc: "Nike/Adidas logo" },
      { type: "seams", label: "Seams", desc: "Stitching quality" },
    ],
  },
  {
    id: "tags",
    title: "Tags & Labels",
    description: "Take photos of all tags (optional if missing)",
    photos: [
      { type: "size_tag", label: "Size Tag", desc: "Size label (optional)" },
      {
        type: "country_tag",
        label: "Country Tag",
        desc: "Made in... (optional)",
      },
      {
        type: "serial_code",
        label: "Serial Code",
        desc: "Product code (optional)",
      },
    ],
    hasQuestions: true,
  },
  {
    id: "back",
    title: "Back Photos",
    description: "Take photos of the back of the shirt",
    photos: [
      { type: "back_far", label: "Back (Far)", desc: "Full back view" },
      {
        type: "back_close",
        label: "Back (Close)",
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
  },
  {
    id: "details",
    title: "Additional Details",
    description: "Tell us more about the shirt",
    photos: [],
    hasForm: true,
  },
  {
    id: "extra",
    title: "More Photos",
    description: "Add more photos if you want (optional)",
    photos: [],
    isExtra: true,
  },
];

export default function StepPhotosGuidedFull({
  data,
  update,
  onNext,
}: StepProps) {
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const currentGroup = SHIRT_PHOTO_GROUPS[currentSubStep];
  const totalSubSteps = SHIRT_PHOTO_GROUPS.length;

  // Handle file upload
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
        (p) => p.typeHint === photoType
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

  // Remove photo
  const removePhoto = (photoType: string) => {
    update(
      "photos",
      data.photos.filter((p) => p.typeHint !== photoType)
    );
  };

  // Get photo for specific type
  const getPhotoByType = (photoType: string) => {
    return data.photos.find((p) => p.typeHint === photoType);
  };

  // Check if current group is complete
  const isGroupComplete = () => {
    if (currentGroup.hasForm || currentGroup.isExtra) return true; // Forms and extra are always optional

    const requiredPhotos = currentGroup.photos.filter(
      (p) => !p.desc.includes("optional")
    );
    return requiredPhotos.every((p) => getPhotoByType(p.type));
  };

  // Update verification field
  const updateVerification = (field: string, value: any) => {
    update("verification", {
      ...data.verification,
      [field]: value,
    });
  };

  // Add defect
  const addDefect = () => {
    const newDefect = { type: "", description: "", photoId: null };
    updateVerification("defects", [...data.verification.defects, newDefect]);
  };

  // Remove defect
  const removeDefect = (index: number) => {
    const newDefects = data.verification.defects.filter((_, i) => i !== index);
    updateVerification("defects", newDefects);
  };

  // Update defect
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

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, photoType: string) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files, photoType);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
        {/* Sub-step Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-1">
                {currentGroup.title}
              </h2>
              <p className="text-base text-gray-500 font-medium">
                {currentGroup.description}
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-400">
                PART {currentSubStep + 1}/{totalSubSteps}
              </span>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2">
            {SHIRT_PHOTO_GROUPS.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 flex-1 rounded-full transition-all",
                  index < currentSubStep
                    ? "bg-green-500"
                    : index === currentSubStep
                    ? "bg-blue-600"
                    : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        {/* CONTENT - Conditional rendering based on step type */}
        {currentGroup.hasQuestions ? (
          /* TAGS STEP WITH QUESTIONS */
          <div className="space-y-6">
            {/* Photo Upload Grid - 3 columns */}
            <div className="grid md:grid-cols-3 gap-4">
              {currentGroup.photos.map((photoConfig) => {
                const existingPhoto = getPhotoByType(photoConfig.type);
                return (
                  <div
                    key={photoConfig.type}
                    className={cn(
                      "relative p-4 rounded-2xl border-2 transition-all",
                      existingPhoto
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                  >
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-sm">
                          {photoConfig.label}
                        </h3>
                        {existingPhoto && (
                          <CheckCircle2 size={16} className="text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {photoConfig.desc}
                      </p>
                    </div>

                    {existingPhoto ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden group">
                        <img
                          src={existingPhoto.url}
                          alt={photoConfig.label}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removePhoto(photoConfig.type)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, photoConfig.type)}
                        className="relative aspect-video rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e.target.files, photoConfig.type)
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center">
                          <Upload
                            size={24}
                            className="mx-auto mb-1 text-gray-400"
                          />
                          <p className="text-xs font-medium text-gray-600">
                            Click or drop
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Questions */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="font-bold text-lg text-gray-900">
                Tag Information
              </h3>

              {/* Vintage */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">
                    Is this a vintage item? (Pre-2005)
                  </p>
                  <p className="text-sm text-gray-500">
                    Items from before 2005
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateVerification(
                      "isVintage",
                      !data.verification.isVintage
                    )
                  }
                  className={cn(
                    "relative inline-flex h-8 w-14 items-center rounded-full transition-colors",
                    data.verification.isVintage ? "bg-black" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-6 w-6 transform rounded-full bg-white transition-transform",
                      data.verification.isVintage
                        ? "translate-x-7"
                        : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              {/* Tag Condition */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900 mb-3">Tag Condition</p>
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
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="text-xl mb-1">{option.emoji}</div>
                      <div className="text-xs font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : currentGroup.hasForm ? (
          /* DETAILS STEP WITH FORM */
          <div className="space-y-6">
            {/* History */}
            <div>
              <label className="block font-bold text-gray-900 mb-2">
                Tell us about this shirt's history (Optional)
              </label>
              <textarea
                value={data.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Where did you get it? Any special memories? Match worn?"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none resize-none"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block font-bold text-gray-900 mb-2">
                Condition
              </label>
              <select
                value={data.condition}
                onChange={(e) => update("condition", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-medium"
              >
                <option value="">Select condition...</option>
                <option value="bnwt">Brand New With Tags (BNWT)</option>
                <option value="bnwot">Brand New Without Tags (BNWOT)</option>
                <option value="excellent">Excellent - Like New</option>
                <option value="good">Good - Minor Wear</option>
                <option value="fair">Fair - Visible Wear</option>
                <option value="poor">Poor - Heavy Wear</option>
              </select>
            </div>

            {/* Defects */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900">
                    Does it have any defects?
                  </p>
                  <p className="text-sm text-gray-500">
                    Stains, holes, fading, etc.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newValue = !data.verification.hasDefects;
                    updateVerification("hasDefects", newValue);
                    if (newValue && data.verification.defects.length === 0) {
                      addDefect();
                    }
                  }}
                  className={cn(
                    "relative inline-flex h-8 w-14 items-center rounded-full transition-colors",
                    data.verification.hasDefects ? "bg-red-500" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-6 w-6 transform rounded-full bg-white transition-transform",
                      data.verification.hasDefects
                        ? "translate-x-7"
                        : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              {data.verification.hasDefects && (
                <div className="mt-4 space-y-3">
                  {data.verification.defects.map((defect, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white rounded-xl border border-red-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-bold text-red-900">
                          Defect #{index + 1}
                        </span>
                        <button
                          onClick={() => removeDefect(index)}
                          className="p-1 hover:bg-red-100 rounded"
                        >
                          <X size={14} className="text-red-600" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <select
                          value={defect.type}
                          onChange={(e) =>
                            updateDefect(index, "type", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm"
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
                          className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm resize-none"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addDefect}
                    className="w-full py-2 border-2 border-dashed border-red-300 rounded-xl text-red-600 font-medium hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Add Another Defect
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : currentGroup.isExtra ? (
          /* EXTRA PHOTOS STEP */
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              📸 The photos you've uploaded will be used for verification and in
              your listing.
              <br />
              You can add more photos here or edit them later.
            </p>
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-gray-400 transition-colors">
              <Upload size={48} className="mx-auto mb-3 text-gray-400" />
              <p className="font-medium text-gray-700">
                Add more photos (optional)
              </p>
              <p className="text-sm text-gray-500">
                Click to upload additional photos
              </p>
            </div>
          </div>
        ) : (
          /* REGULAR PHOTO UPLOAD GRID */
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {currentGroup.photos.map((photoConfig) => {
              const existingPhoto = getPhotoByType(photoConfig.type);
              const isOptional = photoConfig.desc.includes("optional");

              return (
                <div
                  key={photoConfig.type}
                  className={cn(
                    "relative p-4 rounded-2xl border-2 transition-all",
                    existingPhoto
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">
                        {photoConfig.label}
                        {isOptional && (
                          <span className="ml-2 text-xs text-gray-500">
                            (Optional)
                          </span>
                        )}
                      </h3>
                      {existingPhoto && (
                        <CheckCircle2 size={20} className="text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{photoConfig.desc}</p>
                  </div>

                  {existingPhoto ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden group">
                      <img
                        src={existingPhoto.url}
                        alt={photoConfig.label}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(photoConfig.type)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, photoConfig.type)}
                      className="relative aspect-video rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(e.target.files, photoConfig.type)
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-center">
                        <Upload
                          size={32}
                          className="mx-auto mb-2 text-gray-400"
                        />
                        <p className="text-sm font-medium text-gray-600">
                          Click or drop photo
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        {!currentGroup.hasForm && !currentGroup.isExtra && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Make sure photos are clear and well-lit.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            onClick={handleBackSubStep}
            disabled={currentSubStep === 0}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors",
              currentSubStep === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={handleNextSubStep}
            disabled={!isGroupComplete()}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all",
              isGroupComplete()
                ? "bg-black hover:bg-gray-800 hover:scale-[1.02]"
                : "bg-gray-300 cursor-not-allowed"
            )}
          >
            {currentSubStep < totalSubSteps - 1 ? "Next Part" : "Complete"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
