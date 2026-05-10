"use client";

/**
 * RelistAuctionModal
 *
 * Two relist modes via a tab switch:
 *
 *   1. Quick — just pick listing type + duration + prices. Everything else
 *      (photos, item details, shipping) is copied verbatim from the previous run.
 *
 *   2. Full edit — opens the same panel as Edit Listing so the seller can fix
 *      anything (title, description, item details, photos, shipping, …) while
 *      they're at it. The first save publishes the relisted auction.
 *
 * The backend RelistAuctionDto accepts the union of both modes, so we always
 * post to the same endpoint.
 */

import { useState } from "react";
import {
  X,
  RefreshCw,
  Gavel,
  ShoppingCart,
  Layers,
  Clock,
  Pencil,
  Zap,
} from "lucide-react";
import type { MyListing } from "@/types/features/listings.types";
import {
  useEditForm,
  EditSectionBasic,
  EditSectionDetails,
  EditSectionPricing,
  EditSectionImages,
} from "./edit";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RelistPayload {
  endTime: string;
  startTime?: string;
  listingType?: "auction" | "buy_now" | "auction_buy_now";
  startingBid?: number;
  buyNowPrice?: number | null;
  bidIncrement?: number;
  // Optional structural overrides — used by Full Edit mode
  title?: string;
  description?: string;
  images?: string[];
  category?: string;
  itemType?: string;
  league?: string;
  team?: string;
  season?: string;
  size?: string;
  sizeEU?: string;
  sizeUK?: string;
  condition?: string;
  tagCondition?: string;
  manufacturer?: string;
  model?: string;
  countryOfProduction?: string;
  productionYear?: string;
  serialCode?: string;
  playerName?: string | null;
  playerNumber?: string | null;
  hasAutograph?: boolean;
  autographDetails?: string;
  isVintage?: boolean;
  vintageYear?: string;
  shippingCost?: number;
  shippingTime?: string;
  shippingFrom?: string;
}

interface RelistAuctionModalProps {
  listing: MyListing;
  onClose: () => void;
  onRelist: (id: string, payload: RelistPayload) => Promise<boolean>;
}

type Mode = "quick" | "full";

// ─── Static options ───────────────────────────────────────────────────────────

const DURATION_OPTIONS = [
  { label: "1 day", days: 1 },
  { label: "3 days", days: 3 },
  { label: "5 days", days: 5 },
  { label: "7 days", days: 7 },
  { label: "14 days", days: 14 },
  { label: "30 days", days: 30 },
];

