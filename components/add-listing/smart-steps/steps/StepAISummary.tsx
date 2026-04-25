"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, Loader2, AlertCircle, ChevronRight, TrendingUp } from "lucide-react";
import { SmartFormData } from "../types";
import { analyzeListing, AIAnalysisResult } from "@/lib/api/ai";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext?: () => void;
}

function normalizeCondition(raw: string): string {
  if (!raw) return "good";
  const lower = raw.toLowerCase();
  if (lower.includes("brand new with tags") || lower.startsWith("bnwt")) return "bnwt";
  if (lower.includes("brand new without tags") || lower.startsWith("bnwot")) return "bnwot";
  if (lower.includes("excellent") || lower.includes("like new")) return "excellent";
  if (lower.includes("good")) return "good";
  if (lower.includes("fair") || lower.includes("visible wear")) return "fair";
  if (lower.includes("poor") || lower.includes("heavy wear")) return "poor";
  const firstWord = raw.split(/[\s\-.,]/)[0].toLowerCase();
  return ["bnwt", "bnwot", "excellent", "good", "fair", "poor"].includes(firstWord)
    ? firstWord
    : "good";
}

// Split authenticityNotes into green and red flags based on content
function parseFlags(notes: string): { green: string[]; red: string[] } {
  const RED_KEYWORDS = [
    "not found", "missing", "unclear", "could not", "unable", "no serial",
    "no tag", "inconsistent", "concern", "warning", "suspect", "replica",
    "possible", "potential", "fake", "unverified", "cannot", "failed",
  ];

  const lines = notes
    .split(/\n/)
    .map((l) => l.replace(/^\*+\s*|\d+\.\s*/, "").trim())
    .filter((l) => l.length > 5);

  const green: string[] = [];
  const red: string[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    const isRed = RED_KEYWORDS.some((kw) => lower.includes(kw));
    if (isRed) red.push(line);
    else green.push(line);
  }

  return { green, red };
}

export default function StepAISummary({ data, update, onNext }: StepProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  useEffect(() => {
    if (data.aiData) {
      setAiResult(data.aiData);
      setIsLoading(false);
      return;
    }
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const photos = (data.photos || [])
        .filter((p) => p.url && p.url.length > 0)
        .map((p) => ({ url: p.url, typeHint: p.typeHint || "front" }));

      const result = await analyzeListing(data.category, photos);

      if (result.success && result.data) {
        const ai = result.data;
        setAiResult(ai);
        update("aiData", ai);
        // Pre-fill form fields for the edit step
        update("title", ai.title);
        update("description", ai.description);
        update("sport", ai.sport || "");
        update("itemCategory", ai.itemCategory || "");
        update("league", ai.league || "");
        update("brand", ai.brand);
        update("club", ai.team);
        update("season", ai.season);
        update("model", ai.model);
        update("size", ai.size);
        update("productionYear", ai.productionYear || "");
        update("condition", normalizeCondition(ai.condition));
        update("countryOfProduction", ai.countryOfProduction || "");
        update("serialCode", ai.serialCode || "");
        update("playerName", ai.playerName || "");
        update("playerNumber", ai.playerNumber || "");
      } else {
        setError("AI analysis failed. Please try again.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Could not connect to AI service.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center justify-center min-h-[400px] p-12">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-full border-4 border-gray-100 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-black animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">Analyzing your photos</h2>
          <p className="text-gray-400 text-center text-sm max-w-xs leading-relaxed">
            Checking authenticity, identifying item details and estimating market value...
          </p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-red-100 flex flex-col items-center justify-center min-h-[360px] p-12">
          <AlertCircle className="w-14 h-14 text-red-500 mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Analysis Failed</h2>
          <p className="text-red-600 text-center text-sm max-w-sm mb-8">{error}</p>
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

  const score = aiResult.authenticityScore;
  const scoreColor = score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";
  const barColor = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500";
  const borderColor = score >= 80 ? "border-green-200 bg-green-50" : score >= 60 ? "border-yellow-200 bg-yellow-50" : "border-red-200 bg-red-50";
  const { green, red } = parseFlags(aiResult.authenticityNotes);

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">

      {/* Score card */}
      <div className={cn("rounded-3xl border-2 p-7 shadow-sm", borderColor)}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
              Authenticity Score
            </p>
            <p className={cn("text-6xl font-black tracking-tighter leading-none", scoreColor)}>
              {score}
              <span className="text-2xl text-gray-400 font-bold">/100</span>
            </p>
          </div>
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-4xl",
            score >= 80 ? "bg-green-100" : score >= 60 ? "bg-yellow-100" : "bg-red-100",
          )}>
            {score >= 80 ? "✅" : score >= 60 ? "⚠️" : "❌"}
          </div>
        </div>
        <div className="w-full h-2.5 bg-white/60 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-1000", barColor)}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Green flags */}
      {green.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-sm font-bold text-gray-900">Positive findings</span>
            <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{green.length}</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {green.map((note, i) => (
              <li key={i} className="flex items-start gap-3 px-5 py-3">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{note}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Red flags */}
      {red.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
            <AlertTriangle size={16} className="text-orange-500" />
            <span className="text-sm font-bold text-gray-900">Points to verify</span>
            <span className="ml-auto text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{red.length}</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {red.map((note, i) => (
              <li key={i} className="flex items-start gap-3 px-5 py-3">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  !
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{note}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-green-50 rounded-2xl border border-green-100">
          <CheckCircle2 size={16} className="text-green-500 shrink-0" />
          <p className="text-sm text-green-700 font-medium">No red flags detected</p>
        </div>
      )}

      {/* Price estimation */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
          <TrendingUp size={16} className="text-gray-700" />
          <span className="text-sm font-bold text-gray-900">Market price estimate</span>
        </div>
        <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100">
          <div className="text-center px-4 py-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Minimum</p>
            <p className="text-2xl font-black text-gray-700">€{aiResult.priceMin}</p>
          </div>
          <div className="text-center px-4 py-5 bg-black">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Suggested</p>
            <p className="text-3xl font-black text-white">€{aiResult.priceSuggested}</p>
          </div>
          <div className="text-center px-4 py-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Maximum</p>
            <p className="text-2xl font-black text-gray-700">€{aiResult.priceMax}</p>
          </div>
        </div>
      </div>

      {/* Continue */}
      {onNext && (
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 py-4 bg-black text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          Continue — Review & Edit Details
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
