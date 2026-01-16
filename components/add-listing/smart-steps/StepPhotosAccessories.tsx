"use client";

import { SmartFormData, Photo } from "./types";
import { Upload, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext?: () => void;
}

// Simple photo list for accessories - NO sub-steps, just 4 photos
const ACCESSORY_PHOTOS = [
  {
    type: "full_view",
    label: "Full View",
    desc: "Complete view of accessory",
    optional: false,
  },
  {
    type: "logo_branding",
    label: "Logo / Branding",
    desc: "Close-up of logo",
    optional: false,
  },
  {
    type: "label_tag",
    label: "Label / Tag",
    desc: "Label or tag",
    optional: false,
  },
  {
    type: "material_detail",
    label: "Material – Close-up",
    desc: "Material structure",
    optional: false,
  },
];

export default function StepPhotosAccessories({
  data,
  update,
  onNext,
}: StepProps) {
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

  const removePhoto = (photoType: string) => {
    update(
      "photos",
      data.photos.filter((p) => p.typeHint !== photoType)
    );
  };

  const getPhotoByType = (photoType: string) => {
    return data.photos.find((p) => p.typeHint === photoType);
  };

  const canProceed = ACCESSORY_PHOTOS.filter((p) => !p.optional).every((p) =>
    getPhotoByType(p.type)
  );

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2">
            Accessories Photos
          </h2>
          <p className="text-base text-gray-500 font-medium">
            Upload 4 photos of your accessory item
          </p>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
          <p className="text-sm font-bold text-yellow-900">
            ⚠️ MAX REALISTIC SCORE: 75–85%
          </p>
          <p className="text-xs text-yellow-800 mt-1">
            Accessories have lower AI verification scores due to limited
            verification points
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {ACCESSORY_PHOTOS.map((photoConfig) => {
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
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {photoConfig.label}
                    </h3>
                    {existingPhoto && (
                      <CheckCircle2 size={16} className="text-green-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{photoConfig.desc}</p>
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
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="relative aspect-video rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50">
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

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Make sure all 4 photos are clear and
            well-lit. Focus on branding and material details for best AI
            verification.
          </p>
        </div>
      </div>
    </div>
  );
}
