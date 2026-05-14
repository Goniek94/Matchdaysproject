"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import { BadgeCheck, Clock, PenLine, X, AlertTriangle } from "lucide-react";
import type { SmartFormData } from "@/types/features/listing.types";
import { CONDITIONS } from "@/lib/constants/listing.constants";
import {
  getSizeGroupsForCategory,
  getMeasurementFieldsForCategory,
  type SizeGroup,
  type MeasurementField,
} from "@/lib/constants/listing/taxonomy.constants";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
}

const CONDITION_DESC: Record<string, string> = {
  bnwt: "Unworn, tags on",
  bnwot: "Unworn, no tags",
  excellent: "1–2 wears, no flaws",
  good: "Light wear, no damage",
  fair: "Visible wear / fading",
  damaged: "Heavy wear / damage",
};

// Fallback when the item category doesn't have predefined size groups
// (e.g. sticks, rackets, accessories). User goes straight into custom mode.
const FALLBACK_SIZE_GROUPS: SizeGroup[] = [
  { label: "Standard", sizes: ["XS", "S", "M", "L", "XL", "XXL"] },
];

// ─── Measurements helpers ────────────────────────────────────────────────────

/**
 * Serialise a key→value map of measurements into the canonical string that
 * lives on `data.measurements` and gets sent to the AI prompt.
 *
 *   { chest: "52", length: "70", sleeve: "22" }
 *     → "Chest 52cm · Length 70cm · Sleeve 22cm"
 *
 * Empty values are dropped. Field labels come from the taxonomy so they match
 * the visible UI labels exactly.
 */
function serialiseMeasurements(
  values: Record<string, string>,
  fields: MeasurementField[],
): string {
  return fields
    .map((f) => {
      const v = values[f.key]?.trim();
      if (!v) return null;
      return `${f.label} ${v}${f.unit}`;
    })
    .filter(Boolean)
    .join(" · ");
}

/**
 * Parse a previously-serialised measurements string back into a key→value map.
 * Used to seed the form when the user comes back to the step. Forgiving — if
 * the string has a custom shape we just leave the structured inputs empty
 * (the seller's freeform string is preserved on `data.measurements`).
 */
function parseMeasurements(
  raw: string | undefined,
  fields: MeasurementField[],
): Record<string, string> {
  const out: Record<string, string> = {};
  if (!raw) return out;
  for (const f of fields) {
    const re = new RegExp(
      `${f.label}\\s+([0-9]+(?:[\\.,][0-9]+)?)\\s*${f.unit}`,
      "i",
    );
    const m = raw.match(re);
    if (m) out[f.key] = m[1].replace(",", ".");
  }
  return out;
}

