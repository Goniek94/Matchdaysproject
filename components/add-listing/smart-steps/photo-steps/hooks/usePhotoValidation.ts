"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

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

      // Tags step
      if (group.id === "tags") {
        // Combined tag mode: only combined_tag photo required
        if (data.verification.tagsCombined) {
          return !!getPhotoByType("combined_tag");
        }

        const serialMissing = !!(data.verification as any).serialMissing;
        const serialMissingReason = (data.verification as any).serialMissingReason ?? "";

        // Serial declared missing but no reason given → block
        if (serialMissing && !serialMissingReason) return false;

        // Check each tag photo
        const allTagsComplete = group.photos.every((p) => {
          if (!p.type) return true;
          // serial_code: skip if user declared it missing with a reason
          if (p.type === "serial_code" && serialMissing && serialMissingReason) return true;
          // skip optional photos
          if (p.desc.toLowerCase().includes("optional")) return true;
          return !!getPhotoByType(p.type);
        });

        return allTagsComplete;
      }

      // Back step — respect "no player print" / individual name+number toggles
      if (group.id === "back") {
        const noName = !!(data.verification as any).noName || data.verification.noPlayerPrint;
        const noNumber = !!(data.verification as any).noNumber || data.verification.noPlayerPrint;

        const requiredPhotos = group.photos.filter((p) => {
          if (!p.type || p.desc.toLowerCase().includes("optional")) return false;
          if (noName && p.type === "player_name") return false;
          if (noNumber && p.type === "player_number") return false;
          return true;
        });
        return requiredPhotos.every((p) => p.type && getPhotoByType(p.type));
      }

      // Default — check all required (non-optional) photos
      const requiredPhotos = group.photos.filter(
        (p) => p.type && !p.desc.toLowerCase().includes("optional"),
      );
      return requiredPhotos.every((p) => p.type && getPhotoByType(p.type));
    },
    [data.verification, getPhotoByType],
  );

  return { isGroupComplete };
}
