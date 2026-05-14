"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { SmartFormData as BaseSmartFormData } from "../types";
import {
  Euro,
  Gavel,
  ShoppingCart,
  TrendingUp,
  Infinity as InfinityIcon,
} from "lucide-react";
import { CURRENCY } from "@/lib/constants/listing.constants";
import { cn } from "@/lib/utils";

export type SmartFormData = BaseSmartFormData;

interface StepProps {
  data: SmartFormData;
  update: (field: any, val: any) => void;
}

export default function StepPricing({ data, update }: StepProps) {
  const isAuction = data.listingType === "auction";
  const isBuyNow = data.listingType === "buy_now";

  // Sugerowana cena z AI (jeśli istnieje)
  const aiSuggestedPrice = data.aiData?.priceSuggested || data.aiData?.priceMin;

  const handleTypeChange = (type: "auction" | "buy_now") => {
    update("listingType", type);

    if (type === "buy_now") {
      update("duration", "365d"); // Kup Teraz - długi czas
    } else {
      update("duration", "7d"); // Aukcja - domyślnie 7 dni
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2">
            How do you want to sell?
          </h2>
          <p className="text-base text-gray-500 font-medium">
            Choose listing type and set the price
          </p>
        </div>

        {/* Listing Type Selection */}
        <div className="mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Listing Type</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Auction */}
            <button
              onClick={() => handleTypeChange("auction")}
              className={cn(
                "group relative p-6 rounded-2xl border-2 text-left transition-all duration-300",
                isAuction
                  ? "border-black bg-gray-50 shadow-xl scale-[1.02]"
                  : "border-gray-200 hover:border-gray-400 hover:shadow-lg",
              )}
            >
              <div
                className={cn(
                  "inline-flex p-3 rounded-xl mb-4 transition-colors",
                  isAuction
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200",
                )}
              >
                <Gavel size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Auction</h4>
              <p className="text-sm text-gray-600 mb-4">
                Buyers will bid. Great for rare or collectible items.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-600" />
                  Potentially higher final price
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-600" />
                  Max 7 days duration
                </li>
              </ul>
            </button>

            {/* Buy Now */}
            <button
              onClick={() => handleTypeChange("buy_now")}
              className={cn(
                "group relative p-6 rounded-2xl border-2 text-left transition-all duration-300",
                isBuyNow
                  ? "border-black bg-gray-50 shadow-xl scale-[1.02]"
                  : "border-gray-200 hover:border-gray-400 hover:shadow-lg",
              )}
            >
              <div
                className={cn(
                  "inline-flex p-3 rounded-xl mb-4 transition-colors",
                  isBuyNow
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200",
                )}
              >
                <ShoppingCart size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Buy Now</h4>
              <p className="text-sm text-gray-600 mb-4">
                Fixed price – instant purchase possible.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-blue-600" />
                  Instant sale
                </li>
                <li className="flex items-center gap-2">
                  <InfinityIcon size={14} className="text-blue-600" />
                  Active until sold
                </li>
              </ul>
            </button>
          </div>
        </div>

        {/* Pricing Fields */}
        {data.listingType && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {isAuction ? (
              /* AUCTION */
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-bold text-gray-900 mb-2">
                      Starting Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Euro
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="number"
                        value={data.startPrice ?? ""}
                        onChange={(e) => update("startPrice", e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-bold text-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-900 mb-2">
                      Bid Increment <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Euro
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="number"
                        value={data.bidStep ?? ""}
                        onChange={(e) => update("bidStep", e.target.value)}
                        placeholder="5.00"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-bold text-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration - tylko 24h, 48h, 7d */}
                <div>
                  <label className="block font-bold text-gray-900 mb-2">
                    Auction Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "24h", label: "24 Hours" },
                      { value: "48h", label: "48 Hours" },
                      { value: "7d", label: "7 Days" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => update("duration", option.value)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-center font-bold transition-all",
                          data.duration === option.value
                            ? "border-black bg-black text-white shadow-md scale-[1.02]"
                            : "border-gray-200 hover:border-gray-400",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {aiSuggestedPrice && (
                  <p className="text-sm text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl">
                    💡 AI suggests starting around {CURRENCY.SYMBOL}
                    {aiSuggestedPrice}
                  </p>
                )}
              </>
            ) : (
              /* BUY NOW */
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-gray-900 mb-2">
                    Fixed Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Euro
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={24}
                    />
                    <input
                      type="number"
                      value={data.price ?? ""}
                      onChange={(e) => update("price", e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-bold text-2xl"
                    />
                  </div>
                  {aiSuggestedPrice && (
                    <p className="text-sm text-emerald-600 mt-2">
                      💡 AI suggested price: {CURRENCY.SYMBOL}
                      {aiSuggestedPrice}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg font-medium">
                  <InfinityIcon size={18} />
                  This listing will remain active until the item is sold.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
