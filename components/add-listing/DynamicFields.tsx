"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input, Textarea, Select } from "@/components/ui/form-components";
import { CONDITIONS, ListingFormData } from "./types";
import { AlertTriangle, Camera, X } from "lucide-react";

interface DynamicFieldsProps {
  category: {
    id: string;
    name: string;
    specificFields: {
      id: string;
      label: string;
      type: "text" | "select" | "number";
      options?: string[];
      required: boolean;
      aiDetectable: boolean;
    }[];
  };
  formData: ListingFormData;
  onUpdate: (updates: Partial<ListingFormData>) => void;
}

export default function DynamicFields({
  category,
  formData,
  onUpdate,
}: DynamicFieldsProps) {
  const updateField = (fieldId: string, value: string) => {
    onUpdate({
      specificFields: {
        ...formData.specificFields,
        [fieldId]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Product Details
        </h2>
        <p className="text-gray-600">Fill in detailed product information</p>
      </div>

      {/* Basic Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Information
        </h3>
        <div className="space-y-4">
          <Input
            label="Listing title"
            value={formData.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="E.g. Nike Manchester United Home Jersey 2023/24"
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe the product condition, usage history, etc. in detail"
            rows={6}
            required
          />
        </div>
      </Card>

      {/* Category Specific Fields */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Category Details: {category.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {category.specificFields.map((field) => {
            const value = formData.specificFields[field.id] || "";

            if (field.type === "select" && field.options) {
              return (
                <Select
                  key={field.id}
                  label={field.label}
                  value={value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  options={field.options.map((opt) => ({
                    value: opt,
                    label: opt,
                  }))}
                  required={field.required}
                />
              );
            }

            if (field.type === "number") {
              return (
                <Input
                  key={field.id}
                  type="number"
                  label={field.label}
                  value={value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  required={field.required}
                />
              );
            }

            return (
              <Input
                key={field.id}
                label={field.label}
                value={value}
                onChange={(e) => updateField(field.id, e.target.value)}
                required={field.required}
              />
            );
          })}
        </div>
      </Card>

      {/* Condition */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Product Condition
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select condition <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CONDITIONS.map((condition) => (
                <button
                  key={condition.id}
                  onClick={() => onUpdate({ condition: condition.id })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.condition === condition.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">
                    {condition.label}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {condition.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Defects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Defects and damages (optional)
            </label>
            <Textarea
              value={formData.userNotes}
              onChange={(e) => onUpdate({ userNotes: e.target.value })}
              placeholder="Describe any defects, damages or imperfections..."
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Honest information about defects increases buyer trust
            </p>
          </div>
        </div>
      </Card>

      {/* Shirt-specific fields */}
      {category.id === "shirts" && (
        <>
          {/* Defects Section */}
          <Card className="p-6 border-orange-200 bg-orange-50">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Does the shirt have any defects?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please indicate if there are any visible defects, stains, or
                  damages
                </p>

                {/* Has Defects Toggle */}
                <div className="flex items-center gap-3 mb-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasDefects}
                      onChange={(e) =>
                        onUpdate({ hasDefects: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700">
                    {formData.hasDefects ? "Yes, has defects" : "No defects"}
                  </span>
                </div>

                {/* Defect Photos Upload */}
                {formData.hasDefects && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Add photos of defects{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {formData.defectPhotos.map((photo, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={photo}
                            alt={`Defect ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={() => {
                              const newPhotos = formData.defectPhotos.filter(
                                (_, i) => i !== index
                              );
                              onUpdate({ defectPhotos: newPhotos });
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {formData.defectPhotos.length < 4 && (
                        <div className="relative aspect-square border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 transition-colors cursor-pointer group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const url = event.target?.result as string;
                                  onUpdate({
                                    defectPhotos: [
                                      ...formData.defectPhotos,
                                      url,
                                    ],
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-orange-400 group-hover:text-orange-600">
                            <Camera className="w-6 h-6 mb-1" />
                            <p className="text-xs font-medium">Add photo</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Add up to 4 photos showing the defects clearly
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Serial Code & Tag Condition */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tag Information
            </h3>
            <div className="space-y-4">
              {/* Serial Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial code from small tag (if available)
                </label>
                <Input
                  value={formData.serialCode}
                  onChange={(e) => onUpdate({ serialCode: e.target.value })}
                  placeholder="e.g., 123456789"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usually found on the small tag inside the shirt
                </p>
              </div>

              {/* Tag Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tag condition <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => onUpdate({ tagCondition: "normal" })}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      formData.tagCondition === "normal"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">Normal tag</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Tag is intact and readable
                    </p>
                  </button>

                  <button
                    onClick={() => onUpdate({ tagCondition: "no_tag" })}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      formData.tagCondition === "no_tag"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">No tag</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Shirt has no tag
                    </p>
                  </button>

                  <button
                    onClick={() => onUpdate({ tagCondition: "cut_tag" })}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      formData.tagCondition === "cut_tag"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">Cut tag</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Tag has been cut out
                    </p>
                  </button>

                  <button
                    onClick={() => onUpdate({ tagCondition: "faded_tag" })}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      formData.tagCondition === "faded_tag"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">Faded tag</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Tag is washed out/unreadable
                    </p>
                  </button>

                  <button
                    onClick={() => onUpdate({ tagCondition: "pre_2005" })}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      formData.tagCondition === "pre_2005"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">
                      Pre-2005 shirt
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Vintage shirt from before 2005
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
