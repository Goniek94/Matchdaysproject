"use client";

/**
 * EditSectionPricing
 * Buy Now price and shipping details
 */

import { Truck } from "lucide-react";
import type { EditFormState, EditFormErrors } from "./useEditForm";
import type { MyListing } from "@/types/features/listings.types";

interface EditSectionPricingProps {
  listing: MyListing;
  form: EditFormState;
  errors: EditFormErrors;
  setField: <K extends keyof EditFormState>(
    key: K,
    value: EditFormState[K],
  ) => void;
}

export default function EditSectionPricing({
  listing,
  form,
  errors,
  setField,
}: EditSectionPricingProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
        Pricing & Shipping
      </h3>

      {/* Starting bid (read-only) */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
        <span className="text-xs font-bold text-gray-500 uppercase">
          Starting Bid
        </span>
        <span className="text-sm font-black text-gray-900">
          £{Number(listing.startingBid).toFixed(2)}
        </span>
      </div>

      {/* Buy Now Price */}
      {listing.listingType !== "auction" && (
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Buy Now Price (£)
          </label>
          <input
            type="number"
            value={form.buyNowPrice}
            onChange={(e) => setField("buyNowPrice", e.target.value)}
            min={0}
            step={0.01}
            placeholder="0.00"
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-black/10 ${
              errors.buyNowPrice
                ? "border-red-400 bg-red-50"
                : "border-gray-200 focus:border-gray-400"
            }`}
          />
          {errors.buyNowPrice && (
            <p className="text-xs text-red-500 mt-1">{errors.buyNowPrice}</p>
          )}
        </div>
      )}

      {/* Shipping */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
            Shipping
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Cost (£)</label>
            <input
              type="number"
              value={form.shippingCost}
              onChange={(e) => setField("shippingCost", e.target.value)}
              min={0}
              step={0.01}
              placeholder="0.00"
              className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all ${
                errors.shippingCost ? "border-red-400" : "border-gray-200"
              }`}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Est. Time
            </label>
            <input
              type="text"
              value={form.shippingTime}
              onChange={(e) => setField("shippingTime", e.target.value)}
              placeholder="3-5 business days"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Ships From</label>
          <input
            type="text"
            value={form.shippingFrom}
            onChange={(e) => setField("shippingFrom", e.target.value)}
            placeholder="City, Country"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
