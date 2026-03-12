"use client";

import { AlertTriangle, BookmarkPlus } from "lucide-react";

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDraft: () => void;
  onDiscard: () => void;
}

/**
 * Modal shown when user tries to leave the photo step.
 * Offers save-as-draft, discard, or continue editing options.
 */
export function ExitModal({
  isOpen,
  onClose,
  onSaveDraft,
  onDiscard,
}: ExitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-center mb-5">
          <div className="p-4 bg-amber-100 rounded-2xl">
            <AlertTriangle size={28} className="text-amber-600" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-gray-900 text-center mb-2">
          Leave this step?
        </h3>
        <p className="text-gray-500 text-center mb-8 text-sm leading-relaxed">
          Your uploaded photos{" "}
          <strong className="text-gray-800">will not be saved</strong>.
          You&apos;ll lose everything added here.
        </p>
        <div className="space-y-3">
          <button
            onClick={onSaveDraft}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all text-sm"
          >
            <BookmarkPlus size={16} /> Save as Draft
          </button>
          <button
            onClick={onDiscard}
            className="w-full px-6 py-3.5 border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all text-sm"
          >
            Leave anyway — discard photos
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-gray-400 rounded-xl font-medium hover:bg-gray-50 transition-all text-xs"
          >
            Continue editing
          </button>
        </div>
      </div>
    </div>
  );
}
