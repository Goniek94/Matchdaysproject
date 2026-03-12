"use client";

import { Upload } from "lucide-react";

/**
 * Optional extra photos upload section.
 * Shown as the last sub-step for additional angles or details.
 */
export function ExtraPhotosUpload() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Upload size={24} className="text-gray-400" />
      </div>
      <p className="font-bold text-gray-900 mb-1">Add more photos</p>
      <p className="text-sm text-gray-500 mb-6">
        Optional — any extra angles or details
      </p>
      <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 transition-colors cursor-pointer">
        <p className="text-sm text-gray-400">
          Click to upload additional photos
        </p>
      </div>
    </div>
  );
}
