"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  ShirtIcon,
  Sparkles,
  ArrowLeft,
  Shirt,
  Info,
} from "lucide-react";
import { SmartFormData } from "../types";
import { analyzeListing, AIAnalysisResult } from "@/lib/api/ai";
import type { AIDefect } from "@/types/features/listing.types";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

function normalizeCondition(raw: string): string {
  if (!raw) return "good";
  const lower = raw.toLowerCase();
  if (lower.includes("brand new with tags") || lower.startsWith("bnwt"))
    return "bnwt";
  if (lower.includes("brand new without tags") || lower.startsWith("bnwot"))
    return "bnwot";
  if (lower.includes("excellent") || lower.includes("like new"))
    return "excellent";
  if (lower.includes("good")) return "good";
  if (lower.includes("fair") || lower.includes("visible wear")) return "fair";
  // Accept legacy "poor" from older AI runs, map to "damaged"
  if (
    lower.includes("damaged") ||
    lower.includes("poor") ||
    lower.includes("heavy wear")
  )
    return "damaged";
  const firstWord = raw.split(/[\s\-.,]/)[0].toLowerCase();
  if (firstWord === "poor") return "damaged";
  return ["bnwt", "bnwot", "excellent", "good", "fair", "damaged"].includes(
    firstWord,
  )
    ? firstWord
    : "good";
}

// Split authenticityNotes into green and red flags based on content.
// Defensive against Gemini returning notes as string | string[] | object[] | null.
function parseFlags(notes: unknown): { green: string[]; red: string[] } {
  const RED_KEYWORDS = [
    "not found",
    "missing",
    "no serial",
    "no tag",
    "inconsistent",
    "concern",
    "warning",
    "suspect",
    "fake",
    "counterfeit",
    "unverified",
    "failed",
    "❌",
    "⚠️",
  ];

  // Coerce input into a flat array of strings, regardless of shape.
  let rawLines: string[] = [];
  if (Array.isArray(notes)) {
    rawLines = notes
      .map((n) => (typeof n === "string" ? n : JSON.stringify(n)))
      .flatMap((s) => s.split(/\n/));
  } else if (typeof notes === "string") {
    rawLines = notes.split(/\n/);
  } else if (notes == null) {
    return { green: [], red: [] };
  } else {
    // Object or other — stringify as a fallback
    rawLines = JSON.stringify(notes).split(/\n/);
  }

  const lines = rawLines
    .map((l) => l.replace(/^\*+\s*|\d+\.\s*/, "").trim())
    .filter((l) => l.length > 5);

  const green: string[] = [];
  const red: string[] = [];

  for (const line of lines) {
    if (line.includes("✅")) {
      green.push(line);
      continue;
    }
    if (line.includes("❌") || line.includes("⚠️")) {
      red.push(line);
      continue;
    }
    const lower = line.toLowerCase();
    const isRed = RED_KEYWORDS.some((kw) => lower.includes(kw));
    if (isRed) red.push(line);
    else green.push(line);
  }

  return { green, red };
}

// ─── Severity badge ───────────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  minor: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Minor" },
  moderate: { bg: "bg-orange-50", text: "text-orange-700", label: "Moderate" },
  major: { bg: "bg-red-50", text: "text-red-700", label: "Major" },
};

// ─── Condition label map ──────────────────────────────────────────────────────

const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  bnwt: { label: "Brand New With Tags", color: "text-emerald-700" },
  bnwot: { label: "Brand New Without Tags", color: "text-emerald-600" },
  excellent: { label: "Excellent", color: "text-emerald-600" },
  good: { label: "Good", color: "text-blue-600" },
  fair: { label: "Fair", color: "text-amber-600" },
  damaged: { label: "Damaged", color: "text-red-600" },
};

// ─── Condition & Defects card ─────────────────────────────────────────────────

