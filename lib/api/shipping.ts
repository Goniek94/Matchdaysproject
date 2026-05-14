/**
 * Shipping estimate API client.
 *
 * Public endpoint — no auth required, so guests on auction cards also see
 * the "+ ~€X shipping" hint. Response is cheap to compute on the backend
 * (lookup in a static zone table for now, real carrier API later).
 */

import apiClient from "./client";
import type { ApiResponse } from "./config";

export interface ShippingEstimateOption {
  min: number;
  max: number;
  daysMin: number;
  daysMax: number;
  carrier: string;
}

export interface ShippingEstimate {
  currency: string;
  fromCountry: string;
  toCountry: string;
  itemCategory: string;
  domestic: boolean;
  standard: ShippingEstimateOption;
  express: ShippingEstimateOption;
  disclaimer: string;
}

export async function getShippingEstimate(params: {
  fromCountry: string;
  toCountry: string;
  itemCategory?: string;
}): Promise<ApiResponse<ShippingEstimate>> {
  const res = await apiClient.get<ApiResponse<ShippingEstimate>>(
    "/shipping/estimate",
    { params },
  );
  return res.data;
}

/** "€8" if min==max, "€8–14" otherwise. */
export function formatShippingRange(opt: ShippingEstimateOption): string {
  if (opt.min === opt.max) return `€${opt.min}`;
  return `€${opt.min}–${opt.max}`;
}

export function formatShippingDays(opt: ShippingEstimateOption): string {
  if (opt.daysMin === opt.daysMax) return `${opt.daysMin} business day${opt.daysMin === 1 ? "" : "s"}`;
  return `${opt.daysMin}–${opt.daysMax} business days`;
}
