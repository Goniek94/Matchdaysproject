"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Camera, Sparkles, Loader2 } from "lucide-react";

interface PhotoUploadProps {
  category: {
    id: string;
    name: string;
    requiredPhotos: {
      id: string;
      label: string;
      description: string;
      required: boolean;
    }[];
  };
  photos: Record<string, string | null>;
  onPhotosChange: (photos: Record<string, string | null>) => void;
  useAI: boolean;
  aiCreditsAvailable: number;
  onAIToggle: (useAI: boolean) => void;
  onAIProcess: () => void;
  isProcessing: boolean;
}

export default function PhotoUpload({
  category,
  photos,
  onPhotosChange,
  useAI,
  aiCreditsAvailable,
  onAIToggle,
  onAIProcess,
  isProcessing,
}: PhotoUploadProps) {
  const [dragOver, setDragOver] = useState<string | null>(null);

  // Handle file upload
  const handleFileUpload = (photoId: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      onPhotosChange({
        ...photos,
        [photoId]: url,
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDrop = (photoId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(photoId, file);
    }
  };

  // Remove photo
  const removePhoto = (photoId: string) => {
    onPhotosChange({
      ...photos,
      [photoId]: null,
    });
  };

  // Check if all required photos are uploaded
  const requiredPhotos = category.requiredPhotos.filter((p) => p.required);
  const allRequiredUploaded = requiredPhotos.every((p) => photos[p.id]);

  // Check if any photos are uploaded
  const hasPhotos = Object.values(photos).some((photo) => photo !== null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Photos</h2>
        <p className="text-gray-600">
          Add product photos according to category requirements
        </p>
      </div>

      {/* Photo Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.requiredPhotos.map((photoReq) => {
          const hasPhoto = photos[photoReq.id];

          return (
            <Card
              key={photoReq.id}
              className={`p-4 ${
                dragOver === photoReq.id
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : ""
              }`}
            >
              <div className="space-y-3">
                {/* Label */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {photoReq.label}
                    {photoReq.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h3>
                  {hasPhoto && (
                    <button
                      onClick={() => removePhoto(photoReq.id)}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-600">{photoReq.description}</p>

                {/* Upload Area */}
                {hasPhoto ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={hasPhoto}
                      alt={photoReq.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(photoReq.id);
                    }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={(e) => handleDrop(photoReq.id, e)}
                    className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer group"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(photoReq.id, file);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500">
                      <Camera className="w-8 h-8 mb-2" />
                      <p className="text-sm font-medium">Add photo</p>
                      <p className="text-xs mt-1">or drag here</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Upload Progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">
            Progress: {Object.values(photos).filter(Boolean).length} /{" "}
            {category.requiredPhotos.length} photos
          </span>
          <span
            className={`font-medium ${
              allRequiredUploaded ? "text-green-600" : "text-gray-600"
            }`}
          >
            {allRequiredUploaded
              ? "✓ All required photos added"
              : `${
                  requiredPhotos.length -
                  requiredPhotos.filter((p) => photos[p.id]).length
                } required remaining`}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                (Object.values(photos).filter(Boolean).length /
                  category.requiredPhotos.length) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      {/* AI Toggle - Show after photos are uploaded */}
      {hasPhotos && aiCreditsAvailable > 0 && (
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Use AI to automatically fill the form?
                </h3>
                <p className="text-sm text-gray-600">
                  AI will analyze photos and fill the form for you
                  <span className="ml-2 text-purple-600 font-medium">
                    ({aiCreditsAvailable} credits available)
                  </span>
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => onAIToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* AI Process Button */}
          {useAI && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={onAIProcess}
                disabled={isProcessing}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    AI is analyzing photos...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze photos with AI
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
