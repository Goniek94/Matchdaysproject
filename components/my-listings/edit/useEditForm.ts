"use client";

/**
 * useEditForm Hook
 * Manages form state and validation for the edit listing panel
 */

import { useState, useCallback } from "react";
import type {
  MyListing,
  UpdateListingPayload,
} from "@/types/features/listings.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EditFormState {
  title: string;
  description: string;
  size: string;
  condition: string;
  playerName: string;
  playerNumber: string;
  buyNowPrice: string;
  shippingCost: string;
  shippingTime: string;
  shippingFrom: string;
}

export interface EditFormErrors {
  title?: string;
  description?: string;
  buyNowPrice?: string;
  shippingCost?: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEditForm(listing: MyListing) {
  const [form, setForm] = useState<EditFormState>({
    title: listing.title,
    description: listing.description,
    size: listing.size ?? "",
    condition: listing.condition ?? "",
    playerName: listing.playerName ?? "",
    playerNumber: listing.playerNumber ?? "",
    buyNowPrice: listing.buyNowPrice ? String(listing.buyNowPrice) : "",
    shippingCost: String(listing.shippingCost ?? 0),
    shippingTime: listing.shippingTime ?? "3-5 business days",
    shippingFrom: listing.shippingFrom ?? "",
  });

  const [errors, setErrors] = useState<EditFormErrors>({});
  const [dirty, setDirty] = useState(false);

  // Generic field updater
  const setField = useCallback(
    <K extends keyof EditFormState>(key: K, value: EditFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setDirty(true);
      // Clear error on change
      setErrors((prev) => {
        if (prev[key as keyof EditFormErrors]) {
          const next = { ...prev };
          delete next[key as keyof EditFormErrors];
          return next;
        }
        return prev;
      });
    },
    [],
  );

  // Validate and return payload (null if invalid)
  const validate = useCallback((): UpdateListingPayload | null => {
    const newErrors: EditFormErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (form.buyNowPrice && isNaN(parseFloat(form.buyNowPrice))) {
      newErrors.buyNowPrice = "Must be a valid number";
    }

    if (form.shippingCost && isNaN(parseFloat(form.shippingCost))) {
      newErrors.shippingCost = "Must be a valid number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return null;
    }

    const payload: UpdateListingPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      size: form.size || undefined,
      condition: form.condition || undefined,
      playerName: form.playerName.trim() || null,
      playerNumber: form.playerNumber.trim() || null,
      shippingCost: parseFloat(form.shippingCost) || 0,
      shippingTime: form.shippingTime.trim(),
      shippingFrom: form.shippingFrom.trim(),
    };

    if (form.buyNowPrice) {
      payload.buyNowPrice = parseFloat(form.buyNowPrice);
    }

    return payload;
  }, [form]);

  return { form, errors, dirty, setField, validate };
}
