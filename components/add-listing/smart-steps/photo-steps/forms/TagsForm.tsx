"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SmartFormData, Photo } from "@/types/features/listing.types";
import type { PhotoGroup } from "@/lib/constants/listing.constants";
import { PhotoSlot } from "../shared";

interface TagsFormProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  currentGroup: PhotoGroup;
  getPhotoByType: (photoType: string) => Photo | undefined;
  handleFileUpload: (files: FileList | null, photoType: string) => void;
  removePhoto: (photoType: string) => void;
}

const SERIAL_MISSING_REASONS = [
  { value: "pre_2005", label: "Pre-2005 jersey", desc: "Era item — no serial tag" },
  { value: "faded", label: "Faded / Unreadable", desc: "Code worn off" },
  { value: "cut_out", label: "Cut out / Removed", desc: "Tag was removed" },
] as const;

/**
 * Tags & labels form section.
 * Serial code tag is REQUIRED unless user explicitly marks it as missing with a reason.
 */
export function TagsForm({
  data,
  update,
  currentGroup,
  getPhotoByType,
  handleFileUpload,
  removePhoto,
}: TagsFormProps) {
  const updateVerification = (field: string, value: any) => {
    update("verification", { ...data.verification, [field]: value });
  };

  const serialMissing = !!(data.verification as any).serialMissing;
  const serialMissingReason = (data.verification as any).serialMissingReason ?? "";

  return (
    <div className="space-y-6">
      {/* Combined tag toggle */}
      <div
        className={cn(
          "flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all select-none",
          data.verification.tagsCombined
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 bg-gray-50 hover:border-gray-300",
        )}
        onClick={() =>
          updateVerification("tagsCombined", !data.verification.tagsCombined)
        }
      >
        <div
          className={cn(
            "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
            data.verification.tagsCombined
              ? "bg-blue-600 border-blue-600"
              : "border-gray-400",
          )}
        >
          {data.verification.tagsCombined && (
            <span className="text-white text-xs font-black">✓</span>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">
            All tag info is on one label
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Nike / Adidas / Puma often combine size, country and serial code on
            a single tag
          </p>
        </div>
      </div>

      {/* Tag photos */}
      {data.verification.tagsCombined ? (
        <div className="max-w-xs">
          <PhotoSlot
            typeKey="combined_tag"
            label="Combined Tag Photo"
            desc="One photo — size, country & serial code all in frame"
            existingPhoto={getPhotoByType("combined_tag")}
            onUpload={(files) => handleFileUpload(files, "combined_tag")}
            onRemove={() => removePhoto("combined_tag")}
          />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            {currentGroup.photos
              .filter((p) => {
                // Hide serial_code slot if user has declared it missing
                if (p.type === "serial_code" && serialMissing) return false;
                return true;
              })
              .map((photoConfig) => {
                const typeKey = photoConfig.type ?? photoConfig.label;
                const isRequired = !photoConfig.desc.toLowerCase().includes("optional");
                return (
                  <PhotoSlot
                    key={typeKey}
                    typeKey={typeKey}
                    label={photoConfig.label}
                    desc={photoConfig.desc}
                    isOptional={!isRequired}
                    existingPhoto={getPhotoByType(typeKey)}
                    onUpload={(files) => handleFileUpload(files, typeKey)}
                    onRemove={() => removePhoto(typeKey)}
                  />
                );
              })}
          </div>

          {/* Serial code missing section */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-3">
            <div
              className="flex items-center justify-between cursor-pointer gap-4"
              onClick={() => {
                const next = !serialMissing;
                updateVerification("serialMissing", next);
                if (!next) updateVerification("serialMissingReason", "");
              }}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800">
                    Serial code tag is missing
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Check this only if the tag physically doesn't exist
                  </p>
                </div>
              </div>
              {/* Toggle */}
              <div
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative flex-shrink-0",
                  serialMissing ? "bg-amber-500" : "bg-gray-300",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    serialMissing ? "left-6" : "left-1",
                  )}
                />
              </div>
            </div>

            {serialMissing && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {SERIAL_MISSING_REASONS.map((reason) => (
                  <button
                    key={reason.value}
                    type="button"
                    onClick={() =>
                      updateVerification(
                        "serialMissingReason",
                        serialMissingReason === reason.value ? "" : reason.value,
                      )
                    }
                    className={cn(
                      "text-left p-2.5 rounded-xl border text-xs transition-all",
                      serialMissingReason === reason.value
                        ? "border-amber-500 bg-amber-500 text-white"
                        : "border-amber-200 bg-white text-gray-700 hover:border-amber-400",
                    )}
                  >
                    <p className="font-bold leading-tight">{reason.label}</p>
                    <p className={cn("mt-0.5 text-[10px]", serialMissingReason === reason.value ? "text-amber-100" : "text-gray-400")}>
                      {reason.desc}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual serial code input (always visible as fallback) */}
      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <label className="font-bold text-gray-900 text-sm">Serial Code — manual entry</label>
          <span className="text-[10px] text-gray-400 font-medium bg-gray-200 px-1.5 py-0.5 rounded-full">
            optional
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Can&apos;t read the tag clearly? Type the product code manually — e.g.{" "}
          <span className="font-mono text-gray-700 bg-gray-200 px-1 rounded">
            GH7252
          </span>
        </p>
        <input
          type="text"
          value={(data.verification as any).serialCode || ""}
          onChange={(e) => updateVerification("serialCode", e.target.value)}
          placeholder="e.g. GH7252 or BQ6580-100"
          className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none text-sm font-mono tracking-wider bg-white"
        />
      </div>

      {/* Vintage toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
        <div>
          <p className="font-bold text-gray-900 text-sm">Vintage / Pre-2005 item</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Items manufactured before 2005 — may lack serial tags
          </p>
        </div>
        <button
          type="button"
          onClick={() => updateVerification("isVintage", !data.verification.isVintage)}
          className={cn(
            "relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0",
            data.verification.isVintage ? "bg-black" : "bg-gray-200",
          )}
        >
          <span
            className={cn(
              "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
              data.verification.isVintage ? "translate-x-6" : "translate-x-1",
            )}
          />
        </button>
      </div>
    </div>
  );
}
