"use client";

import { SmartFormData } from "./types";
import { Edit2, CheckCircle } from "lucide-react";
import { useState } from "react";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
}

export default function StepAISummary({ data, update }: StepProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Mock AI data - w rzeczywistości to będzie z data.aiData
  const aiGenerated = {
    title: data.title || "Manchester United Home Shirt 2023/24 - Rashford #10",
    description:
      data.description ||
      "Official Manchester United home shirt from the 2023/24 season. Features the iconic red color with Adidas branding and TeamViewer sponsor. Player name 'RASHFORD' and number '10' on the back. Excellent condition with minimal wear.",
    brand: data.brand || "adidas",
    club: data.club || "Manchester United",
    season: data.season || "2023/24",
    model: data.model || "Home",
    size: data.size || "L",
    condition: data.condition || "excellent",
    country: "Thailand",
    serialCode: "HT3660-624",
    estimatedPrice: { min: 80, max: 120, suggested: 95 },
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
              <CheckCircle className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
                AI Analysis Complete
              </h2>
              <p className="text-base text-gray-500 font-medium">
                Review and edit the generated details
              </p>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-6 mb-8">
          {/* Title */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg text-gray-900">
                Generated Title
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Edit2 size={14} />
                Edit
              </button>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={data.title || aiGenerated.title}
                onChange={(e) => update("title", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-600 focus:outline-none font-medium"
              />
            ) : (
              <p className="text-xl font-bold text-gray-900">
                {aiGenerated.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg text-gray-900">
                Generated Description
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Edit2 size={14} />
                Edit
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={data.description || aiGenerated.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-black focus:outline-none resize-none"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {aiGenerated.description}
              </p>
            )}
          </div>
        </div>

        {/* Product Details Table */}
        <div className="mb-8">
          <h3 className="font-bold text-xl text-gray-900 mb-4">
            Product Details
          </h3>
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                {[
                  { label: "Brand", value: aiGenerated.brand, key: "brand" },
                  {
                    label: "Club / Team",
                    value: aiGenerated.club,
                    key: "club",
                  },
                  { label: "Season", value: aiGenerated.season, key: "season" },
                  { label: "Model", value: aiGenerated.model, key: "model" },
                  { label: "Size", value: aiGenerated.size, key: "size" },
                  {
                    label: "Condition",
                    value: aiGenerated.condition,
                    key: "condition",
                  },
                  {
                    label: "Country of Production",
                    value: aiGenerated.country,
                    key: "country",
                  },
                  {
                    label: "Serial Code",
                    value: aiGenerated.serialCode,
                    key: "serialCode",
                  },
                  {
                    label: "Category",
                    value: data.categorySlug || "Shirts & Jerseys",
                    key: "category",
                  },
                ].map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-700 w-1/3">
                      {row.label}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Price Estimation */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
          <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">💰</span>
            AI Price Estimation
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Minimum</p>
              <p className="text-2xl font-black text-gray-900">
                ${aiGenerated.estimatedPrice.min}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <p className="text-sm text-white/80 mb-1">Suggested</p>
              <p className="text-3xl font-black text-white">
                ${aiGenerated.estimatedPrice.suggested}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Maximum</p>
              <p className="text-2xl font-black text-gray-900">
                ${aiGenerated.estimatedPrice.max}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4 text-center">
            Based on similar items sold recently
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 Note:</strong> You can edit any of these details before
            publishing. The AI analysis is based on your photos and similar
            items in our database.
          </p>
        </div>
      </div>
    </div>
  );
}
