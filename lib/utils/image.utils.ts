/**
 * Image compression, validation, and URL utilities
 * Ported from marketplace-frontend (Repotest) imageCompression.js + getImageUrl.js → TypeScript
 */

// ============================================
// TYPES
// ============================================

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
  outputFormat?: "webp" | "jpeg" | "png";
}

export interface CompressionResult {
  compressedFiles: File[];
  errors: Array<{ file: string; error: string }>;
  totalOriginalSize: number;
  totalCompressedSize: number;
}

export interface ProgressInfo {
  current: number;
  total: number;
  fileName: string;
  status: "compressing" | "completed" | "error";
  error?: string;
}

export interface UploadedImage {
  url: string;
  isMain: boolean;
  originalName: string;
  filename: string;
}

// ============================================
// COMPRESSION PRESETS (from Repotest)
// ============================================

export const COMPRESSION_PRESETS = {
  HIGH_QUALITY: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    maxSizeKB: 5120,
    outputFormat: "webp" as const,
  },
  MEDIUM_QUALITY: {
    maxWidth: 1280,
    maxHeight: 720,
    quality: 0.8,
    maxSizeKB: 3072,
    outputFormat: "webp" as const,
  },
  LOW_QUALITY: {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.75,
    maxSizeKB: 1024,
    outputFormat: "webp" as const,
  },
  MOBILE: {
    maxWidth: 1024,
    maxHeight: 768,
    quality: 0.75,
    maxSizeKB: 2048,
    outputFormat: "webp" as const,
  },
} as const;

// ============================================
// HELPERS
// ============================================

/** Calculate new dimensions preserving aspect ratio */
const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } => {
  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;
    if (width > height) {
      width = maxWidth;
      height = width / aspectRatio;
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
    } else {
      height = maxHeight;
      width = height * aspectRatio;
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
    }
  }

  return { width: Math.round(width), height: Math.round(height) };
};

/** Generate filename with new extension */
const generateFileName = (originalName: string, format: string): string => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  const extension = format === "jpeg" ? "jpg" : format;
  return `${nameWithoutExt}_compressed.${extension}`;
};

/** Format file size to human-readable string */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// ============================================
// COMPRESSION (ported 1:1 from Repotest)
// ============================================

/** Compress a single image file using Canvas API */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {},
): Promise<File> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    outputFormat = "webp",
  } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File is not an image"));
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      try {
        const { width, height } = calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight,
        );

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Image compression failed"));
              return;
            }

            const compressedFile = new File(
              [blob],
              generateFileName(file.name, outputFormat),
              { type: `image/${outputFormat}`, lastModified: Date.now() },
            );

            const ratio = (
              ((file.size - compressedFile.size) / file.size) *
              100
            ).toFixed(1);

            console.log(
              `✅ Compressed ${file.name}: ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)} (${ratio}% reduction, ${width}x${height})`,
            );

            URL.revokeObjectURL(img.src);
            resolve(compressedFile);
          },
          `image/${outputFormat}`,
          quality,
        );
      } catch (error) {
        URL.revokeObjectURL(img.src);
        reject(
          new Error(
            `Image processing error: ${error instanceof Error ? error.message : "Unknown"}`,
          ),
        );
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };

    img.src = URL.createObjectURL(file);
  });
};

/** Compress multiple image files with progress callback */
export const compressImages = async (
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (info: ProgressInfo) => void,
): Promise<CompressionResult> => {
  const compressedFiles: File[] = [];
  const errors: Array<{ file: string; error: string }> = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      onProgress?.({
        current: i + 1,
        total: files.length,
        fileName: file.name,
        status: "compressing",
      });
      const compressedFile = await compressImage(file, options);
      compressedFiles.push(compressedFile);
      onProgress?.({
        current: i + 1,
        total: files.length,
        fileName: file.name,
        status: "completed",
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      errors.push({ file: file.name, error: msg });
      onProgress?.({
        current: i + 1,
        total: files.length,
        fileName: file.name,
        status: "error",
        error: msg,
      });
    }
  }

  return {
    compressedFiles,
    errors,
    totalOriginalSize: files.reduce((sum, f) => sum + f.size, 0),
    totalCompressedSize: compressedFiles.reduce((sum, f) => sum + f.size, 0),
  };
};

// ============================================
// VALIDATION (ported from Repotest)
// ============================================

/** Validate an image file before compression/upload */
export const validateImageFile = (
  file: File,
  options: { maxSizeKB?: number; allowedTypes?: string[] } = {},
): { isValid: boolean; errors: string[] } => {
  const {
    maxSizeKB = 10240,
    allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  } = options;

  const errors: string[] = [];
  if (!allowedTypes.includes(file.type))
    errors.push(`Unsupported format: ${file.type}`);
  if (file.size > maxSizeKB * 1024)
    errors.push(
      `File too large: ${formatFileSize(file.size)} (max: ${formatFileSize(maxSizeKB * 1024)})`,
    );
  if (file.size === 0) errors.push("File is empty");

  return { isValid: errors.length === 0, errors };
};

// ============================================
// IMAGE URL HELPER (ported from Repotest getImageUrl)
// ============================================

/** Returns a proper URL for an image, handling various formats */
export const getImageUrl = (
  image: string | string[] | null | undefined,
  options: { width?: number; quality?: number } = {},
): string => {
  const { width = 800, quality = 80 } = options;
  const defaultImage = "/images/placeholder.png";

  try {
    if (!image) return defaultImage;

    if (typeof image !== "string") {
      if (Array.isArray(image) && image.length > 0)
        return getImageUrl(image[0], options);
      return defaultImage;
    }

    const clean = image.trim();
    if (!clean) return defaultImage;

    // Full URL - return as-is (with Supabase optimization if applicable)
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      if (
        clean.includes("supabase.co/storage/v1/object/public/") &&
        !clean.includes("?")
      ) {
        return `${clean}?width=${width}&quality=${quality}&format=webp`;
      }
      return clean;
    }

    // Base64 or blob - return as-is
    if (clean.startsWith("data:") || clean.startsWith("blob:")) return clean;

    return defaultImage;
  } catch {
    return defaultImage;
  }
};
