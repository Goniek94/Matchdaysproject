import { SmartFormData, getCategoryById, DEFECT_TYPES } from "./types";
import { AlertCircle, Plus, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
}

export default function StepVerification({ data, update }: StepProps) {
  const selectedCategory = getCategoryById(data.category);
  const categoryFields = selectedCategory?.verification.specificFields || {};

  // Update verification field
  const updateVerification = (field: string, value: any) => {
    update("verification", {
      ...data.verification,
      [field]: value,
    });
  };

  // Add defect
  const addDefect = () => {
    const newDefect = {
      type: "",
      description: "",
      photoId: null,
    };
    updateVerification("defects", [...data.verification.defects, newDefect]);
  };

  // Remove defect
  const removeDefect = (index: number) => {
    const newDefects = data.verification.defects.filter((_, i) => i !== index);
    updateVerification("defects", newDefects);
    if (newDefects.length === 0) {
      updateVerification("hasDefects", false);
    }
  };

  // Update defect
  const updateDefect = (index: number, field: string, value: any) => {
    const newDefects = [...data.verification.defects];
    newDefects[index] = { ...newDefects[index], [field]: value };
    updateVerification("defects", newDefects);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Main Container with Shadow */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2">
            Product Verification
          </h2>
          <p className="text-base text-gray-500 font-medium">
            Provide details to verify authenticity and condition
          </p>
        </div>

        <div className="space-y-6">
          {/* Tag Condition (for apparel) */}
          {categoryFields.tagCondition !== undefined && (
            <div className="p-6 bg-white rounded-2xl border-2 border-gray-200">
              <label className="block text-lg font-bold text-gray-900 mb-4">
                Tag Condition
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: "intact", label: "Intact", emoji: "✓" },
                  { value: "cut", label: "Cut Out", emoji: "✂️" },
                  { value: "washed_out", label: "Washed Out", emoji: "💧" },
                  { value: "missing", label: "Missing", emoji: "❌" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateVerification("tagCondition", option.value)
                    }
                    className={cn(
                      "p-4 rounded-xl border-2 text-center transition-all duration-200",
                      data.verification.tagCondition === option.value
                        ? "border-black bg-gray-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    )}
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vintage (Pre-2005) */}
          {categoryFields.isVintage !== undefined && (
            <div className="p-6 bg-white rounded-2xl border-2 border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-1">
                    Vintage Item (Pre-2005)
                  </label>
                  <p className="text-sm text-gray-500">
                    Items from before 2005 may have different verification
                    requirements
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateVerification(
                      "isVintage",
                      !data.verification.isVintage
                    )
                  }
                  className={cn(
                    "relative inline-flex h-8 w-14 items-center rounded-full transition-colors",
                    data.verification.isVintage ? "bg-black" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-6 w-6 transform rounded-full bg-white transition-transform",
                      data.verification.isVintage
                        ? "translate-x-7"
                        : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              {data.verification.isVintage && (
                <div className="mt-4 animate-in slide-in-from-top-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approximate Year
                  </label>
                  <input
                    type="text"
                    value={data.verification.vintageYear}
                    onChange={(e) =>
                      updateVerification("vintageYear", e.target.value)
                    }
                    placeholder="e.g., 1998, 2002-2003"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none transition-colors"
                  />
                </div>
              )}
            </div>
          )}

          {/* Autograph */}
          {categoryFields.hasAutograph !== undefined && (
            <div className="p-6 bg-white rounded-2xl border-2 border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-1">
                    Has Autograph
                  </label>
                  <p className="text-sm text-gray-500">
                    Item is signed by a player or celebrity
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateVerification(
                      "hasAutograph",
                      !data.verification.hasAutograph
                    )
                  }
                  className={cn(
                    "relative inline-flex h-8 w-14 items-center rounded-full transition-colors",
                    data.verification.hasAutograph ? "bg-black" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-6 w-6 transform rounded-full bg-white transition-transform",
                      data.verification.hasAutograph
                        ? "translate-x-7"
                        : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              {data.verification.hasAutograph && (
                <div className="mt-4 animate-in slide-in-from-top-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autograph Details
                  </label>
                  <textarea
                    value={data.verification.autographDetails}
                    onChange={(e) =>
                      updateVerification("autographDetails", e.target.value)
                    }
                    placeholder="Who signed it? Is it authenticated? Include certificate details..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none transition-colors resize-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Defects */}
          {categoryFields.hasDefects !== undefined && (
            <div className="p-6 bg-white rounded-2xl border-2 border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-1">
                    Has Defects
                  </label>
                  <p className="text-sm text-gray-500">
                    Stains, holes, fading, or other issues
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newValue = !data.verification.hasDefects;
                    updateVerification("hasDefects", newValue);
                    if (newValue && data.verification.defects.length === 0) {
                      addDefect();
                    }
                  }}
                  className={cn(
                    "relative inline-flex h-8 w-14 items-center rounded-full transition-colors",
                    data.verification.hasDefects ? "bg-red-500" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-6 w-6 transform rounded-full bg-white transition-transform",
                      data.verification.hasDefects
                        ? "translate-x-7"
                        : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              {data.verification.hasDefects && (
                <div className="mt-6 space-y-4 animate-in slide-in-from-top-2">
                  {data.verification.defects.map((defect, index) => (
                    <div
                      key={index}
                      className="p-4 bg-red-50 rounded-xl border border-red-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-bold text-red-900">
                          Defect #{index + 1}
                        </span>
                        <button
                          onClick={() => removeDefect(index)}
                          className="p-1 hover:bg-red-200 rounded-lg transition-colors"
                        >
                          <X size={16} className="text-red-600" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={defect.type}
                            onChange={(e) =>
                              updateDefect(index, "type", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-red-200 bg-white focus:border-red-400 focus:outline-none text-sm"
                          >
                            <option value="">Select defect type...</option>
                            {DEFECT_TYPES.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={defect.description}
                            onChange={(e) =>
                              updateDefect(index, "description", e.target.value)
                            }
                            placeholder="Describe the defect location and severity..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-red-200 bg-white focus:border-red-400 focus:outline-none text-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addDefect}
                    className="w-full py-3 px-4 border-2 border-dashed border-red-300 rounded-xl text-red-600 font-medium hover:bg-red-50 hover:border-red-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add Another Defect
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 flex gap-4">
            <AlertCircle
              size={24}
              className="text-blue-600 flex-shrink-0 mt-1"
            />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">
                Why is this important?
              </h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                Accurate verification details help buyers trust your listing and
                improve AI authenticity scoring. Being transparent about defects
                and condition builds credibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
