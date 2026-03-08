"use client";

import { SmartFormData } from "./types";
import { Edit2, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { analyzeListing, AIAnalysisResult } from "@/lib/api/ai";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
}

export default function StepAISummary({ data, update }: StepProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Collect photos from the form - data.photos contains all uploaded photos
      const photos = (data.photos || [])
        .filter((p) => p.url && p.url.length > 0)
        .map((p) => ({
          url: p.url,
          typeHint: p.typeHint || "front",
        }));

      console.log(
        "[AI] Sending photos:",
        photos.length,
        "category:",
        data.category,
      );

      const result = await analyzeListing(data.category, photos);

      if (result.success && result.data) {
        const ai = result.data;
        setAiResult(ai);

        // Wpisujemy wyniki AI do SmartFormData
        update("title", ai.title);
        update("description", ai.description);
        update("brand", ai.brand);
        update("club", ai.team);
        update("season", ai.season);
        update("model", ai.model);
        update("size", ai.size);
        update("condition", ai.condition);
      } else {
        setError("AI analysis failed. Please try again.");
      }
    } catch (err: any) {
      console.error("[AI] Error:", err);
      if (err?.response?.status === 401) {
        setError("You need to be logged in to use AI analysis.");
      } else if (err?.response?.status === 429) {
        setError("Too many requests. Please wait a moment and try again.");
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Could not connect to AI service.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOADING ---
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            AI Is Analyzing Your Photos
          </h2>
          <p className="text-gray-500 text-center max-w-sm">
            Gemini Vision is identifying brand, team, season and estimating
            value...
          </p>
        </div>
      </div>
    );
  }

  // --- ERROR ---
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-red-100 flex flex-col items-center justify-center min-h-[400px]">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Analysis Failed
          </h2>
          <p className="text-red-600 text-center max-w-sm mb-8">{error}</p>
          <button
            onClick={runAnalysis}
            className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!aiResult) return null;

  // --- WYNIK ---
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

        {/* Authenticity Score */}
        <div
          className={`p-4 rounded-2xl border-2 mb-6 ${
            aiResult.verificationRoute === "auto_publish"
              ? "bg-green-50 border-green-200 text-green-700"
              : aiResult.verificationRoute === "manual_review"
                ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold">AI Authenticity Score</span>
            <span className="text-2xl font-black">
              {aiResult.authenticityScore}%
            </span>
          </div>
          <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-current rounded-full transition-all duration-1000"
              style={{ width: `${aiResult.authenticityScore}%` }}
            />
          </div>
          <p className="text-xs font-medium">{aiResult.authenticityNotes}</p>
        </div>

        {/* Title & Description */}
        <div className="space-y-6 mb-8">
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
                {isEditing ? "Done" : "Edit"}
              </button>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={data.title || ""}
                onChange={(e) => update("title", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-600 focus:outline-none font-medium"
              />
            ) : (
              <p className="text-xl font-bold text-gray-900">{data.title}</p>
            )}
          </div>

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
                {isEditing ? "Done" : "Edit"}
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={data.description || ""}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-black focus:outline-none resize-none"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {data.description}
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
                  { label: "Brand", value: aiResult.brand },
                  { label: "Club / Team", value: aiResult.team },
                  { label: "Season", value: aiResult.season },
                  { label: "Model", value: aiResult.model },
                  { label: "Size", value: aiResult.size },
                  { label: "Condition", value: aiResult.condition },
                  {
                    label: "Country of Production",
                    value: aiResult.countryOfProduction,
                  },
                  { label: "Serial Code", value: aiResult.serialCode },
                  {
                    label: "Category",
                    value: data.categorySlug || data.category,
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
                      {row.value || "—"}
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
                €{aiResult.priceMin}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <p className="text-sm text-white/80 mb-1">Suggested</p>
              <p className="text-3xl font-black text-white">
                €{aiResult.priceSuggested}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Maximum</p>
              <p className="text-2xl font-black text-gray-900">
                €{aiResult.priceMax}
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
