"use client";

/**
 * Edit Listing Page (full-screen)
 *
 * Two-column layout:
 *   LEFT  — large active photo + interactive thumbnail strip
 *           (drag to reorder, click ⭐ to make main, X to delete, + to add)
 *   RIGHT — same form sections used by the slide-in modal:
 *           Basic / Details / Pricing & shipping.
 *
 * Edit-permission mirrors backend lock rule: when an auction has at least one
 * bid, only description / images / shipping fields are editable. The other
 * fields are visibly disabled with a banner explaining why.
 */

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
  Clock,
  Gavel,
  Eye,
  Heart,
  Loader2,
  Star,
  Trash2,
  Plus,
  Lock,
} from "lucide-react";
import { getListing, updateListing } from "@/lib/api/my-listings";
import type { MyListing } from "@/types/features/listings.types";
import {
  useEditForm,
  EditSectionBasic,
  EditSectionDetails,
  EditSectionPricing,
} from "@/components/my-listings/edit";
import {
  uploadListingImages,
  deleteListingImages,
} from "@/lib/supabase/supabase";
import { logger } from "@/lib/logger";

const MAX_IMAGES = 12;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(value: number | null | undefined): string {
  if (!value) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(value);
}

function getTimeLeft(endTime: string): string {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h left`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [listing, setListing] = useState<MyListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);

  // Load listing
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getListing(id)
      .then((res) => {
        if (res.success && res.data) {
          setListing(res.data);
        } else {
          setLoadError("Listing not found.");
        }
      })
      .catch(() => setLoadError("Failed to load listing."))
      .finally(() => setLoading(false));
  }, [id]);

  // Loading / error gates — render before mounting form hook so its `listing`
  // dependency is always defined.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }
  if (loadError || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{loadError ?? "Listing not found."}</p>
        <Link
          href="/my-listings"
          className="text-sm font-bold text-blue-600 hover:underline"
        >
          ← Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <EditListingPageInner
      listing={listing}
      onSavedOptimistic={(next) => setListing(next)}
      saving={saving}
      setSaving={setSaving}
      feedback={feedback}
      setFeedback={setFeedback}
      onBack={() => router.push("/my-listings")}
    />
  );
}

// ─── Inner component (after listing loaded) ───────────────────────────────────

function EditListingPageInner({
  listing,
  onSavedOptimistic,
  saving,
  setSaving,
  feedback,
  setFeedback,
  onBack,
}: {
  listing: MyListing;
  onSavedOptimistic: (next: MyListing) => void;
  saving: boolean;
  setSaving: (v: boolean) => void;
  feedback: { kind: "success" | "error"; message: string } | null;
  setFeedback: (
    f: { kind: "success" | "error"; message: string } | null,
  ) => void;
  onBack: () => void;
}) {
  const { form, errors, dirty, mode, isEditable, setField, validate, reset } =
    useEditForm(listing);

  const isLocked = mode === "locked";
  const canEditImages = isEditable("images");

  // Keep "active image" in sync with form.images so re-ordering updates the canvas
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    if (activeIndex >= form.images.length) {
      setActiveIndex(Math.max(0, form.images.length - 1));
    }
  }, [form.images.length, activeIndex]);

  const activeImage = form.images[activeIndex] ?? null;

  // ── Image manager state ─────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const setImages = (next: string[]) => {
    setField("images", next);
  };

  const move = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || to >= form.images.length) return;
    const next = [...form.images];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setImages(next);
    // Follow the moved image with the active selector for an intuitive UX
    if (activeIndex === from) setActiveIndex(to);
    else if (activeIndex === to) setActiveIndex(from);
  };

  const setAsMain = (index: number) => move(index, 0);

  const handleAddClick = () => {
    if (!canEditImages || uploading) return;
    fileInputRef.current?.click();
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const slots = MAX_IMAGES - form.images.length;
    if (slots <= 0) {
      setImageError(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    setUploading(true);
    setImageError(null);
    try {
      const uploaded = await uploadListingImages(files.slice(0, slots));
      setImages([...form.images, ...uploaded.map((u) => u.url)]);
    } catch (err) {
      logger.error("Image upload failed", "EditListingPage", err);
      setImageError(
        err instanceof Error ? err.message : "Image upload failed",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (index: number) => {
    if (!canEditImages) return;
    if (form.images.length === 1) {
      setImageError("At least one photo is required");
      setTimeout(() => setImageError(null), 2500);
      return;
    }
    const target = form.images[index];
    setImages(form.images.filter((_, i) => i !== index));
    try {
      await deleteListingImages([target]);
    } catch (err) {
      logger.warn(
        "Failed to delete image from storage (continuing)",
        "EditListingPage",
        err,
      );
    }
  };

  // Native HTML5 drag & drop
  const onDragStart = (i: number) => (e: React.DragEvent) => {
    if (!canEditImages) return;
    setDragIndex(i);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (i: number) => (e: React.DragEvent) => {
    if (!canEditImages || dragIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(i);
  };
  const onDrop = (i: number) => (e: React.DragEvent) => {
    if (!canEditImages || dragIndex === null) return;
    e.preventDefault();
    move(dragIndex, i);
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const onDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const payload = validate();
    if (!payload) return;
    if (Object.keys(payload).length === 0) {
      setFeedback({
        kind: "error",
        message: "Nothing to save — no changes detected.",
      });
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const res = await updateListing(listing.id, payload);
      if (res.success && res.data) {
        const updated = res.data;
        onSavedOptimistic(updated);
        reset(updated);
        setFeedback({ kind: "success", message: "Changes saved!" });
        setTimeout(() => setFeedback(null), 2000);
      } else {
        setFeedback({
          kind: "error",
          message: res.message ?? "Failed to save. Please try again.",
        });
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err) {
      setFeedback({
        kind: "error",
        message: err instanceof Error ? err.message : "Unexpected error",
      });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const bidCount = listing._count?.bids ?? listing.bidCount ?? 0;
  const favCount = listing._count?.favorites ?? listing.favoritesCount ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-[1600px] mx-auto px-6 xl:px-10">
        {/* ── Top bar ────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="min-w-0">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-1.5 uppercase tracking-wider"
            >
              <ArrowLeft size={14} />
              Back to My Listings
            </button>
            <h1 className="text-2xl xl:text-3xl font-black text-gray-900 leading-tight truncate">
              Edit · {listing.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href={`/auction/${listing.id}`}
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors bg-white"
            >
              <ExternalLink size={14} />
              View Live
            </Link>
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>

        {/* ── Lock banner ───────────────────────────────────────────────── */}
        {isLocked && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-amber-50 border border-amber-200 rounded-2xl">
            <Lock size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-amber-800 uppercase tracking-wide">
                Auction has bids — limited edit
              </p>
              <p className="text-xs text-amber-700 mt-1 leading-snug">
                To stay fair to {bidCount} {bidCount === 1 ? "bidder" : "bidders"},
                only the description, photos and shipping can be changed. Title,
                price, item details and timing are locked.
              </p>
            </div>
          </div>
        )}

        {/* ── Feedback banners ──────────────────────────────────────────── */}
        {feedback?.kind === "success" && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <CheckCircle2
              size={20}
              className="text-emerald-600 flex-shrink-0"
            />
            <p className="text-sm font-bold text-emerald-800">
              {feedback.message}
            </p>
          </div>
        )}
        {feedback?.kind === "error" && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <p className="text-sm font-bold text-red-800">{feedback.message}</p>
          </div>
        )}

        {/* ── Main 2-column layout ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* ── LEFT: Image manager + summary (7/12 ≈ 58%) ────────────── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active photo */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={listing.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <ImageIcon size={48} className="text-gray-300" />
                  <p className="text-xs font-bold text-gray-400">
                    No photos yet
                  </p>
                </div>
              )}

              {activeImage && activeIndex === 0 && (
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-amber-400 rounded-lg shadow-md">
                  <Star size={11} fill="white" className="text-white" />
                  <span className="text-[11px] font-black text-white tracking-widest">
                    MAIN
                  </span>
                </div>
              )}
            </div>

            {/* Image error */}
            {imageError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-xs font-bold text-red-700">{imageError}</p>
              </div>
            )}

            {/* Thumbnail strip */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  Photos ({form.images.length}/{MAX_IMAGES})
                </span>
                {canEditImages && (
                  <span className="text-[11px] text-gray-400">
                    Drag to reorder · click ⭐ to set main
                  </span>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {form.images.map((src, i) => {
                  const isMain = i === 0;
                  const isActive = i === activeIndex;
                  const isDragOver = dragOverIndex === i && dragIndex !== i;

                  return (
                    <div
                      key={`${src}-${i}`}
                      draggable={canEditImages}
                      onDragStart={onDragStart(i)}
                      onDragOver={onDragOver(i)}
                      onDrop={onDrop(i)}
                      onDragEnd={onDragEnd}
                      onClick={() => setActiveIndex(i)}
                      className={`group relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isActive
                          ? "border-black shadow-md"
                          : isMain
                            ? "border-amber-400"
                            : "border-gray-200 hover:border-gray-400"
                      } ${
                        isDragOver ? "ring-2 ring-blue-500 scale-105" : ""
                      } ${canEditImages ? "active:cursor-grabbing" : "cursor-pointer"}`}
                    >
                      <Image
                        src={src}
                        alt={`Photo ${i + 1}`}
                        fill
                        className="object-cover pointer-events-none"
                        sizes="96px"
                        unoptimized
                      />

                      {/* Position badge */}
                      <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/70 text-white text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </div>

                      {/* MAIN badge */}
                      {isMain && (
                        <div className="absolute bottom-0 left-0 right-0 bg-amber-400 text-white text-[9px] font-black text-center py-0.5 tracking-widest">
                          MAIN
                        </div>
                      )}

                      {/* Hover controls */}
                      {canEditImages && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                          {!isMain && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAsMain(i);
                              }}
                              title="Set as main"
                              className="p-1.5 rounded-md bg-amber-400 hover:bg-amber-500 text-white shadow"
                            >
                              <Star size={12} fill="white" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(i);
                            }}
                            title="Delete"
                            className="p-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white shadow"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Upload tile */}
                {canEditImages && form.images.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={handleAddClick}
                    disabled={uploading}
                    className="flex-shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50"
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
                        <Plus size={20} className="text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-500">
                          Add photo
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
            </div>

            {/* Listing summary card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-gray-900 leading-tight">
                    {form.title || listing.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {form.team || listing.team} · {form.season || listing.season} ·{" "}
                    {form.size || listing.size}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {listing.featured && (
                    <span className="px-2 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-black rounded-full uppercase">
                      Featured
                    </span>
                  )}
                  {listing.rare && (
                    <span className="px-2 py-0.5 bg-purple-500 text-white text-[10px] font-black rounded-full uppercase">
                      Rare
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-1.5">
                  <Gavel size={14} />
                  <span className="font-semibold">{bidCount} bids</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye size={14} />
                  <span className="font-semibold">
                    {listing.views ?? 0} views
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <Heart size={13} />
                  <span className="font-semibold">{favCount}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto text-amber-600">
                  <Clock size={14} />
                  <span className="font-semibold text-xs">
                    {listing.status === "active"
                      ? getTimeLeft(listing.endTime)
                      : listing.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                    {listing.listingType === "buy_now"
                      ? "Buy Now"
                      : "Starting Bid"}
                  </p>
                  <p className="text-2xl font-black text-gray-900">
                    {formatPrice(
                      listing.listingType === "buy_now"
                        ? (listing.buyNowPrice ?? listing.startingBid)
                        : listing.startingBid,
                    )}
                  </p>
                </div>
                {listing.currentBid > 0 &&
                  listing.listingType !== "buy_now" && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                        Current Bid
                      </p>
                      <p className="text-xl font-black text-emerald-600">
                        {formatPrice(listing.currentBid)}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Edit form (5/12 ≈ 42%) ─────────────────────────── */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <EditSectionBasic
                form={form}
                errors={errors}
                setField={setField}
                isEditable={isEditable}
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <EditSectionDetails
                form={form}
                setField={setField}
                isEditable={isEditable}
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <EditSectionPricing
                form={form}
                errors={errors}
                setField={setField}
                isEditable={isEditable}
              />
            </div>

            <div className="flex gap-3 sticky bottom-4 z-20 bg-white p-3 rounded-2xl border border-gray-200 shadow-xl">
              <button
                onClick={onBack}
                className="flex-1 py-3 text-center border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !dirty}
                className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
