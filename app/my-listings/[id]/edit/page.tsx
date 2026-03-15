"use client";

/**
 * Edit Listing Page
 * Full-page edit view for a single listing.
 * Layout mirrors SmartFormSummary: left column = image gallery + listing info,
 * right column = editable form fields.
 */

import { useState, useEffect } from "react";
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
  Tag,
  Gavel,
  Eye,
  Heart,
  Loader2,
} from "lucide-react";
import { getListing, updateListing } from "@/lib/api/my-listings";
import type {
  MyListing,
  UpdateListingPayload,
} from "@/types/features/listings.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(value: number | null | undefined): string {
  if (!value) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
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

  // Listing data
  const [listing, setListing] = useState<MyListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active image in gallery
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<UpdateListingPayload>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);

  // Field errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // ── Load listing ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getListing(id)
      .then((res) => {
        if (res.success && res.data) {
          const l = res.data;
          setListing(l);
          setActiveImage(l.images?.[0] ?? null);
          // Pre-fill form with current values
          setForm({
            title: l.title,
            description: l.description,
            size: l.size,
            condition: l.condition,
            playerName: l.playerName ?? "",
            playerNumber: l.playerNumber ?? "",
            buyNowPrice: l.buyNowPrice ?? undefined,
            shippingCost: l.shippingCost,
            shippingTime: l.shippingTime,
            shippingFrom: l.shippingFrom,
          });
        } else {
          setError("Listing not found.");
        }
      })
      .catch(() => setError("Failed to load listing."))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Field setter ────────────────────────────────────────────────────────────
  const setField = <K extends keyof UpdateListingPayload>(
    key: K,
    value: UpdateListingPayload[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // ── Validate ────────────────────────────────────────────────────────────────
  const validate = (): UpdateListingPayload | null => {
    const errs: Record<string, string> = {};
    if (!form.title?.trim()) errs.title = "Title is required";
    if ((form.title?.length ?? 0) > 120) errs.title = "Max 120 characters";
    if (!form.description?.trim()) errs.description = "Description is required";
    if ((form.description?.length ?? 0) > 2000)
      errs.description = "Max 2000 characters";
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return null;
    }
    return form;
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const payload = validate();
    if (!payload || !listing) return;

    setSaving(true);
    setFeedback(null);

    try {
      const res = await updateListing(listing.id, payload);
      if (res.success) {
        setFeedback("success");
        setDirty(false);
        setTimeout(() => router.push("/my-listings"), 1400);
      } else {
        setFeedback("error");
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      setFeedback("error");
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  // ── Loading / Error states ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{error ?? "Listing not found."}</p>
        <Link
          href="/my-listings"
          className="text-sm font-bold text-blue-600 hover:underline"
        >
          ← Back to My Listings
        </Link>
      </div>
    );
  }

  const images = listing.images ?? [];
  const bidCount = listing._count?.bids ?? listing.bidCount ?? 0;
  const favCount = listing._count?.favorites ?? listing.favoritesCount ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/my-listings"
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              My Listings
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-bold text-gray-900 truncate max-w-xs">
              {listing.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/auction/${listing.id}`}
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ExternalLink size={14} />
              View Live
            </Link>
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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

        {/* ── Feedback banners ─────────────────────────────────────────────── */}
        {feedback === "success" && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <CheckCircle2
              size={20}
              className="text-emerald-600 flex-shrink-0"
            />
            <p className="text-sm font-bold text-emerald-800">
              Changes saved! Redirecting…
            </p>
          </div>
        )}
        {feedback === "error" && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <p className="text-sm font-bold text-red-800">
              Failed to save. Please try again.
            </p>
          </div>
        )}

        {/* ── Main 2-column layout ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* ── LEFT: Gallery + Listing info (3/5) ─────────────────────────── */}
          <div className="lg:col-span-3 space-y-5">
            {/* Main image */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={listing.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-300" />
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(src)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === src
                        ? "border-gray-900 shadow-md"
                        : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Image ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] font-black text-center py-0.5 tracking-widest">
                        MAIN
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Listing summary card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-gray-900 leading-tight">
                    {listing.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {listing.team} · {listing.season} · {listing.size}
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

              {/* Stats row */}
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

              {/* Price */}
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

          {/* ── RIGHT: Edit form (2/5) ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-24">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Basic Info
              </h3>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title ?? ""}
                  onChange={(e) => setField("title", e.target.value)}
                  maxLength={120}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-black/10 ${
                    fieldErrors.title
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-gray-400"
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {fieldErrors.title ? (
                    <p className="text-xs text-red-500">{fieldErrors.title}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-xs text-gray-400 ml-auto">
                    {(form.title ?? "").length}/120
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description ?? ""}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={6}
                  maxLength={2000}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-black/10 resize-none ${
                    fieldErrors.description
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-gray-400"
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {fieldErrors.description ? (
                    <p className="text-xs text-red-500">
                      {fieldErrors.description}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p className="text-xs text-gray-400 ml-auto">
                    {(form.description ?? "").length}/2000
                  </p>
                </div>
              </div>
            </div>

            {/* Jersey Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Jersey Details
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Size
                  </label>
                  <select
                    value={form.size ?? ""}
                    onChange={(e) => setField("size", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all bg-white"
                  >
                    <option value="">Select size</option>
                    {[
                      "XS",
                      "S",
                      "M",
                      "L",
                      "XL",
                      "XXL",
                      "XXXL",
                      "Youth S",
                      "Youth M",
                      "Youth L",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Condition
                  </label>
                  <select
                    value={form.condition ?? ""}
                    onChange={(e) => setField("condition", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all bg-white"
                  >
                    <option value="">Select condition</option>
                    {[
                      "New with tags",
                      "New without tags",
                      "Excellent",
                      "Good",
                      "Fair",
                      "Poor",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Player Name
                  </label>
                  <input
                    type="text"
                    value={form.playerName ?? ""}
                    onChange={(e) =>
                      setField("playerName", e.target.value || null)
                    }
                    placeholder="e.g. Beckham"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Player Number
                  </label>
                  <input
                    type="text"
                    value={form.playerNumber ?? ""}
                    onChange={(e) =>
                      setField("playerNumber", e.target.value || null)
                    }
                    placeholder="e.g. 7"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Shipping */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Pricing & Shipping
              </h3>

              {/* Starting bid (read-only) */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Starting Bid
                </span>
                <span className="text-sm font-black text-gray-900">
                  £{Number(listing.startingBid).toFixed(2)}
                </span>
              </div>

              {/* Buy Now Price (only for non-auction) */}
              {listing.listingType !== "auction" && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Buy Now Price (£)
                  </label>
                  <input
                    type="number"
                    value={form.buyNowPrice ?? ""}
                    onChange={(e) =>
                      setField(
                        "buyNowPrice",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
              )}

              {/* Shipping */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Shipping Cost (£)
                  </label>
                  <input
                    type="number"
                    value={form.shippingCost ?? ""}
                    onChange={(e) =>
                      setField("shippingCost", Number(e.target.value))
                    }
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Est. Delivery Time
                  </label>
                  <input
                    type="text"
                    value={form.shippingTime ?? ""}
                    onChange={(e) => setField("shippingTime", e.target.value)}
                    placeholder="3-5 business days"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Ships From
                </label>
                <input
                  type="text"
                  value={form.shippingFrom ?? ""}
                  onChange={(e) => setField("shippingFrom", e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Link
                href="/my-listings"
                className="flex-1 py-3 text-center border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
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
