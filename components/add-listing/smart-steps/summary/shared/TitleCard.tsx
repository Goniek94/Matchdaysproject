"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Pencil, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CompletionMode } from "@/types/features/listing.types";

interface TitleCardProps {
  title: string;
  completionMode: CompletionMode;
  onUpdate?: (value: string) => void;
}

const TitleCard = ({ title, completionMode, onUpdate }: TitleCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync draft when title prop changes (e.g. after AI re-run)
  useEffect(() => {
    if (!isEditing) setDraft(title);
  }, [title, isEditing]);

  const handleEdit = () => {
    setDraft(title);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleConfirm = () => {
    const trimmed = draft.trim();
    if (trimmed && onUpdate) onUpdate(trimmed);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div className="group flex items-start justify-between gap-3">
      {isEditing ? (
        /* ── Edit mode ── */
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-2xl font-extrabold text-gray-900 leading-tight tracking-tight bg-transparent border-b-2 border-primary outline-none pb-1 transition-all"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleConfirm}
              className="flex items-center gap-1 text-[11px] font-bold text-white bg-black px-3 py-1 rounded-full hover:bg-gray-800 transition-all"
            >
              <Check size={11} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-800 transition-all"
            >
              <X size={11} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* ── View mode ── */
        <h2
          className="flex-1 text-2xl font-extrabold text-gray-900 leading-tight tracking-tight cursor-pointer hover:text-gray-700 transition-colors"
          onClick={onUpdate ? handleEdit : undefined}
          title={onUpdate ? "Click to edit title" : undefined}
        >
          {title || "Untitled Listing"}
        </h2>
      )}

      {/* Badges / edit button */}
      {!isEditing && (
        <div className="flex items-center gap-2 shrink-0 mt-1">
          {completionMode === "AI" && (
            <Badge
              variant="outline"
              className="text-[10px] bg-primary/5 border-primary/20 text-primary gap-1"
            >
              <Sparkles size={9} />
              AI
            </Badge>
          )}
          {onUpdate && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              title="Edit title"
            >
              <Pencil size={11} />
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TitleCard;
