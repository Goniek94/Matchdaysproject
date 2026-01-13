"use client";

import { SmartFormData, BRANDS } from "./types";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export default function StepProductDetailsManual({ data, update }: StepProps) {
  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2">
            Product Details
          </h2>
          <p className="text-base text-gray-500 font-medium">
            Fill in the details about your item
          </p>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-bold text-gray-900 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Manchester United Home Shirt 2023/24 - Rashford #10"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-medium"
            />
            <p className="text-xs text-gray-500 mt-1">
              Make it descriptive and include key details
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-gray-900 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe the item in detail. Include any special features, history, or condition notes..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 50 characters recommended
            </p>
          </div>

          {/* Grid for smaller fields */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Brand */}
            <div>
              <label className="block font-bold text-gray-900 mb-2">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                value={data.brand}
                onChange={(e) => update("brand", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-medium"
              >
                <option value="">Select brand...</option>
                {BRANDS.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Club */}
            <div>
              <label className="block font-bold text-gray-900 mb-2">
                Club / Team <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.club}
                onChange={(e) => update("club", e.target.value)}
                placeholder="e.g. Manchester United"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-medium"
              />
            </div>

            {/* Season */}
            <div>
              <label className="block font-bold text-gray-900 mb-2">
                Season <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.season}
                onChange={(e) => update("season", e.target.value)}
                placeholder="e.g. 2023/24"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-medium"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block font-bold text-gray-900 mb-2">
                Model
              </label>
              <input
                type="text"
                value={data.model}
                onChange={(e) => update("model", e.target.value)}
                placeholder="e.g. Home, Away, Third"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-medium"
              />
            </div>

            {/* Size */}
            <div>
              <label className="block font-bold text-gray-900 mb-2">
                Size <span className="text-red-500">*</span>
              </label>
              <select
                value={data.size}
                onChange={(e) => update("size", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-medium"
              >
                <option value="">Select size...</option>
                {SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block font-bold text-gray-900 mb-2">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                value={data.condition}
                onChange={(e) => update("condition", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-medium"
              >
                <option value="">Select condition...</option>
                <option value="bnwt">Brand New With Tags (BNWT)</option>
                <option value="bnwot">Brand New Without Tags (BNWOT)</option>
                <option value="excellent">Excellent - Like New</option>
                <option value="good">Good - Minor Wear</option>
                <option value="fair">Fair - Visible Wear</option>
                <option value="poor">Poor - Heavy Wear</option>
              </select>
            </div>
          </div>

          {/* Optional fields */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              Additional Information (Optional)
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Country of Production */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Country of Production
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thailand, Turkey"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none"
                />
              </div>

              {/* Serial Code */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Serial Code / SKU
                </label>
                <input
                  type="text"
                  placeholder="e.g. DH2290-688"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> The more details you provide, the more
              attractive your listing will be to potential buyers. Be honest
              about the condition!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
