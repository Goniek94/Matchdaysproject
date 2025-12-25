"use client";

import React from "react";
import { DollarSign, Clock, Gavel } from "lucide-react";

export default function StepPricing({ data, updateData }: any) {
  return (
    <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-8 pb-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black">Set Your Price</h2>
        <p className="text-gray-500">Choose how you want to sell.</p>
      </div>

      <div className="bg-black text-white p-8 rounded-3xl shadow-2xl">
        {/* Toggle Type */}
        <div className="flex gap-2 mb-8 p-1 bg-gray-800 rounded-xl">
          <button
            onClick={() => updateData("listingType", "auction")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              data.listingType === "auction"
                ? "bg-white text-black shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Gavel size={16} /> Auction
          </button>
          <button
            onClick={() => updateData("listingType", "buy_now")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              data.listingType === "buy_now"
                ? "bg-white text-black shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <DollarSign size={16} /> Buy Now
          </button>
        </div>

        {/* Dynamic Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">
              {data.listingType === "auction"
                ? "Starting Price (€)"
                : "Total Price (€)"}
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                €
              </span>
              <input
                type="number"
                value={data.price}
                onChange={(e) => updateData("price", e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-6 py-5 bg-gray-900 border border-gray-700 rounded-2xl text-white text-3xl font-bold focus:border-white outline-none"
              />
            </div>
          </div>

          {data.listingType === "auction" && (
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">
                Duration
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["3", "5", "7"].map((days) => (
                  <button
                    key={days}
                    onClick={() => updateData("auctionDuration", days)}
                    className={`py-3 rounded-xl font-bold border ${
                      data.auctionDuration === days
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-gray-500 border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-800">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-6 h-6 rounded border flex items-center justify-center ${
                  data.acceptOffers
                    ? "bg-green-500 border-green-500"
                    : "border-gray-600 bg-transparent"
                }`}
              >
                <input
                  type="checkbox"
                  checked={data.acceptOffers}
                  onChange={(e) => updateData("acceptOffers", e.target.checked)}
                  className="hidden"
                />
                {data.acceptOffers && (
                  <span className="text-white text-xs">✓</span>
                )}
              </div>
              <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                Allow users to send offers?
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
