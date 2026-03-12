"use client";

import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SmartFormData } from "@/types/features/listing.types";
import { SHIRT_SIZES, DEFECT_TYPES } from "@/lib/constants/listing.constants";

interface DetailsFormProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
}

/**
 * Condition & details form section.
 * Handles item history, condition, size (for shirts), and defects.
 */
export function DetailsForm({ data, update }: DetailsFormProps) {
  const updateVerification = (field: string, value: any) => {
    update("verification", { ...data.verification, [field]: value });
  };

  const addDefect = () => {
    updateVerification("defects", [
      ...data.verification.defects,
      { type: "", description: "", photoId: null },
    ]);
  };

  const removeDefect = (index: number) => {
    updateVerification(
      "defects",
      data.verification.defects.filter((_, i) => i !== index),
    );
  };

  const updateDefect = (index: number, field: string, value: any) => {
    const newDefects = [...data.verification.defects];
    newDefects[index] = { ...newDefects[index], [field]: value };
    updateVerification("defects", newDefects);
  };

  return (
    <div className="space-y-6">
      {/* Item History */}
      <div>
        <label className="block font-bold text-gray-900 mb-2 text-sm">
          Item History{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Where did you get it? Any special memories? Match worn?"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none resize-none text-sm"
        />
      </div>

      {/* Condition */}
      <div>
        <label className="block font-bold text-gray-900 mb-2 text-sm">
          Condition
        </label>
        <select
          value={data.condition}
          onChange={(e) => update("condition", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-medium text-sm"
        >
          <option value="">Select condition...</option>
          <option value="bnwt">Brand New With Tags (BNWT)</option>
          <option value="bnwot">Brand New Without Tags (BNWOT)</option>
          <option value="excellent">Excellent — Like New</option>
          <option value="good">Good — Minor Wear</option>
          <option value="fair">Fair — Visible Wear</option>
          <option value="poor">Poor — Heavy Wear</option>
        </select>
      </div>

      {/* Size selector — shown for shirts */}
      {data.category === "shirts" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-bold text-gray-900 text-sm">Size</label>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
              override tag if unreadable
            </span>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
            {SHIRT_SIZES.map((s) => (
              <button
                key={s.id}
                onClick={() => update("size", s.id === data.size ? "" : s.id)}
                className={`py-2 px-1 rounded-xl border-2 text-xs font-bold transition-all ${
                  data.size === s.id
                    ? "border-black bg-black text-white shadow-md"
                    : "border-gray-200 text-gray-600 hover:border-gray-400 bg-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Defects section */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold text-gray-900 text-sm">Any defects?</p>
            <p className="text-xs text-gray-500">Stains, holes, fading, etc.</p>
          </div>
          <button
            onClick={() => {
              const newValue = !data.verification.hasDefects;
              updateVerification("hasDefects", newValue);
              if (newValue && data.verification.defects.length === 0)
                addDefect();
            }}
            className={cn(
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
              data.verification.hasDefects ? "bg-red-500" : "bg-gray-200",
            )}
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                data.verification.hasDefects
                  ? "translate-x-6"
                  : "translate-x-1",
              )}
            />
          </button>
        </div>

        {data.verification.hasDefects && (
          <div className="mt-3 space-y-3">
            {data.verification.defects.map((defect, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-xl border border-red-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-red-800">
                    Defect #{index + 1}
                  </span>
                  <button
                    onClick={() => removeDefect(index)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <X size={13} className="text-red-500" />
                  </button>
                </div>
                <div className="space-y-2">
                  <select
                    value={defect.type}
                    onChange={(e) =>
                      updateDefect(index, "type", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs"
                  >
                    <option value="">Select defect type...</option>
                    {DEFECT_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={defect.description}
                    onChange={(e) =>
                      updateDefect(index, "description", e.target.value)
                    }
                    placeholder="Describe the defect..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs resize-none"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addDefect}
              className="w-full py-2 border-2 border-dashed border-red-300 rounded-xl text-red-500 text-xs font-semibold hover:bg-red-50 flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Add Another Defect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
