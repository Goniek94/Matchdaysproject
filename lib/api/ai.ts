import apiClient from "./client";
import { ApiResponse } from "./config";
import type { AIAnalysisResult } from "@/types/features/listing.types";

// Re-export for convenience
export type { AIAnalysisResult } from "@/types/features/listing.types";

// --- TYPY ---

// Single photo sent to the backend
export interface PhotoDto {
  base64: string; // photo as base64 string (without "data:image/jpeg;base64," prefix)
  typeHint: string; // e.g. "front_far", "size_tag" - tells AI what the photo shows
  mimeType?: string; // e.g. "image/jpeg" - optional
}

// Payload sent to the backend
export interface AnalyzeListingDto {
  category: string; // e.g. "shirts_jerseys"
  photos: PhotoDto[]; // array of photos
}

// --- HELPERY ---

// Zdjęcia w formularzu wyglądają tak: "data:image/jpeg;base64,/9j/4AAQ..."
// Backend chce TYLKO część po przecinku: "/9j/4AAQ..."
// Ta funkcja odcina prefix
const stripDataUrlPrefix = (dataUrl: string): string => {
  if (dataUrl.startsWith("data:")) {
    return dataUrl.split(",")[1];
  }
  return dataUrl;
};

// Wyciąga typ pliku z data URL, np. "image/jpeg"
const getMimeType = (dataUrl: string): string => {
  if (dataUrl.startsWith("data:")) {
    const match = dataUrl.match(/^data:([^;]+);/);
    return match ? match[1] : "image/jpeg";
  }
  return "image/jpeg";
};

// Compresses an image data URL to reduce payload size before sending to AI
// Resizes to max 800px and reduces JPEG quality to 0.7
const compressImage = (dataUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX_SIZE = 800;
      let { width, height } = img;

      // Scale down if larger than MAX_SIZE
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

    img.onerror = () => resolve(dataUrl); // fallback to original on error
    img.src = dataUrl;
  });
};

// Mapowanie kategorii z formularza na format backendu
// W formularzu masz "shirts", backend oczekuje "shirts_jerseys"
const CATEGORY_MAP: Record<string, string> = {
  shirts: "shirts_jerseys",
  footwear: "sports_footwear",
  pants: "pants_shorts",
  jackets: "jackets_hoodies",
  accessories: "accessories",
  equipment: "sports_equipment",
};

// --- GŁÓWNA FUNKCJA ---

export const analyzeListing = async (
  category: string,
  photos: Array<{ url: string; typeHint: string }>,
): Promise<ApiResponse<AIAnalysisResult>> => {
  // Mapujemy kategorię
  const backendCategory = CATEGORY_MAP[category] || category;

  // Filter empty photos, take max 8
  const validPhotos = photos
    .filter((p) => p.url && p.url.length > 0)
    .slice(0, 8);

  if (validPhotos.length === 0) {
    throw new Error("Brak zdjęć do analizy");
  }

  // Compress all photos in parallel before sending to reduce payload size
  const compressedPhotos = await Promise.all(
    validPhotos.map((p) => compressImage(p.url)),
  );

  const photoDtos: PhotoDto[] = compressedPhotos.map((compressedUrl, i) => ({
    base64: stripDataUrlPrefix(compressedUrl),
    typeHint: validPhotos[i].typeHint,
    mimeType: "image/jpeg", // always JPEG after canvas compression
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