export default function StepPreAnalysis({ data, update }: StepProps) {
  const v = data.verification;
  const updateV = (key: keyof SmartFormData["verification"], val: any) =>
    update("verification", { ...v, [key]: val });

  // Resolve size groups + measurement fields from the item category the
  // seller picked in Step 1. Stable per category — recomputed only when
  // itemCategory changes.
  const sizeGroups = useMemo(
    () =>
      getSizeGroupsForCategory(data.itemCategory) ?? FALLBACK_SIZE_GROUPS,
    [data.itemCategory],
  );
  const allPresetSizes = useMemo(
    () => sizeGroups.flatMap((g) => g.sizes),
    [sizeGroups],
  );

  const measurementFields = useMemo(
    () => getMeasurementFieldsForCategory(data.itemCategory) ?? [],
    [data.itemCategory],
  );

  // Structured measurement values seeded from the persisted string. Local
  // state keeps each input editable without thrashing parent state on
  // every keystroke; we serialise to `data.measurements` on change.
  const [measurementValues, setMeasurementValues] = useState<
    Record<string, string>
  >(() => parseMeasurements(data.measurements, measurementFields));

  const isCustomSize =
    !!data.size &&
    !allPresetSizes.some(
      (s) => s.toUpperCase() === data.size.toUpperCase(),
    );
  const [customMode, setCustomMode] = useState(isCustomSize);

  const handleMeasurementChange = (key: string, value: string) => {
    const next = { ...measurementValues, [key]: value };
    setMeasurementValues(next);
    update("measurements", serialiseMeasurements(next, measurementFields));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">

      {/* Header */}
      <div className="mb-2">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">Tell us about your item</h2>
        <p className="text-base text-gray-500 mt-2 leading-relaxed">
          Fill in what you know — the AI will verify and cross-check the rest from your photos.
        </p>
      </div>

      {/* Condition */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 pt-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Condition</p>
          <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">AI will verify</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {CONDITIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => update("condition", c.id)}
              className={cn(
                "text-left px-3.5 py-3 rounded-xl border-2 transition-all",
                data.condition === c.id
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
              )}
            >
              <p className="text-xs font-black leading-tight">{c.label}</p>
              <p className={cn(
                "text-[10px] mt-1 leading-tight",
                data.condition === c.id ? "text-gray-300" : "text-gray-400",
              )}>
                {CONDITION_DESC[c.id] ?? ""}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Size — chip picker grouped by Adult / Youth / Kids / Footwear */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Size</p>
          <button
            type="button"
            onClick={() => {
              if (customMode) {
                update("size", "");
                setCustomMode(false);
              } else {
                setCustomMode(true);
              }
            }}
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            {customMode ? "← Back to presets" : "Type custom →"}
          </button>
        </div>

        {customMode ? (
          <input
            type="text"
            autoFocus
            value={data.size || ""}
            onChange={(e) => update("size", e.target.value)}
            placeholder="e.g. EU 42.5, UK 8, 164cm, One size, S/M (helmet 58)..."
            className="w-full text-base font-semibold text-gray-900 outline-none border-b-2 border-gray-200 focus:border-black pb-1 placeholder:text-gray-300 placeholder:font-normal transition-colors"
          />
        ) : (
          <div className="space-y-4">
            {sizeGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-2">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.sizes.map((s) => {
                    const selected =
                      (data.size || "").toUpperCase() === s.toUpperCase();
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => update("size", s)}
                        className={cn(
                          "px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all min-w-[3.5rem]",
                          selected
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Measurements — structured fields per item category. Jersey gets
            chest/length/sleeve, boots get insole length, helmet gets
            circumference. Each value serialises into `data.measurements`
            as "Chest 52cm · Length 70cm · …" so the AI prompt and the
            public listing both quote them verbatim. */}
        {measurementFields.length > 0 && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                Measurements
              </p>
              <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">
                Optional · AI uses these
              </span>
            </div>
            <div
              className={cn(
                "grid gap-3",
                measurementFields.length === 1
                  ? "grid-cols-1 sm:max-w-xs"
                  : measurementFields.length === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : measurementFields.length === 3
                      ? "grid-cols-1 sm:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
              )}
            >
              {measurementFields.map((f) => (
                <label
                  key={f.key}
                  className="block bg-gray-50/60 rounded-xl border border-gray-100 px-3.5 py-3 hover:border-gray-300 focus-within:border-black focus-within:bg-white transition-colors"
                >
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                    {f.label}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min={0}
                      value={measurementValues[f.key] ?? ""}
                      onChange={(e) =>
                        handleMeasurementChange(f.key, e.target.value)
                      }
                      placeholder="—"
                      className="flex-1 w-full text-lg font-bold text-gray-900 outline-none bg-transparent tabular-nums placeholder:text-gray-300 placeholder:font-normal"
                    />
                    <span className="text-xs font-bold text-gray-400 shrink-0">
                      {f.unit}
                    </span>
                  </div>
                  {f.hint && (
                    <p className="text-[10px] text-gray-400 mt-1 leading-tight">
                      {f.hint}
                    </p>
                  )}
                </label>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
              Helps buyers when the tag size is unreliable (vintage cuts,
              foreign brands, kids sizes). Anything you enter shows up in the
              listing automatically.
            </p>
          </div>
        )}
      </div>

      {/* Item history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Item story / provenance</p>
          <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">Optional</span>
        </div>
        <textarea
          value={data.itemHistory || ""}
          onChange={(e) => update("itemHistory", e.target.value)}
          placeholder="e.g. Bought at the Bernabeu in 2024, worn to one match, stored folded since then..."
          rows={3}
          className="w-full text-sm text-gray-700 outline-none resize-none placeholder:text-gray-300 leading-relaxed"
        />
      </div>

      {/* Defects */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => updateV("hasDefects", !v.hasDefects)}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
            v.hasDefects ? "bg-orange-500" : "bg-gray-100",
          )}>
            <AlertTriangle size={15} className={v.hasDefects ? "text-white" : "text-gray-400"} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-bold text-gray-900 leading-none">This item has defects or damage</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Stains, tears, fading, missing tags...</p>
          </div>
          <div
            className={cn("rounded-full relative transition-colors shrink-0", v.hasDefects ? "bg-orange-500" : "bg-gray-200")}
            style={{ width: 40, height: 22 }}
          >
            <div className={cn(
              "absolute top-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform",
              v.hasDefects ? "translate-x-[19px]" : "translate-x-0.5",
            )} />
          </div>
        </button>

        {v.hasDefects && (
          <div className="border-t border-gray-100 px-5 pb-4 pt-3">
            <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Describe the defects</p>
            <textarea
              value={v.defects?.[0]?.description || ""}
              onChange={(e) =>
                updateV("defects", [{ type: "general", description: e.target.value, photoId: null }])
              }
              placeholder="e.g. Small ink stain on the back, number print slightly cracked..."
              rows={3}
              className="w-full text-sm text-gray-700 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-black transition-colors resize-none placeholder:text-gray-300 leading-relaxed"
            />
          </div>
        )}
      </div>

      {/* Autograph */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => updateV("hasAutograph", !v.hasAutograph)}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
            v.hasAutograph ? "bg-black" : "bg-gray-100",
          )}>
            <PenLine size={15} className={v.hasAutograph ? "text-white" : "text-gray-400"} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-bold text-gray-900 leading-none">Signed / Autographed item</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Player, manager, or celebrity signature</p>
          </div>
          <div
            className={cn("rounded-full relative transition-colors shrink-0", v.hasAutograph ? "bg-black" : "bg-gray-200")}
            style={{ width: 40, height: 22 }}
          >
            <div className={cn(
              "absolute top-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform",
              v.hasAutograph ? "translate-x-[19px]" : "translate-x-0.5",
            )} />
          </div>
        </button>

        {v.hasAutograph && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-4">
            <p className="text-xs font-bold text-gray-700">Do you have a Certificate of Authenticity (COA)?</p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateV("hasCertificate", true)}
                className={cn(
                  "flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-left transition-all",
                  v.hasCertificate
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
                )}
              >
                <BadgeCheck size={16} className={v.hasCertificate ? "text-white" : "text-gray-400"} />
                <span className="text-xs font-bold leading-tight">Yes, I have proof</span>
              </button>

              <button
                onClick={() => updateV("hasCertificate", false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-left transition-all",
                  !v.hasCertificate
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
                )}
              >
                <X size={16} className={!v.hasCertificate ? "text-white" : "text-gray-400"} />
                <span className="text-xs font-bold leading-tight">No certificate</span>
              </button>
            </div>

            {v.hasCertificate ? (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Certificate details</p>
                <textarea
                  value={v.certificateDetails || ""}
                  onChange={(e) => updateV("certificateDetails", e.target.value)}
                  placeholder="e.g. PSA/DNA COA #12345, Beckett cert, club letter, photo evidence..."
                  rows={3}
                  className="w-full text-xs text-gray-800 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-black transition-colors resize-none placeholder:text-gray-300 leading-relaxed"
                />
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3.5 border border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={15} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-black text-gray-900">Partner Verification</p>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white bg-gray-400 px-1.5 py-0.5 rounded-full leading-none">
                      Coming soon
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    We&apos;re partnering with certified autograph authenticators. Signed items without proof may require expert review — verification can take{" "}
                    <span className="font-semibold text-gray-700">3–7 business days</span>.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
