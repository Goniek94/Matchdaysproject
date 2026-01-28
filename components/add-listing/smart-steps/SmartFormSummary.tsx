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

interface SmartFormSummaryProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  updateAi: (key: string, val: string) => void;
  onNext: () => void;
}

export default function SmartFormSummary({
  data,
  update,
  updateAi,
  onNext,
}: SmartFormSummaryProps) {
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

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 pb-24">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
          <Sparkles size={14} /> Analysis Complete
        </span>
        <h2 className="text-4xl font-black text-gray-900">Review Your Item</h2>
        <p className="text-gray-500 mt-2">
          Our AI has prepared the details. You can edit any field below.
        </p>
      </div>

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
                  key={i}
                  onClick={() => setActiveImage(photo.src)}
                  className={`relative w-24 h-24 rounded-xl flex-shrink-0 overflow-hidden border transition-all duration-200 snap-start ${
                    activeImage === photo.src
                      ? "border-black ring-2 ring-black ring-offset-2 scale-105 shadow-md"
                      : "border-gray-200 hover:border-gray-400 hover:opacity-80 opacity-60"
                  }`}
                >
                  <Image
                    src={photo.src as string}
                    alt={photo.label}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

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
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="w-full lg:w-5/12 space-y-6 sticky top-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100 shadow-xl shadow-blue-100/50">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                  <Sparkles size={12} /> Suggested Valuation
                </span>
                <p className="text-blue-900/60 text-xs font-medium leading-relaxed max-w-[200px]">
                  Based on recent sales of similar items in this condition.
                </p>
              </div>
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
                </div>
                <select
                  value={data.condition}
                  onChange={(e) => update("condition", e.target.value)}
                  className="w-full bg-transparent font-bold text-gray-900 text-right outline-none cursor-pointer focus:text-blue-600"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group"
          >
            Proceed to Pricing{" "}
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

const DetailRow = ({
  icon,
  label,
  value,
  onChange,
  readOnly = false,
  placeholder = "-",
}: any) => (
  <div className="grid grid-cols-[1.5fr_2fr] items-center px-6 py-4 hover:bg-gray-50 transition-colors group">
    <div className="flex items-center gap-3 text-gray-500">
      {icon}
      <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
    </div>
    {readOnly ? (
      <div className="font-bold text-gray-900 text-right truncate">{value}</div>
    ) : (
      <input
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent font-bold text-gray-900 text-right outline-none focus:text-blue-600 transition-colors placeholder:text-gray-300"
      />
    )}
  </div>
);
