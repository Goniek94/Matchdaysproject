"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BadgeCheck, Clock, PenLine, X, AlertTriangle } from "lucide-react";
import type { SmartFormData } from "@/types/features/listing.types";
import { CONDITIONS } from "@/lib/constants/listing.constants";
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
  poor: "Heavy wear / damage",
};

export default function StepPreAnalysis({ data, update }: StepProps) {
  const v = data.verification;
  const updateV = (key: keyof SmartFormData["verification"], val: any) =>
    update("verification", { ...v, [key]: val });

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-400">

      {/* Header */}
      <div className="mb-1">
        <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Tell us about your item</h2>
        <p className="text-sm text-gray-400 mt-1">Fill in what you know — the AI will verify the rest from your photos.</p>
      </div>

      {/* Condition */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 pt-4 pb-5">
        <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-3">Condition</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CONDITIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => update("condition", c.id)}
              className={cn(
                "text-left px-3 py-2.5 rounded-xl border-2 transition-all",
                data.condition === c.id
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
              )}
            >
              <p className="text-[11px] font-black leading-none">{c.label}</p>
              <p className={cn(
                "text-[10px] mt-0.5 leading-tight",
                data.condition === c.id ? "text-gray-300" : "text-gray-400",
              )}>
                {CONDITION_DESC[c.id] ?? ""}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Size</p>
        <input
          type="text"
          value={data.size || ""}
          onChange={(e) => update("size", e.target.value)}
          placeholder="e.g. M, L, XL, 13-14Y, 164cm, EU 42, UK 8..."
          className="w-full text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-300 placeholder:font-normal"
        />
      </div>

      {/* Item history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">Item story / provenance</p>
          <span className="text-[9px] font-semibold text-gray-300 uppercase tracking-widest">Optional</span>
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
