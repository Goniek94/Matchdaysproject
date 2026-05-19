// components/ai-tools/LegitCheckResult.tsx

"use client";

import type { AIAnalysisResult } from "@/types/features/listing.types";

interface LegitCheckResultProps {
  result: AIAnalysisResult;
  onReset: () => void;
}

const scoreColor = (score: number) => {
  if (score >= 90)
    return {
      bar: "bg-green-500",
      text: "text-green-600",
      bg: "bg-green-50 border-green-200",
    };
  if (score >= 70)
    return {
      bar: "bg-yellow-400",
      text: "text-yellow-600",
      bg: "bg-yellow-50 border-yellow-200",
    };
  return {
    bar: "bg-red-500",
    text: "text-red-600",
    bg: "bg-red-50 border-red-200",
  };
};

const routeLabel = (route: AIAnalysisResult["verificationRoute"]) => {
  if (route === "auto_publish")
    return { label: "Auto Approved", color: "bg-green-100 text-green-700" };
  if (route === "manual_review")
    return { label: "Manual Review", color: "bg-yellow-100 text-yellow-700" };
  return { label: "Expert Required", color: "bg-red-100 text-red-700" };
};

export default function LegitCheckResult({
  result,
  onReset,
}: LegitCheckResultProps) {
  const colors = scoreColor(result.authenticityScore);
  const route = routeLabel(result.verificationRoute);
  const notes = result.authenticityNotes.split("\n").filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className={`border rounded-2xl p-6 ${colors.bg}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
              AI Confidence Score
            </p>
            <p className={`text-5xl font-black ${colors.text}`}>
              {result.authenticityScore}
              <span className="text-2xl font-medium">/100</span>
            </p>
            <p className={`text-sm font-semibold mt-1 ${colors.text}`}>
              {result.authenticityLabel} Confidence
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${route.color}`}
            >
              {route.label}
            </span>
            <p className="text-xs text-gray-500 mt-2">{result.title}</p>
          </div>
        </div>
        {/* Score bar */}
        <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${colors.bar}`}
            style={{ width: `${result.authenticityScore}%` }}
          />
        </div>
      </div>

      {/* Item Details */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Brand", value: result.brand },
          { label: "Team", value: result.team },
          { label: "Season", value: result.season },
          { label: "Size", value: result.size },
          { label: "Condition", value: result.condition },
          { label: "Country", value: result.countryOfProduction },
        ]
          .filter((item) => item.value)
          .map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                {item.value}
              </p>
            </div>
          ))}
      </div>

      {/* Price Estimate */}
      <div className="bg-black text-white rounded-2xl p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Market Value Estimate
        </p>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-xs text-gray-500">Min</p>
            <p className="text-lg font-bold">€{result.priceMin}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-400">Suggested</p>
            <p className="text-3xl font-black text-white">
              €{result.priceSuggested}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Max</p>
            <p className="text-lg font-bold">€{result.priceMax}</p>
          </div>
        </div>
      </div>

      {/* Authenticity Notes */}
      <div className="bg-gray-50 rounded-2xl p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Expert Notes
        </p>
        <div className="space-y-2">
          {notes.map((note, i) => (
            <p key={i} className="text-sm text-gray-700 leading-relaxed">
              {note}
            </p>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full py-3 border-2 border-black rounded-xl font-semibold text-sm hover:bg-black hover:text-white transition-all"
      >
        Check Another Item
      </button>
    </div>
  );
}
