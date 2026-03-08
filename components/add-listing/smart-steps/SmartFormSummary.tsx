<<<<<<< HEAD
"use client";

import { SmartFormData } from "./types";
import { CheckCircle2, ArrowRight } from "lucide-react";
=======
// components/add-listing/smart-steps/SmartFormSummary.tsx
import { useState, useEffect } from "react";
import {
  Sparkles,
  Edit3,
  CheckCircle2,
  Shirt,
  Tag,
  Trophy,
  Layers,
  Activity,
  Image as ImageIcon,
  CalendarDays,
  Ruler,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { SmartFormData, CONDITIONS } from "./types";
>>>>>>> b4a964b208ac84352bb983237b815715e12e3b10

interface SmartFormSummaryProps {
  data: SmartFormData;
  onPublish: () => void;
  onBack: () => void;
  isPublishing: boolean; // ← dodane
}

export default function SmartFormSummary({
  data,
  onPublish,
  onBack,
  isPublishing, // ← z parenta, nie lokalny state
}: SmartFormSummaryProps) {
<<<<<<< HEAD
  // ← usunięty lokalny useState i handlePublish
=======
  const [activeImage, setActiveImage] = useState<string | null>(null);
  
  // Cast data to any to access properties that may not be in the type definition
  const formData = data as any;

  useEffect(() => {
    const frontPhoto = data.photos.find((p: any) => p.typeHint === 'front_far' || p.typeHint === 'front_close');
    if (frontPhoto?.url) {
      setActiveImage(frontPhoto.url);
    }
  }, [data.photos]);

  const frontPhoto = data.photos.find((p: any) => p.typeHint === 'front_far' || p.typeHint === 'front_close');
  const backPhoto = data.photos.find((p: any) => p.typeHint === 'back_far' || p.typeHint === 'back_close');
  const neckTagPhoto = data.photos.find((p: any) => p.typeHint === 'size_tag' || p.typeHint === 'neck_label');

  const allPhotos = [
    { src: frontPhoto?.url, label: "Front" },
    { src: backPhoto?.url, label: "Back" },
    { src: neckTagPhoto?.url, label: "Tag" },
    ...(formData.galleryPhotos || []).map((src: string, i: number) => ({
      src,
      label: `Extra ${i + 1}`,
    })),
  ].filter((item) => item.src !== null && item.src !== undefined);
>>>>>>> b4a964b208ac84352bb983237b815715e12e3b10

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
          <CheckCircle2 size={14} /> Ready to Publish
        </div>
        <h2 className="text-4xl font-black text-gray-900">Final Review</h2>
        <p className="text-gray-500 mt-2">Check everything before going live</p>
      </div>

<<<<<<< HEAD
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-6">
        {data.photos.length > 0 && (
          <div className="flex gap-3 p-6 border-b border-gray-100 overflow-x-auto">
            {data.photos
              .filter((p) => p.url)
              .slice(0, 6)
              .map((photo, i) => (
                <div
=======
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* --- LEFT COLUMN --- */}
        <div className="w-full lg:w-7/12 space-y-8">
          <div className="group relative">
            <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">
              Listing Title
            </label>
            <textarea
              value={formData.aiGenerated?.title || ''}
              onChange={(e: any) => updateAi("title", e.target.value)}
              className="w-full text-3xl font-black text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-black outline-none resize-none overflow-hidden leading-tight transition-all placeholder:text-gray-300"
              rows={2}
              placeholder="e.g. Authentic FC Barcelona Shirt..."
            />
            <Edit3
              className="absolute top-8 right-0 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              size={20}
            />
          </div>

          <div className="aspect-[4/3] w-full rounded-[2rem] overflow-hidden relative shadow-2xl bg-gray-100 border border-gray-100 group">
            {activeImage ? (
              <Image
                src={activeImage}
                alt="Main view"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <ImageIcon size={48} className="opacity-20" />
                <span className="text-sm font-medium">No image selected</span>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
              <span className="text-gray-900 font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                <ImageIcon size={14} /> Preview Mode
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x">
              {allPhotos.map((photo, i) => (
                <button
>>>>>>> b4a964b208ac84352bb983237b815715e12e3b10
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

<<<<<<< HEAD
        <div className="px-8 py-6 border-b border-gray-100">
          <p className="text-xs font-bold uppercase text-gray-400 mb-1">
            Title
          </p>
          <p className="text-2xl font-black text-gray-900">
            {data.title || "—"}
          </p>
=======
          <div className="group relative pt-2 border-t border-gray-100">
            <label className="text-[10px] font-bold uppercase text-gray-400 mb-4 block">
              Description
            </label>
            <textarea
              value={formData.aiGenerated?.description || ''}
              onChange={(e: any) => updateAi("description", e.target.value)}
              className="w-full min-h-[200px] bg-white rounded-2xl p-6 text-gray-600 leading-relaxed border border-gray-100 focus:border-black focus:ring-1 focus:ring-black outline-none resize-y transition-all shadow-sm"
            />
          </div>
>>>>>>> b4a964b208ac84352bb983237b815715e12e3b10
        </div>

        <div className="px-8 py-6 border-b border-gray-100">
          <p className="text-xs font-bold uppercase text-gray-400 mb-1">
            Description
          </p>
          <p className="text-gray-700 leading-relaxed">
            {data.description || "—"}
          </p>
        </div>

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
<<<<<<< HEAD
            ) : (
              <>
                <div>
                  <p className="text-xs text-gray-500">Starting bid</p>
                  <p className="text-2xl font-black text-gray-900">
                    €{data.startPrice || "—"}
                  </p>
=======
            </div>
            <div className="text-4xl font-black text-blue-700 tracking-tight mt-4">
              {formData.aiGenerated?.estimatedValue || "Calculating..."}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden">
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                Item Specifics
              </h3>
            </div>

            <div className="divide-y divide-gray-100">
              <DetailRow
                icon={<Layers size={16} />}
                label="Category"
                value={data.category}
                readOnly
              />
              <DetailRow
                icon={<Tag size={16} />}
                label="Brand"
                value={formData.aiGenerated?.brand || ''}
                onChange={(val: any) => updateAi("brand", val)}
              />
              <DetailRow
                icon={<Trophy size={16} />}
                label="Team / Club"
                value={formData.aiGenerated?.team || ''}
                onChange={(val: any) => updateAi("team", val)}
              />
              <DetailRow
                icon={<CalendarDays size={16} />}
                label="Season"
                value={formData.aiGenerated?.year || ''}
                onChange={(val: any) => updateAi("year", val)}
              />
              <DetailRow
                icon={<Shirt size={16} />}
                label="Model"
                value={formData.aiGenerated?.model || ''}
                onChange={(val: any) => updateAi("model", val)}
              />
              <DetailRow
                icon={<Ruler size={16} />}
                label="Dimensions"
                value={formData.aiGenerated?.dimensions || ''}
                onChange={(val: any) => updateAi("dimensions", val)}
                placeholder="Optional"
              />
              <div className="grid grid-cols-[1.5fr_2fr] items-center px-6 py-4 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3 text-gray-500">
                  <Activity size={16} />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    Condition
                  </span>
>>>>>>> b4a964b208ac84352bb983237b815715e12e3b10
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

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={isPublishing}
          className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          Back
        </button>

        <button
          onClick={onPublish}
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
