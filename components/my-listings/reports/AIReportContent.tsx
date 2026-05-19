"use client";

/**
 * AIReportContent
 *
 * Read-only renderer for an AI analysis blob (the same `aiData` shape that
 * StepAISummary produces during the listing wizard). Used both inline on the
 * "Reports" tab in My Listings and anywhere else we want to surface the
 * archived analysis (admin moderation panel, dispute review, …).
 *
 * Pure presentation — no fetching, no state, no side effects. Hand it the
 * blob, get back the styled report.
 */

import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Shirt,
  Info,
  ShieldCheck,
  Globe,
  ExternalLink,
  Search,
} from "lucide-react";
import type {
  AIAnalysisResult,
  AIDefect,
} from "@/types/features/listing.types";
import { cn } from "@/lib/utils";

// ─── Score helpers ────────────────────────────────────────────────────────────

function scoreTier(score: number) {
  const isHigh = score >= 80;
  const isMid = score >= 60 && score < 80;
  return {
    isHigh,
    isMid,
    // Wording matches the "scoring, not certification" framing used
     // across the rest of the trust surfaces. AI is a recommendation
     // signal; the actual authenticity call is made by a moderator.
    label: isHigh
      ? "High AI confidence"
      : isMid
        ? "Review recommended"
        : "Potential issues",
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
}

// ─── Notes parsing — mirrors StepAISummary's parseFlags ───────────────────────

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

function parseFlags(notes: unknown): { green: string[]; red: string[] } {
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
    if (RED_KEYWORDS.some((kw) => lower.includes(kw))) red.push(line);
    else green.push(line);
  }

  return { green, red };
}

function parseFinding(raw: string): { category: string | null; body: string } {
  let text = raw.trim().replace(/^\d+[.)]\s*/, "");
  let category: string | null = null;
  const catMatch = text.match(/^\[([^\]]+)\]\s*[—\-:]?\s*/);
  if (catMatch) {
    category = catMatch[1].trim();
    text = text.slice(catMatch[0].length);
  }
  text = text
    .replace(
      /\s*[✅⚠️❌]\s*(authentic indicator|minor concern|red flag)\s*\.?\s*$/i,
      "",
    )
    .replace(/\s*[✅⚠️❌]\s*$/, "")
    .trim();
  return { category, body: text };
}

// ─── Sub-cards ────────────────────────────────────────────────────────────────

