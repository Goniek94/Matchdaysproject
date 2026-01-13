"use client";

import { useState } from "react";
import { SmartFormData, Photo } from "./types";
import {
  Upload,
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext?: () => void;
}

// Photo groups for footwear - 5 PARTS
const FOOTWEAR_PHOTO_GROUPS = [
  {
    id: "overview",
    title: "Overview (Całość Butów)",
    description: "Take photos of the complete shoes from all angles",
    photos: [
      {
        type: "side_left",
        label: "Side View – Left",
        desc: "Lewy but z profilu",
        why: "AI sprawdza: sylwetkę, proporcje, kształt toe boxa",
        optional: false,
      },
      {
        type: "side_right",
        label: "Side View – Right",
        desc: "Prawy but z profilu",
        why: "AI sprawdza: symetrię (fake często się sypie)",
        optional: false,
      },
      {
        type: "front_both",
        label: "Front View (Both)",
        desc: "Oba buty od przodu",
        why: "AI sprawdza: szerokość noska, kąt czubka",
        optional: false,
      },
      {
        type: "back_heel",
        label: "Back View (Heel)",
        desc: "Pięty obu butów",
        why: "AI sprawdza: kształt zapiętka, wysokość pięty",
        optional: false,
      },
    ],
  },
  {
    id: "labels",
    title: "Labels & SKU (NAJWAŻNIEJSZE)",
    description: "Inner labels - critical for AI verification",
    photos: [
      {
        type: "inner_label_left",
        label: "Inner Label – Left",
        desc: "Metka wewnętrzna lewego buta",
        why: "AI sprawdza: SKU, rozmiary, daty produkcji, fabrykę",
        optional: false,
      },
      {
        type: "inner_label_right",
        label: "Inner Label – Right",
        desc: "Metka wewnętrzna prawego buta",
        why: "AI sprawdza: czy lewy i prawy but mają różne kody",
        optional: false,
      },
    ],
    critical: true,
    warning: "❗ Brak metek → MAX SCORE = 70%",
  },
  {
    id: "sole",
    title: "Sole & Construction",
    description: "Bottom and midsole details",
    photos: [
      {
        type: "outsole",
        label: "Outsole (Bottom)",
        desc: "Spód buta",
        why: "AI sprawdza: pattern bieżnika, pivot circle, głębokość nacięć",
        optional: false,
      },
      {
        type: "midsole",
        label: "Midsole Close-up",
        desc: "Podeszwa boczna",
        why: "AI sprawdza: kształt pianek, linie formy",
        optional: false,
      },
    ],
  },
  {
    id: "details",
    title: "Details & Branding",
    description: "Logo, tongue, and stitching quality",
    photos: [
      {
        type: "brand_logo",
        label: "Brand Logo",
        desc: "Swoosh / Stripes / NB",
        why: "AI sprawdza: pozycję, grubość, haft vs nadruk",
        optional: false,
      },
      {
        type: "tongue_label",
        label: "Tongue Label",
        desc: "Język",
        why: "AI sprawdza: font, spacing, zgodność z modelem",
        optional: false,
      },
      {
        type: "stitching",
        label: "Stitching / Glue",
        desc: "Szwy lub klejenia",
        why: "AI sprawdza: równość, typ ściegu, nadlewki kleju",
        optional: false,
      },
    ],
  },
  {
    id: "inside",
    title: "Inside & Extras",
    description: "Insoles and optional items",
    photos: [
      {
        type: "insole_top",
        label: "Insole (Top)",
        desc: "Wkładka z góry",
        why: "AI sprawdza: odciski form, jakość pianki",
        optional: false,
      },
      {
        type: "insole_bottom",
        label: "Insole (Bottom)",
        desc: "Spód wkładki",
        why: "AI sprawdza: odciski form, jakość pianki",
        optional: false,
      },
      {
        type: "box",
        label: "Box + Label (Optional)",
        desc: "Pudełko z kodem",
        why: "➕ Boost do 95–98%",
        optional: true,
      },
      {
        type: "extras",
        label: "Extra Laces (Optional)",
        desc: "Dodatkowe sznurówki",
        why: "➕ Drobny boost",
        optional: true,
      },
    ],
  },
];

export default function StepPhotosFootwear({
  data,
  update,
  onNext,
}: StepProps) {
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const currentGroup = FOOTWEAR_PHOTO_GROUPS[currentSubStep];
  const totalSubSteps = FOOTWEAR_PHOTO_GROUPS.length;

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
    const requiredPhotos = currentGroup.photos.filter((p) => !p.optional);
    return requiredPhotos.every((p) => getPhotoByType(p.type));
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
            {FOOTWEAR_PHOTO_GROUPS.map((_, index) => (
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

          {/* Critical warning */}
          {currentGroup.critical && (
            <div className="mt-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-sm font-bold text-red-900">
                {currentGroup.warning}
              </p>
            </div>
          )}
        </div>

        {/* Photo Upload Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {currentGroup.photos.map((photoConfig) => {
            const existingPhoto = getPhotoByType(photoConfig.type);
            const isOptional = photoConfig.optional;

            return (
              <div
                key={photoConfig.type}
                className={cn(
                  "relative p-4 rounded-2xl border-2 transition-all",
                  existingPhoto
                    ? "border-green-500 bg-green-50"
                    : isOptional
                    ? "border-blue-200 bg-blue-50/30"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                {/* Label */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {photoConfig.label}
                      {isOptional && (
                        <span className="ml-2 text-xs text-blue-600">
                          (Optional)
                        </span>
                      )}
                    </h3>
                    {existingPhoto && (
                      <CheckCircle2 size={16} className="text-green-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {photoConfig.desc}
                  </p>
                  {/* Why tooltip */}
                  <div className="flex items-start gap-1 p-2 bg-blue-50 rounded-lg">
                    <Info
                      size={12}
                      className="text-blue-600 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-xs text-blue-800">{photoConfig.why}</p>
                  </div>
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
                        size={28}
                        className="mx-auto mb-2 text-gray-400"
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

        {/* Info Box */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Make sure photos are clear and well-lit.
            {currentGroup.critical &&
              " These photos are CRITICAL for AI verification!"}
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
            {currentSubStep < totalSubSteps - 1 ? "Next Part" : "Complete"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
