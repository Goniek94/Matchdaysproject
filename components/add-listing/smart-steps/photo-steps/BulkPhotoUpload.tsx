"use client";

import { useRef, useState, useCallback, DragEvent } from "react";

import { Upload, X, CheckCircle2, ChevronRight, Image as ImageIcon } from "lucide-react";
import type { SmartFormData, Photo } from "@/types/features/listing.types";
import { cn } from "@/lib/utils";

interface BulkPhotoUploadProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: unknown) => void;
  onNext: () => void;
  onBack: () => void;
}

const PHOTO_HINTS = [
  { icon: "📸", text: "Full front view of the item (laid flat or on a hanger)" },
  { icon: "🔄", text: "Full back view" },
  { icon: "🏷️", text: "Size & washing label (all text must be readable)" },
  { icon: "🔢", text: "Serial / product code tag" },
  { icon: "👟", text: "Brand logo / manufacturer mark" },
  { icon: "🔍", text: "Any defects, wear or damage (if applicable)" },
];

async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function BulkPhotoUpload({
  data,
  update,
  onNext,
  onBack,
}: BulkPhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hashSetRef = useRef<Set<string>>(new Set());

  // Only photos uploaded in bulk mode (type hint starts with "bulk_")
  const bulkPhotos = data.photos.filter((p) => p.typeHint?.startsWith("bulk_"));

  const processFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setIsProcessing(true);

      const newPhotos: Photo[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;

        const hash = await hashFile(file);
        if (hashSetRef.current.has(hash)) continue;
        hashSetRef.current.add(hash);

        await new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const typeHint = `bulk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
            newPhotos.push({
              id: `photo-${Date.now()}-${Math.random()}`,
              url: e.target?.result as string,
              typeHint: typeHint as Photo["typeHint"],
            });
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }

      if (newPhotos.length > 0) {
        update("photos", [...data.photos, ...newPhotos]);
      }

      setIsProcessing(false);
    },
    [data.photos, update],
  );

  const removePhoto = (id: string) => {
    update("photos", data.photos.filter((p) => p.id !== id));
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, i: number) => {
    setDragIndex(i);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, i: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (i !== dropIndex) setDropIndex(i);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, i: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === i) {
      setDragIndex(null);
      setDropIndex(null);
      return;
    }
    const reordered = [...bulkPhotos];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(i, 0, moved);
    const nonBulk = data.photos.filter((p) => !p.typeHint?.startsWith("bulk_"));
    update("photos", [...nonBulk, ...reordered]);
    setDragIndex(null);
    setDropIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDropIndex(null);
  };

  const canContinue = bulkPhotos.length >= 2;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Info card — what to include */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">
          What photos to include
        </h3>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          To verify your listing accurately, please provide clear photos of the
          following. The more you include, the higher your authenticity score.
        </p>
        <ul className="space-y-2">
          {PHOTO_HINTS.map((hint, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="text-base leading-none mt-0.5">{hint.icon}</span>
              <span>{hint.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          processFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 px-6 cursor-pointer transition-all",
          isDragging
            ? "border-black bg-gray-50 scale-[1.01]"
            : "border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
          onChange={(e) => processFiles(e.target.files)}
          className="hidden"
        />
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
          isDragging ? "bg-black" : "bg-gray-100",
        )}>
          <Upload size={28} className={isDragging ? "text-white" : "text-gray-400"} />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-gray-800">
            {isDragging ? "Drop photos here" : "Click or drag photos here"}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            Select multiple at once — JPG, PNG, WEBP
          </p>
        </div>
        {isProcessing && (
          <div className="absolute inset-0 rounded-2xl bg-white/80 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Photo previews */}
      {bulkPhotos.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">
              Uploaded ({bulkPhotos.length})
            </span>
            {bulkPhotos.length >= 2 && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                <CheckCircle2 size={14} />
                Ready to continue
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {bulkPhotos.map((photo, i) => (
              <div
                key={photo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={(e) => handleDrop(e, i)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "relative group aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing transition-all select-none",
                  dragIndex === i && "opacity-40 scale-95",
                  dropIndex === i && dragIndex !== i && "ring-2 ring-black ring-offset-2 scale-[1.03]",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt="uploaded"
                  className="w-full h-full object-cover pointer-events-none"
                />
                {i === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] font-bold text-center py-1 uppercase tracking-widest">
                    Cover
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); removePhoto(photo.id); }}
                  className="absolute top-1.5 right-1.5 p-1.5 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
            {/* Add more tile */}
            <button
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              <ImageIcon size={20} className="text-gray-400" />
              <span className="text-[11px] text-gray-400 font-medium">Add more</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all",
            canContinue
              ? "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed",
          )}
        >
          Continue
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
