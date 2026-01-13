"use client";

import { useState } from "react";
import { SmartFormData, Photo, getCategoryById } from "./types";
import { Upload, X, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
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
    description: "Take photos of all tags and labels (optional if missing)",
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
    hasQuestions: true, // This step has additional questions
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
    ],
  },
  {
    id: "details",
    title: "Additional Details",
    description: "Tell us more about the shirt (optional)",
    photos: [],
    hasForm: true, // This step has a form instead of photos
  },
  {
    id: "extra",
    title: "More Photos",
    description: "Add more photos if you want (optional)",
    photos: [],
    isOptional: true,
  },
];

export default function StepPhotosGuided({ data, update, onNext }: StepProps) {
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const selectedCategory = getCategoryById(data.category);
  const currentGroup = SHIRT_PHOTO_GROUPS[currentSubStep];
  const totalSubSteps = SHIRT_PHOTO_GROUPS.length;

  // Handle file upload
  const handleFileUpload = (files: FileList | null, photoType: string) => {
    if (!files) return;

    const file = files[0]; // Only one photo per type
    const reader = new FileReader();

    reader.onload = (e) => {
      const newPhoto: Photo = {
        id: `photo-${Date.now()}-${Math.random()}`,
        url: e.target?.result as string,
        typeHint: photoType as any,
      };

      // Check if photo of this type already exists
      const existingIndex = data.photos.findIndex(
        (p) => p.typeHint === photoType
      );

      if (existingIndex >= 0) {
        // Replace existing photo
        const updatedPhotos = [...data.photos];
        updatedPhotos[existingIndex] = newPhoto;
        update("photos", updatedPhotos);
      } else {
        // Add new photo
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
    const requiredPhotos = currentGroup.photos.filter(
      (p) => !p.desc.includes("optional")
    );
    return requiredPhotos.every((p) => getPhotoByType(p.type));
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

  const handleNextSubStep = () => {
    if (currentSubStep < totalSubSteps - 1) {
      setCurrentSubStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (onNext) {
      onNext(); // Go to next main step
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
      {/* Main Container */}
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

        {/* Photo Upload Grid */}
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
                {/* Label */}
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

                {/* Upload Area or Preview */}
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
                    className={cn(
                      "relative aspect-video rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all",
                      isDragging
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    )}
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

        {/* Info Box */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Make sure photos are clear and well-lit.
            All required photos must be uploaded to continue.
          </p>
        </div>

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
            {currentSubStep < totalSubSteps - 1
              ? "Next Part"
              : "Complete Photos"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
