"use client";

/**
 * ListingCard Component
 * Displays a single user listing with status badge, stats and action buttons.
 * Supports: view, edit (slide-in panel), boost, cancel, delete.
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  Gavel,
  Clock,
  Tag,
  Trash2,
  XCircle,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Ban,
  Hourglass,
  Package,
  Pencil,
  Zap,
  Heart,
  RefreshCw,
} from "lucide-react";
import type {
  MyListing,
  AuctionStatus,
  UpdateListingPayload,
} from "@/types/features/listings.types";
import EditListingModal from "./EditListingModal";
import BoostListingModal from "./BoostListingModal";
import RelistAuctionModal, { type RelistPayload } from "./RelistAuctionModal";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AuctionStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  active: {
    label: "Active",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 size={13} />,
  },
  upcoming: {
    label: "Upcoming",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: <Hourglass size={13} />,
  },
  ended: {
    label: "Ended",
    color: "text-gray-600",
    bg: "bg-gray-100 border-gray-200",
    icon: <Clock size={13} />,
  },
  sold: {
    label: "Sold",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    icon: <ShoppingBag size={13} />,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    icon: <Ban size={13} />,
  },
  awaiting_payment: {
    label: "Awaiting Payment",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: <AlertCircle size={13} />,
  },
  paid: {
    label: "Paid",
    color: "text-teal-700",
    bg: "bg-teal-50 border-teal-200",
    icon: <CheckCircle2 size={13} />,
  },
  shipped: {
    label: "Shipped",
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
    icon: <Package size={13} />,
  },
  delivered: {
    label: "Delivered",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: <CheckCircle2 size={13} />,
  },
  completed: {
    label: "Completed",
    color: "text-green-800",
    bg: "bg-green-100 border-green-300",
    icon: <CheckCircle2 size={13} />,
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ListingCardProps {
  listing: MyListing;
  onDelete: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
  onUpdate?: (id: string, payload: UpdateListingPayload) => Promise<boolean>;
  onBoost?: (listingId: string, tier: string) => Promise<boolean>;
  onRelist?: (id: string, payload: RelistPayload) => Promise<boolean>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

export default function ListingCard({
  listing,
  onDelete,
  onCancel,
  onUpdate,
  onBoost,
  onRelist,
}: ListingCardProps) {
  const [confirmAction, setConfirmAction] = useState<
    "delete" | "cancel" | null
  >(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showBoost, setShowBoost] = useState(false);
  const [showRelist, setShowRelist] = useState(false);

  const statusCfg = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG.ended;
  const thumbnail = listing.images?.[0] ?? null;
  const bidCount = listing._count?.bids ?? listing.bidCount ?? 0;
  const favCount = listing._count?.favorites ?? listing.favoritesCount ?? 0;
  const isEditable = ["active", "upcoming"].includes(listing.status);
  // ended and cancelled can also be edited (title/description before relisting)
  const canEditEnded = ["ended", "cancelled"].includes(listing.status);
  const canBoost = ["active", "upcoming"].includes(listing.status);
  const canDelete = bidCount === 0 && listing.status !== "sold";
  const canCancel = ["active", "upcoming"].includes(listing.status);
  const canRelist = ["ended", "cancelled"].includes(listing.status);

  const handleConfirm = async () => {
    if (confirmAction === "delete") await onDelete(listing.id);
    if (confirmAction === "cancel") await onCancel(listing.id);
    setConfirmAction(null);
  };

  const handleSaveEdit = async (
    id: string,
    payload: UpdateListingPayload,
  ): Promise<boolean> => {
    if (onUpdate) return onUpdate(id, payload);
    return false;
  };

  const handleBoost = async (
    listingId: string,
    tier: string,
  ): Promise<boolean> => {
    if (onBoost) return onBoost(listingId, tier);
    // Placeholder: always succeed if no handler provided
    return true;
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
        {/* Image */}
        <div className="relative h-80 bg-gray-100 overflow-hidden flex-shrink-0">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag size={36} className="text-gray-300" />
            </div>
          )}

          {/* Status badge */}
          <div
            className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${statusCfg.bg} ${statusCfg.color}`}
          >
            {statusCfg.icon}
            {statusCfg.label}
          </div>

          {/* Featured / Rare badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
            {listing.featured && (
              <span className="px-2 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-black rounded-full uppercase tracking-wide">
                Featured
              </span>
            )}
            {listing.rare && (
              <span className="px-2 py-0.5 bg-purple-500 text-white text-[10px] font-black rounded-full uppercase tracking-wide">
                Rare
              </span>
            )}
          </div>

          {/* Quick edit overlay on hover */}
          {(isEditable || canEditEnded) && (
            <Link
              href={`/my-listings/${listing.id}/edit`}
              className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <span className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-xs font-black text-gray-900 shadow-lg">
                <Pencil size={14} />
                Edit
              </span>
            </Link>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-3">
          {/* Title & team */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
              {listing.title}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              {listing.team} · {listing.season} · {listing.size}
            </p>
          </div>

          {/* Price & stats */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                {listing.listingType === "buy_now" ? "Buy Now" : "Current Bid"}
              </p>
              <p className="text-lg font-black text-gray-900">
                {formatPrice(
                  listing.listingType === "buy_now"
                    ? (listing.buyNowPrice ?? listing.currentBid)
                    : listing.currentBid,
                )}
              </p>
            </div>

            <div className="text-right space-y-0.5">
              <div className="flex items-center gap-1 text-gray-500 text-xs font-semibold justify-end">
                <Gavel size={12} />
                <span>{bidCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs justify-end">
                <div className="flex items-center gap-0.5">
                  <Eye size={12} />
                  <span>{listing.views ?? 0}</span>
                </div>
                <span className="text-gray-200">·</span>
                <div className="flex items-center gap-0.5 text-rose-400">
                  <Heart size={11} />
                  <span>{favCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time info */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={13} className="flex-shrink-0" />
            {listing.status === "active" ? (
              <span className="font-semibold text-amber-600">
                {getTimeLeft(listing.endTime)}
              </span>
            ) : (
              <span>Ends {formatDate(listing.endTime)}</span>
            )}
          </div>

          {/* Confirm action overlay */}
          {confirmAction && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
              <p className="text-xs font-bold text-red-800 mb-2">
                {confirmAction === "delete"
                  ? "Delete this listing permanently?"
                  : "Cancel this auction?"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-1.5 text-xs font-bold bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  No, keep it
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, confirm
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          {!confirmAction && (
            <div className="flex gap-1.5 mt-auto pt-1">
              {/* View */}
              <Link
                href={`/auction/${listing.id}`}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors"
              >
                <ExternalLink size={12} />
                View
              </Link>

              {/* Edit */}
              {isEditable && (
                <Link
                  href={`/my-listings/${listing.id}/edit`}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold text-blue-700 transition-colors"
                  title="Edit listing"
                >
                  <Pencil size={12} />
                  Edit
                </Link>
              )}

              {/* Boost */}
              {canBoost && (
                <button
                  onClick={() => setShowBoost(true)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-bold text-amber-700 transition-colors"
                  title="Boost listing"
                >
                  <Zap size={12} />
                </button>
              )}

              {/* Cancel */}
              {canCancel && (
                <button
                  onClick={() => setConfirmAction("cancel")}
                  className="flex items-center justify-center px-2.5 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-xs font-bold text-orange-600 transition-colors"
                  title="Cancel auction"
                >
                  <XCircle size={13} />
                </button>
              )}

              {/* Edit for ended/cancelled */}
              {canEditEnded && (
                <Link
                  href={`/my-listings/${listing.id}/edit`}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold text-blue-700 transition-colors"
                  title="Edit listing"
                >
                  <Pencil size={12} />
                  Edit
                </Link>
              )}

              {/* Relist */}
              {canRelist && onRelist && (
                <button
                  onClick={() => setShowRelist(true)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-700 transition-colors"
                  title="Relist auction"
                >
                  <RefreshCw size={12} />
                  Relist
                </button>
              )}

              {/* Delete */}
              {canDelete && (
                <button
                  onClick={() => setConfirmAction("delete")}
                  className="flex items-center justify-center px-2.5 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold text-red-600 transition-colors"
                  title="Delete listing"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit panel */}
      {showEdit && (
        <EditListingModal
          listing={listing}
          onClose={() => setShowEdit(false)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Boost modal */}
      {showBoost && (
        <BoostListingModal
          listing={listing}
          onClose={() => setShowBoost(false)}
          onBoost={handleBoost}
        />
      )}

      {/* Relist modal */}
      {showRelist && onRelist && (
        <RelistAuctionModal
          listing={listing}
          onClose={() => setShowRelist(false)}
          onRelist={onRelist}
        />
      )}
    </>
  );
}
