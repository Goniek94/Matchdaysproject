"use client";

import { useCallback } from "react";
import type { SmartFormData, Photo } from "@/types/features/listing.types";
import type { PhotoGroup } from "@/lib/constants/listing.constants";

/**
 * Custom hook for validating photo group completeness.
 * Determines if the user can proceed to the next sub-step.
 */
export function usePhotoValidation(
  data: SmartFormData,
  getPhotoByType: (photoType: string) => Photo | undefined,
) {
  const isGroupComplete = useCallback(
    (group: PhotoGroup): boolean => {
      // Details form and extra steps are always "complete"
      if (group.hasDetailsForm || group.isExtra) return true;

      // Tags step — combined tag mode
      if (group.id === "tags") {
        if (data.verification.tagsCombined) {
          return !!getPhotoByType("combined_tag");
        }
        return true;
      }

      // Back step — respect "no player print" toggle
      if (group.id === "back") {
        const requiredPhotos = group.photos.filter((p) => {
          if (!p.type || p.desc.includes("optional")) return false;
          if (
            data.verification.noPlayerPrint &&
            (p.type === "player_name" || p.type === "player_number")
          )
            return false;
          return true;
        });
        return requiredPhotos.every((p) => p.type && getPhotoByType(p.type));
      }

      // Default — check all required (non-optional) photos
      const requiredPhotos = group.photos.filter(
        (p) => p.type && !p.desc.includes("optional"),
      );
      return requiredPhotos.every((p) => p.type && getPhotoByType(p.type));
    },
    [data.verification, getPhotoByType],
  );

  return { isGroupComplete };
}
