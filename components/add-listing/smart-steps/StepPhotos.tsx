import {
  SmartFormData,
  Photo,
  getCategoryById,
  getRequiredPhotosForCategory,
  getOptionalPhotosForCategory,
} from "./types";
import { Upload, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
}

export default function StepPhotos({ data, update }: StepProps) {
  const [isDragging, setIsDragging] = useState(false);

  const selectedCategory = getCategoryById(data.category);
  const minPhotos = 5; // Updated to 5 as per spec
  const maxPhotos = 15; // Updated to 15 as per spec
  const canProceed = data.photos.length >= minPhotos;

  const requiredPhotos = getRequiredPhotosForCategory(data.category);
  const optionalPhotos = getOptionalPhotosForCategory(data.category);
  const allPhotoTypes = [...requiredPhotos, ...optionalPhotos];

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newPhotos: Photo[] = [];
    const remainingSlots = maxPhotos - data.photos.length;

    Array.from(files)
      .slice(0, remainingSlots)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const photo: Photo = {
            id: `photo-${Date.now()}-${Math.random()}`,
            url: e.target?.result as string,
            typeHint: null,
          };
          newPhotos.push(photo);

          if (newPhotos.length === Math.min(files.length, remainingSlots)) {
            update("photos", [...data.photos, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      });
  };

  // Remove photo
  const removePhoto = (photoId: string) => {
    update(
      "photos",
      data.photos.filter((p) => p.id !== photoId)
    );
  };

  // Update photo type hint
  const updatePhotoType = (photoId: string, typeHint: Photo["typeHint"]) => {
    update(
      "photos",
      data.photos.map((p) => (p.id === photoId ? { ...p, typeHint } : p))
    );
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Main Container with Shadow */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2">
            Upload Photos
          </h2>
          <p className="text-base text-gray-500 font-medium">
            Add at least {minPhotos} photos of your item
          </p>
          {selectedCategory && (
            <div className="mt-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900 mb-1">
                    📸 Required Photos for Verification
                  </h3>
                  <p className="text-sm text-blue-700 font-medium">
                    These photos are mandatory for product authentication and
                    verification by our team
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 mb-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                  ✅ Must Include:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {requiredPhotos.map((photoType) => (
                    <div
                      key={photoType}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg"
                    >
                      <span className="text-lg">📷</span>
                      {photoType}
                    </div>
                  ))}
                </div>
              </div>

              {optionalPhotos.length > 0 && (
                <div className="bg-white/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    💡 Optional (Recommended):
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {optionalPhotos.map((photoType) => (
                      <div
                        key={photoType}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg"
                      >
                        <span className="text-lg">📸</span>
                        {photoType}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 font-medium">
                  ⚠️ <strong>Important:</strong> All required photos must be
                  clear and well-lit for successful verification. Missing photos
                  will delay your listing approval.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Area */}
        {data.photos.length < maxPhotos && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-8 mb-6 transition-all duration-300",
              isDragging
                ? "border-black bg-gray-50 scale-[1.02]"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="photo-upload"
            />
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                <Upload size={32} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Drop photos here or click to upload
              </h3>
              <p className="text-sm text-gray-500">
                {data.photos.length}/{maxPhotos} photos uploaded • Min{" "}
                {minPhotos} required
              </p>
            </div>
          </div>
        )}

        {/* Photo Grid */}
        {data.photos.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Your Photos ({data.photos.length}/{maxPhotos})
              </h3>
              {canProceed && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 size={20} />
                  <span className="text-sm font-medium">Ready to proceed</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-gray-300 transition-all"
                >
                  <img
                    src={photo.url}
                    alt={`Product photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Remove button */}
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>

                  {/* Type hint selector */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <select
                      value={photo.typeHint || ""}
                      onChange={(e) =>
                        updatePhotoType(
                          photo.id,
                          (e.target.value || null) as Photo["typeHint"]
                        )
                      }
                      className="w-full text-xs bg-white/90 rounded px-2 py-1 font-medium"
                    >
                      <option value="">Label photo...</option>
                      {allPhotoTypes
                        .filter((photoType) => photoType !== null)
                        .map((photoType) => (
                          <option key={photoType} value={photoType as string}>
                            {(photoType as string).charAt(0).toUpperCase() +
                              (photoType as string).slice(1)}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Photo number badge */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                    #{index + 1}
                  </div>

                  {/* Type hint badge */}
                  {photo.typeHint && (
                    <div className="absolute top-2 left-2 right-2 flex justify-center">
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
                        {photo.typeHint}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {data.photos.length > 0 && data.photos.length < minPhotos && (
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm font-medium text-yellow-900">
              ⚠️ Add {minPhotos - data.photos.length} more photo
              {minPhotos - data.photos.length > 1 ? "s" : ""} to continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
