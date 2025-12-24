"use client";

import { Gavel, Tag, Coins, CalendarClock, Percent } from "lucide-react";
import { motion } from "framer-motion";

interface StepPricingProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

export default function StepPricing({ data, updateData }: StepPricingProps) {
  const calculateEarnings = (price: string) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return 0;
    const fee = numPrice * 0.08;
    return (numPrice - fee).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black">Pricing Strategy</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div
          onClick={() => updateData("listingType", "auction")}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
            data.listingType === "auction"
              ? "border-black bg-gray-900 text-white"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex justify-between mb-4">
            <Gavel
              size={24}
              className={
                data.listingType === "auction"
                  ? "text-yellow-400"
                  : "text-gray-400"
              }
            />{" "}
            {data.listingType === "auction" && (
              <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded">
                SELECTED
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg">Auction</h3>
        </div>
        <div
          onClick={() => updateData("listingType", "buy_now")}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
            data.listingType === "buy_now"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex justify-between mb-4">
            <Tag
              size={24}
              className={
                data.listingType === "buy_now" ? "text-white" : "text-gray-400"
              }
            />{" "}
            {data.listingType === "buy_now" && (
              <span className="text-xs bg-white text-blue-600 px-2 py-1 rounded">
                SELECTED
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg">Buy Now</h3>
        </div>
      </div>

      <motion.div
        key={data.listingType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
      >
        {data.listingType === "auction" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 mb-2">
                <Coins size={14} /> Starting Price (€)
              </label>
              <input
                type="number"
                value={data.price}
                onChange={(e) => updateData("price", e.target.value)}
                className="w-full p-4 text-2xl font-black bg-gray-50 rounded-xl"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 mb-2">
                <CalendarClock size={14} /> Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["3", "5", "7", "10"].map((day) => (
                  <button
                    key={day}
                    onClick={() => updateData("auctionDuration", day)}
                    className={`py-2 rounded-lg font-bold border ${
                      data.auctionDuration === day
                        ? "bg-black text-white border-black"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {day}d
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 mb-2">
              <Tag size={14} /> Buy Now Price (€)
            </label>
            <input
              type="number"
              value={data.price}
              onChange={(e) => updateData("price", e.target.value)}
              className="w-full p-4 text-4xl font-black bg-gray-50 rounded-xl mb-6"
              placeholder="0.00"
            />

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600">
                  <Percent size={16} />
                </div>
                <span className="font-bold text-sm">Allow Negotiations</span>
              </div>
              <button
                onClick={() => updateData("acceptOffers", !data.acceptOffers)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  data.acceptOffers ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    data.acceptOffers ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {data.price && (
          <div className="mt-8 pt-6 border-t flex justify-between items-center">
            <span className="text-sm text-gray-500">Estimated Fee (8%)</span>
            <div className="text-right">
              <span className="text-xs text-gray-400 block">Net Earnings</span>
              <span className="text-2xl font-black text-green-600">
                €{calculateEarnings(data.price)}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
