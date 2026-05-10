import { createClient } from "@supabase/supabase-js";
import {
  compressImage,
  COMPRESSION_PRESETS,
  validateImageFile,
  formatFileSize,
} from "@/lib/utils/image.utils";
import type { UploadedImage } from "@/lib/utils/image.utils";
import { logger } from "@/lib/logger";

// ── Lazy client factory ───────────────────────────────────────────────────────
// Supabase is browser-only (image upload). We delay validation until first use
// so that Next.js static prerendering doesn't throw during the build.

let _supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables.\n" +
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.\n" +
      "See .env.example for the full list of required variables.",
    );
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return (getSupabaseClient() as never as Record<string | symbol, unknown>)[prop];
  },
});

// ============================================
// FILE-BASED UPLOAD WITH COMPRESSION
// ============================================

/**
 * Upload listing images to Supabase Storage with automatic compression.
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

  logger.info(`Starting upload: ${files.length} file(s)`, "Supabase");

  // Sort so main image is uploaded first
  const sortedFiles = [...files].sort((a, b) => {
    if (a === mainImageFile) return -1;
    if (b === mainImageFile) return 1;
    return 0;
  });

  const uploadedImages: UploadedImage[] = [];
  const totalFiles = sortedFiles.length;

  for (let i = 0; i < sortedFiles.length; i++) {
    const file = sortedFiles[i];

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      logger.warn(
        `Skipping invalid file "${file.name}": ${validation.errors?.join(", ")}`,
        "Supabase",
      );
      continue;
    }

    logger.debug(
      `Compressing image ${i + 1}/${totalFiles} (${formatFileSize(file.size)})`,
      "Supabase",
    );

    const compressedFile = await compressImage(file, COMPRESSION_PRESETS.HIGH_QUALITY);

    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1_000_000);
    const filename = `listings/${timestamp}-${randomId}.webp`;

    const { data, error } = await supabase.storage
      .from("Matchdays")
      .upload(filename, compressedFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/webp",
      });

    if (error) {
      logger.error(`Upload failed for "${file.name}"`, "Supabase", error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from("Matchdays")
      .getPublicUrl(data.path);

    uploadedImages.push({
      url: urlData.publicUrl,
      isMain: file === mainImageFile,
      originalName: file.name,
      filename,
    });

    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalFiles) * 100));
    }
  }

  logger.info(`Upload complete: ${uploadedImages.length}/${totalFiles} file(s)`, "Supabase");
  return uploadedImages;
};

/**
 * Delete images from Supabase Storage.
 */
export const deleteListingImages = async (
  imageUrls: string[],
): Promise<{ success: boolean }> => {
  const filenames = imageUrls.map((url) => {
    const parts = url.split("/");
    return parts.slice(-2).join("/");
  });

  const { error } = await supabase.storage.from("Matchdays").remove(filenames);

  if (error) {
    logger.error("Delete failed", "Supabase", error);
    throw new Error(`Delete failed: ${error.message}`);
  }

  return { success: true };
};

export const uploadPhoto = async (
  file: string, // base64 string
  fileName: string,
  mimeType: string = "image/jpeg",
): Promise<string | null> => {
  try {
    const base64Data = file.startsWith("data:") ? file.split(",")[1] : file;

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const path = `listings/${Date.now()}_${fileName}`;
    const { data, error } = await supabase.storage
      .from("Matchdays")
      .upload(path, blob, { contentType: mimeType, upsert: false });

    if (error) {
      logger.error("uploadPhoto failed", "Supabase", error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("Matchdays")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (err) {
    logger.error("uploadPhoto threw", "Supabase", err);
    return null;
  }
};

export const uploadPhotos = async (
  photos: Array<{ url: string; typeHint: string | null }>,
): Promise<Array<{ url: string; typeHint: string | null }>> => {
  const base64Photos = photos.filter((p) => p.url?.startsWith("data:"));
  const httpPhotos  = photos.filter((p) => p.url?.startsWith("http"));

  logger.debug(
    `uploadPhotos: ${base64Photos.length} to upload, ${httpPhotos.length} already hosted`,
    "Supabase",
  );

  if (base64Photos.length === 0) {
    return photos;
  }

  const uploaded = await Promise.all(
    base64Photos.map(async (photo, index) => {
      const mimeType = photo.url.match(/^data:([^;]+);/)?.[1] || "image/jpeg";
      const ext = mimeType.split("/")[1] || "jpg";
      const fileName = `${photo.typeHint || "photo"}_${index}.${ext}`;

      const publicUrl = await uploadPhoto(photo.url, fileName, mimeType);

      // CRITICAL: never fall back to the base64 data URL — it would balloon
      // the listing payload to MBs in the DB and slow every list response.
      // Throwing here aborts the create-listing flow with a clear error.
      if (!publicUrl) {
        throw new Error(
          `Failed to upload image ${index + 1}. Please retry — your draft is preserved.`,
        );
      }

      return { url: publicUrl, typeHint: photo.typeHint };
    }),
  );

  return [...uploaded, ...httpPhotos];
};