function ConditionDefectsCard({ aiResult }: { aiResult: AIAnalysisResult }) {
  const hasConditionDetails = !!aiResult.conditionDetails;
  const defects = aiResult.defects ?? [];
  const hasDefects = defects.length > 0;

  // Don't render the card if there's nothing to show
  if (!hasConditionDetails && !hasDefects) return null;

  const conditionKey = (aiResult.condition || "").toLowerCase();
  const conditionMeta = CONDITION_LABELS[conditionKey] ?? {
    label: aiResult.condition,
    color: "text-gray-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-50">
        <Shirt size={15} className="text-gray-500" />
        <span className="text-sm font-bold text-gray-900">Item Condition</span>
        <span
          className={cn(
            "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100",
            conditionMeta.color,
          )}
        >
          {conditionMeta.label}
        </span>
      </div>

      {/* Condition details paragraph */}
      {hasConditionDetails && (
        <div className="flex items-start gap-3 px-5 py-3.5 border-b border-gray-50">
          <Info size={14} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 leading-relaxed">
            {aiResult.conditionDetails}
          </p>
        </div>
      )}

      {/* Defects list */}
      {hasDefects ? (
        <ul className="divide-y divide-gray-50">
          {defects.map((defect: AIDefect, i: number) => {
            const sev =
              SEVERITY_STYLES[defect.severity] ?? SEVERITY_STYLES.minor;
            return (
              <li key={i} className="flex items-start gap-3 px-5 py-3">
                <AlertTriangle
                  size={14}
                  className="text-amber-400 shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-bold text-gray-800 capitalize">
                      {defect.type.replace(/_/g, " ")}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                        sev.bg,
                        sev.text,
                      )}
                    >
                      {sev.label}
                    </span>
                    <span className="text-[10px] text-gray-400 italic">
                      {defect.location}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {defect.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        hasConditionDetails && (
          <div className="flex items-center gap-3 px-5 py-3">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-700 font-medium">
              No visible defects detected
            </p>
          </div>
        )
      )}
    </div>
  );
}

// ─── Findings card (positive / warning) ───────────────────────────────────────

/** Pull "[Category]" prefix off a note line and strip trailing verdict marker. */
function parseFinding(raw: string): { category: string | null; body: string } {
  let text = raw.trim();

  // Remove leading numbering like "1. ", "2) ", etc.
  text = text.replace(/^\d+[.)]\s*/, "");

  // Pull off [Category] prefix
  let category: string | null = null;
  const catMatch = text.match(/^\[([^\]]+)\]\s*[—\-:]?\s*/);
  if (catMatch) {
    category = catMatch[1].trim();
    text = text.slice(catMatch[0].length);
  }

  // Strip trailing verdict markers like "✅ Authentic indicator.", "⚠️ Minor concern.", "❌ Red flag."
  text = text
    .replace(
      /\s*[✅⚠️❌]\s*(authentic indicator|minor concern|red flag)\s*\.?\s*$/i,
      "",
    )
    .replace(/\s*[✅⚠️❌]\s*$/, "")
    .trim();

  return { category, body: text };
}

interface FindingsSectionProps {
  tone: "positive" | "warning";
  title: string;
  subtitle: string;
  items: string[];
}

function FindingsSection({ tone, title, subtitle, items }: FindingsSectionProps) {
  const isPositive = tone === "positive";

  const theme = isPositive
    ? {
        wrap: "bg-gradient-to-br from-emerald-50/60 via-white to-white border-emerald-200/70",
        iconBg: "bg-emerald-500 shadow-emerald-200",
        iconColor: "text-white",
        headerText: "text-emerald-900",
        subtitleText: "text-emerald-700/80",
        countChip: "bg-emerald-100 text-emerald-700 border-emerald-200",
        card: "bg-white border-emerald-100 hover:border-emerald-300",
        accent: "before:bg-emerald-500",
        catChip: "bg-emerald-100 text-emerald-800 border-emerald-200",
        dotColor: "text-emerald-500",
      }
    : {
        wrap: "bg-gradient-to-br from-amber-50/60 via-white to-white border-amber-200/70",
        iconBg: "bg-amber-500 shadow-amber-200",
        iconColor: "text-white",
        headerText: "text-amber-900",
        subtitleText: "text-amber-700/80",
        countChip: "bg-amber-100 text-amber-800 border-amber-200",
        card: "bg-white border-amber-100 hover:border-amber-300",
        accent: "before:bg-amber-500",
        catChip: "bg-amber-100 text-amber-800 border-amber-200",
        dotColor: "text-amber-500",
      };

  const HeaderIcon = isPositive ? CheckCircle2 : AlertTriangle;

  return (
    <div className={cn("rounded-2xl border shadow-sm p-5 space-y-3.5", theme.wrap)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
            theme.iconBg,
          )}
        >
          <HeaderIcon size={18} className={theme.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-base font-extrabold tracking-tight", theme.headerText)}>
            {title}
          </p>
          <p className={cn("text-[11px] leading-tight", theme.subtitleText)}>
            {subtitle}
          </p>
        </div>
        <span
          className={cn(
            "text-xs font-extrabold px-2.5 py-1 rounded-full border",
            theme.countChip,
          )}
        >
          {items.length}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((raw, i) => {
          const { category, body } = parseFinding(raw);
          if (!body && !category) return null;
          return (
            <div
              key={i}
              className={cn(
                "relative rounded-xl border px-4 py-3 transition-colors",
                "before:absolute before:left-0 before:top-3 before:bottom-3 before:w-1 before:rounded-full",
                theme.card,
                theme.accent,
              )}
            >
              <div className="pl-2.5 space-y-1.5">
                {category && (
                  <span
                    className={cn(
                      "inline-block text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md border",
                      theme.catChip,
                    )}
                  >
                    {category}
                  </span>
                )}
                {body && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {body}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Seller's declaration vs AI verdict ───────────────────────────────────────

function ConditionMatchCard({ aiResult }: { aiResult: AIAnalysisResult }) {
  const match = aiResult.userConditionMatch;
  if (!match || match === "match") return null;

  const note = aiResult.userConditionNote || "";
  const aiCondition = aiResult.condition || "";
  const aiLabel = CONDITION_LABELS[aiCondition.toLowerCase()]?.label || aiCondition;

  const isLower = match === "lower";
  const theme = isLower
    ? {
        bg: "bg-amber-50",
        border: "border-amber-200",
        icon: "text-amber-500",
        title: "text-amber-900",
        body: "text-amber-800",
        chip: "bg-amber-100 text-amber-700",
        headline: "AI sees more wear than you declared",
      }
    : {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        icon: "text-emerald-500",
        title: "text-emerald-900",
        body: "text-emerald-800",
        chip: "bg-emerald-100 text-emerald-700",
        headline: "AI sees the item in better condition than you declared",
      };

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-sm space-y-2.5",
        theme.bg,
        theme.border,
      )}
    >
      <div className="flex items-center gap-2.5">
        <AlertTriangle size={16} className={theme.icon} />
        <span className={cn("text-sm font-bold", theme.title)}>
          {theme.headline}
        </span>
        <span
          className={cn(
            "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full",
            theme.chip,
          )}
        >
          AI: {aiLabel}
        </span>
      </div>
      {note && (
        <p className={cn("text-sm leading-relaxed", theme.body)}>{note}</p>
      )}
      <p className="text-[11px] text-gray-500 leading-relaxed">
        The condition shown in your listing will use the AI verdict for buyer
        trust. You can override it in the next step.
      </p>
    </div>
  );
}

export default function StepAISummary({
  data,
  update,
  onNext,
  onBack,
}: StepProps) {
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

      // Gather seller's pre-analysis declarations so AI can cross-check them.
      const userDefectsText = (data.verification?.defects || [])
        .map((d) => d.description)
        .filter(Boolean)
        .join("; ");

      const result = await analyzeListing(data.category, photos, {
        userDeclaredCondition: data.condition || undefined,
        userDeclaredDefects: data.verification?.hasDefects
          ? userDefectsText || undefined
          : undefined,
        userItemHistory: data.itemHistory || undefined,
        userMeasurements: data.measurements || undefined,
      });

      if (result.success && result.data) {
        const ai = result.data;
        setAiResult(ai);
        update("aiData", ai);
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
        update("colorway", ai.colorway || "");
        update("studType", ai.studType || "");
        if (ai.fiaCertification) update("serialCode", ai.fiaCertification);
      } else {
        setError("AI analysis failed. Please try again.");
      }
    } catch (err: any) {
      const raw =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Could not connect to AI service.";
      const message = Array.isArray(raw)
        ? raw.join(" • ")
        : typeof raw === "string"
          ? raw
          : JSON.stringify(raw);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[420px] p-12 gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Loader2 className="w-9 h-9 text-black animate-spin" />
            </div>
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </span>
          </div>
          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Analyzing your photos
            </h2>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Checking authenticity, identifying item details and estimating
              market value...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border border-red-100 shadow-sm flex flex-col items-center justify-center min-h-[360px] p-12 gap-5">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-extrabold text-gray-900">
              Analysis Failed
            </h2>
            <p className="text-sm text-red-500 max-w-sm">{error}</p>
          </div>
          <button
            onClick={runAnalysis}
            className="px-8 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!aiResult) return null;

  // ── Multiple items detected ──────────────────────────────────────────────
  if (aiResult.multipleItemsDetected) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border-2 border-red-200 shadow-sm flex flex-col items-center justify-center min-h-[360px] p-12 gap-5 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <ShirtIcon className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-gray-900">
              Multiple items detected
            </h2>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Your photos appear to show more than one item. Each listing must
              contain photos of a single item only.
            </p>
          </div>
          {aiResult.multipleItemsReason && (
            <p className="text-xs text-red-500 bg-red-50 px-4 py-2.5 rounded-xl max-w-sm">
              {aiResult.multipleItemsReason}
            </p>
          )}
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all"
          >
            <ArrowLeft size={15} />
            Go back and fix photos
          </button>
        </div>
      </div>
    );
  }

  const score = aiResult.authenticityScore;
  const isHigh = score >= 80;
  const isMid = score >= 60 && score < 80;

  const scoreLabel = isHigh
    ? "Looks authentic"
    : isMid
      ? "Needs review"
      : "Potential issues";

  const scoreTheme = {
    bg: isHigh ? "bg-emerald-50" : isMid ? "bg-amber-50" : "bg-red-50",
    border: isHigh
      ? "border-emerald-200"
      : isMid
        ? "border-amber-200"
        : "border-red-200",
    text: isHigh
      ? "text-emerald-600"
      : isMid
        ? "text-amber-600"
        : "text-red-600",
    bar: isHigh ? "bg-emerald-500" : isMid ? "bg-amber-500" : "bg-red-500",
    badge: isHigh
      ? "bg-emerald-100 text-emerald-700"
      : isMid
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700",
  };

  const { green, red } = parseFlags(aiResult.authenticityNotes);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Score card ─────────────────────────────────────────────────── */}
      <div
        className={cn(
          "rounded-3xl border-2 p-6 shadow-sm",
          scoreTheme.bg,
          scoreTheme.border,
        )}
      >
        {/* Top row: label + emoji */}
        <div className="flex items-start justify-between mb-5">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              AI Authenticity
            </p>
            <p className={cn("text-base font-bold", scoreTheme.text)}>
              {scoreLabel}
            </p>
          </div>
          <span
            className={cn(
              "text-[11px] font-bold px-3 py-1 rounded-full",
              scoreTheme.badge,
            )}
          >
            {score}%
          </span>
        </div>

        {/* Big score number */}
        <div className="mb-4">
          <span
            className={cn(
              "text-7xl font-black tracking-tighter leading-none",
              scoreTheme.text,
            )}
          >
            {score}
          </span>
          <span className="text-2xl font-bold text-gray-300 ml-1">/100</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              scoreTheme.bar,
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* ── Seller vs AI condition discrepancy ──────────────────────────── */}
      <ConditionMatchCard aiResult={aiResult} />

      {/* ── Green flags ────────────────────────────────────────────────── */}
      {green.length > 0 && (
        <FindingsSection
          tone="positive"
          title="Positive findings"
          subtitle="Indicators of authenticity verified from the photos"
          items={green}
        />
      )}

      {/* ── Red flags ──────────────────────────────────────────────────── */}
      {red.length > 0 ? (
        <FindingsSection
          tone="warning"
          title="Points to verify"
          subtitle="Areas the AI couldn't fully confirm — review before publishing"
          items={red}
        />
      ) : (
        <div className="flex items-center gap-3.5 px-5 py-4 bg-gradient-to-r from-emerald-50 via-emerald-50 to-white rounded-2xl border border-emerald-200 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-200">
            <CheckCircle2 size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-900">
              No red flags detected
            </p>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Every checked area passed authentication.
            </p>
          </div>
        </div>
      )}

      {/* ── Condition & Defects ────────────────────────────────────────── */}
      <ConditionDefectsCard aiResult={aiResult} />

      {/* ── Price estimate ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-50">
          <TrendingUp size={15} className="text-gray-500" />
          <span className="text-sm font-bold text-gray-900">
            Market price estimate
          </span>
          {aiResult.priceConfidence && (
            <span
              className={cn(
                "ml-auto inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border",
                aiResult.priceConfidence === "high"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : aiResult.priceConfidence === "medium"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-red-50 text-red-700 border-red-200",
              )}
              title={
                aiResult.priceConfidence === "high"
                  ? "5+ comparable sales found"
                  : aiResult.priceConfidence === "medium"
                    ? "2–4 comparable sales found"
                    : "Limited market data for this item"
              }
            >
              {aiResult.priceConfidence === "high"
                ? "High confidence"
                : aiResult.priceConfidence === "medium"
                  ? "Medium confidence"
                  : "Low confidence"}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {/* Min */}
          <div className="text-center px-4 py-5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Min
            </p>
            <p className="text-xl font-black text-gray-400">
              €{aiResult.priceMin}
            </p>
          </div>
          {/* Suggested — highlighted */}
          <div className="text-center px-4 py-5 bg-black">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Suggested
            </p>
            <p className="text-3xl font-black text-white">
              €{aiResult.priceSuggested}
            </p>
          </div>
          {/* Max */}
          <div className="text-center px-4 py-5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Max
            </p>
            <p className="text-xl font-black text-gray-400">
              €{aiResult.priceMax}
            </p>
          </div>
        </div>

        {/* What AI used as price reference */}
        {aiResult.priceSources && aiResult.priceSources.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-2.5">
              Based on market data
            </p>
            <ul className="space-y-1.5">
              {aiResult.priceSources.map((src, i) => (
                <li
                  key={i}
                  className="text-xs text-gray-700 leading-relaxed pl-4 relative"
                >
                  <span className="absolute left-0 top-1.5 w-1 h-1 rounded-full bg-gray-400" />
                  {src}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Verifiable web links Gemini consulted */}
        {aiResult.groundingCitations &&
          aiResult.groundingCitations.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-100">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-2.5">
                Sources consulted ({aiResult.groundingCitations.length})
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {aiResult.groundingCitations.slice(0, 8).map((c, i) =>
                  c.uri ? (
                    <li key={i}>
                      <a
                        href={c.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-600 hover:text-black bg-white border border-gray-200 px-2 py-1 rounded-full transition-colors hover:border-gray-400"
                        title={c.title ?? c.uri}
                      >
                        <span className="max-w-[180px] truncate">
                          {c.title ??
                            (() => {
                              try {
                                return new URL(c.uri).hostname;
                              } catch {
                                return c.uri;
                              }
                            })()}
                        </span>
                      </a>
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
          )}
      </div>

      {/* ── Continue button ─────────────────────────────────────────────── */}
      {onNext && (
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2.5 py-4 bg-black text-white font-bold text-sm rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg shadow-black/10"
        >
          Continue — Review & Edit Details
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
