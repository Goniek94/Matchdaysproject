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
    img.onload = () => {
      const MAX_SIZE = 800;
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
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
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

export const analyzeListing = async (
  category: string,
  photos: Array<{ url: string; typeHint: string }>,
): Promise<ApiResponse<AIAnalysisResult>> => {
  const backendCategory = CATEGORY_MAP[category] || category;

  const validPhotos = photos
    .filter((p) => p.url && p.url.length > 0)
    .slice(0, 8);

  if (validPhotos.length === 0) {
    throw new Error("Brak zdjęć do analizy");
  }

  const compressedPhotos = await Promise.all(
    validPhotos.map((p) => compressImage(p.url)),
  );

  const photoDtos: PhotoDto[] = compressedPhotos.map((compressedUrl, i) => ({
    base64: stripDataUrlPrefix(compressedUrl),
    typeHint: validPhotos[i].typeHint,
    mimeType: "image/jpeg",
  }));

  const payload: AnalyzeListingDto = {
    category: backendCategory,
    photos: photoDtos,
  };

  const response = await apiClient.post<ApiResponse<AIAnalysisResult>>(
    "/ai/analyze",
    payload,
  );

  return response.data;
};
