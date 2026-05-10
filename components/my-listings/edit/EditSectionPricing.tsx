"use client";

/**
 * EditSectionPricing
 * Pricing, listing type, timing and shipping fields. Honours lock rule.
 *
 * Currency: EUR — matches the rest of the marketplace.
 */

import { Truck, Clock, Tag, ShoppingCart, Gavel, Layers } from "lucide-react";
import type { EditFormState, EditFormErrors } from "./useEditForm";

interface EditSectionPricingProps {
  form: EditFormState;
  errors: EditFormErrors;
  setField: <K extends keyof EditFormState>(
    key: K,
    value: EditFormState[K],
  ) => void;
  isEditable: (key: keyof EditFormState) => boolean;
}

const inputClass = (locked: boolean, hasError = false) =>
  `w-full px-3 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-black/10 ${
    locked
      ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
      : hasError
        ? "border-red-400 bg-red-50"
        : "border-gray-200 focus:border-gray-400 bg-white"
  }`;

const LISTING_TYPES = [
  { id: "auction", label: "Auction", icon: Gavel },
  { id: "buy_now", label: "Buy Now", icon: ShoppingCart },
  { id: "auction_buy_now", label: "Both", icon: Layers },
] as const;

export default function EditSectionPricing({
  form,
  errors,
  setField,
  isEditable,
}: EditSectionPricingProps) {
  const lockedListingType = !isEditable("listingType");
  const lockedStartingBid = !isEditable("startingBid");
  const lockedBidIncrement = !isEditable("bidIncrement");
  const lockedBuyNow = !isEditable("buyNowPrice");
  const lockedStart = !isEditable("startTime");
  const lockedEnd = !isEditable("endTime");

  const showAuctionPricing =
    form.listingType === "auction" || form.listingType === "auction_buy_now";
  const showBuyNowPricing =
    form.listingType === "buy_now" || form.listingType === "auction_buy_now";

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
        Pricing & Timing
      </h3>

      {/* Listing type */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          Listing Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {LISTING_TYPES.map(({ id, label, icon: Icon }) => {
            const active = form.listingType === id;
            return (
              <button
                key={id}
                type="button"
                disabled={lockedListingType}
                onClick={() => setField("listingType", id)}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 transition-all ${
                  lockedListingType
                    ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                    : active
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                <Icon size={14} />
                <span className="text-[10px] font-black uppercase tracking-wide">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Auction pricing */}
      {showAuctionPricing && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1.5">
              <Tag size={11} className="text-gray-400" />
              Starting Bid (€)
            </label>
            <input
              type="number"
              value={form.startingBid}
              onChange={(e) => setField("startingBid", e.target.value)}
              min={1}
              step={0.01}
              disabled={lockedStartingBid}
              placeholder="0.00"
              className={inputClass(lockedStartingBid, !!errors.startingBid)}
            />
            {errors.startingBid && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.startingBid}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Bid Increment (€)
            </label>
            <input
              type="number"
              value={form.bidIncrement}
              onChange={(e) => setField("bidIncrement", e.target.value)}
              min={1}
              step={0.01}
              disabled={lockedBidIncrement}
              placeholder="5.00"
              className={inputClass(lockedBidIncrement, !!errors.bidIncrement)}
            />
            {errors.bidIncrement && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.bidIncrement}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Buy Now pricing */}
      {showBuyNowPricing && (
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1.5">
            <ShoppingCart size={11} className="text-gray-400" />
            Buy Now Price (€)
          </label>
          <input
            type="number"
            value={form.buyNowPrice}
            onChange={(e) => setField("buyNowPrice", e.target.value)}
            min={0}
            step={0.01}
            disabled={lockedBuyNow}
            placeholder="0.00"
            className={inputClass(lockedBuyNow, !!errors.buyNowPrice)}
          />
          {errors.buyNowPrice && (
            <p className="text-[11px] text-red-500 mt-1">
              {errors.buyNowPrice}
            </p>
          )}
        </div>
      )}

      {/* Timing */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1.5">
            <Clock size={11} className="text-gray-400" />
            Start Time
          </label>
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={(e) => setField("startTime", e.target.value)}
            disabled={lockedStart}
            className={inputClass(lockedStart)}
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1.5">
            <Clock size={11} className="text-gray-400" />
            End Time
          </label>
          <input
            type="datetime-local"
            value={form.endTime}
            onChange={(e) => setField("endTime", e.target.value)}
            disabled={lockedEnd}
            className={inputClass(lockedEnd, !!errors.endTime)}
          />
          {errors.endTime && (
            <p className="text-[11px] text-red-500 mt-1">{errors.endTime}</p>
          )}
        </div>
      </div>

      {/* Shipping */}
      <div className="pt-2 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
            Shipping
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Cost (€)</label>
            <input
              type="number"
              value={form.shippingCost}
              onChange={(e) => setField("shippingCost", e.target.value)}
              min={0}
              step={0.01}
              disabled={!isEditable("shippingCost")}
              placeholder="0.00"
              className={inputClass(
                !isEditable("shippingCost"),
                !!errors.shippingCost,
              )}
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
              disabled={!isEditable("shippingTime")}
              placeholder="3-5 business days"
              className={inputClass(!isEditable("shippingTime"))}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Ships From</label>
          <input
            type="text"
            value={form.shippingFrom}
            onChange={(e) => setField("shippingFrom", e.target.value)}
            disabled={!isEditable("shippingFrom")}
            placeholder="City, Country"
            className={inputClass(!isEditable("shippingFrom"))}
          />
        </div>
      </div>
    </div>
  );
}
