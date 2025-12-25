// components/add-listing/smart-steps/SmartFormUI.tsx

import { useRef } from "react";
import Image from "next/image";
import { Camera, Edit3, Check, Plus } from "lucide-react";

// --- SECTION HEADER (Mniejszy padding, bardziej skupiony) ---
export const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-gray-500 font-medium text-sm">{subtitle}</p>
    )}
  </div>
);

// --- MODERN PHOTO BOX ---
interface PhotoBoxProps {
  label: string;
  subLabel?: string;
  imageUrl: string | null;
  onUpload: (url: string) => void;
  optional?: boolean;
}

export const PhotoBox = ({
  label,
  subLabel,
  imageUrl,
  onUpload,
  optional = false,
}: PhotoBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => !imageUrl && inputRef.current?.click()}
      className={`relative w-full aspect-[4/5] rounded-xl cursor-pointer transition-all duration-200 group overflow-hidden ${
        imageUrl
          ? "bg-white shadow-sm border border-gray-200"
          : "bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-100"
      }`}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) =>
          e.target.files?.[0] &&
          onUpload(URL.createObjectURL(e.target.files[0]))
        }
      />

      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt={label}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Edit3 size={12} /> Change
            </button>
          </div>

          {/* Status Icon */}
          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-sm">
            <Check size={12} strokeWidth={3} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-3 text-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm text-gray-400 group-hover:text-black transition-colors">
            {optional ? <Plus size={18} /> : <Camera size={18} />}
          </div>
          <span className="font-bold text-gray-900 text-xs mb-0.5">
            {label}
          </span>
          <span className="text-[10px] text-gray-400 leading-tight px-1">
            {subLabel}
          </span>
          {optional && (
            <span className="absolute top-2 right-2 text-[9px] font-bold text-gray-300 uppercase tracking-wider">
              Optional
            </span>
          )}
        </div>
      )}

      {/* Label Overlay when filled */}
      {imageUrl && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-1.5 px-2 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-900 truncate text-center uppercase tracking-wide">
            {label}
          </p>
        </div>
      )}
    </div>
  );
};
