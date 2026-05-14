"use client";

import { useEffect, useState } from "react";
import {
  getShippingEstimate,
  type ShippingEstimate,
} from "@/lib/api/shipping";

/**
 * Lightweight hook to fetch a shipping estimate for the current viewer.
 *
 * Inputs: seller's `fromCountry` (auction.shippingFrom) and the buyer's
 * `toCountry` (resolved from the auth context if logged in; otherwise
 * fall back to the seller's country so the user still sees something
 * useful — domestic rate).
 *
 * Caches successful responses in-memory by the input tuple so jumping
 * between auctions on the same listing page doesn't refetch every time.
 */

const memoryCache = new Map<string, ShippingEstimate>();
const inflight = new Map<string, Promise<ShippingEstimate | null>>();

function cacheKey(from: string, to: string, cat?: string) {
  return `${from.toUpperCase()}|${to.toUpperCase()}|${(cat || "").toLowerCase()}`;
}

export function useShippingEstimate(params: {
  fromCountry?: string | null;
  toCountry?: string | null;
  itemCategory?: string | null;
  enabled?: boolean;
}) {
  const enabled = params.enabled !== false;
  const from = params.fromCountry?.trim().toUpperCase();
  const to = params.toCountry?.trim().toUpperCase() || from;
  const cat = params.itemCategory?.trim().toLowerCase() || undefined;

  const key = from && to ? cacheKey(from, to, cat) : null;

  const [estimate, setEstimate] = useState<ShippingEstimate | null>(
    key ? memoryCache.get(key) ?? null : null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !key || !from || !to) {
      setEstimate(null);
      return;
    }
    const cached = memoryCache.get(key);
    if (cached) {
      setEstimate(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);

    // Dedupe concurrent requests with the same key.
    const existing = inflight.get(key);
    const promise =
      existing ??
      (async () => {
        try {
          const res = await getShippingEstimate({
            fromCountry: from,
            toCountry: to,
            itemCategory: cat,
          });
          if (res.success && res.data) {
            memoryCache.set(key, res.data);
            return res.data;
          }
          return null;
        } catch {
          return null;
        }
      })();

    inflight.set(key, promise);
    promise.finally(() => inflight.delete(key));

    promise.then((data) => {
      if (cancelled) return;
      setEstimate(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, key, from, to, cat]);

  return { estimate, loading };
}
