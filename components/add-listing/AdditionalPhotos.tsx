"use client";

import { Card } from "@/components/ui/card";
import { Camera, X, Info } from "lucide-react";

interface AdditionalPhotosProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export default function AdditionalPhotos({
  photos,
  onPhotosChange,
}: AdditionalPhotosProps) {
  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      onPhotosChange([...photos, url]);
    };
    reader.readAsDataURL(file);
  };

  // Remove photo
  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const maxPhotos = 8;
  const canAddMore = photos.length < maxPhotos;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Additional Photos (Optional)
        </h2>
        <p className="text-gray-600">
          Add more photos to showcase your product better
        </p>
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <p className="font-medium text-gray-900 mb-1">
              Why add more photos?
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Show different angles and details</li>
              <li>Highlight unique features or accessories</li>
              <li>Increase buyer confidence</li>
              <li>
                Do not add verification photos (tags, labels) that were already
                uploaded
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={photo}
              alt={`Additional photo ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
              Photo {index + 1}
            </div>
          </div>
        ))}

        {/* Add Photo Button */}
        {canAddMore && (
          <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500">
              <Camera className="w-8 h-8 mb-2" />
              <p className="text-sm font-medium">Add photo</p>
              <p className="text-xs mt-1">
                {photos.length}/{maxPhotos}
              </p>
            </div>
          </div>
        )}
      </div>

      {photos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">No additional photos added yet</p>
          <p className="text-xs mt-1">This step is optional</p>
        </div>
      )}

      {!canAddMore && (
        <p className="text-sm text-gray-600 text-center">
          Maximum number of additional photos reached ({maxPhotos})
        </p>
      )}
    </div>
  );
}
