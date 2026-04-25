"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { ChevronRight, Pencil, Star, X, PlusCircle } from "lucide-react";
import type { SmartFormData, Photo } from "@/types/features/listing.types";
import { CONDITIONS } from "@/lib/constants/listing.constants";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext: () => void;
  onBack: () => void;
}

// Editable text field row
function FieldRow({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = "—",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => {
    onChange(draft);
    setEditing(false);
  };

  return (
    <div className={cn("group px-5 py-3 border-b border-gray-50 last:border-0", editing ? "bg-blue-50/40" : "hover:bg-gray-50/50")}>
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest shrink-0 pt-0.5 min-w-[110px]">
          {label}
        </span>

        {editing ? (
          <div className="flex-1 flex flex-col gap-1.5">
            {multiline ? (
              <textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={5}
                className="w-full text-sm text-gray-900 border border-gray-300 rounded-xl p-3 outline-none focus:border-black resize-none bg-white"
              />
            ) : (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && save()}
                className="w-full text-sm font-semibold text-gray-900 border-b-2 border-black outline-none bg-transparent py-0.5"
              />
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setDraft(value); setEditing(false); }}
                className="text-xs text-gray-400 hover:text-gray-700 font-medium px-2 py-1"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="text-xs font-bold text-white bg-black rounded-lg px-3 py-1 hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => { setDraft(value); setEditing(true); }}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 text-right hover:text-black group-hover:underline flex-1 justify-end"
          >
            <span className="break-words text-right">{value || <span className="text-gray-300">{placeholder}</span>}</span>
            <Pencil size={11} className="text-gray-400 opacity-0 group-hover:opacity-100 shrink-0" />
          </button>
        )}
      </div>
    </div>
  );
}

// Condition select row
function ConditionRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="group px-5 py-3 border-b border-gray-50 hover:bg-gray-50/50">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest shrink-0 min-w-[110px]">
          Condition
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-sm font-semibold text-gray-900 bg-transparent border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-black cursor-pointer"
        >
          {CONDITIONS.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

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
    if (data.photos[index]?.url === activeImg) {
      setActiveImg(updated[0]?.url ?? null);
    }
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
        if (incoming.length === files.length) {
          update("photos", [...data.photos, ...incoming]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-1">
            Review & Edit
          </h2>
          <p className="text-base text-gray-400 font-medium">
            AI filled in the details — correct anything before continuing.
          </p>
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-[1fr_300px] gap-6 items-start">

          {/* Left: photos + title + description */}
          <div className="space-y-5">

            {/* Photo manager */}
            <div className="rounded-2xl overflow-hidden bg-gray-950">
              {/* Main preview */}
              <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                {activeImg ? (
                  <img src={activeImg} alt="preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex items-center justify-center h-40 text-gray-600 text-sm">No photos</div>
                )}
              </div>
              {/* Thumbnails */}
              <div className="p-3 bg-gray-900 flex gap-2 overflow-x-auto">
                {data.photos.map((photo, i) => (
                  <div key={photo.id ?? i} className="relative shrink-0 group/thumb">
                    <button
                      onClick={() => setActiveImg(photo.url)}
                      className={cn(
                        "relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all block",
                        activeImg === photo.url ? "border-white scale-105" : "border-transparent opacity-50 hover:opacity-80",
                      )}
                    >
                      <img src={photo.url} alt={`${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                    {/* Main star */}
                    {i === 0 ? (
                      <div className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                        <Star size={10} className="text-black fill-black" />
                      </div>
                    ) : (
                      <button
                        onClick={() => setAsMain(i)}
                        title="Set as main"
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-yellow-400 rounded-full items-center justify-center shadow-md hidden group-hover/thumb:flex"
                      >
                        <Star size={10} className="text-black" />
                      </button>
                    )}
                    {/* Remove */}
                    <button
                      onClick={() => removePhoto(i)}
                      title="Remove"
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full items-center justify-center shadow-md hidden group-hover/thumb:flex"
                    >
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ))}
                {/* Add more */}
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="shrink-0 w-14 h-14 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center gap-0.5 hover:border-gray-400 transition-colors"
                >
                  <PlusCircle size={18} className="text-gray-500" />
                  <span className="text-[9px] text-gray-500">Add</span>
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
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 pt-4 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Title</span>
              </div>
              <FieldRow
                label=""
                value={data.title || ""}
                onChange={(v) => update("title", v)}
                placeholder="Enter listing title"
              />
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 pt-4 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</span>
              </div>
              <FieldRow
                label=""
                value={data.description || ""}
                onChange={(v) => update("description", v)}
                multiline
                placeholder="Enter description"
              />
            </div>
          </div>

          {/* Right: details */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Details</span>
            </div>
            <ConditionRow
              value={data.condition || "excellent"}
              onChange={(v) => update("condition", v)}
            />
            <FieldRow label="Brand" value={data.brand || ""} onChange={(v) => update("brand", v)} />
            <FieldRow label="Model" value={data.model || ""} onChange={(v) => update("model", v)} />
            <FieldRow label="Club / Team" value={data.club || ""} onChange={(v) => update("club", v)} />
            <FieldRow label="Season" value={data.season || ""} onChange={(v) => update("season", v)} />
            <FieldRow label="Size" value={data.size || ""} onChange={(v) => update("size", v)} />
            <FieldRow label="Country" value={data.countryOfProduction || ""} onChange={(v) => update("countryOfProduction", v)} />
            <FieldRow label="Serial Code" value={data.serialCode || ""} onChange={(v) => update("serialCode", v)} />
            <FieldRow label="Player" value={data.playerName || ""} onChange={(v) => update("playerName", v)} />
            <FieldRow label="Number" value={data.playerNumber || ""} onChange={(v) => update("playerNumber", v)} />
          </div>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 flex items-center justify-between border-t border-gray-100 pt-6">
          <button
            onClick={onBack}
            className="text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors"
          >
            ← Back to Analysis
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-7 py-3.5 bg-black text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all"
          >
            Continue
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
