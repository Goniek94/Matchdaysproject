"use client";

import { useCallback } from "react";
import type { SmartFormData, Photo } from "@/types/features/listing.types";

/**
 * Custom hook for photo upload, removal, and retrieval logic.
 * Eliminates duplicated upload code across all category photo steps.
 */
export function usePhotoUpload(
  data: SmartFormData,
  update: (field: keyof SmartFormData, val: any) => void,
) {
  const handleFileUpload = useCallback(
    (files: FileList | null, photoType: string) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const newPhoto: Photo = {
          id: `photo-${Date.now()}-${Math.random()}`,
          url: e.target?.result as string,
          typeHint: photoType as Photo["typeHint"],
        };

        const existingIndex = data.photos.findIndex(
          (p) => p.typeHint === photoType,
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
    },
    [data.photos, update],
  );

  const removePhoto = useCallback(
    (photoType: string) => {
      update(
        "photos",
        data.photos.filter((p) => p.typeHint !== photoType),
      );
    },
    [data.photos, update],
  );

  const getPhotoByType = useCallback(
    (photoType: string): Photo | undefined => {
      return data.photos.find((p) => p.typeHint === photoType);
    },
    [data.photos],
  );

  return { handleFileUpload, removePhoto, getPhotoByType };
}
