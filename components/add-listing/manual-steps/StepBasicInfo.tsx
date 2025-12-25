"use client";

import React from "react";
import { Shirt, Disc, Layers, Scissors, Footprints } from "lucide-react";

const CATEGORIES = [
  { id: "shirt", label: "Jersey", icon: Shirt },
  { id: "boots", label: "Boots", icon: Footprints },
  { id: "outerwear", label: "Jacket", icon: Layers },
  { id: "pants", label: "Shorts", icon: Scissors },
  { id: "accessory", label: "Ball/Other", icon: Disc },
];

export default function StepBasicInfo({ data, updateData }: any) {
  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black">Basic Information</h2>
        <p className="text-gray-500">What are you selling today?</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
            Listing Title
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateData("title", e.target.value)}
            placeholder="e.g. 2004 Arsenal Home Shirt Henry #14"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none font-bold"
          />
        </div>

        {/* Category Selection (Item Type) */}
        <div className="grid grid-cols-5 gap-2">
          {/* Tutaj zakładam, że w ManualForm w FormData 'brand' etc. są polami, ale jeśli chcesz kategorię, 
               warto dodać 'category' do FormData w ManualForm. Poniżej przykład dla Brand/Team */}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
              Brand
            </label>
            <select
              value={data.brand}
              onChange={(e) => updateData("brand", e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none"
            >
              <option value="">Select...</option>
              <option value="Nike">Nike</option>
              <option value="Adidas">Adidas</option>
              <option value="Puma">Puma</option>
              <option value="Umbro">Umbro</option>
              <option value="Kappa">Kappa</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
              Team / Club
            </label>
            <input
              type="text"
              value={data.team}
              onChange={(e) => updateData("team", e.target.value)}
              placeholder="e.g. AC Milan"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
              Year
            </label>
            <input
              type="number"
              value={data.year}
              onChange={(e) => updateData("year", e.target.value)}
              placeholder="2020"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
              Size
            </label>
            <input
              type="text"
              value={data.size}
              onChange={(e) => updateData("size", e.target.value)}
              placeholder="L"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
              Condition
            </label>
            <select
              value={data.condition}
              onChange={(e) => updateData("condition", e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none"
            >
              <option value="bnwt">Brand New (Tags)</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>
        </div>

        {/* Tag Status - Critical for Logic */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-2">Internal Tags Status</h3>
          <p className="text-xs text-blue-600 mb-4">
            This determines our verification process.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateData("tagStatus", "modern")}
              className={`p-3 rounded-lg text-sm font-bold border transition-all ${
                data.tagStatus === "modern"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-blue-200 text-blue-900 hover:border-blue-400"
              }`}
            >
              Modern & Readable
            </button>
            <button
              onClick={() => updateData("tagStatus", "vintage")}
              className={`p-3 rounded-lg text-sm font-bold border transition-all ${
                data.tagStatus === "vintage"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-blue-200 text-blue-900 hover:border-blue-400"
              }`}
            >
              Vintage (Pre-2010)
            </button>
            <button
              onClick={() => updateData("tagStatus", "washed")}
              className={`p-3 rounded-lg text-sm font-bold border transition-all ${
                data.tagStatus === "washed"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-blue-200 text-blue-900 hover:border-blue-400"
              }`}
            >
              Washed Out / Faded
            </button>
            <button
              onClick={() => updateData("tagStatus", "cut")}
              className={`p-3 rounded-lg text-sm font-bold border transition-all ${
                data.tagStatus === "cut"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-blue-200 text-blue-900 hover:border-blue-400"
              }`}
            >
              Cut / Missing
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => updateData("description", e.target.value)}
            className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:border-black outline-none resize-none"
            placeholder="Tell us about the history, fit, and any specific defects..."
          />
        </div>
      </div>
    </div>
  );
}
