"use client";

import { SmartFormData } from "./types";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";

interface SmartFormSummaryProps {
  data: SmartFormData;
  onPublish: () => void;
  onBack: () => void;
}

export default function SmartFormSummary({
  data,
  onPublish,
  onBack,
}: SmartFormSummaryProps) {
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    await onPublish();
    setIsPublishing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
          <CheckCircle2 size={14} /> Ready to Publish
        </div>
        <h2 className="text-4xl font-black text-gray-900">Final Review</h2>
        <p className="text-gray-500 mt-2">Check everything before going live</p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-6">
        {/* Photos preview */}
        {data.photos.length > 0 && (
          <div className="flex gap-3 p-6 border-b border-gray-100 overflow-x-auto">
            {data.photos
              .filter((p) => p.url)
              .slice(0, 6)
              .map((photo, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100"
                >
                  <img
                    src={photo.url}
                    alt={photo.typeHint || `photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>
        )}

        {/* Title */}
        <div className="px-8 py-6 border-b border-gray-100">
          <p className="text-xs font-bold uppercase text-gray-400 mb-1">
            Title
          </p>
          <p className="text-2xl font-black text-gray-900">
            {data.title || "—"}
          </p>
        </div>

        {/* Description */}
        <div className="px-8 py-6 border-b border-gray-100">
          <p className="text-xs font-bold uppercase text-gray-400 mb-1">
            Description
          </p>
          <p className="text-gray-700 leading-relaxed">
            {data.description || "—"}
          </p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-gray-100">
          {[
            { label: "Category", value: data.categorySlug },
            { label: "Brand", value: data.brand },
            { label: "Club / Team", value: data.club },
            { label: "Season", value: data.season },
            { label: "Model", value: data.model },
            { label: "Size", value: data.size },
            { label: "Condition", value: data.condition },
            { label: "Tag Condition", value: data.verification?.tagCondition },
            { label: "Photos", value: `${data.photos.length} uploaded` },
          ].map((item, i) => (
            <div key={i} className="px-6 py-4">
              <p className="text-xs font-bold uppercase text-gray-400 mb-1">
                {item.label}
              </p>
              <p className="font-bold text-gray-900">{item.value || "—"}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
          <p className="text-xs font-bold uppercase text-gray-400 mb-3">
            Pricing
          </p>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="font-bold text-gray-900 capitalize">
                {data.listingType === "buy_now" ? "Buy Now" : "Auction"}
              </p>
            </div>
            {data.listingType === "buy_now" ? (
              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="text-2xl font-black text-gray-900">
                  €{data.price || "—"}
                </p>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-xs text-gray-500">Starting bid</p>
                  <p className="text-2xl font-black text-gray-900">
                    €{data.startPrice || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-bold text-gray-900">{data.duration}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
        >
          Back
        </button>

        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex items-center gap-2 px-12 py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50 group"
        >
          {isPublishing ? "Publishing..." : "Publish Listing"}
          {!isPublishing && (
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          )}
        </button>
      </div>
    </div>
  );
}
