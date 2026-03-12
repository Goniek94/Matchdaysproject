import type {
  Category,
  Photo,
  PhotoTypeHint,
} from "@/types/features/listing.types";
import { CATEGORIES } from "@/lib/constants/listing.constants";

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
  return required.every((reqType) => photoTypes.includes(reqType));
};

export const getMissingRequiredPhotos = (
  photos: Photo[],
  categoryId: string,
): PhotoTypeHint[] => {
  const required = getRequiredPhotosForCategory(categoryId);
  const photoTypes = photos.map((p) => p.typeHint).filter(Boolean);
  return required.filter((reqType) => !photoTypes.includes(reqType));
};

export const getPublicationStatus = (
  authenticityScore: number,
): "PUBLISHED" | "UNDER_REVIEW" | "FLAGGED" => {
  if (authenticityScore >= 90) return "PUBLISHED";
  if (authenticityScore >= 70) return "UNDER_REVIEW";
  return "FLAGGED";
};

export const isStepValid = (step: number, data: any): boolean => {
  switch (step) {
    case 1:
      return !!data.category;
    case 2:
      return !!data.completionMode;
    case 3:
      return data.photos.length >= 5;
    case 4:
      return !!data.title && !!data.description;
    case 5:
      return !!data.listingType && (!!data.price || !!data.startPrice);
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
