"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Pencil,
  Star,
  PlusCircle,
  Check,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  AlignLeft,
  Shirt,
  AlertTriangle,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import type {
  SmartFormData,
  Photo,
  AIDefect,
} from "@/types/features/listing.types";
import { CONDITIONS } from "@/lib/constants/listing.constants";
import { PHOTO_LIMITS } from "@/lib/constants/listing/listing-config.constants";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext: () => void;
  onBack: () => void;
}

// ─── Inline editable field ────────────────────────────────────────────────────

function EditableField({
  value,
  onChange,
  multiline = false,
  placeholder = "—",
  displayClass = "",
  inputClass = "",
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
  displayClass?: string;
  inputClass?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => {
    onChange(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="w-full flex flex-col gap-2">
        {multiline ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={6}
            className={cn(
              "w-full border-b-2 border-black outline-none bg-transparent resize-none leading-relaxed text-left",
              inputClass,
            )}
          />
        ) : (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancel();
            }}
            className={cn(
              "w-full border-b-2 border-black outline-none bg-transparent",
              inputClass,
            )}
          />
        )}
        <div className="flex gap-2 justify-end">
          <button
            onClick={cancel}
            className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="flex items-center gap-1 text-xs font-bold text-white bg-black rounded-lg px-3 py-1.5"
          >
            <Check size={10} /> Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={cn(
        "group flex items-start gap-2 w-full text-left rounded-md -mx-1 px-1 transition-colors hover:bg-gray-50",
        displayClass,
      )}
      title="Click to edit"
    >
      <span
        className={cn(
          "flex-1 text-left border-b border-dashed border-gray-200 group-hover:border-gray-400 transition-colors pb-0.5",
          !value && "italic font-normal text-gray-300",
        )}
      >
        {value || placeholder}
      </span>
      <Pencil
        size={12}
        className="text-gray-300 opacity-40 group-hover:opacity-100 group-hover:text-black mt-1 shrink-0 transition-all"
      />
    </button>
  );
}

// ─── Spec row ─────────────────────────────────────────────────────────────────

function SpecRow({
  label,
  value,
  onChange,
  verified,
  select,
  locked,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  verified?: boolean;
  select?: { id: string; label: string }[];
  /**
   * Anti-gaming lock. When true, the value is shown read-only with a small
   * padlock — sellers can't rewrite an AI-extracted brand/club/serial just
   * to mislead a buyer after the analysis already ran.
   */
  locked?: boolean;
}) {
  // For locked select rows we still want to show the friendly label, not the
  // raw id (e.g. "Excellent - Like New" instead of "excellent").
  const displayValue = (() => {
    if (select) {
      return select.find((o) => o.id === value)?.label ?? value;
    }
    return value;
  })();

  return (
    <div
      className={cn(
        "flex items-center py-2.5 border-b border-gray-100 last:border-0 gap-2",
        verified && "bg-emerald-50/60 -mx-5 px-5",
        locked && !verified && "bg-gray-50/60 -mx-5 px-5",
      )}
    >
      <span
        className={cn(
          "text-[9px] font-extrabold uppercase tracking-widest leading-none shrink-0 w-[88px] flex items-center gap-1",
          verified ? "text-emerald-600" : locked ? "text-gray-500" : "text-gray-400",
        )}
      >
        {label}
        {verified && (
          <span className="inline-block bg-emerald-100 text-emerald-700 text-[7px] px-1 py-0.5 rounded-full leading-none">
            AI
          </span>
        )}
        {locked && !verified && (
          <ShieldCheck size={9} className="text-gray-400" aria-label="Locked" />
        )}
      </span>

      <div className="flex-1 min-w-0 text-right">
        {locked ? (
          <span
            className="text-xs font-semibold text-gray-900 text-right truncate inline-block max-w-full"
            title="Locked — AI verified this from the photos. Re-list with new photos to change."
          >
            {displayValue || <span className="italic text-gray-300">—</span>}
          </span>
        ) : select ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="text-xs font-semibold text-gray-900 bg-transparent border-0 outline-none cursor-pointer text-right appearance-none w-full"
          >
            {select.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <EditableField
            value={value}
            onChange={onChange}
            displayClass="text-xs font-semibold text-gray-900 text-right truncate"
            inputClass="text-xs font-semibold text-gray-900 text-right"
          />
        )}
      </div>
    </div>
  );
}

