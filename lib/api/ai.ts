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
  /** Seller's declared condition from the pre-analysis step (bnwt/bnwot/excellent/good/fair/damaged). */
  userDeclaredCondition?: string;
  /** Seller's free-text defects description from the pre-analysis step. */
  userDeclaredDefects?: string;
  /** Seller's item history / provenance text from the pre-analysis step. */
  userItemHistory?: string;
  /** Seller-provided measurements (e.g. "Chest 52cm · Length 70cm"). AI quotes these in the listing description. */
  userMeasurements?: string;
}

export interface UserAnalysisContext {
  userDeclaredCondition?: string;
  userDeclaredDefects?: string;
  userItemHistory?: string;
  userMeasurements?: string;
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
  userContext?: UserAnalysisContext,
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

  return {
    category: backendCategory,
    photos: photoDtos,
    userDeclaredCondition: userContext?.userDeclaredCondition?.trim() || undefined,
    userDeclaredDefects: userContext?.userDeclaredDefects?.trim() || undefined,
    userItemHistory: userContext?.userItemHistory?.trim() || undefined,
    userMeasurements: userContext?.userMeasurements?.trim() || undefined,
  };
};

/**
 * Synchronous AI analysis — request blocks until Gemini returns. Use only when
 * the user is actively watching a spinner (LegitCheck, in-wizard preview).
 *
 * `userContext` carries the seller's declarations from the pre-analysis form
 * so the backend prompt can cross-check them against photo evidence and
 * populate userConditionMatch/userConditionNote in the response.
 *
 * Timeout override: Gemini with Google Search Grounding can spend 15–25 s
 * generating + multiple search round-trips, plus we POST a large base64
 * payload. The default 30 s axios timeout was clipping legitimate requests
 * mid-flight — users saw "Analysis Failed" and assumed their session had
 * died. 120 s gives Gemini comfortable headroom even on a slow upstream.
 */
const AI_ANALYZE_TIMEOUT_MS = 120_000;

export const analyzeListing = async (
  category: string,
  photos: Array<{ url: string; typeHint: string }>,
  userContext?: UserAnalysisContext,
): Promise<ApiResponse<AIAnalysisResult>> => {
  const payload = await buildAnalyzePayload(category, photos, userContext);
  const response = await apiClient.post<ApiResponse<AIAnalysisResult>>(
    "/ai/analyze",
    payload,
    { timeout: AI_ANALYZE_TIMEOUT_MS },
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
  userContext?: UserAnalysisContext,
): Promise<ApiResponse<{ jobId: string; status: string }>> => {
  const payload = await buildAnalyzePayload(category, photos, userContext);
  // /ai/analyze-async returns 202 quickly with a jobId — Bull does the heavy
  // work in the background. Still bump the timeout: posting the base64
  // payload alone can be slow on flaky connections.
  const response = await apiClient.post<
    ApiResponse<{ jobId: string; status: string }>
  >("/ai/analyze-async", { ...payload, auctionId }, { timeout: 60_000 });
  return response.data;
};
