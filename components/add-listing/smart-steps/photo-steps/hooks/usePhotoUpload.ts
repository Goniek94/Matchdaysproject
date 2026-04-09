"use client";

import { useCallback, useRef } from "react";
import type { SmartFormData, Photo } from "@/types/features/listing.types";

/** SHA-256 hash of a file's raw bytes, returned as a hex string. */
async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Custom hook for photo upload, removal, and retrieval logic.
 * Includes SHA-256 deduplication — uploading the exact same file twice
 * is silently ignored (or replaces the slot if it's the same type).
 */
export function usePhotoUpload(
  data: SmartFormData,
  update: (field: keyof SmartFormData, val: any) => void,
) {
  // Map from hash → typeHint so we can detect cross-slot duplicates
  const hashMapRef = useRef<Map<string, string>>(new Map());

  const handleFileUpload = useCallback(
    async (files: FileList | null, photoType: string) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      const hash = await hashFile(file);

      // Check if this exact file content already exists in a DIFFERENT slot
      const existingType = hashMapRef.current.get(hash);
      if (existingType && existingType !== photoType) {
        // Same image already uploaded for a different slot — show toast and bail
        showDuplicateToast();
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const newPhoto: Photo = {
          id: `photo-${Date.now()}-${Math.random()}`,
          url: e.target?.result as string,
          typeHint: photoType as Photo["typeHint"],
        };

        // If replacing a slot, remove the old hash entry first
        const existingIndex = data.photos.findIndex(
          (p) => p.typeHint === photoType,
        );
        if (existingIndex >= 0) {
          // Find old hash and remove it
          for (const [h, t] of hashMapRef.current.entries()) {
            if (t === photoType) { hashMapRef.current.delete(h); break; }
          }
          const updatedPhotos = [...data.photos];
          updatedPhotos[existingIndex] = newPhoto;
          update("photos", updatedPhotos);
        } else {
          update("photos", [...data.photos, newPhoto]);
        }

        // Register this hash
        hashMapRef.current.set(hash, photoType);
      };

      reader.readAsDataURL(file);
    },
    [data.photos, update],
  );

  const removePhoto = useCallback(
    (photoType: string) => {
      // Also purge the hash entry for this slot
      for (const [h, t] of hashMapRef.current.entries()) {
        if (t === photoType) { hashMapRef.current.delete(h); break; }
      }
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

/** Shows a lightweight toast without any external library. */
function showDuplicateToast() {
  const existing = document.getElementById("__dup_photo_toast");
  if (existing) return; // already visible

  const toast = document.createElement("div");
  toast.id = "__dup_photo_toast";
  toast.textContent = "This photo is already added to another slot";
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1f2937",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
    zIndex: "9999",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}
