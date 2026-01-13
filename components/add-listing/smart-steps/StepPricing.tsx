"use client";

import { SmartFormData } from "./types";
import { DollarSign, Gavel, ShoppingCart, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
}

export default function StepPricing({ data, update }: StepProps) {
  const isAuction = data.listingType === "auction";
  const isBuyNow = data.listingType === "buy_now";

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2">
            Pricing & Listing Type
          </h2>
          <p className="text-base text-gray-500 font-medium">
            Choose how you want to sell your item
          </p>
        </div>

        {/* Listing Type Selection */}
        <div className="mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Listing Type</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Auction */}
            <button
              onClick={() => update("listingType", "auction")}
              className={cn(
                "group relative p-6 rounded-2xl border-2 text-left transition-all duration-300",
                isAuction
                  ? "border-black bg-gray-50 shadow-xl scale-[1.02]"
                  : "border-gray-200 hover:border-gray-400 hover:shadow-lg"
              )}
            >
              <div
                className={cn(
                  "inline-flex p-3 rounded-xl mb-4 transition-colors",
                  isAuction
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                )}
              >
                <Gavel size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Auction</h4>
              <p className="text-sm text-gray-600 mb-4">
                Let buyers bid on your item. Great for rare or collectible
                items.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-600" />
                  Potentially higher final price
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-600" />
                  Creates excitement and urgency
                </li>
              </ul>
              {isAuction && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>

            {/* Buy Now */}
            <button
              onClick={() => update("listingType", "buy_now")}
              className={cn(
                "group relative p-6 rounded-2xl border-2 text-left transition-all duration-300",
                isBuyNow
                  ? "border-black bg-gray-50 shadow-xl scale-[1.02]"
                  : "border-gray-200 hover:border-gray-400 hover:shadow-lg"
              )}
            >
              <div
                className={cn(
                  "inline-flex p-3 rounded-xl mb-4 transition-colors",
                  isBuyNow
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                )}
              >
                <ShoppingCart size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Buy Now</h4>
              <p className="text-sm text-gray-600 mb-4">
                Set a fixed price. Buyers can purchase immediately.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-blue-600" />
                  Instant sale possible
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-blue-600" />
                  Simple and straightforward
                </li>
              </ul>
              {isBuyNow && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Fields */}
        {data.listingType && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {isAuction ? (
              /* Auction Pricing */
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Starting Price */}
                  <div>
                    <label className="block font-bold text-gray-900 mb-2">
                      Starting Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="number"
                        value={data.startPrice}
                        onChange={(e) => update("startPrice", e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-bold text-lg"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum bid to start the auction
                    </p>
                  </div>

                  {/* Bid Step */}
                  <div>
                    <label className="block font-bold text-gray-900 mb-2">
                      Bid Step <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="number"
                        value={data.bidStep}
                        onChange={(e) => update("bidStep", e.target.value)}
                        placeholder="5.00"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-bold text-lg"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum increase per bid
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block font-bold text-gray-900 mb-2">
                    Auction Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "24h", label: "24 Hours" },
                      { value: "3d", label: "3 Days" },
                      { value: "7d", label: "7 Days" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => update("duration", option.value)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-center font-bold transition-all",
                          data.duration === option.value
                            ? "border-black bg-black text-white"
                            : "border-gray-200 hover:border-gray-400"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Buy Now Pricing */
              <div>
                <label className="block font-bold text-gray-900 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={24}
                  />
                  <input
                    type="number"
                    value={data.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-bold text-2xl"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Fixed price for immediate purchase
                </p>
              </div>
            )}

            {/* Info Box */}
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-sm text-yellow-900">
                <strong>💡 Pricing Tip:</strong>{" "}
                {isAuction
                  ? "Start with a lower price to attract more bidders. The final price often exceeds the starting price!"
                  : "Research similar items to set a competitive price. You can always adjust it later."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
