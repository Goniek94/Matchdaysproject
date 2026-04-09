"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/context/AuthContext";
import { getWonAuctions, confirmPurchase } from "@/lib/api/auctions.api";
import type { AuctionDto } from "@/types/api/auction.types";
import {
  Trophy,
  Package,
  CheckCircle,
  Clock,
  Truck,
  ArrowRight,
  ShoppingBag,
  Gavel,
} from "lucide-react";

// ─── Status display helpers ───────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  sold: {
    label: "Awaiting confirmation",
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
    icon: <Clock size={14} />,
  },
  awaiting_payment: {
    label: "Confirmed — awaiting payment",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: <CheckCircle size={14} />,
  },
  paid: {
    label: "Payment received",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle size={14} />,
  },
  shipped: {
    label: "Shipped",
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
    icon: <Truck size={14} />,
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <Package size={14} />,
  },
  completed: {
    label: "Completed",
    color: "text-gray-700",
    bg: "bg-gray-100 border-gray-200",
    icon: <CheckCircle size={14} />,
  },
};

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status.toLowerCase()] ?? {
    label: status,
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
    icon: <Clock size={14} />,
  };

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  const [purchases, setPurchases] = useState<AuctionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    id: string;
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchPurchases();
  }, [isAuthenticated]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await getWonAuctions();
      if (res.success && res.data) {
        setPurchases(res.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (auctionId: string) => {
    try {
      setConfirming(auctionId);
      const res = await confirmPurchase(auctionId);
      if (res.success) {
        setFeedback({
          id: auctionId,
          type: "success",
          msg: "Purchase confirmed! Seller will be notified.",
        });
        // Update local state
        setPurchases((prev) =>
          prev.map((p) =>
            p.id === auctionId ? { ...p, status: "awaiting_payment" as any } : p,
          ),
        );
      } else {
        setFeedback({ id: auctionId, type: "error", msg: res.message ?? "Error" });
      }
    } catch {
      setFeedback({ id: auctionId, type: "error", msg: "Request failed" });
    } finally {
      setConfirming(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // ── Loading state ──
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Loading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-1">
            Transaction History
          </h1>
          <p className="text-gray-500 text-sm">
            {user?.username && (
              <span className="font-medium text-gray-700">{user.username}</span>
            )}{" "}
            · Purchases & won auctions
          </p>
        </div>

        {/* Empty state */}
        {purchases.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center">
            <ShoppingBag size={52} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No purchases yet
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Items you buy or win at auction will appear here.
            </p>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Browse Auctions
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Purchase list */}
        {purchases.length > 0 && (
          <div className="space-y-4">
            {purchases.map((item) => {
              const statusCfg = getStatusConfig(item.status);
              const price = Number(
                item.buyNowPrice ?? item.currentBid ?? item.startingBid,
              );
              const isBuyNow = item.listingType === "buy_now";
              const needsConfirm = item.status === "sold";
              const thisFeedback =
                feedback?.id === item.id ? feedback : null;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="flex gap-4 p-5">
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.images?.[0] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={28} className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <Link
                          href={`/auction/${item.id}`}
                          className="font-semibold text-gray-900 hover:text-black line-clamp-2 text-sm leading-snug"
                        >
                          {item.title}
                        </Link>
                        <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
                          €{price.toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mb-2">
                        Seller: {item.seller?.username ?? "Unknown"} ·{" "}
                        {formatDate(item.updatedAt)}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Type badge */}
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {isBuyNow ? (
                            <>
                              <ShoppingBag size={11} /> Buy Now
                            </>
                          ) : (
                            <>
                              <Gavel size={11} /> Won Auction
                            </>
                          )}
                        </span>

                        {/* Status badge */}
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusCfg.color} ${statusCfg.bg}`}
                        >
                          {statusCfg.icon}
                          {statusCfg.label}
                        </span>

                        {/* Trophy for wins */}
                        {!isBuyNow && (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <Trophy size={11} /> Winner
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Confirm banner */}
                  {needsConfirm && (
                    <div className="border-t border-orange-100 bg-orange-50 px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex-1 text-xs text-orange-700">
                        <span className="font-semibold">Action required:</span>{" "}
                        Confirm your purchase to notify the seller and start the
                        shipping process.
                      </div>
                      <button
                        onClick={() => handleConfirm(item.id)}
                        disabled={confirming === item.id}
                        className="flex-shrink-0 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {confirming === item.id
                          ? "Confirming…"
                          : "Confirm Purchase"}
                      </button>
                    </div>
                  )}

                  {/* Feedback toast */}
                  {thisFeedback && (
                    <div
                      className={`border-t px-5 py-3 text-xs font-medium ${
                        thisFeedback.type === "success"
                          ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                          : "bg-red-50 border-red-100 text-red-700"
                      }`}
                    >
                      {thisFeedback.msg}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Stats summary */}
        {purchases.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              {
                label: "Total purchases",
                value: purchases.length,
                icon: <ShoppingBag size={20} />,
              },
              {
                label: "Auctions won",
                value: purchases.filter((p) => p.listingType !== "buy_now")
                  .length,
                icon: <Trophy size={20} />,
              },
              {
                label: "Total spent",
                value: `€${purchases
                  .reduce(
                    (sum, p) =>
                      sum +
                      Number(
                        p.buyNowPrice ?? p.currentBid ?? p.startingBid,
                      ),
                    0,
                  )
                  .toLocaleString()}`,
                icon: <CheckCircle size={20} />,
              },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-gray-100 p-4 text-center"
              >
                <div className="text-gray-400 flex justify-center mb-2">
                  {icon}
                </div>
                <div className="text-xl font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