// ─── Category-aware spec rows ────────────────────────────────────────────────

function CategorySpecRows({
  data,
  update,
  aiFilledPlayer,
  aiFilledNumber,
}: {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  aiFilledPlayer: boolean;
  aiFilledNumber: boolean;
}) {
  const cat = (data.itemCategory || "").toLowerCase();

  const isBoots = cat.includes("boot") || cat.includes("cleat");
  const isSneakers =
    cat.includes("sneaker") || cat.includes("shoe") || cat.includes("footwear");
  const isRaceSuit =
    cat.includes("race_suit") ||
    cat.includes("race suit") ||
    cat.includes("racesuit");
  const isHelmet = cat.includes("helmet");
  const isGKGloves = cat.includes("goalkeeper");
  const isRacingGloves =
    cat.includes("racing_glove") || cat.includes("racing glove");
  const isShorts = cat.includes("short") || cat.includes("pant");
  const isJacket =
    cat.includes("jacket") || cat.includes("hood") || cat.includes("tracksuit");

  // Anti-gaming: every field AI extracted from photos is locked here. Sellers
  // who want a different brand/club/serial than what the photos show need to
  // re-list (which triggers a fresh AI scan, fresh moderation). Only fields
  // that AI can't see (size tag may be illegible, seller can clarify;
  // measurements are physical tape readings) stay editable.

  const conditionRow = (
    <SpecRow
      key="condition"
      label="Condition"
      value={data.condition || "excellent"}
      onChange={(v) => update("condition", v)}
      select={CONDITIONS.map((c) => ({ id: c.id, label: c.label }))}
      verified={!!data.aiData?.condition}
      locked
    />
  );
  const brandRow = (
    <SpecRow
      key="brand"
      label="Brand"
      value={data.brand || ""}
      onChange={(v) => update("brand", v)}
      locked
    />
  );
  const modelRow = (
    <SpecRow
      key="model"
      label="Model"
      value={data.model || ""}
      onChange={(v) => update("model", v)}
      locked
    />
  );
  const clubRow = (
    <SpecRow
      key="club"
      label="Club / Team"
      value={data.club || ""}
      onChange={(v) => update("club", v)}
      locked
    />
  );
  const seasonRow = (
    <SpecRow
      key="season"
      label="Season"
      value={data.season || ""}
      onChange={(v) => update("season", v)}
      locked
    />
  );
  const sizeRow = (
    <SpecRow
      key="size"
      label="Size"
      value={data.size || ""}
      onChange={(v) => update("size", v)}
    />
  );
  const measurementsRow = (
    <SpecRow
      key="measurements"
      label="Measurements"
      value={data.measurements || ""}
      onChange={(v) => update("measurements", v)}
    />
  );
  const yearRow = (
    <SpecRow
      key="year"
      label="Year"
      value={data.productionYear || ""}
      onChange={(v) => update("productionYear", v)}
      locked
    />
  );
  const countryRow = (
    <SpecRow
      key="country"
      label="Country"
      value={data.countryOfProduction || ""}
      onChange={(v) => update("countryOfProduction", v)}
      verified
      locked
    />
  );
  const serialRow = (
    <SpecRow
      key="serial"
      label="Serial"
      value={data.serialCode || ""}
      onChange={(v) => update("serialCode", v)}
      verified
      locked
    />
  );
  const fiaCertRow = (
    <SpecRow
      key="fia"
      label="FIA Cert."
      value={data.serialCode || ""}
      onChange={(v) => update("serialCode", v)}
      verified
      locked
    />
  );
  const colorwayRow = (
    <SpecRow
      key="colorway"
      label="Colorway"
      value={data.colorway || ""}
      onChange={(v) => update("colorway", v)}
      locked
    />
  );
  const sizeEURow = (
    <SpecRow
      key="sizeEU"
      label="Size EU"
      value={data.sizeEU || ""}
      onChange={(v) => update("sizeEU", v)}
    />
  );
  const sizeUKRow = (
    <SpecRow
      key="sizeUK"
      label="Size UK"
      value={data.sizeUK || ""}
      onChange={(v) => update("sizeUK", v)}
    />
  );
  const studTypeRow = (
    <SpecRow
      key="studType"
      label="Stud Type"
      value={data.studType || ""}
      onChange={(v) => update("studType", v)}
      locked
    />
  );
  const playerRow = (
    <SpecRow
      key="player"
      label="Player"
      value={data.playerName || ""}
      onChange={(v) => update("playerName", v)}
      verified={aiFilledPlayer}
      locked
    />
  );
  const numberRow = (
    <SpecRow
      key="number"
      label="Number"
      value={data.playerNumber || ""}
      onChange={(v) => update("playerNumber", v)}
      verified={aiFilledNumber}
      locked
    />
  );
  const driverRow = (
    <SpecRow
      key="driver"
      label="Driver"
      value={data.playerName || ""}
      onChange={(v) => update("playerName", v)}
      verified={aiFilledPlayer}
      locked
    />
  );

  if (isBoots)
    return (
      <>
        {conditionRow}
        {brandRow}
        {modelRow}
        {clubRow}
        {seasonRow}
        {sizeRow}
        {measurementsRow}
        {sizeEURow}
        {sizeUKRow}
        {colorwayRow}
        {studTypeRow}
        {yearRow}
        {countryRow}
        {serialRow}
      </>
    );
  if (isSneakers)
    return (
      <>
        {conditionRow}
        {brandRow}
        {modelRow}
        {colorwayRow}
        {sizeRow}
        {measurementsRow}
        {sizeEURow}
        {sizeUKRow}
        {yearRow}
        {countryRow}
        {serialRow}
      </>
    );
  if (isRaceSuit || isHelmet)
    return (
      <>
        {conditionRow}
        {brandRow}
        {modelRow}
        {driverRow}
        {clubRow}
        {seasonRow}
        {sizeRow}
        {measurementsRow}
        {fiaCertRow}
        {yearRow}
        {countryRow}
      </>
    );
  if (isGKGloves)
    return (
      <>
        {conditionRow}
        {brandRow}
        {modelRow}
        {sizeRow}
        {measurementsRow}
        {yearRow}
        {countryRow}
        {serialRow}
      </>
    );
  if (isRacingGloves)
    return (
      <>
        {conditionRow}
        {brandRow}
        {modelRow}
        {sizeRow}
        {measurementsRow}
        {fiaCertRow}
        {yearRow}
        {countryRow}
      </>
    );
  if (isShorts || isJacket)
    return (
      <>
        {conditionRow}
        {brandRow}
        {modelRow}
        {clubRow}
        {seasonRow}
        {sizeRow}
        {measurementsRow}
        {yearRow}
        {countryRow}
        {serialRow}
      </>
    );

  // Default: jersey / shirt
  return (
    <>
      {conditionRow}
      {brandRow}
      {modelRow}
      {clubRow}
      {seasonRow}
      {sizeRow}
      {measurementsRow}
      {playerRow}
      {numberRow}
      {yearRow}
      {countryRow}
      {serialRow}
    </>
  );
}