function ConditionDefectsCard({ aiResult }: { aiResult: AIAnalysisResult }) {
  const SEVERITY_STYLES: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    minor: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Minor" },
    moderate: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      label: "Moderate",
    },
    major: { bg: "bg-red-50", text: "text-red-700", label: "Major" },
  };
  const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
    bnwt: { label: "Brand New With Tags", color: "text-emerald-700" },
    bnwot: { label: "Brand New Without Tags", color: "text-emerald-600" },
    excellent: { label: "Excellent", color: "text-emerald-600" },
    good: { label: "Good", color: "text-blue-600" },
    fair: { label: "Fair", color: "text-amber-600" },
    damaged: { label: "Damaged", color: "text-red-600" },
  };

  const defects = aiResult.defects ?? [];
  const hasDetails = !!aiResult.conditionDetails;
  if (!hasDetails && defects.length === 0) return null;

  const key = (aiResult.condition || "").toLowerCase();
  const meta = CONDITION_LABELS[key] ?? {
    label: aiResult.condition || "Unknown",
    color: "text-gray-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-50">
        <Shirt size={15} className="text-gray-500" />
        <span className="text-sm font-bold text-gray-900">Item Condition</span>
        <span
          className={cn(
            "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100",
            meta.color,
          )}
        >
          {meta.label}
        </span>
      </div>
      {hasDetails && (
        <div className="flex items-start gap-3 px-5 py-3.5 border-b border-gray-50">
          <Info size={14} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 leading-relaxed">
            {aiResult.conditionDetails}
          </p>
        </div>
      )}
      {defects.length > 0 ? (
        <ul className="divide-y divide-gray-50">
          {defects.map((d: AIDefect, i: number) => {
            const sev = SEVERITY_STYLES[d.severity] ?? SEVERITY_STYLES.minor;
            return (
              <li key={i} className="flex items-start gap-3 px-5 py-3">
                <AlertTriangle
                  size={14}
                  className="text-amber-400 shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-bold text-gray-800 capitalize">
                      {d.type.replace(/_/g, " ")}
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
                    {d.location && (
                      <span className="text-[10px] text-gray-400 italic">
                        {d.location}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {d.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        hasDetails && (
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

function FindingsSection({
  tone,
  title,
  subtitle,
  items,
}: {
  tone: "positive" | "warning";
  title: string;
  subtitle: string;
  items: string[];
}) {
  const isPositive = tone === "positive";
  const theme = isPositive
    ? {
        wrap: "bg-gradient-to-br from-emerald-50/60 via-white to-white border-emerald-200/70",
        iconBg: "bg-emerald-500 shadow-emerald-200",
        headerText: "text-emerald-900",
        subText: "text-emerald-700/80",
        countChip: "bg-emerald-100 text-emerald-700 border-emerald-200",
        card: "bg-white border-emerald-100",
        accent: "before:bg-emerald-500",
        catChip: "bg-emerald-100 text-emerald-800 border-emerald-200",
      }
    : {
        wrap: "bg-gradient-to-br from-amber-50/60 via-white to-white border-amber-200/70",
        iconBg: "bg-amber-500 shadow-amber-200",
        headerText: "text-amber-900",
        subText: "text-amber-700/80",
        countChip: "bg-amber-100 text-amber-800 border-amber-200",
        card: "bg-white border-amber-100",
        accent: "before:bg-amber-500",
        catChip: "bg-amber-100 text-amber-800 border-amber-200",
      };
  const Icon = isPositive ? CheckCircle2 : AlertTriangle;

  return (
    <div className={cn("rounded-2xl border shadow-sm p-5 space-y-3.5", theme.wrap)}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
            theme.iconBg,
          )}
        >
          <Icon size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-base font-extrabold tracking-tight",
              theme.headerText,
            )}
          >
            {title}
          </p>
          <p className={cn("text-[11px] leading-tight", theme.subText)}>
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

      <div className="space-y-2">
        {items.map((raw, i) => {
          const { category, body } = parseFinding(raw);
          if (!body && !category) return null;
          return (
            <div
              key={i}
              className={cn(
                "relative rounded-xl border px-4 py-3",
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
                  <p className="text-sm text-gray-700 leading-relaxed">{body}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export interface AIReportContentProps {
  aiData: AIAnalysisResult;
  /** Optional — when present, render a small contextual title above the score */
  listingTitle?: string;
  /** Optional — when present, the timestamp of the analysis (createdAt) */
  generatedAt?: string;
}

export default function AIReportContent({
  aiData,
  listingTitle,
  generatedAt,
}: AIReportContentProps) {
  const score = Math.round(aiData.authenticityScore ?? 0);
  const tier = scoreTier(score);
  const { green, red } = parseFlags(aiData.authenticityNotes);

  const hasPrice =
    (aiData.priceSuggested ?? 0) > 0 ||
    (aiData.priceMin ?? 0) > 0 ||
    (aiData.priceMax ?? 0) > 0;

  return (
    <div className="w-full space-y-3">
      {/* Score card */}
      <div
        className={cn("rounded-3xl border-2 p-6 shadow-sm", tier.bg, tier.border)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              AI Authenticity Report
            </p>
            {listingTitle && (
              <p className="text-sm font-bold text-gray-700 truncate max-w-xs">
                {listingTitle}
              </p>
            )}
            <p className={cn("text-base font-bold", tier.text)}>{tier.label}</p>
          </div>
          <span
            className={cn(
              "text-[11px] font-bold px-3 py-1 rounded-full",
              tier.badge,
            )}
          >
            {score}%
          </span>
        </div>

        <div className="mb-3">
          <span
            className={cn(
              "text-6xl font-black tracking-tighter leading-none",
              tier.text,
            )}
          >
            {score}
          </span>
          <span className="text-2xl font-bold text-gray-300 ml-1">/100</span>
        </div>

        <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              tier.bar,
            )}
            style={{ width: `${score}%` }}
          />
        </div>

        {generatedAt && (
          <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1">
            <ShieldCheck size={10} />
            Report generated {new Date(generatedAt).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>

      {green.length > 0 && (
        <FindingsSection
          tone="positive"
          title="Positive findings"
          subtitle="Indicators of authenticity verified from the photos"
          items={green}
        />
      )}

      {red.length > 0 ? (
        <FindingsSection
          tone="warning"
          title="Points to verify"
          subtitle="Areas the AI couldn't fully confirm"
          items={red}
        />
      ) : (
        green.length > 0 && (
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
        )
      )}

      <ConditionDefectsCard aiResult={aiData} />

      {hasPrice && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-50">
            <TrendingUp size={15} className="text-gray-500" />
            <span className="text-sm font-bold text-gray-900">
              Market price estimate
            </span>
            {aiData.priceConfidence && (
              <ConfidenceBadge confidence={aiData.priceConfidence} />
            )}
          </div>
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="text-center px-4 py-5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Min
              </p>
              <p className="text-xl font-black text-gray-400">
                €{aiData.priceMin ?? 0}
              </p>
            </div>
            <div className="text-center px-4 py-5 bg-black">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Suggested
              </p>
              <p className="text-3xl font-black text-white">
                €{aiData.priceSuggested ?? 0}
              </p>
            </div>
            <div className="text-center px-4 py-5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Max
              </p>
              <p className="text-xl font-black text-gray-400">
                €{aiData.priceMax ?? 0}
              </p>
            </div>
          </div>

          {/* Price sources (free-text bullets from AI) */}
          {aiData.priceSources && aiData.priceSources.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Globe size={11} className="text-gray-400" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                  Based on
                </span>
              </div>
              <ul className="space-y-1.5">
                {aiData.priceSources.map((src, i) => (
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

          {/* Verifiable web citations from Google Search grounding */}
          {aiData.groundingCitations &&
            aiData.groundingCitations.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Search size={11} className="text-gray-400" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                    Sources consulted ({aiData.groundingCitations.length})
                  </span>
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {aiData.groundingCitations.slice(0, 8).map((c, i) =>
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
                            {c.title ?? new URL(c.uri).hostname}
                          </span>
                          <ExternalLink size={9} />
                        </a>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

// ─── Confidence badge ─────────────────────────────────────────────────────────

function ConfidenceBadge({
  confidence,
}: {
  confidence: "high" | "medium" | "low";
}) {
  const meta = {
    high: {
      label: "High confidence",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      sub: "5+ market comps",
    },
    medium: {
      label: "Medium confidence",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      sub: "Few market comps",
    },
    low: {
      label: "Low confidence",
      className: "bg-red-50 text-red-700 border-red-200",
      sub: "Limited market data",
    },
  }[confidence];

  return (
    <span
      className={cn(
        "ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full border",
        meta.className,
      )}
      title={meta.sub}
    >
      <ShieldCheck size={10} />
      {meta.label}
    </span>
  );
}
