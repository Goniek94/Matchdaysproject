import { DollarSign, Clock, Zap, Gavel } from "lucide-react";
import { SmartFormData } from "./types";

interface StepSalesStrategyProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
}

export default function StepSalesStrategy({
  data,
  update,
}: StepSalesStrategyProps) {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
          Final Step
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Set Your Price
        </h2>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Choose how you want to sell your item. You can run an auction or set a
          fixed price.
        </p>
      </div>

      {/* Listing Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <button
          onClick={() => update("listingType", "auction")}
          className={`p-8 rounded-2xl border-2 transition-all text-left ${
            data.listingType === "auction"
              ? "border-black bg-black text-white shadow-xl"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
              data.listingType === "auction" ? "bg-white/20" : "bg-gray-100"
            }`}
          >
            <Gavel
              size={28}
              className={
                data.listingType === "auction" ? "text-white" : "text-gray-700"
              }
            />
          </div>
          <h3
            className={`text-2xl font-bold mb-2 ${
              data.listingType === "auction" ? "text-white" : "text-gray-900"
            }`}
          >
            Auction
          </h3>
          <p
            className={`text-sm ${
              data.listingType === "auction" ? "text-white/80" : "text-gray-500"
            }`}
          >
            Let buyers compete. Set a starting price and watch bids come in.
          </p>
        </button>

        <button
          onClick={() => update("listingType", "buy_now")}
          className={`p-8 rounded-2xl border-2 transition-all text-left ${
            data.listingType === "buy_now"
              ? "border-blue-500 bg-blue-500 text-white shadow-xl"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
              data.listingType === "buy_now" ? "bg-white/20" : "bg-gray-100"
            }`}
          >
            <Zap
              size={28}
              className={
                data.listingType === "buy_now" ? "text-white" : "text-gray-700"
              }
            />
          </div>
          <h3
            className={`text-2xl font-bold mb-2 ${
              data.listingType === "buy_now" ? "text-white" : "text-gray-900"
            }`}
          >
            Buy Now
          </h3>
          <p
            className={`text-sm ${
              data.listingType === "buy_now" ? "text-white/80" : "text-gray-500"
            }`}
          >
            Set a fixed price. Buyers can purchase instantly.
          </p>
        </button>
      </div>

      {/* Price Input */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-8">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
          <DollarSign size={18} />
          {data.listingType === "auction" ? "Starting Price" : "Fixed Price"}
        </label>
        <div className="relative">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-gray-400">
            $
          </span>
          <input
            type="number"
            value={data.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="0.00"
            className="w-full pl-16 pr-6 py-6 text-5xl font-black text-gray-900 bg-gray-50 rounded-xl border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all"
            min="0"
            step="0.01"
          />
        </div>
        {data.aiGenerated.estimatedValue && (
          <p className="text-sm text-gray-500 mt-4">
            <span className="font-semibold">AI Suggestion:</span>{" "}
            {data.aiGenerated.estimatedValue}
          </p>
        )}
      </div>

      {/* Duration (only for auctions) */}
      {data.listingType === "auction" && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-8">
          <label className="flex items-center gap-2 text-sm font-bold text-amber-900 mb-4 uppercase tracking-wide">
            <Clock size={18} />
            Auction Duration
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "1", label: "1 Day" },
              { value: "3", label: "3 Days" },
              { value: "7", label: "7 Days" },
              { value: "14", label: "14 Days" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => update("duration", option.value)}
                className={`py-4 px-6 rounded-xl font-bold transition-all ${
                  data.duration === option.value
                    ? "bg-amber-600 text-white shadow-lg"
                    : "bg-white text-amber-900 hover:bg-amber-100 border-2 border-amber-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <DollarSign size={18} />
          Pricing Tips
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • <strong>Auctions</strong> work best for rare or highly sought
            items
          </li>
          <li>
            • <strong>Buy Now</strong> is ideal for quick sales at fair market
            value
          </li>
          <li>• Consider the condition and rarity when setting your price</li>
          <li>• Check similar listings to gauge market demand</li>
        </ul>
      </div>
    </div>
  );
}
