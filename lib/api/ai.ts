import apiClient from "./client";
import { ApiResponse } from "./config";
import type { AIAnalysisResult } from "@/types/features/listing.types";

export type { AIAnalysisResult } from "@/types/features/listing.types";

export interface PhotoDto {
  base64: string;
  typeHint: string;
  mimeType?: string;
}

export interface AnalyzeListingDto {
  category: string;
  photos: PhotoDto[];
}

const stripDataUrlPrefix = (dataUrl: string): string => {
  if (dataUrl.startsWith("data:")) {
    return dataUrl.split(",")[1];
  }
  return dataUrl;
};

const compressImage = (dataUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // 1200px keeps player name / number legible after JPEG compression
      const MAX_SIZE = 1200;
      let { width, height } = img;

      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(dataUrl); return; }

      ctx.drawImage(img, 0, 0, width, height);
      try {
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      } catch {
        // Cross-origin image (e.g. Supabase URL) — return original
        resolve(dataUrl);
      }
    };

    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

const CATEGORY_MAP: Record<string, string> = {
  shirts: "shirts_jerseys",
  footwear: "sports_footwear",
  pants: "pants_shorts",
  jackets: "jackets_hoodies",
  accessories: "accessories",
  equipment: "sports_equipment",
};

/** Build the payload that both sync and async endpoints accept. */
const buildAnalyzePayload = async (
  category: string,
  photos: Array<{ url: string; typeHint: string }>,
): Promise<AnalyzeListingDto> => {
  const backendCategory = CATEGORY_MAP[category] || category;

  const validPhotos = photos
    .filter((p) => p.url && p.url.length > 0)
    .slice(0, 8);

  if (validPhotos.length === 0) {
    throw new Error("No images provided for analysis");
  }

  const compressedPhotos = await Promise.all(
    validPhotos.map((p) => compressImage(p.url)),
  );

  const photoDtos: PhotoDto[] = compressedPhotos.map((compressedUrl, i) => ({
    base64: stripDataUrlPrefix(compressedUrl),
    typeHint: validPhotos[i].typeHint,
    mimeType: "image/jpeg",
  }));

  return { category: backendCategory, photos: photoDtos };
};

/**
 * Synchronous AI analysis — request blocks until Gemini returns. Use only when
 * the user is actively watching a spinner (LegitCheck, in-wizard preview).
 */
export const analyzeListing = async (
  category: string,
  photos: Array<{ url: string; typeHint: string }>,
): Promise<ApiResponse<AIAnalysisResult>> => {
  const payload = await buildAnalyzePayload(category, photos);
  const response = await apiClient.post<ApiResponse<AIAnalysisResult>>(
    "/ai/analyze",
    payload,
  );
  return response.data;
};

/**
 * Fire-and-forget AI analysis — enqueues a Bull job and returns 202 with the
 * jobId immediately. Use for post-publish background verification so the user
 * isn't stuck waiting 5–15s after pressing "Publish".
 *
 * Pass `auctionId` to have the worker write the score back to that auction
 * (auto-publish when score ≥90, otherwise mark for manual review).
 */
export const analyzeListingAsync = async (
  category: string,
  photos: Array<{ url: string; typeHint: string }>,
  auctionId?: string,
): Promise<ApiResponse<{ jobId: string; status: string }>> => {
  const payload = await buildAnalyzePayload(category, photos);
  const response = await apiClient.post<
    ApiResponse<{ jobId: string; status: string }>
  >("/ai/analyze-async", { ...payload, auctionId });
  return response.data;
};
