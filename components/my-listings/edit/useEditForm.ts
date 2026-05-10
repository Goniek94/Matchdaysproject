"use client";

/**
 * useEditForm Hook
 *
 * Manages form state for the edit-listing panel.
 *
 * Two edit modes (mirrors backend AuctionsService.update lock rule):
 *   - FREE  → seller can edit anything. listingType=buy_now, OR auction-type
 *             before the first bid lands.
 *   - LOCKED → only description, images and shipping fields. Active auction-type
 *             listings with bidCount > 0 — fairness for current bidders.
 *
 * The hook always tracks every editable field, but `validate()` returns only
 * the fields that actually changed AND are allowed by the current mode. This
 * keeps the network payload minimal and avoids tripping the backend's
 * forbidNonWhitelisted validation when a locked field accidentally stays in
 * state.
 */

import { useState, useMemo, useCallback } from "react";
import type {
  MyListing,
  UpdateListingPayload,
} from "@/types/features/listings.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EditMode = "free" | "locked";

export interface EditFormState {
  // Basic
  title: string;
  description: string;
  images: string[];

  // Categorisation
  category: string;
  itemType: string;
  league: string;
  team: string;
  season: string;

  // Item details
  size: string;
  sizeEU: string;
  sizeUK: string;
  condition: string;
  tagCondition: string;
  manufacturer: string;
  model: string;
  countryOfProduction: string;
  productionYear: string;
  serialCode: string;
  playerName: string;
  playerNumber: string;

  // Authenticity
  hasAutograph: boolean;
  autographDetails: string;
  isVintage: boolean;
  vintageYear: string;

  // Pricing & timing (strings so the inputs stay controlled)
  startingBid: string;
  bidIncrement: string;
  buyNowPrice: string;
  startTime: string;
  endTime: string;
  listingType: "auction" | "buy_now" | "auction_buy_now";

  // Shipping
  shippingCost: string;
  shippingTime: string;
  shippingFrom: string;
}

export interface EditFormErrors {
  title?: string;
  description?: string;
  images?: string;
  startingBid?: string;
  bidIncrement?: string;
  buyNowPrice?: string;
  endTime?: string;
  shippingCost?: string;
}

// ─── Field permission map ─────────────────────────────────────────────────────