const LISTING_TYPES = [
  {
    id: "auction" as const,
    label: "Auction",
    description: "Buyers place bids, highest wins",
    icon: <Gavel size={18} />,
  },
  {
    id: "buy_now" as const,
    label: "Buy Now",
    description: "Fixed price, instant purchase",
    icon: <ShoppingCart size={18} />,
  },
  {
    id: "auction_buy_now" as const,
    label: "Auction + Buy Now",
    description: "Both bidding and instant purchase",
    icon: <Layers size={18} />,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RelistAuctionModal({
  listing,
  onClose,
  onRelist,
}: RelistAuctionModalProps) {
  const [mode, setMode] = useState<Mode>("quick");

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <RefreshCw size={18} className="text-emerald-700" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-black text-gray-900">Relist Auction</h2>
              <p className="text-xs text-gray-500 truncate">{listing.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="px-4 pt-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("quick")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 transition-all ${
                mode === "quick"
                  ? "border-black text-black bg-gray-50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Zap size={14} />
              Quick relist
            </button>
            <button
              onClick={() => setMode("full")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 transition-all ${
                mode === "full"
                  ? "border-black text-black bg-gray-50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Pencil size={14} />
              Full edit
            </button>
          </div>
        </div>

        {/* Body */}
        {mode === "quick" ? (
          <QuickRelistBody
            listing={listing}
            onClose={onClose}
            onRelist={onRelist}
          />
        ) : (
          <FullRelistBody
            listing={listing}
            onClose={onClose}
            onRelist={onRelist}
          />
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// QUICK MODE — duration + listing type + prices only
// ═════════════════════════════════════════════════════════════════════════════

function QuickRelistBody({
  listing,
  onClose,
  onRelist,
}: {
  listing: MyListing;
  onClose: () => void;
  onRelist: (id: string, payload: RelistPayload) => Promise<boolean>;
}) {
  const [listingType, setListingType] = useState<
    "auction" | "buy_now" | "auction_buy_now"
  >(listing.listingType ?? "auction");
  const [durationDays, setDurationDays] = useState(7);
  const [startingBid, setStartingBid] = useState(
    String(Number(listing.startingBid ?? 10)),
  );
  const [buyNowPrice, setBuyNowPrice] = useState(
    String(Number(listing.buyNowPrice ?? 0)),
  );
  const [bidIncrement, setBidIncrement] = useState(
    String(Number(listing.bidIncrement ?? 5)),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showBidFields = listingType !== "buy_now";
  const showBuyNowField = listingType !== "auction";

  const handleSubmit = async () => {
    setError(null);

    const startBid = parseFloat(startingBid);
    const buyNow = parseFloat(buyNowPrice);
    const increment = parseFloat(bidIncrement);

    if (showBidFields && (!startBid || startBid <= 0)) {
      setError("Starting bid must be greater than 0");
      return;
    }
    if (showBuyNowField && (!buyNow || buyNow <= 0)) {
      setError("Buy now price must be greater than 0");
      return;
    }
    if (showBidFields && showBuyNowField && buyNow <= startBid) {
      setError("Buy now price must be greater than starting bid");
      return;
    }

    const endTime = new Date();
    endTime.setDate(endTime.getDate() + durationDays);

    const payload: RelistPayload = {
      endTime: endTime.toISOString(),
      listingType,
      ...(showBidFields && {
        startingBid: startBid,
        bidIncrement: increment,
      }),
      ...(showBuyNowField && { buyNowPrice: buyNow }),
    };

    setIsSubmitting(true);
    try {
      const ok = await onRelist(listing.id, payload);
      if (ok) onClose();
      else setError("Failed to relist auction. Please try again.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
        {/* Listing type */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Listing Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LISTING_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setListingType(t.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all ${
                  listingType === t.id
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <span
                  className={
                    listingType === t.id ? "text-white" : "text-gray-500"
                  }
                >
                  {t.icon}
                </span>
                <span className="text-xs font-bold leading-tight">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {LISTING_TYPES.find((t) => t.id === listingType)?.description}
          </p>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            <Clock size={12} className="inline mr-1" />
            Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => setDurationDays(opt.days)}
                className={`py-2 px-3 rounded-lg border text-sm font-bold transition-all ${
                  durationDays === opt.days
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {showBidFields && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Starting Bid (€)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Bid Increment (€)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={bidIncrement}
                onChange={(e) => setBidIncrement(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        )}

        {showBuyNowField && (
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Buy Now Price (€)
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={buyNowPrice}
              onChange={(e) => setBuyNowPrice(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1">
          <p className="font-bold text-gray-800 mb-1">Summary</p>
          <p>
            Type:{" "}
            <span className="font-semibold">
              {LISTING_TYPES.find((t) => t.id === listingType)?.label}
            </span>
          </p>
          <p>
            Duration:{" "}
            <span className="font-semibold">{durationDays} days</span>
          </p>
          {showBidFields && (
            <p>
              Starting bid: <span className="font-semibold">€{startingBid}</span>
            </p>
          )}
          {showBuyNowField && (
            <p>
              Buy now: <span className="font-semibold">€{buyNowPrice}</span>
            </p>
          )}
          <p>
            Ends:{" "}
            <span className="font-semibold">
              {new Date(
                Date.now() + durationDays * 24 * 60 * 60 * 1000,
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Relisting...
            </>
          ) : (
            <>
              <RefreshCw size={15} />
              Relist Auction
            </>
          )}
        </button>
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// FULL MODE — same form as Edit Listing, plus mandatory new endTime
// ═════════════════════════════════════════════════════════════════════════════

function FullRelistBody({
  listing,
  onClose,
  onRelist,
}: {
  listing: MyListing;
  onClose: () => void;
  onRelist: (id: string, payload: RelistPayload) => Promise<boolean>;
}) {
  // Relisting an ended/cancelled auction has bidCount=0 in practice,
  // and we want every field unlocked anyway, so force the form into "free" mode
  // by passing a synthetic listing with bidCount=0 + buy_now type.
  const baseListing: MyListing = {
    ...listing,
    bidCount: 0,
    listingType: "buy_now", // forces useEditForm into "free" mode
  };

  const { form, errors, setField, validate, isEditable } =
    useEditForm(baseListing);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async () => {
    const diff = validate();
    if (!diff) return;

    // endTime is required for relist — fall back to listing.endTime if seller didn't change it
    const endTime = diff.endTime ?? new Date(listing.endTime).toISOString();
    if (!endTime || new Date(endTime) <= new Date()) {
      setFeedback("Please pick a future end time.");
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    // Take the full form snapshot (not diff) — relist replaces the auction entirely
    const payload: RelistPayload = {
      endTime,
      ...(diff.startTime && { startTime: diff.startTime }),
      listingType: form.listingType,
      title: form.title.trim(),
      description: form.description.trim(),
      images: form.images,
      ...(form.category && { category: form.category.trim() }),
      ...(form.itemType && { itemType: form.itemType.trim() }),
      ...(form.league && { league: form.league.trim() }),
      ...(form.team && { team: form.team.trim() }),
      ...(form.season && { season: form.season.trim() }),
      ...(form.size && { size: form.size }),
      ...(form.sizeEU && { sizeEU: form.sizeEU }),
      ...(form.sizeUK && { sizeUK: form.sizeUK }),
      ...(form.condition && { condition: form.condition }),
      ...(form.tagCondition && { tagCondition: form.tagCondition }),
      ...(form.manufacturer && { manufacturer: form.manufacturer.trim() }),
      ...(form.model && { model: form.model.trim() }),
      ...(form.countryOfProduction && {
        countryOfProduction: form.countryOfProduction.trim(),
      }),
      ...(form.productionYear && { productionYear: form.productionYear }),
      ...(form.serialCode && { serialCode: form.serialCode }),
      playerName: form.playerName.trim() || null,
      playerNumber: form.playerNumber.trim() || null,
      hasAutograph: form.hasAutograph,
      ...(form.autographDetails && {
        autographDetails: form.autographDetails.trim(),
      }),
      isVintage: form.isVintage,
      ...(form.vintageYear && { vintageYear: form.vintageYear }),
      ...(form.startingBid && { startingBid: parseFloat(form.startingBid) }),
      ...(form.bidIncrement && { bidIncrement: parseFloat(form.bidIncrement) }),
      buyNowPrice: form.buyNowPrice ? parseFloat(form.buyNowPrice) : null,
      shippingCost: parseFloat(form.shippingCost) || 0,
      shippingTime: form.shippingTime.trim(),
      shippingFrom: form.shippingFrom.trim(),
    };

    setIsSubmitting(true);
    try {
      const ok = await onRelist(listing.id, payload);
      if (ok) onClose();
      else {
        setFeedback("Failed to relist. Please check the form and try again.");
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Unexpected error");
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="overflow-y-auto flex-1">
        <EditSectionImages
          images={form.images}
          onChange={(next) => setField("images", next)}
          error={errors.images}
        />

        <div className="px-6 py-5 space-y-6">
          {feedback && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
              {feedback}
            </div>
          )}

          <EditSectionBasic
            form={form}
            errors={errors}
            setField={setField}
            isEditable={isEditable}
          />

          <div className="border-t border-gray-100" />

          <EditSectionDetails
            form={form}
            setField={setField}
            isEditable={isEditable}
          />

          <div className="border-t border-gray-100" />

          <EditSectionPricing
            form={form}
            errors={errors}
            setField={setField}
            isEditable={isEditable}
          />
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Relisting...
            </>
          ) : (
            <>
              <RefreshCw size={15} />
              Relist with edits
            </>
          )}
        </button>
      </div>
    </>
  );
}
