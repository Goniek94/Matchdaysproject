/**
 * Listing Utilities
 * Helper functions for listing operations
 */

import type {
  Category,
  Photo,
  PhotoTypeHint,
} from "@/types/features/listing.types";
import { CATEGORIES } from "@/lib/constants/listing.constants";

// ============================================
// CATEGORY HELPERS
// ============================================

/**
 * Get category by ID
 * @param id - Category ID
 * @returns Category object or undefined
 */
export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find((cat) => cat.id === id);
};

/**
 * Get required photos for a category
 * @param categoryId - Category ID
 * @returns Array of required photo types
 */
export const getRequiredPhotosForCategory = (
  categoryId: string
): PhotoTypeHint[] => {
  const category = getCategoryById(categoryId);
  return category?.verification.requiredPhotos || [];
};

/**
 * Get optional photos for a category
 * @param categoryId - Category ID
 * @returns Array of optional photo types
 */
export const getOptionalPhotosForCategory = (
  categoryId: string
): PhotoTypeHint[] => {
  const category = getCategoryById(categoryId);
  return category?.verification.optionalPhotos || [];
};

// ============================================
// PHOTO VALIDATION
// ============================================

/**
 * Check if all required photos are present
 * @param photos - Array of uploaded photos
 * @param categoryId - Category ID
 * @returns True if all required photos are present
 */
export const hasRequiredPhotos = (
  photos: Photo[],
  categoryId: string
): boolean => {
  const required = getRequiredPhotosForCategory(categoryId);
  const photoTypes = photos.map((p) => p.typeHint).filter(Boolean);

  return required.every((reqType) => photoTypes.includes(reqType));
};

/**
 * Get missing required photos
 * @param photos - Array of uploaded photos
 * @param categoryId - Category ID
 * @returns Array of missing photo types
 */
export const getMissingRequiredPhotos = (
  photos: Photo[],
  categoryId: string
): PhotoTypeHint[] => {
  const required = getRequiredPhotosForCategory(categoryId);
  const photoTypes = photos.map((p) => p.typeHint).filter(Boolean);

  return required.filter((reqType) => !photoTypes.includes(reqType));
};

// ============================================
// PUBLICATION STATUS
// ============================================

/**
 * Determine publication status based on authenticity score
 * @param authenticityScore - Score from 0-100
 * @returns Publication status
 */
export const getPublicationStatus = (
  authenticityScore: number
): "PUBLISHED" | "UNDER_REVIEW" | "FLAGGED" => {
  if (authenticityScore >= 90) return "PUBLISHED";
  if (authenticityScore >= 70) return "UNDER_REVIEW";
  return "FLAGGED";
};

// ============================================
// FORM VALIDATION
// ============================================

/**
 * Validate form step completion
 * @param step - Current step number
 * @param data - Form data
 * @returns True if step is valid
 */
export const isStepValid = (step: number, data: any): boolean => {
  switch (step) {
    case 1: // Category
      return !!data.category;
    case 2: // Completion Mode
      return !!data.completionMode;
    case 3: // Photos
      return data.photos.length >= 5;
    case 4: // Details
      return !!data.title && !!data.description;
    case 5: // Pricing
      return !!data.listingType && (!!data.price || !!data.startPrice);
    default:
      return false;
  }
};

// ============================================
// FORMATTING
// ============================================

/**
 * Format photo type hint to readable label
 * @param typeHint - Photo type hint
 * @returns Formatted label
 */
export const formatPhotoTypeLabel = (typeHint: PhotoTypeHint): string => {
  if (!typeHint) return "Unknown";

  return typeHint
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Format price with currency
 * @param price - Price value
 * @param currency - Currency code (default: PLN)
 * @returns Formatted price string
 */
export const formatPrice = (
  price: number,
  currency: string = "PLN"
): string => {
  return `${price.toLocaleString()} ${currency}`;
};