/** Fields that remain editable after the first bid lands on an auction. */
const POST_BID_EDITABLE: ReadonlySet<keyof EditFormState> = new Set([
  "description",
  "images",
  "shippingCost",
  "shippingTime",
  "shippingFrom",
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const numStr = (n: number | null | undefined): string =>
  n === null || n === undefined ? "" : String(n);

const isoLocalForInput = (iso: string | undefined): string => {
  if (!iso) return "";
  // datetime-local needs YYYY-MM-DDTHH:mm in local timezone
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const localToIso = (local: string | undefined): string | undefined => {
  if (!local) return undefined;
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};

const initialFromListing = (listing: MyListing): EditFormState => ({
  title: listing.title,
  description: listing.description,
  images: listing.images ?? [],

  category: listing.category ?? "",
  itemType: listing.itemType ?? "",
  league: (listing as MyListing & { league?: string | null }).league ?? "",
  team: listing.team ?? "",
  season: listing.season ?? "",

  size: listing.size ?? "",
  sizeEU: (listing as MyListing & { sizeEU?: string | null }).sizeEU ?? "",
  sizeUK: (listing as MyListing & { sizeUK?: string | null }).sizeUK ?? "",
  condition: listing.condition ?? "",
  tagCondition:
    (listing as MyListing & { tagCondition?: string | null }).tagCondition ?? "",
  manufacturer: listing.manufacturer ?? "",
  model: (listing as MyListing & { model?: string | null }).model ?? "",
  countryOfProduction:
    (listing as MyListing & { countryOfProduction?: string | null })
      .countryOfProduction ?? "",
  productionYear:
    (listing as MyListing & { productionYear?: string | null })
      .productionYear ?? "",
  serialCode:
    (listing as MyListing & { serialCode?: string | null }).serialCode ?? "",
  playerName: listing.playerName ?? "",
  playerNumber: listing.playerNumber ?? "",

  hasAutograph:
    (listing as MyListing & { hasAutograph?: boolean }).hasAutograph ?? false,
  autographDetails:
    (listing as MyListing & { autographDetails?: string | null })
      .autographDetails ?? "",
  isVintage:
    (listing as MyListing & { isVintage?: boolean }).isVintage ?? false,
  vintageYear:
    (listing as MyListing & { vintageYear?: string | null }).vintageYear ?? "",

  startingBid: numStr(listing.startingBid),
  bidIncrement: numStr(listing.bidIncrement),
  buyNowPrice: numStr(listing.buyNowPrice),
  startTime: isoLocalForInput(listing.startTime),
  endTime: isoLocalForInput(listing.endTime),
  listingType: listing.listingType,

  shippingCost: numStr(listing.shippingCost ?? 0),
  shippingTime: listing.shippingTime ?? "3-5 business days",
  shippingFrom: listing.shippingFrom ?? "",
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEditForm(listing: MyListing) {
  const initial = useMemo(() => initialFromListing(listing), [listing]);
  const [form, setForm] = useState<EditFormState>(initial);
  const [errors, setErrors] = useState<EditFormErrors>({});
  const [dirty, setDirty] = useState(false);

  /** "locked" = active auction-type listing with at least one bid. */
  const mode: EditMode = useMemo(() => {
    const isAuctionType =
      listing.listingType === "auction" ||
      listing.listingType === "auction_buy_now";
    return isAuctionType && (listing.bidCount ?? 0) > 0 ? "locked" : "free";
  }, [listing.listingType, listing.bidCount]);

  const isEditable = useCallback(
    (key: keyof EditFormState): boolean => {
      if (mode === "free") return true;
      return POST_BID_EDITABLE.has(key);
    },
    [mode],
  );

  // Generic field updater
  const setField = useCallback(
    <K extends keyof EditFormState>(key: K, value: EditFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setDirty(true);
      setErrors((prev) => {
        const errKey = key as keyof EditFormErrors;
        if (prev[errKey]) {
          const next = { ...prev };
          delete next[errKey];
          return next;
        }
        return prev;
      });
    },
    [],
  );

  /** Validate and produce the diff payload (only changed AND editable fields). */
  const validate = useCallback((): UpdateListingPayload | null => {
    const newErrors: EditFormErrors = {};

    // Always required
    if (!form.title.trim()) newErrors.title = "Title is required";
    else if (form.title.trim().length < 5)
      newErrors.title = "Title must be at least 5 characters";

    if (!form.description.trim())
      newErrors.description = "Description is required";
    else if (form.description.trim().length < 20)
      newErrors.description = "Description must be at least 20 characters";

    if (form.images.length === 0)
      newErrors.images = "Add at least one photo";

    // Pricing
    if (form.startingBid && Number.isNaN(parseFloat(form.startingBid)))
      newErrors.startingBid = "Must be a valid number";
    if (form.bidIncrement && Number.isNaN(parseFloat(form.bidIncrement)))
      newErrors.bidIncrement = "Must be a valid number";
    if (form.buyNowPrice && Number.isNaN(parseFloat(form.buyNowPrice)))
      newErrors.buyNowPrice = "Must be a valid number";
    if (form.shippingCost && Number.isNaN(parseFloat(form.shippingCost)))
      newErrors.shippingCost = "Must be a valid number";

    // Cross-field: buyNow > startingBid
    const startingBidNum = parseFloat(form.startingBid || "0");
    const buyNowNum = form.buyNowPrice ? parseFloat(form.buyNowPrice) : null;
    if (buyNowNum !== null && buyNowNum > 0 && buyNowNum <= startingBidNum) {
      newErrors.buyNowPrice = "Must be greater than the starting bid";
    }

    // Timing
    const endIso = localToIso(form.endTime);
    if (form.endTime && !endIso) newErrors.endTime = "Invalid date";
    else if (endIso && new Date(endIso) <= new Date()) {
      newErrors.endTime = "End time must be in the future";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return null;
    }

    // Build a diff payload — only changed values that the server is allowed to receive
    const payload: UpdateListingPayload = {};

    const addIfChanged = <K extends keyof EditFormState>(
      key: K,
      transform: (v: EditFormState[K]) => unknown,
    ) => {
      if (!isEditable(key)) return;
      const before = transform(initial[key]);
      const after = transform(form[key]);
      if (JSON.stringify(before) !== JSON.stringify(after)) {
        // We rely on TypeScript to catch invalid keys at the call sites below.
        (payload as Record<string, unknown>)[key as string] = after;
      }
    };

    // String fields → trimmed string or omitted
    const trimmedString = (v: string) => v.trim();
    const trimmedOrUndef = (v: string) => (v.trim() ? v.trim() : undefined);
    const playerOrNull = (v: string) => (v.trim() ? v.trim() : null);
    const numOrUndef = (v: string) =>
      v.trim() === "" ? undefined : parseFloat(v);
    const numOrNull = (v: string) =>
      v.trim() === "" ? null : parseFloat(v);
    const isoOrUndef = (v: string) => localToIso(v);

    addIfChanged("title", trimmedString);
    addIfChanged("description", trimmedString);
    addIfChanged("images", (v) => v as string[]);

    addIfChanged("category", trimmedOrUndef);
    addIfChanged("itemType", trimmedOrUndef);
    addIfChanged("league", trimmedOrUndef);
    addIfChanged("team", trimmedOrUndef);
    addIfChanged("season", trimmedOrUndef);

    addIfChanged("size", trimmedOrUndef);
    addIfChanged("sizeEU", trimmedOrUndef);
    addIfChanged("sizeUK", trimmedOrUndef);
    addIfChanged("condition", trimmedOrUndef);
    addIfChanged("tagCondition", trimmedOrUndef);
    addIfChanged("manufacturer", trimmedOrUndef);
    addIfChanged("model", trimmedOrUndef);
    addIfChanged("countryOfProduction", trimmedOrUndef);
    addIfChanged("productionYear", trimmedOrUndef);
    addIfChanged("serialCode", trimmedOrUndef);
    addIfChanged("playerName", playerOrNull);
    addIfChanged("playerNumber", playerOrNull);

    addIfChanged("hasAutograph", (v) => v as boolean);
    addIfChanged("autographDetails", trimmedOrUndef);
    addIfChanged("isVintage", (v) => v as boolean);
    addIfChanged("vintageYear", trimmedOrUndef);

    addIfChanged("startingBid", numOrUndef);
    addIfChanged("bidIncrement", numOrUndef);
    addIfChanged("buyNowPrice", numOrNull);
    addIfChanged("startTime", isoOrUndef);
    addIfChanged("endTime", isoOrUndef);
    addIfChanged("listingType", (v) => v as string);

    addIfChanged("shippingCost", (v) => parseFloat(v as string) || 0);
    addIfChanged("shippingTime", trimmedString);
    addIfChanged("shippingFrom", trimmedString);

    return payload;
  }, [form, initial, isEditable]);

  /** Reset back to the initial server state (used after a successful save). */
  const reset = useCallback(
    (next?: MyListing) => {
      setForm(next ? initialFromListing(next) : initial);
      setErrors({});
      setDirty(false);
    },
    [initial],
  );

  return {
    form,
    errors,
    dirty,
    mode,
    isEditable,
    setField,
    validate,
    reset,
  };
}
