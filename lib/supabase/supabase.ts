import { createClient } from "@supabase/supabase-js";
import {
  compressImage,
  COMPRESSION_PRESETS,
  validateImageFile,
  formatFileSize,
} from "@/lib/utils/image.utils";
import type { UploadedImage } from "@/lib/utils/image.utils";

const supabaseUrl = "https://kbrxpdibulijbljelvgp.supabase.co";
const supabaseAnonKey = "sb_publishable_qiAAgkOIQ9BGbnhu7X2LVg_eENp4amc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// FILE-BASED UPLOAD WITH COMPRESSION
// Ported from marketplace-frontend (Repotest) uploadCarImages → TypeScript
// ============================================

/**
 * Upload listing images to Supabase Storage with automatic compression.
 * Ported 1:1 from Repotest's uploadCarImages function.
 *
 * @param files - Array of File objects to upload
 * @param mainImageFile - The file that should be marked as main image
 * @param onProgress - Optional progress callback (0-100)
 * @returns Array of uploaded image info with public URLs
 */
export const uploadListingImages = async (
  files: File[],
  mainImageFile?: File | null,
  onProgress?: (progress: number) => void,
): Promise<UploadedImage[]> => {
  if (!files || files.length === 0) return [];

  console.log("🚀 Starting Supabase upload:", files.length, "files");

  // Sort so main image is uploaded first (like Repotest)
  const sortedFiles = [...files].sort((a, b) => {
    if (a === mainImageFile) return -1;
    if (b === mainImageFile) return 1;
    return 0;
  });

  try {
    const uploadedImages: UploadedImage[] = [];
    const totalFiles = sortedFiles.length;

    for (let i = 0; i < sortedFiles.length; i++) {
      const file = sortedFiles[i];

      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        console.warn(
          `⚠️ Skipping invalid file ${file.name}:`,
          validation.errors,
        );
        continue;
      }

      // Log original size
      console.log(`📦 Original size: ${formatFileSize(file.size)}`);

      // Compress the file (like Repotest does with browser-image-compression)
      console.log(`🗜️ Compressing image ${i + 1}/${totalFiles}...`);
      const compressedFile = await compressImage(
        file,
        COMPRESSION_PRESETS.HIGH_QUALITY,
      );

      // Generate unique filename (like Repotest)
      const timestamp = Date.now();
      const randomId = Math.floor(Math.random() * 1000000);
      const filename = `listings/${timestamp}-${randomId}.webp`;

      console.log(`📤 Upload ${i + 1}/${totalFiles}: ${filename}`);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("Matchdays")
        .upload(filename, compressedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: "image/webp",
        });

      if (error) {
        console.error("❌ Supabase upload error:", error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log("✅ Upload success:", data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("Matchdays")
        .getPublicUrl(data.path);

      uploadedImages.push({
        url: urlData.publicUrl,
        isMain: file === mainImageFile,
        originalName: file.name,
        filename: filename,
      });

      // Update progress
      if (onProgress) {
        const progress = Math.round(((i + 1) / totalFiles) * 100);
        onProgress(progress);
      }
    }

    console.log("🎉 All files uploaded to Supabase:", uploadedImages);
    return uploadedImages;
  } catch (error) {
    console.error("💥 Error uploading images to Supabase:", error);
    throw error;
  }
};

/**
 * Delete images from Supabase Storage.
 * Ported from Repotest's deleteCarImages.
 */
export const deleteListingImages = async (
  imageUrls: string[],
): Promise<{ success: boolean }> => {
  try {
    console.log("🗑️ Deleting images from Supabase:", imageUrls);

    const filenames = imageUrls.map((url) => {
      const parts = url.split("/");
      // Get last two parts (listings/filename.webp)
      return parts.slice(-2).join("/");
    });

    const { error } = await supabase.storage
      .from("Matchdays")
      .remove(filenames);

    if (error) {
      console.error("❌ Supabase delete error:", error);
      throw new Error(`Delete failed: ${error.message}`);
    }

    console.log("✅ Files deleted from Supabase");
    return { success: true };
  } catch (error) {
    console.error("💥 Error deleting images from Supabase:", error);
    throw error;
  }
};

export const uploadPhoto = async (
  file: string, // base64 string
  fileName: string,
  mimeType: string = "image/jpeg",
): Promise<string | null> => {
  try {
    // Konwertuj base64 na Blob
    const base64Data = file.startsWith("data:") ? file.split(",")[1] : file;

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Upload do Supabase Storage
    const path = `listings/${Date.now()}_${fileName}`;
    const { data, error } = await supabase.storage
      .from("Matchdays")
      .upload(path, blob, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      console.error("[Supabase] Upload error:", error);
      return null;
    }

    // Zwróć publiczny URL
    const { data: urlData } = supabase.storage
      .from("Matchdays")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (err) {
    console.error("[Supabase] Upload failed:", err);
    return null;
  }
};

export const uploadPhotos = async (
  photos: Array<{ url: string; typeHint: string | null }>,
): Promise<Array<{ url: string; typeHint: string | null }>> => {
  console.group("🗄️ [Supabase] uploadPhotos called");
  console.log("Total photos received:", photos.length);

  const base64Photos = photos.filter((p) => p.url && p.url.startsWith("data:"));
  const blobPhotos = photos.filter((p) => p.url && p.url.startsWith("blob:"));
  const httpPhotos = photos.filter((p) => p.url && p.url.startsWith("http"));
  const otherPhotos = photos.filter(
    (p) =>
      p.url &&
      !p.url.startsWith("data:") &&
      !p.url.startsWith("blob:") &&
      !p.url.startsWith("http"),
  );

  console.log("📊 Photo breakdown:");
  console.log("  - Base64 (will upload):", base64Photos.length);
  console.log("  - Blob (⚠️ SKIPPED - cannot upload):", blobPhotos.length);
  console.log("  - HTTP (already uploaded):", httpPhotos.length);
  console.log("  - Other/Unknown:", otherPhotos.length);

  if (base64Photos.length === 0) {
    console.warn(
      "⚠️ [Supabase] NO base64 photos to upload! All photos will keep original URLs.",
    );
  }

  const uploaded = await Promise.all(
    base64Photos.map(async (photo, index) => {
      const mimeType = photo.url.match(/^data:([^;]+);/)?.[1] || "image/jpeg";
      const ext = mimeType.split("/")[1] || "jpg";
      const fileName = `${photo.typeHint || "photo"}_${index}.${ext}`;

      console.log(`  📤 Uploading photo[${index}]: ${fileName} (${mimeType})`);
      const publicUrl = await uploadPhoto(photo.url, fileName, mimeType);
      console.log(
        `  ${publicUrl ? "✅" : "❌"} Upload result: ${publicUrl?.substring(0, 80) || "FAILED"}`,
      );

      return {
        url: publicUrl || photo.url,
        typeHint: photo.typeHint,
      };
    }),
  );

  console.log(
    "📊 Final result: uploaded",
    uploaded.length,
    "photos out of",
    photos.length,
    "total",
  );
  console.groupEnd();

  return uploaded;
};
