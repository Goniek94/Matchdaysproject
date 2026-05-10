"use client";

/**
 * EditSectionImages
 *
 * Full image manager for the edit-listing panel:
 *   - Add new photos (uploaded to Supabase via uploadListingImages)
 *   - Reorder via native HTML5 drag & drop, or with arrow buttons
 *   - Set any photo as MAIN (moves to index 0)
 *   - Delete (also tries to remove the file from Supabase Storage)
 *
 * The component is purely state-management: changes are written into form.images
 * via setField("images", …). The parent EditListingModal commits everything in
 * one PATCH /auctions/:id call.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ImageIcon,
  Star,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  uploadListingImages,
  deleteListingImages,
} from "@/lib/supabase/supabase";
import { logger } from "@/lib/logger";

const MAX_IMAGES = 12;

interface EditSectionImagesProps {
  images: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  error?: string;
}

export default function EditSectionImages({
  images,
  onChange,
  disabled = false,
  error,
}: EditSectionImagesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // ── Add ──────────────────────────────────────────────────────────────────────
  const handleAddClick = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-uploading the same file
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      setUploadError(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    const accepted = files.slice(0, remainingSlots);

    setUploading(true);
    setUploadError(null);
    try {
      const uploaded = await uploadListingImages(accepted);
      const newUrls = uploaded.map((u) => u.url);
      onChange([...images, ...newUrls]);
    } catch (err) {
      logger.error("Image upload failed", "EditSectionImages", err);
      setUploadError(
        err instanceof Error ? err.message : "Image upload failed",
      );
    } finally {
      setUploading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async (index: number) => {
    if (disabled) return;
    const target = images[index];
    const next = images.filter((_, i) => i !== index);
    onChange(next);
    // Best-effort storage cleanup — never block the UI
    try {
      await deleteListingImages([target]);
    } catch (err) {
      logger.warn(
        "Failed to delete image from storage (continuing)",
        "EditSectionImages",
        err,
      );
    }
  };

  // ── Reorder helpers ──────────────────────────────────────────────────────────
  const move = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const setAsMain = (index: number) => move(index, 0);

  // ── Drag & drop ──────────────────────────────────────────────────────────────
  const onDragStart = (i: number) => (e: React.DragEvent) => {
    if (disabled) return;
    setDragIndex(i);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (i: number) => (e: React.DragEvent) => {
    if (disabled || dragIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(i);
  };
  const onDrop = (i: number) => (e: React.DragEvent) => {
    if (disabled || dragIndex === null) return;
    e.preventDefault();
    move(dragIndex, i);
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const onDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-4">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Photos ({images.length}/{MAX_IMAGES})
        </span>
        <span className="text-[11px] text-gray-400">
          Drag to reorder · first = main
        </span>
      </div>

      {/* Error feedback */}
      {(error || uploadError) && (
        <div className="mx-6 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle
            size={14}
            className="text-red-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-xs font-medium text-red-700">
            {uploadError || error}
          </p>
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && !uploading && (
        <div
          onClick={handleAddClick}
          className={`mx-6 flex flex-col items-center justify-center h-28 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <ImageIcon size={24} className="text-gray-300 mb-1" />
          <p className="text-xs font-bold text-gray-500">Add photos</p>
          <p className="text-[10px] text-gray-400">Click to browse</p>
        </div>
      )}

      {/* Thumbnail strip */}
      {(images.length > 0 || uploading) && (
        <div className="px-6 pb-1">
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {images.map((src, i) => {
              const isMain = i === 0;
              const isDragOver = dragOverIndex === i && dragIndex !== i;
              return (
                <div
                  key={`${src}-${i}`}
                  draggable={!disabled}
                  onDragStart={onDragStart(i)}
                  onDragOver={onDragOver(i)}
                  onDrop={onDrop(i)}
                  onDragEnd={onDragEnd}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    isMain
                      ? "border-amber-400 shadow-md"
                      : "border-gray-200"
                  } ${
                    isDragOver ? "ring-2 ring-blue-500 scale-105" : ""
                  } ${disabled ? "opacity-50" : "cursor-grab active:cursor-grabbing"}`}
                >
                  <Image
                    src={src}
                    alt={`Photo ${i + 1}`}
                    fill
                    className="object-cover pointer-events-none"
                    sizes="(max-width: 640px) 25vw, 20vw"
                    unoptimized
                  />

                  {/* MAIN badge */}
                  {isMain && (
                    <div className="absolute top-1 left-1 flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-400 rounded-md shadow-sm">
                      <Star size={9} fill="white" className="text-white" />
                      <span className="text-[9px] font-black text-white tracking-wider">
                        MAIN
                      </span>
                    </div>
                  )}

                  {/* Position badge */}
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </div>

                  {/* Hover controls */}
                  {!disabled && (
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-center gap-1">
                        {!isMain && (
                          <button
                            type="button"
                            onClick={() => setAsMain(i)}
                            title="Set as main"
                            className="p-1 rounded-md bg-white/90 hover:bg-white text-amber-600"
                          >
                            <Star size={11} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => move(i, i - 1)}
                          disabled={i === 0}
                          title="Move left"
                          className="p-1 rounded-md bg-white/90 hover:bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(i, i + 1)}
                          disabled={i === images.length - 1}
                          title="Move right"
                          className="p-1 rounded-md bg-white/90 hover:bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(i)}
                          title="Delete"
                          className="p-1 rounded-md bg-white/90 hover:bg-white text-red-600"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Upload tile */}
            {!disabled && images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={handleAddClick}
                disabled={uploading}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2
                      size={18}
                      className="text-gray-400 animate-spin"
                    />
                    <span className="text-[10px] font-bold text-gray-500">
                      Uploading…
                    </span>
                  </>
                ) : (
                  <>
                    <Plus size={18} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500">
                      Add
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
}
