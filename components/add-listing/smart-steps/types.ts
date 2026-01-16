/**
 * @deprecated This file is deprecated. Use imports from:
 * - @/types/features/listing.types for types
 * - @/lib/constants for constants
 * - @/lib/utils for utility functions
 *
 * This file is kept for backward compatibility only.
 */

// Re-export everything from new locations
export * from "@/types/features/listing.types";
export * from "@/lib/constants/listing.constants";
export * from "@/lib/utils/listing.utils";

// Alias for backward compatibility
export { INITIAL_FORM_STATE as INITIAL_STATE } from "@/types/features/listing.types";
