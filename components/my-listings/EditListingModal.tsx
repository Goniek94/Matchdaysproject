"use client";

/**
 * EditListingModal
 * Slide-in panel from the right for editing a listing.
 * Layout: sticky header → image strip → scrollable form sections → sticky footer.
 */

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type {
  MyListing,
  UpdateListingPayload,
} from "@/types/features/listings.types";
import {
  useEditForm,
  EditPanelHeader,
  EditSectionBasic,
  EditSectionDetails,
  EditSectionPricing,
  EditSectionImages,
} from "./edit";

// ─── Props ────────────────────────────────────────────────────────────────────

interface EditListingModalProps {
  listing: MyListing;
  onClose: () => void;
  onSave: (id: string, payload: UpdateListingPayload) => Promise<boolean>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditListingModal({
  listing,
  onClose,
  onSave,
}: EditListingModalProps) {
  const { form, errors, dirty, setField, validate } = useEditForm(listing);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSave = async () => {
    const payload = validate();
    if (!payload) return;

    setSaving(true);
    setFeedback(null);

    const ok = await onSave(listing.id, payload);

    setSaving(false);
    setFeedback(ok ? "success" : "error");

    if (ok) {
      setTimeout(() => onClose(), 1400);
    } else {
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div className="fixed right-0 top-0 bottom-0 z-[160] w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* ── Sticky header ─────────────────────────────────────────────── */}
        <EditPanelHeader
          listing={listing}
          dirty={dirty}
          saving={saving}
          onClose={onClose}
          onSave={handleSave}
        />

        {/* ── Image strip (outside scroll, always visible) ──────────────── */}
        <div className="border-b border-gray-100 bg-white">
          <EditSectionImages listing={listing} />
        </div>

        {/* ── Scrollable form body ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-6">
            {/* Feedback banners */}
            {feedback === "success" && (
              <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle2
                  size={18}
                  className="text-emerald-600 flex-shrink-0"
                />
                <p className="text-sm font-bold text-emerald-800">
                  Changes saved successfully!
                </p>
              </div>
            )}
            {feedback === "error" && (
              <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                <p className="text-sm font-bold text-red-800">
                  Failed to save. Please try again.
                </p>
              </div>
            )}

            {/* Section: Basic info */}
            <section>
              <EditSectionBasic
                form={form}
                errors={errors}
                setField={setField}
              />
            </section>

            <div className="border-t border-gray-100" />

            {/* Section: Jersey details */}
            <section>
              <EditSectionDetails form={form} setField={setField} />
            </section>

            <div className="border-t border-gray-100" />

            {/* Section: Pricing & shipping */}
            <section>
              <EditSectionPricing
                listing={listing}
                form={form}
                errors={errors}
                setField={setField}
              />
            </section>
          </div>
        </div>

        {/* ── Sticky footer ─────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
