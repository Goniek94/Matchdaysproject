import type {
  Category,
  Photo,
  PhotoTypeHint,
} from "@/types/features/listing.types";
import { CATEGORIES } from "@/lib/constants/listing.constants";

// Definiujemy kształt danych, których spodziewamy się w formularzu
// Partial sprawia, że wszystkie pola są opcjonalne, co pasuje do formularza krok po kroku
interface ListingFormData {
  category?: string;
  completionMode?: string;
  photos?: Photo[];
  title?: string;
  description?: string;
  listingType?: string;
  price?: number;
  startPrice?: number;
}

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find((cat) => cat.id === id);
};

export const getRequiredPhotosForCategory = (
  categoryId: string,
): PhotoTypeHint[] => {
  const category = getCategoryById(categoryId);
  return category?.verification.requiredPhotos || [];
};

export const getOptionalPhotosForCategory = (
  categoryId: string,
): PhotoTypeHint[] => {
  const category = getCategoryById(categoryId);
  return category?.verification.optionalPhotos || [];
};

export const hasRequiredPhotos = (
  photos: Photo[],
  categoryId: string,
): boolean => {
  const required = getRequiredPhotosForCategory(categoryId);
  const photoTypes = photos.map((p) => p.typeHint).filter(Boolean);
  return required.every((reqType) =>
    photoTypes.includes(reqType as PhotoTypeHint),
  );
};

export const getMissingRequiredPhotos = (
  photos: Photo[],
  categoryId: string,
): PhotoTypeHint[] => {
  const required = getRequiredPhotosForCategory(categoryId);
  const photoTypes = photos.map((p) => p.typeHint).filter(Boolean);
  return required.filter(
    (reqType) => !photoTypes.includes(reqType as PhotoTypeHint),
  );
};

export const getPublicationStatus = (
  authenticityScore: number,
): "PUBLISHED" | "UNDER_REVIEW" | "FLAGGED" => {
  if (authenticityScore >= 90) return "PUBLISHED";
  if (authenticityScore >= 70) return "UNDER_REVIEW";
  return "FLAGGED";
};

/**
 * Walidacja kroków formularza bez użycia 'any'
 * Używamy bezpiecznego rzutowania na zdefiniowany interfejs.
 */
export const isStepValid = (
  step: number,
  data: Record<string, unknown>,
): boolean => {
  // Rzutujemy dane na nasz interfejs, aby TS wiedział jakie pola mogą tam być
  const form = data as ListingFormData;

  switch (step) {
    case 1:
      return !!form.category;
    case 2:
      return !!form.completionMode;
    case 3:
      // Teraz TS wie, że photos to Photo[] i posiada właściwość .length
      return Array.isArray(form.photos) && form.photos.length >= 5;
    case 4:
      return !!form.title && !!form.description;
    case 5:
      return !!form.listingType && (!!form.price || !!form.startPrice);
    default:
      return false;
  }
};

export const formatPhotoTypeLabel = (typeHint: PhotoTypeHint): string => {
  if (!typeHint) return "Unknown";
  return typeHint
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatPrice = (
  price: number,
  currency: string = "PLN",
): string => {
  return `${price.toLocaleString()} ${currency}`;
};
