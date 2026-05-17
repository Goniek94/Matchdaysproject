"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Seller-side counterpart of /history.
 *
 * Lists every order where the current user is the SELLER, with a deep-link
 * into /orders/[id] — that page is where the seller marks-as-shipped,
 * enters tracking, handles disputes, and (eventually) generates a shipping
 * label. We don't duplicate those actions here; this page is a worklist /
 * scoreboard. One row = one sale.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  XCircle,
  ShieldCheck,
  ArrowRight,
  Gavel,
  Tag,
} from "lucide-react";

import { useAuth } from "@/lib/context/AuthContext";
import { ordersApi } from "@/lib/api";
import type { OrderListItem, OrderStatus } from "@/lib/api/orders";

// ─── Status display — mirrors /orders/[id] tones so a buyer/seller
//     glancing at both screens reads the same language. ────────────────

const STATUS_META: Record<
  OrderStatus,
  { label: string; tone: string; icon: React.ReactNode; actionable: boolean }
> = {
  PENDING_PAYMENT:   { label: "Awaiting payment",                tone: "bg-amber-50 text-amber-700 border-amber-200",     icon: <Clock size={12} />,        actionable: false },
  AWAITING_SHIPPING: { label: "Paid — ready to ship",            tone: "bg-amber-50 text-amber-700 border-amber-200",     icon: <Truck size={12} />,        actionable: true  },
  PAID:              { label: "Paid — confirm shipping",         tone: "bg-blue-50 text-blue-700 border-blue-200",        icon: <CheckCircle size={12} />,  actionable: true  },
  SHIPPED:           { label: "Shipped",                          tone: "bg-indigo-50 text-indigo-700 border-indigo-200",  icon: <Truck size={12} />,        actionable: false },
  DELIVERED:         { label: "Delivered — funds escrow",         tone: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <Package size={12} />,    actionable: false },
  COMPLETED:         { label: "Completed",                        tone: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <ShieldCheck size={12} />, actionable: false },
  DISPUTED:          { label: "Disputed",                         tone: "bg-orange-50 text-orange-700 border-orange-200",  icon: <AlertCircle size={12} />,  actionable: true  },
  REFUND_REQUESTED:  { label: "Refund requested",                 tone: "bg-orange-50 text-orange-700 border-orange-200",  icon: <AlertCircle size={12} />,  actionable: true  },
  REFUNDED:          { label: "Refunded",                         tone: "bg-gray-100 text-gray-600 border-gray-200",       icon: <XCircle size={12} />,      actionable: false },
  CANCELLED:         { label: "Cancelled",                        tone: "bg-gray-100 text-gray-600 border-gray-200",       icon: <XCircle size={12} />,      actionable: false },
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(iso));

// ─── Page ─────────────────────────────────────────────────────────────────

export default function SalesPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "action_needed" | "in_progress" | "done">("all");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const res = await ordersApi.listSelling();
        if (res.success && Array.isArray(res.data)) setOrders(res.data);
      } catch {
        // Empty state below handles "no data" — no inline error needed.
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated]);

  // Coarse buckets the seller cares about at-a-glance:
  //   action_needed → orders waiting on them (PAID / AWAITING_SHIPPING / DISPUTED)
  //   in_progress   → shipped, in transit
  //   done          → completed, refunded, cancelled
  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "action_needed") return STATUS_META[o.status]?.actionable;
    if (filter === "in_progress")   return o.status === "SHIPPED";
    if (filter === "done")          return ["COMPLETED", "REFUNDED", "CANCELLED"].includes(o.status);
    return true;
  });

  const counts = {
    all: orders.length,
    action_needed: orders.filter((o) => STATUS_META[o.status]?.actionable).length,
    in_progress: orders.filter((o) => o.status === "SHIPPED").length,
    done: orders.filter((o) => ["COMPLETED", "REFUNDED", "CANCELLED"].includes(o.status)).length,
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 uppercase tracking-widest">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-1">Sales</h1>
          <p className="text-gray-500 text-sm">
            {user?.username && <span className="font-medium text-gray-700">{user.username}</span>}{" "}
            · Orders where you are the seller
          </p>
        </div>

        {/* Filter tabs */}
        {orders.length > 0 && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {(
              [
                ["all",           "All",            counts.all],
                ["action_needed", "Action needed",  counts.action_needed],
                ["in_progress",   "In transit",     counts.in_progress],
                ["done",          "Closed",         counts.done],
              ] as const
            ).map(([key, label, n]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                  filter === key
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {label}
                <span className={`ml-1.5 text-[10px] ${filter === key ? "text-white/70" : "text-gray-400"}`}>
                  {n}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center">
            <Tag size={52} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No sales yet</h2>
            <p className="text-gray-400 text-sm mb-8">
              When buyers confirm purchases of your listings, they&apos;ll appear here.
            </p>
            <Link
              href="/my-listings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              View your listings <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* List */}
        {filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((order) => {
              const meta = STATUS_META[order.status];
              const price = Number(order.totalPaid || order.itemPrice || 0);
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex gap-4 p-5">
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {order.auction.images?.[0] ? (
                        <Image
                          src={order.auction.images[0]}
                          alt={order.auction.title}
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
                          href={`/orders/${order.id}`}
                          className="font-semibold text-gray-900 hover:text-black line-clamp-2 text-sm leading-snug"
                        >
                          {order.auction.title}
                        </Link>
                        <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
                          €{price.toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mb-2">
                        Buyer: {order.buyer?.username ?? "—"} · {formatDate(order.createdAt)}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Order id chip */}
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-mono">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>

                        {/* Status badge */}
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${meta.tone}`}>
                          {meta.icon}
                          {meta.label}
                        </span>

                        {/* Action-needed indicator */}
                        {meta.actionable && (
                          <span className="inline-flex items-center gap-1 text-xs text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full font-bold">
                            <Gavel size={11} /> Your turn
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTA — always to the order page; that's where the
                      seller marks-as-shipped, types tracking, opens a
                      dispute, etc. Keeping the row clickable too via
                      the title link for muscle memory. */}
                  <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between gap-3">
                    {order.trackingNumber ? (
                      <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Truck size={12} /> {order.shippingCarrier} · {order.trackingNumber}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">No tracking yet</span>
                    )}
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline"
                    >
                      {meta.actionable ? "Manage sale" : "View order"} <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty filter state — orders exist but current tab has none */}
        {orders.length > 0 && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 py-12 text-center">
            <p className="text-gray-400 text-sm">No sales in this filter</p>
          </div>
        )}

        {/* Stats summary */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { label: "Total sales",   value: orders.length, icon: <Tag size={20} /> },
              { label: "Action needed", value: counts.action_needed, icon: <AlertCircle size={20} /> },
              { label: "Completed",     value: orders.filter((o) => o.status === "COMPLETED").length, icon: <ShieldCheck size={20} /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 text-gray-600 mb-2">
                  {stat.icon}
                </div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
