"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { ChevronRight, ChevronLeft, Pencil, Star, X, PlusCircle, Check, ShieldCheck, ShieldAlert } from "lucide-react";
import type { SmartFormData, Photo } from "@/types/features/listing.types";
import { CONDITIONS } from "@/lib/constants/listing.constants";
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

  const save = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (editing) {
    return (
      <div className="w-full flex flex-col gap-2">
        {multiline ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={6}
            className={cn("w-full border-b-2 border-black outline-none bg-transparent resize-none leading-relaxed", inputClass)}
          />
        ) : (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
            className={cn("w-full border-b-2 border-black outline-none bg-transparent", inputClass)}
          />
        )}
        <div className="flex gap-2 justify-end">
          <button onClick={cancel} className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 transition-colors">Cancel</button>
          <button onClick={save} className="flex items-center gap-1 text-xs font-bold text-white bg-black rounded-lg px-3 py-1.5">
            <Check size={10} /> Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setDraft(value); setEditing(true); }}
      className={cn("group flex items-start gap-2 text-left w-full", displayClass)}
    >
      <span className={cn("flex-1", !value && "italic font-normal text-gray-300")}>
        {value || placeholder}
      </span>
      <Pencil size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 mt-0.5 shrink-0 transition-opacity" />
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  verified?: boolean;
  select?: { id: string; label: string }[];
}) {
  return (
    <div className={cn(
      "flex items-center py-2.5 border-b border-gray-100 last:border-0 gap-2",
      verified && "bg-emerald-50/60 -mx-5 px-5",
    )}>
      <span className={cn(
        "text-[9px] font-extrabold uppercase tracking-widest leading-none shrink-0 w-[88px]",
        verified ? "text-emerald-600" : "text-gray-400",
      )}>
        {label}
        {verified && (
          <span className="ml-1 inline-block bg-emerald-100 text-emerald-700 text-[7px] px-1 py-0.5 rounded-full align-middle leading-none">AI</span>
        )}
      </span>

      <div className="flex-1 min-w-0 text-right">
        {select ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="text-xs font-semibold text-gray-900 bg-transparent border-0 outline-none cursor-pointer text-right appearance-none w-full"
          >
            {select.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        ) : (
          <EditableField
            value={value}
            onChange={onChange}
            displayClass="text-xs font-semibold text-gray-900 justify-end truncate"
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
  const isSneakers = cat.includes("sneaker") || cat.includes("shoe") || cat.includes("footwear");
  const isRaceSuit = cat.includes("race_suit") || cat.includes("race suit") || cat.includes("racesuit");
  const isHelmet = cat.includes("helmet");
  const isGKGloves = cat.includes("goalkeeper");
  const isRacingGloves = cat.includes("racing_glove") || cat.includes("racing glove");
  const isShorts = cat.includes("short") || cat.includes("pant");
  const isJacket = cat.includes("jacket") || cat.includes("hood") || cat.includes("tracksuit");

  const conditionRow = (
    <SpecRow key="condition" label="Condition" value={data.condition || "excellent"} onChange={(v) => update("condition", v)}
      select={CONDITIONS.map((c) => ({ id: c.id, label: c.label }))} />
  );
  const brandRow = <SpecRow key="brand" label="Brand" value={data.brand || ""} onChange={(v) => update("brand", v)} />;
  const modelRow = <SpecRow key="model" label="Model" value={data.model || ""} onChange={(v) => update("model", v)} />;
  const clubRow = <SpecRow key="club" label="Club / Team" value={data.club || ""} onChange={(v) => update("club", v)} />;
  const seasonRow = <SpecRow key="season" label="Season" value={data.season || ""} onChange={(v) => update("season", v)} />;
  const sizeRow = <SpecRow key="size" label="Size" value={data.size || ""} onChange={(v) => update("size", v)} />;
  const yearRow = <SpecRow key="year" label="Year" value={data.productionYear || ""} onChange={(v) => update("productionYear", v)} />;
  const countryRow = <SpecRow key="country" label="Country" value={data.countryOfProduction || ""} onChange={(v) => update("countryOfProduction", v)} verified />;
  const serialRow = <SpecRow key="serial" label="Serial" value={data.serialCode || ""} onChange={(v) => update("serialCode", v)} verified />;
  const fiaCertRow = <SpecRow key="fia" label="FIA Cert." value={data.serialCode || ""} onChange={(v) => update("serialCode", v)} verified />;
  const colorwayRow = <SpecRow key="colorway" label="Colorway" value={data.colorway || ""} onChange={(v) => update("colorway", v)} />;
  const sizeEURow = <SpecRow key="sizeEU" label="Size EU" value={data.sizeEU || ""} onChange={(v) => update("sizeEU", v)} />;
  const sizeUKRow = <SpecRow key="sizeUK" label="Size UK" value={data.sizeUK || ""} onChange={(v) => update("sizeUK", v)} />;
  const studTypeRow = <SpecRow key="studType" label="Stud Type" value={data.studType || ""} onChange={(v) => update("studType", v)} />;
  const playerRow = <SpecRow key="player" label="Player" value={data.playerName || ""} onChange={(v) => update("playerName", v)} verified={aiFilledPlayer} />;
  const numberRow = <SpecRow key="number" label="Number" value={data.playerNumber || ""} onChange={(v) => update("playerNumber", v)} verified={aiFilledNumber} />;
  const driverRow = <SpecRow key="driver" label="Driver" value={data.playerName || ""} onChange={(v) => update("playerName", v)} verified={aiFilledPlayer} />;

  if (isBoots) return <>{conditionRow}{brandRow}{modelRow}{clubRow}{seasonRow}{sizeRow}{sizeEURow}{sizeUKRow}{colorwayRow}{studTypeRow}{yearRow}{countryRow}{serialRow}</>;
  if (isSneakers) return <>{conditionRow}{brandRow}{modelRow}{colorwayRow}{sizeRow}{sizeEURow}{sizeUKRow}{yearRow}{countryRow}{serialRow}</>;
  if (isRaceSuit || isHelmet) return <>{conditionRow}{brandRow}{modelRow}{driverRow}{clubRow}{seasonRow}{sizeRow}{fiaCertRow}{yearRow}{countryRow}</>;
  if (isGKGloves) return <>{conditionRow}{brandRow}{modelRow}{sizeRow}{yearRow}{countryRow}{serialRow}</>;
  if (isRacingGloves) return <>{conditionRow}{brandRow}{modelRow}{sizeRow}{fiaCertRow}{yearRow}{countryRow}</>;
  if (isShorts || isJacket) return <>{conditionRow}{brandRow}{modelRow}{clubRow}{seasonRow}{sizeRow}{yearRow}{countryRow}{serialRow}</>;

  // Default: jersey / shirt
  return <>{conditionRow}{brandRow}{modelRow}{clubRow}{seasonRow}{sizeRow}{playerRow}{numberRow}{yearRow}{countryRow}{serialRow}</>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function StepEditListing({ data, update, onNext, onBack }: StepProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [activeImg, setActiveImg] = useState<string | null>(data.photos?.[0]?.url ?? null);

  const setAsMain = (index: number) => {
    if (index === 0) return;
    const reordered = [...data.photos];
    const [moved] = reordered.splice(index, 1);
    reordered.unshift(moved);
    update("photos", reordered);
    setActiveImg(moved.url);
  };

  const removePhoto = (index: number) => {
    const updated = data.photos.filter((_, i) => i !== index);
    update("photos", updated);
    if (data.photos[index]?.url === activeImg) setActiveImg(updated[0]?.url ?? null);
  };

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const incoming: Photo[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        incoming.push({
          id: `photo-${Date.now()}-${Math.random()}`,
          url: e.target?.result as string,
          typeHint: `extra_${Date.now()}` as Photo["typeHint"],
        });
        if (incoming.length === files.length) update("photos", [...data.photos, ...incoming]);
      };
      reader.readAsDataURL(file);
    });
  };

  const score = data.aiData?.authenticityScore ?? 0;
  const isAuthentic = score >= 80;
  const aiFilledPlayer = !!(data.aiData?.playerName);
  const aiFilledNumber = !!(data.aiData?.playerNumber);

  const currentIndex = data.photos.findIndex(p => p.url === activeImg);
  const goNext = () => {
    if (data.photos.length < 2) return;
    setActiveImg(data.photos[(currentIndex + 1) % data.photos.length].url);
  };
  const goPrev = () => {
    if (data.photos.length < 2) return;
    setActiveImg(data.photos[(currentIndex - 1 + data.photos.length) % data.photos.length].url);
  };

  // Swipe / drag handling
  const dragStartX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => { dragStartX.current = e.clientX; };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > 40) { if (diff < 0) goNext(); else goPrev(); }
    dragStartX.current = null;
  };

  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Step 6 of 7</p>
        <h2 className="text-xl font-black text-gray-900 tracking-tighter">Review & Edit</h2>
      </div>

      {/* Main grid: left content | right sidebar */}
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
              onPointerLeave={(e) => { if (e.buttons > 0) onPointerUp(e); }}
            >
              {activeImg
                ? <img src={activeImg} alt="preview" className="w-full h-full object-cover" />
                : <div className="flex items-center justify-center h-full text-gray-600 text-sm">No photos</div>
              }

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
                <div key={photo.id ?? i} className="relative shrink-0 group/thumb">
                  <button
                    onClick={() => setActiveImg(photo.url)}
                    className={cn(
                      "w-10 h-10 rounded-lg overflow-hidden ring-2 transition-all block",
                      activeImg === photo.url
                        ? "ring-white scale-105"
                        : "ring-transparent opacity-40 hover:opacity-70",
                    )}
                  >
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  </button>
                  {i === 0
                    ? <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow pointer-events-none">
                        <Star size={7} className="fill-black text-black" />
                      </div>
                    : <button onClick={() => setAsMain(i)} className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full items-center justify-center shadow hidden group-hover/thumb:flex">
                        <Star size={7} className="text-black" />
                      </button>
                  }
                  <button onClick={() => removePhoto(i)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center shadow hidden group-hover/thumb:flex">
                    <X size={7} className="text-white" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => photoInputRef.current?.click()}
                className="shrink-0 w-10 h-10 rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center gap-0.5 hover:border-gray-500 transition-colors"
              >
                <PlusCircle size={12} className="text-gray-600" />
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
                onChange={(e) => addPhotos(e.target.files)}
              />
            </div>
          </div>

          {/* Title */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
            <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Title</p>
            <EditableField
              value={data.title || ""}
              onChange={(v) => update("title", v)}
              placeholder="Add a title..."
              displayClass="text-lg sm:text-xl font-black text-gray-900 leading-snug tracking-tight"
              inputClass="text-lg sm:text-xl font-black text-gray-900 leading-snug tracking-tight"
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
            <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Description</p>
            <EditableField
              value={data.description || ""}
              onChange={(v) => update("description", v)}
              multiline
              placeholder="Add a description..."
              displayClass="text-sm text-gray-600 leading-relaxed"
              inputClass="text-sm text-gray-600 leading-relaxed"
            />
          </div>

        </div>

        {/* ── RIGHT: details sidebar ────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-24">

          {/* Price + AI score — top card */}
          {((data.aiData?.priceSuggested ?? 0) > 0 || score > 0) && (
            <div className={cn(
              "rounded-2xl overflow-hidden border",
              score > 0
                ? isAuthentic
                  ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
                  : "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
                : "border-gray-100 bg-white",
            )}>
              {/* Price row */}
              {(data.aiData?.priceSuggested ?? 0) > 0 && (
                <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-4 border-b border-black/5">
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">Suggested Price</p>
                    {(data.aiData?.priceMin ?? 0) > 0 && (
                      <p className="text-[10px] text-gray-400 tabular-nums">€{data.aiData!.priceMin} – €{data.aiData!.priceMax}</p>
                    )}
                  </div>
                  <p className="text-3xl font-black text-emerald-600 tabular-nums tracking-tighter">
                    €{data.aiData!.priceSuggested}
                  </p>
                </div>
              )}

              {/* AI score row */}
              {score > 0 && (
                <div className="px-5 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      isAuthentic ? "bg-emerald-500" : "bg-amber-500",
                    )}>
                      {isAuthentic
                        ? <ShieldCheck size={15} className="text-white" />
                        : <ShieldAlert size={15} className="text-white" />
                      }
                    </div>
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 leading-none mb-0.5">AI Authenticity</p>
                      <p className={cn("text-xs font-bold leading-none", isAuthentic ? "text-emerald-700" : "text-amber-700")}>
                        {isAuthentic ? "Looks authentic" : "Needs review"}
                      </p>
                    </div>
                  </div>
                  <p className={cn(
                    "text-4xl font-black tabular-nums tracking-tighter leading-none shrink-0",
                    isAuthentic ? "text-emerald-600" : "text-amber-600",
                  )}>
                    {score}<span className="text-lg font-bold">%</span>
                  </p>
                </div>
              )}

              {/* Score bar */}
              {score > 0 && (
                <div className="h-1 bg-black/5">
                  <div
                    className={cn("h-full", isAuthentic ? "bg-emerald-500" : "bg-amber-500")}
                    style={{ width: `${score}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Item details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 pt-4 pb-2">
            <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-900 mb-1">Item Details</p>
            <CategorySpecRows
              data={data}
              update={update}
              aiFilledPlayer={aiFilledPlayer}
              aiFilledNumber={aiFilledNumber}
            />
          </div>

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
