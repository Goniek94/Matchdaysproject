"use client";

import { CheckCircle2 } from "lucide-react";
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

/**
 * Tags & labels form section.
 * Handles combined tag toggle, serial code input, vintage toggle, and tag condition.
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
            <CheckCircle2 size={13} className="text-white" />
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">
            All tag info is on one label
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Puma / Adidas / Nike often combine size, country and serial code on
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
            desc="One photo — size, country & serial code"
            existingPhoto={getPhotoByType("combined_tag")}
            onUpload={(files) => handleFileUpload(files, "combined_tag")}
            onRemove={() => removePhoto("combined_tag")}
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {currentGroup.photos.map((photoConfig) => {
            const typeKey = photoConfig.type ?? photoConfig.label;
            return (
              <PhotoSlot
                key={typeKey}
                typeKey={typeKey}
                label={photoConfig.label}
                desc={photoConfig.desc}
                isOptional={photoConfig.desc.includes("optional")}
                existingPhoto={getPhotoByType(typeKey)}
                onUpload={(files) => handleFileUpload(files, typeKey)}
                onRemove={() => removePhoto(typeKey)}
              />
            );
          })}
        </div>
      )}

      {/* Serial code manual input */}
      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <label className="font-bold text-gray-900 text-sm">Serial Code</label>
          <span className="text-[10px] text-gray-400 font-medium bg-gray-200 px-1.5 py-0.5 rounded-full">
            optional
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Can&apos;t read the tag? Type the product code manually — e.g.{" "}
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

      {/* Tag info section */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <h3 className="font-bold text-base text-gray-900">Tag Information</h3>

        {/* Vintage toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-medium text-gray-900 text-sm">
              Vintage item? (Pre-2005)
            </p>
            <p className="text-xs text-gray-500">
              Items manufactured before 2005
            </p>
          </div>
          <button
            onClick={() =>
              updateVerification("isVintage", !data.verification.isVintage)
            }
            className={cn(
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
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

        {/* Tag condition */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="font-medium text-gray-900 text-sm mb-3">
            Tag Condition
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: "intact", label: "Intact", emoji: "✓" },
              { value: "cut", label: "Cut Out", emoji: "✂️" },
              { value: "washed_out", label: "Washed Out", emoji: "💧" },
              { value: "missing", label: "Missing", emoji: "❌" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateVerification("tagCondition", option.value)}
                className={cn(
                  "p-3 rounded-xl border-2 text-center transition-all",
                  data.verification.tagCondition === option.value
                    ? "border-black bg-white shadow-md"
                    : "border-gray-200 hover:border-gray-300 bg-white",
                )}
              >
                <div className="text-lg mb-1">{option.emoji}</div>
                <div className="text-xs font-semibold text-gray-700">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
