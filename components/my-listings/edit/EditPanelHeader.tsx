"use client";

/**
 * EditPanelHeader
 * Sticky header for the edit listing slide-in panel
 */

import { X, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { MyListing } from "@/types/features/listings.types";

interface EditPanelHeaderProps {
  listing: MyListing;
  dirty: boolean;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function EditPanelHeader({
  listing,
  dirty,
  saving,
  onClose,
  onSave,
}: EditPanelHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
      {/* Left: close + title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
          title="Close"
        >
          <X size={20} className="text-gray-600" />
        </button>
        <div className="min-w-0">
          <h2 className="text-base font-black text-gray-900 uppercase tracking-tight leading-tight">
            Edit Listing
          </h2>
          <p className="text-xs text-gray-400 truncate max-w-[180px]">
            {listing.title}
          </p>
        </div>
      </div>

      {/* Right: view + save */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={`/auction/${listing.id}`}
          target="_blank"
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          title="View listing"
        >
          <ExternalLink size={16} className="text-gray-500" />
        </Link>

        <button
          onClick={onSave}
          disabled={saving || !dirty}
          className="px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
