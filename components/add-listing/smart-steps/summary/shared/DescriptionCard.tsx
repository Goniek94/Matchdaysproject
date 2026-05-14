"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X, AlignLeft } from "lucide-react";

interface DescriptionCardProps {
  description: string;
  onUpdate?: (value: string) => void;
}

const DescriptionCard = ({ description, onUpdate }: DescriptionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(description);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync draft when description prop changes
  useEffect(() => {
    if (!isEditing) setDraft(description);
  }, [description, isEditing]);

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [draft, isEditing]);

  const handleEdit = () => {
    setDraft(description);
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }, 0);
  };

  const handleConfirm = () => {
    const trimmed = draft.trim();
    if (onUpdate) onUpdate(trimmed);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(description);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleCancel();
    // Ctrl+Enter or Cmd+Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleConfirm();
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <AlignLeft size={14} className="text-gray-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Description
          </span>
        </div>
        {!isEditing && onUpdate && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            title="Edit description"
          >
            <Pencil size={11} />
            Edit
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={6}
              className="w-full text-sm text-gray-700 leading-relaxed bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none transition-all"
              placeholder="Describe your item..."
            />
            <p className="text-[10px] text-gray-400">
              Press{" "}
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px] font-mono">
                Ctrl+Enter
              </kbd>{" "}
              to save or{" "}
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px] font-mono">
                Esc
              </kbd>{" "}
              to cancel
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleConfirm}
                className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-black px-4 py-1.5 rounded-full hover:bg-gray-800 transition-all"
              >
                <Check size={11} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-gray-800 transition-all"
              >
                <X size={11} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p
            className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap text-left cursor-pointer hover:text-gray-800 transition-colors"
            onClick={onUpdate ? handleEdit : undefined}
            title={onUpdate ? "Click to edit description" : undefined}
          >
            {description || (
              <span className="text-gray-400 italic">
                No description provided.
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default DescriptionCard;
