"use client";

/**
 * EditListingModal
 *
 * Slide-in panel from the right for editing a listing.
 *
 * Layout:
 *   sticky header → optional lock banner → image manager → scrollable form sections → sticky footer.
 *
 * Lock-after-bid UX (matches backend rule):
 *   When the auction has at least one bid, only description / images / shipping
 *   are editable. Everything else is shown disabled with a banner explaining why,
 *   so sellers understand the constraint instead of getting "Failed to save".
 */

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Lock } from "lucide-react";
import toast from "react-hot-toast";
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

interface EditListingModalProps {
  listing: MyListing;
  onClose: () => void;
  onSave: (id: string, payload: UpdateListingPayload) => Promise<boolean>;
}

export default function EditListingModal({
  listing,
  onClose,
  onSave,
}: EditListingModalProps) {
  const { form, errors, dirty, mode, isEditable, setField, validate } =
    useEditForm(listing);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);

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

    if (Object.keys(payload).length === 0) {
      setFeedback({ kind: "error", message: "Nothing to save — no changes detected." });
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const ok = await onSave(listing.id, payload);
      setSaving(false);

      if (ok) {
        setFeedback({ kind: "success", message: "Changes saved successfully!" });
        // Toast persists outside the modal, so the user still sees the
        // confirmation after the slide-out animation.
        toast.success("Listing updated", { duration: 3000 });
        setTimeout(() => onClose(), 1400);
      } else {
        setFeedback({
          kind: "error",
          message: "Failed to save. Please check the form and try again.",
        });
        toast.error("Could not save changes");
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (err) {
      setSaving(false);
      const msg =
        err instanceof Error ? err.message : "Unexpected error while saving.";
      setFeedback({ kind: "error", message: msg });
      toast.error(msg);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const isLocked = mode === "locked";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div className="fixed right-0 top-0 bottom-0 z-[160] w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* ── Sticky header ────────────────────────────────────────────── */}
        <EditPanelHeader
          listing={listing}
          dirty={dirty}
          saving={saving}
          onClose={onClose}
          onSave={handleSave}
        />

        {/* ── Lock banner ──────────────────────────────────────────────── */}
        {isLocked && (
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-200">
            <div className="flex items-start gap-2.5">
              <Lock
                size={14}
                className="text-amber-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-xs font-black text-amber-800 uppercase tracking-wide">
                  Auction has bids
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5 leading-snug">
                  To stay fair to {listing.bidCount}{" "}
                  {listing.bidCount === 1 ? "bidder" : "bidders"}, only the
                  description, photos and shipping can be edited. Price, item
                  details and timing are locked.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Image manager ────────────────────────────────────────────── */}
        <div className="border-b border-gray-100 bg-white">
          <EditSectionImages
            images={form.images}
            onChange={(next) => setField("images", next)}
            disabled={!isEditable("images")}
            error={errors.images}
          />
        </div>

        {/* ── Scrollable form body ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-6">
            {/* Feedback banner */}
            {feedback?.kind === "success" && (
              <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle2
                  size={18}
                  className="text-emerald-600 flex-shrink-0"
                />
                <p className="text-sm font-bold text-emerald-800">
                  {feedback.message}
                </p>
              </div>
            )}
            {feedback?.kind === "error" && (
              <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                <p className="text-sm font-bold text-red-800">
                  {feedback.message}
                </p>
              </div>
            )}

            {/* Section: Basic info — title locked, description always editable */}
            <section>
              <EditSectionBasic
                form={form}
                errors={errors}
                setField={setField}
                isEditable={isEditable}
              />
            </section>

            <div className="border-t border-gray-100" />

            {/* Section: Item details — fully locked when bidCount > 0 */}
            <section>
              <EditSectionDetails
                form={form}
                setField={setField}
                isEditable={isEditable}
              />
            </section>

            <div className="border-t border-gray-100" />

            {/* Section: Pricing & shipping — pricing locked, shipping always editable */}
            <section>
              <EditSectionPricing
                form={form}
                errors={errors}
                setField={setField}
                isEditable={isEditable}
              />
            </section>
          </div>
        </div>

        {/* ── Sticky footer ────────────────────────────────────────────── */}
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