// ─── AI Condition & Defects panel ─────────────────────────────────────────────

const AI_CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  bnwt: { label: "Brand New With Tags", color: "text-emerald-700" },
  bnwot: { label: "Brand New Without Tags", color: "text-emerald-600" },
  excellent: { label: "Excellent", color: "text-emerald-600" },
  good: { label: "Good", color: "text-blue-600" },
  fair: { label: "Fair", color: "text-amber-600" },
  damaged: { label: "Damaged", color: "text-red-600" },
};

const AI_SEVERITY_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  minor: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Minor" },
  moderate: { bg: "bg-orange-50", text: "text-orange-700", label: "Moderate" },
  major: { bg: "bg-red-50", text: "text-red-700", label: "Major" },
};

function AIConditionPanel({ aiData }: { aiData: SmartFormData["aiData"] }) {
  if (!aiData) return null;

  const conditionKey = (aiData.condition || "").toLowerCase();
  const conditionMeta =
    AI_CONDITION_LABELS[conditionKey] ?? {
      label: aiData.condition || "Unknown",
      color: "text-gray-700",
    };

  const defects: AIDefect[] = aiData.defects ?? [];
  const hasConditionDetails = !!aiData.conditionDetails;
  const hasDefects = defects.length > 0;
  const match = aiData.userConditionMatch;
  const showMismatch = match === "lower" || match === "higher";

  if (!hasConditionDetails && !hasDefects && !showMismatch) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-50">
        <Shirt size={14} className="text-gray-400" />
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">
          AI Condition Assessment
        </span>
        <span
          className={cn(
            "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100",
            conditionMeta.color,
          )}
        >
          {conditionMeta.label}
        </span>
      </div>

      {showMismatch && aiData.userConditionNote && (
        <div
          className={cn(
            "flex items-start gap-3 px-5 py-3 border-b border-gray-50",
            match === "lower" ? "bg-amber-50" : "bg-emerald-50",
          )}
        >
          <AlertTriangle
            size={14}
            className={cn(
              "shrink-0 mt-0.5",
              match === "lower" ? "text-amber-500" : "text-emerald-500",
            )}
          />
          <p
            className={cn(
              "text-xs leading-relaxed",
              match === "lower" ? "text-amber-800" : "text-emerald-800",
            )}
          >
            {aiData.userConditionNote}
          </p>
        </div>
      )}

      {hasConditionDetails && (
        <div className="flex items-start gap-3 px-5 py-3 border-b border-gray-50">
          <Info size={14} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 leading-relaxed">
            {aiData.conditionDetails}
          </p>
        </div>
      )}

      {hasDefects ? (
        <ul className="divide-y divide-gray-50">
          {defects.map((defect, i) => {
            const sev =
              AI_SEVERITY_STYLES[defect.severity] ?? AI_SEVERITY_STYLES.minor;
            return (
              <li key={i} className="flex items-start gap-3 px-5 py-3">
                <AlertTriangle
                  size={13}
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
                    {defect.location && (
                      <span className="text-[10px] text-gray-400 italic">
                        {defect.location}
                      </span>
                    )}
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
            <Check size={14} className="text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-700 font-medium">
              No visible defects detected
            </p>
          </div>
        )
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function StepEditListing({
  data,
  update,
  onNext,
  onBack,
}: StepProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [activeImg, setActiveImg] = useState<string | null>(
    data.photos?.[0]?.url ?? null,
  );

  const setAsMain = (index: number) => {
    if (index === 0) return;
    const reordered = [...data.photos];
    const [moved] = reordered.splice(index, 1);
    reordered.unshift(moved);
    update("photos", reordered);
    setActiveImg(moved.url);
  };

  // Photo removal intentionally not supported in the post-analysis editor —
  // sellers can ADD more shots but can't drop the originals that AI scored.
  // To swap photos entirely, the seller re-lists (fresh scan + moderation).

  const addPhotos = (files: FileList | null) => {
    if (!files) return;

    const remaining = PHOTO_LIMITS.MAX - data.photos.length;
    if (remaining <= 0) {
      toast.error(`Photo limit reached (max ${PHOTO_LIMITS.MAX}).`);
      return;
    }

    // Slice down to what fits and warn if anything was dropped
    const accepted = Array.from(files).slice(0, remaining);
    const dropped = files.length - accepted.length;

    const incoming: Photo[] = [];
    accepted.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        incoming.push({
          id: `photo-${Date.now()}-${Math.random()}`,
          url: e.target?.result as string,
          typeHint: `extra_${Date.now()}` as Photo["typeHint"],
        });
        if (incoming.length === accepted.length) {
          update("photos", [...data.photos, ...incoming]);
          if (dropped > 0) {
            toast.error(
              `Only ${accepted.length} added — photo limit is ${PHOTO_LIMITS.MAX}. Skipped ${dropped}.`,
            );
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const score = data.aiData?.authenticityScore ?? 0;
  const isAuthentic = score >= 80;
  const aiFilledPlayer = !!data.aiData?.playerName;
  const aiFilledNumber = !!data.aiData?.playerNumber;

  const currentIndex = data.photos.findIndex((p) => p.url === activeImg);
  const goNext = () => {
    if (data.photos.length < 2) return;
    setActiveImg(data.photos[(currentIndex + 1) % data.photos.length].url);
  };
  const goPrev = () => {
    if (data.photos.length < 2) return;
    setActiveImg(
      data.photos[(currentIndex - 1 + data.photos.length) % data.photos.length]
        .url,
    );
  };

  // Swipe / drag handling
  const dragStartX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) goNext();
      else goPrev();
    }
    dragStartX.current = null;
  };

  const hasPriceSuggestion = (data.aiData?.priceSuggested ?? 0) > 0;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
            Step 6 of 7
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">
            Review & Edit
          </h2>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            AI has filled everything in — but nothing here is locked.
            Tap any field below to change it.
          </p>
        </div>

        {/* What you can edit — explicit affordance hint.
            Fields that AI extracted from the photos (brand, club, season,
            condition, player, year, country, serial) are intentionally
            LOCKED — letting sellers rewrite those after the AI ruling
            would defeat the whole point of the authenticity check. */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 bg-gradient-to-r from-blue-50 via-indigo-50/60 to-white rounded-2xl border border-blue-100 px-4 py-3">
            <div className="flex items-center gap-2 pr-3 mr-1 border-r border-blue-200">
              <Pencil size={14} className="text-blue-600" />
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                You can edit
              </span>
            </div>
            {[
              "Title",
              "Description",
              "Size",
              "Measurements",
              "Add photos",
            ].map((label) => (
              <span
                key={label}
                className="text-[11px] font-semibold text-blue-800 bg-white/70 border border-blue-100 px-2 py-0.5 rounded-full"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Mirror callout: what is locked and why */}
          <div className="flex flex-wrap items-center gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-2.5">
            <div className="flex items-center gap-2 pr-3 mr-1 border-r border-gray-200">
              <ShieldCheck size={13} className="text-gray-500" />
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                AI-verified · locked
              </span>
            </div>
            {[
              "Brand",
              "Model",
              "Club",
              "Season",
              "Condition",
              "Player",
              "Serial",
            ].map((label) => (
              <span
                key={label}
                className="text-[11px] font-medium text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid: left (photo + title + description) | right (details + price + nav) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5 lg:gap-6 items-start">
        {/* ── LEFT: photo + title + description ────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Photo gallery */}
          <div className="rounded-2xl overflow-hidden bg-[#0d0d0d] shadow-xl">
            {/* Main image with nav arrows + swipe */}
            <div
              className="relative w-full select-none cursor-grab active:cursor-grabbing"
              style={{ aspectRatio: "1/1" }}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerLeave={(e) => {
                if (e.buttons > 0) onPointerUp(e);
              }}
            >
              {activeImg ? (
                <img
                  src={activeImg}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                  No photos
                </div>
              )}

              {/* Prev / Next arrows */}
              {data.photos.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
                  >
                    <ChevronLeft size={16} className="text-white" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
                  >
                    <ChevronRight size={16} className="text-white" />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full tabular-nums">
                    {currentIndex + 1} / {data.photos.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="p-2 bg-[#1a1a1a] flex gap-1.5 overflow-x-auto scrollbar-hide">
              {data.photos.map((photo, i) => (
                <div
                  key={photo.id ?? i}
                  className="relative shrink-0 group/thumb"
                >
                  <button
                    onClick={() => setActiveImg(photo.url)}
                    className={cn(
                      "w-10 h-10 rounded-lg overflow-hidden ring-2 transition-all block",
                      activeImg === photo.url
                        ? "ring-white scale-105"
                        : "ring-transparent opacity-40 hover:opacity-70",
                    )}
                  >
                    <img
                      src={photo.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                  {i === 0 ? (
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow pointer-events-none">
                      <Star size={7} className="fill-black text-black" />
                    </div>
                  ) : (
                    <button
                      onClick={() => setAsMain(i)}
                      className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full items-center justify-center shadow hidden group-hover/thumb:flex"
                    >
                      <Star size={7} className="text-black" />
                    </button>
                  )}
                  {/* Photo delete button intentionally removed — once AI has
                      analysed a photo set, sellers can ADD more shots but
                      can't drop the originals. Lets us trust the listing
                      reflects what AI scored. To swap photos entirely, the
                      seller has to re-list (fresh scan + fresh moderation). */}
                </div>
              ))}
              {data.photos.length < PHOTO_LIMITS.MAX && (
                <button
                  onClick={() => photoInputRef.current?.click()}
                  title={`Add more photos (${PHOTO_LIMITS.MAX - data.photos.length} left)`}
                  className="shrink-0 w-10 h-10 rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center gap-0.5 hover:border-gray-500 transition-colors"
                >
                  <PlusCircle size={12} className="text-gray-600" />
                </button>
              )}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onClick={(e) => {
                  (e.target as HTMLInputElement).value = "";
                }}
                onChange={(e) => addPhotos(e.target.files)}
              />
            </div>
          </div>

          {/* Title */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
            <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">
              Title
            </p>
            <EditableField
              value={data.title || ""}
              onChange={(v) => update("title", v)}
              placeholder="Add a title..."
              displayClass="text-lg sm:text-xl font-black text-gray-900 leading-snug tracking-tight"
              inputClass="text-lg sm:text-xl font-black text-gray-900 leading-snug tracking-tight"
            />
          </div>

          {/* Description — left-aligned, clean */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50">
              <AlignLeft size={13} className="text-gray-400" />
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">
                Description
              </p>
            </div>
            <div className="px-4 py-3">
              <EditableField
                value={data.description || ""}
                onChange={(v) => update("description", v)}
                multiline
                placeholder="Add a description..."
                displayClass="text-sm text-gray-600 leading-relaxed text-left"
                inputClass="text-sm text-gray-600 leading-relaxed text-left"
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT: AI score + item details + price suggestion + nav ──────── */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
          {/* AI authenticity score */}
          {score > 0 && (
            <div
              className={cn(
                "rounded-2xl overflow-hidden border",
                isAuthentic
                  ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
                  : "border-amber-200 bg-gradient-to-br from-amber-50 to-white",
              )}
            >
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                      isAuthentic ? "bg-emerald-500" : "bg-amber-500",
                    )}
                  >
                    {isAuthentic ? (
                      <ShieldCheck size={16} className="text-white" />
                    ) : (
                      <ShieldAlert size={16} className="text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 leading-none mb-0.5">
                      AI Authenticity
                    </p>
                    <p
                      className={cn(
                        "text-xs font-bold leading-none",
                        isAuthentic ? "text-emerald-700" : "text-amber-700",
                      )}
                    >
                      {isAuthentic ? "Looks authentic" : "Needs review"}
                    </p>
                  </div>
                </div>
                <p
                  className={cn(
                    "text-4xl font-black tabular-nums tracking-tighter leading-none shrink-0",
                    isAuthentic ? "text-emerald-600" : "text-amber-600",
                  )}
                >
                  {score}
                  <span className="text-lg font-bold">%</span>
                </p>
              </div>
              {/* Score bar */}
              <div className="h-1 bg-black/5">
                <div
                  className={cn(
                    "h-full transition-all duration-700",
                    isAuthentic ? "bg-emerald-500" : "bg-amber-500",
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          )}

          {/* Item details — editable spec rows */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 pt-4 pb-2">
            <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-900 mb-1">
              Item Details
            </p>
            <CategorySpecRows
              data={data}
              update={update}
              aiFilledPlayer={aiFilledPlayer}
              aiFilledNumber={aiFilledNumber}
            />
          </div>

          {/* AI condition & defects — below item details */}
          <AIConditionPanel aiData={data.aiData} />

          {/* AI price suggestion — below details */}
          {hasPriceSuggestion && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50">
                <TrendingUp size={14} className="text-gray-400" />
                <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">
                  AI Price Estimate
                </p>
                <span className="ml-auto text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Suggested
                </span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-gray-100">
                {/* Min */}
                <div className="text-center px-3 py-4">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Min
                  </p>
                  <p className="text-base font-black text-gray-400">
                    €{data.aiData!.priceMin}
                  </p>
                </div>
                {/* Suggested — highlighted */}
                <div className="text-center px-3 py-4 bg-black">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Suggested
                  </p>
                  <p className="text-xl font-black text-white">
                    €{data.aiData!.priceSuggested}
                  </p>
                </div>
                {/* Max */}
                <div className="text-center px-3 py-4">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Max
                  </p>
                  <p className="text-base font-black text-gray-400">
                    €{data.aiData!.priceMax}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={onBack}
              className="text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-7 py-3.5 bg-black text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all shadow-lg shadow-black/15"
            >
              Continue <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
