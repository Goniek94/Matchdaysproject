"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Single-order page.
 *
 * Reached from three flows:
 *   1. Direct link after a wallet purchase (cart → /checkout → here on success).
 *   2. Stripe redirect — the backend's success_url is `/orders/:id?paid=1`.
 *      The webhook may not have landed yet by the time the browser comes back,
 *      so we soft-poll for up to ~20 s and surface a friendly "confirming…"
 *      state instead of a flicker.
 *   3. From "My orders" / "My sales" listings.
 *
 * Action buttons render based on the caller's role and the order's status —
 * the backend enforces the same rules, this UI is just a thin guard.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Truck,
  Package,
  AlertCircle,
  Loader2,
  ShieldCheck,
  XCircle,
  Tag,
} from "lucide-react";

import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/CartContext";
import {
  ordersApi,
  type OrderDto,
  type OrderStatus,
} from "@/lib/api";
import { formatMoney } from "@/lib/api/wallet";

// ─── Status display ──────────────────────────────────────────────────────────

const STATUS_META: Record<
  OrderStatus,
  { label: string; tone: string; icon: React.ReactNode }
> = {
  PENDING_PAYMENT: {
    label: "Awaiting payment",
    tone: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock size={14} />,
  },
  PAID: {
    label: "Paid — preparing to ship",
    tone: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <CheckCircle size={14} />,
  },
  SHIPPED: {
    label: "Shipped",
    tone: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: <Truck size={14} />,
  },
  DELIVERED: {
    label: "Delivered — funds release in 7 days",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <Package size={14} />,
  },
  COMPLETED: {
    label: "Completed",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <ShieldCheck size={14} />,
  },
  DISPUTED: {
    label: "Disputed",
    tone: "bg-orange-50 text-orange-700 border-orange-200",
    icon: <AlertCircle size={14} />,
  },
  REFUND_REQUESTED: {
    label: "Refund requested",
    tone: "bg-orange-50 text-orange-700 border-orange-200",
    icon: <AlertCircle size={14} />,
  },
  REFUNDED: {
    label: "Refunded",
    tone: "bg-gray-100 text-gray-600 border-gray-200",
    icon: <XCircle size={14} />,
  },
  CANCELLED: {
    label: "Cancelled",
    tone: "bg-gray-100 text-gray-600 border-gray-200",
    icon: <XCircle size={14} />,
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { clearCart } = useCart();

  const orderId = typeof params?.id === "string" ? params.id : "";
  const justPaidViaStripe = search.get("paid") === "1";
  const cancelledByBuyer = search.get("cancelled") === "1";

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<{
    kind: "idle" | "loading" | "error" | "success";
    message?: string;
  }>({ kind: "idle" });

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await ordersApi.getOrder(orderId);
      if (res.success && res.data) {
        setOrder(res.data);
        setError(null);
      } else {
        setError(res.message ?? "Could not load order.");
      }
    } catch (err: any) {
      setError(err?.message ?? err?.error ?? "Could not load order.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchOrder();
  }, [isAuthenticated, fetchOrder]);

  // After a Stripe redirect the webhook can lag a few seconds. Soft-poll the
  // order until the status flips out of PENDING_PAYMENT (or we hit the cap).
  // We deliberately don't poll forever — a stuck webhook is a real bug and
  // we'd rather surface it than spin indefinitely.
  useEffect(() => {
    if (!justPaidViaStripe || !order) return;
    if (order.status !== "PENDING_PAYMENT") {
      // The webhook already landed — clear the cart so a back-button + retry
      // doesn't accidentally re-checkout the same item.
      clearCart();
      return;
    }

    const startedAt = Date.now();
    const CAP_MS = 25_000;
    const POLL_MS = 2_000;
    const interval = window.setInterval(async () => {
      if (Date.now() - startedAt > CAP_MS) {
        window.clearInterval(interval);
        return;
      }
      try {
        const res = await ordersApi.getOrder(orderId);
        if (res.success && res.data) {
          setOrder(res.data);
          if (res.data.status !== "PENDING_PAYMENT") {
            window.clearInterval(interval);
            clearCart();
          }
        }
      } catch {
        // ignore transient errors — next tick retries
      }
    }, POLL_MS);

    return () => window.clearInterval(interval);
  }, [justPaidViaStripe, order, orderId, clearCart]);

  // ── Derived role ──
  const role: "buyer" | "seller" | "other" = useMemo(() => {
    if (!order || !user) return "other";
    if (order.buyerId === (user as any).id) return "buyer";
    if (order.sellerId === (user as any).id) return "seller";
    return "other";
  }, [order, user]);

  // ── Action handlers ──
  const runAction = async (
    label: string,
    fn: () => Promise<{ success?: boolean; message?: string }>,
  ) => {
    setActionState({ kind: "loading", message: label });
    try {
      const res = await fn();
      if (res.success === false) {
        setActionState({
          kind: "error",
          message: res.message ?? `${label} failed.`,
        });
        return;
      }
      setActionState({ kind: "success", message: `${label} done.` });
      await fetchOrder();
    } catch (err: any) {
      setActionState({
        kind: "error",
        message: err?.message ?? err?.error ?? `${label} failed.`,
      });
    }
  };

  // ── Render guards ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 mb-2">
            Sign in to view this order.
          </p>
          <Link
            href="/login"
            className="text-sm text-black underline underline-offset-2"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto text-amber-500 mb-3" size={28} />
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Couldn&apos;t load this order
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            {error ?? "Unknown error"}
          </p>
          <button
            type="button"
            onClick={() => router.push("/history")}
            className="px-5 py-2 text-sm font-bold bg-black text-white rounded-xl"
          >
            Back to history
          </button>
        </div>
      </div>
    );
  }

  const statusMeta = STATUS_META[order.status];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Back to history
        </Link>

        {/* ── Stripe redirect banner ─────────────────────────────────── */}
        {justPaidViaStripe && order.status === "PENDING_PAYMENT" && (
          <div className="mb-5 flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-800">
            <Loader2 className="animate-spin flex-shrink-0 mt-0.5" size={16} />
            <div>
              <p className="font-bold">Confirming your payment…</p>
              <p className="text-blue-700/80">
                Stripe is letting us know about your payment. This usually
                takes only a few seconds.
              </p>
            </div>
          </div>
        )}

        {justPaidViaStripe && order.status !== "PENDING_PAYMENT" && (
          <div className="mb-5 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm text-emerald-800">
            <CheckCircle className="flex-shrink-0 mt-0.5" size={16} />
            <p>
              Payment confirmed. The seller has been notified and will ship
              your item.
            </p>
          </div>
        )}

        {cancelledByBuyer && (
          <div className="mb-5 flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-sm text-amber-800">
            <AlertCircle className="flex-shrink-0 mt-0.5" size={16} />
            <p>
              You cancelled the Stripe checkout. The order is still
              reservable — you can retry payment below.
            </p>
          </div>
        )}

        {/* ── Order card ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-5">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <p className="text-xs font-semibold text-gray-400 tracking-wide">
                ORDER · {order.id.slice(0, 8).toUpperCase()}
              </p>
              <h1 className="text-2xl font-black text-gray-900 mt-1">
                {order.auction.title}
              </h1>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${statusMeta.tone}`}
            >
              {statusMeta.icon}
              {statusMeta.label}
            </span>
          </div>

          <div className="flex gap-4 items-center pb-5 border-b border-gray-100">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={order.auction.images?.[0] ?? "/images/placeholder.jpg"}
                alt={order.auction.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500">
                {role === "buyer"
                  ? `Sold by ${order.seller?.username ?? "seller"}`
                  : role === "seller"
                    ? `Bought by ${order.buyer?.username ?? "buyer"}`
                    : "Order"}
              </p>
              {order.auction.itemType && (
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Tag size={11} /> {order.auction.itemType}
                </p>
              )}
            </div>
          </div>

          {/* Money breakdown */}
          <div className="space-y-2 my-5">
            <Row label="Item" value={formatMoney(order.itemPrice, order.currency)} />
            <Row
              label="Shipping"
              value={formatMoney(order.shippingCost, order.currency)}
            />
            {role === "seller" && (
              <>
                <Row
                  label={`Platform fee (${(order.feeRate * 100).toFixed(0)}% · ${order.feeTier})`}
                  value={`−${formatMoney(order.platformFee, order.currency)}`}
                  muted
                />
                <Row
                  label="Your payout"
                  value={formatMoney(order.sellerPayout, order.currency)}
                  strong
                />
              </>
            )}
            {role !== "seller" && (
              <Row
                label="Total"
                value={formatMoney(order.totalPaid, order.currency)}
                strong
              />
            )}
          </div>

          {/* Shipping address (buyer-side) */}
          {role === "buyer" && order.shippingAddress && (
            <div className="bg-gray-50 rounded-2xl p-4 text-sm space-y-0.5 mb-5">
              <p className="font-semibold text-gray-900 mb-1">Shipping to</p>
              {((address) => (
                <>
                  <p className="text-gray-700">
                    {address.recipientName ?? ""}
                  </p>
                  <p className="text-gray-500">{address.street ?? ""}</p>
                  <p className="text-gray-500">
                    {address.postalCode ?? ""} {address.city ?? ""}
                    {address.country ? `, ${address.country}` : ""}
                  </p>
                </>
              ))(order.shippingAddress as any)}
            </div>
          )}

          {/* Tracking (seller filled it in) */}
          {order.trackingNumber && (
            <div className="bg-gray-50 rounded-2xl p-4 text-sm mb-5">
              <p className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <Truck size={14} /> Tracking
              </p>
              <p className="text-gray-500">
                {order.shippingCarrier} · {order.trackingNumber}
              </p>
            </div>
          )}

          {/* ── Action area ─────────────────────────────────────────── */}
          <OrderActions
            order={order}
            role={role}
            actionState={actionState}
            runAction={runAction}
            router={router}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Row({
  label,
  value,
  strong,
  muted,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className={muted ? "text-gray-400" : "text-gray-500"}>{label}</span>
      <span
        className={
          strong
            ? "font-black text-gray-900"
            : muted
              ? "font-medium text-gray-500"
              : "font-semibold text-gray-700"
        }
      >
        {value}
      </span>
    </div>
  );
}

function OrderActions({
  order,
  role,
  actionState,
  runAction,
  router,
}: {
  order: OrderDto;
  role: "buyer" | "seller" | "other";
  actionState: { kind: "idle" | "loading" | "error" | "success"; message?: string };
  runAction: (
    label: string,
    fn: () => Promise<{ success?: boolean; message?: string }>,
  ) => Promise<void>;
  router: ReturnType<typeof useRouter>;
}) {
  const [carrier, setCarrier] = useState("");
  const [tracking, setTracking] = useState("");

  const busy = actionState.kind === "loading";

  return (
    <div className="space-y-3">
      {actionState.kind === "error" && actionState.message && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <p>{actionState.message}</p>
        </div>
      )}

      {/* PENDING_PAYMENT — buyer can retry pay or cancel */}
      {role === "buyer" && order.status === "PENDING_PAYMENT" && (
        <>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              runAction("Retry payment", async () => {
                const res = await ordersApi.pay(order.id, {
                  paymentMethod: "STRIPE_CARD",
                });
                if (res.success && res.data && !res.data.paid) {
                  window.location.assign(res.data.checkoutUrl);
                }
                return res;
              })
            }
            className="w-full py-3 text-sm font-bold bg-black text-white rounded-xl disabled:opacity-50"
          >
            Pay with card
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              runAction("Cancel order", () =>
                ordersApi.cancelOrder(order.id),
              ).then(() => router.push("/history"))
            }
            className="w-full py-3 text-sm font-bold bg-white border border-gray-200 text-gray-700 rounded-xl disabled:opacity-50"
          >
            Cancel order
          </button>
        </>
      )}

      {/* PAID — seller ships */}
      {role === "seller" && order.status === "PAID" && (
        <div className="space-y-2">
          <input
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            placeholder="Carrier (DPD, InPost…)"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <input
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="Tracking number"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <button
            type="button"
            disabled={busy || !carrier.trim() || !tracking.trim()}
            onClick={() =>
              runAction("Mark shipped", () =>
                ordersApi.markShipped(order.id, {
                  carrier: carrier.trim(),
                  trackingNumber: tracking.trim(),
                }),
              )
            }
            className="w-full py-3 text-sm font-bold bg-black text-white rounded-xl disabled:opacity-50"
          >
            Mark as shipped
          </button>
        </div>
      )}

      {/* SHIPPED — buyer confirms delivery */}
      {role === "buyer" && order.status === "SHIPPED" && (
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            runAction("Mark delivered", () => ordersApi.markDelivered(order.id))
          }
          className="w-full py-3 text-sm font-bold bg-black text-white rounded-xl disabled:opacity-50"
        >
          I&apos;ve received the item
        </button>
      )}

      {/* DELIVERED — buyer releases escrow early */}
      {role === "buyer" && order.status === "DELIVERED" && (
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            runAction("Release funds", () =>
              ordersApi.confirmReceipt(order.id),
            )
          }
          className="w-full py-3 text-sm font-bold bg-black text-white rounded-xl disabled:opacity-50"
        >
          Release funds to seller
        </button>
      )}

      {/* PAID / SHIPPED / DELIVERED — either party can dispute */}
      {(role === "buyer" || role === "seller") &&
        (order.status === "PAID" ||
          order.status === "SHIPPED" ||
          order.status === "DELIVERED") && (
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              const reason = window.prompt(
                "Why are you disputing this order? The other party will see this message.",
              );
              if (!reason) return;
              runAction("Open dispute", () =>
                ordersApi.openDispute(order.id, { reason }),
              );
            }}
            className="w-full py-3 text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl disabled:opacity-50"
          >
            Open a dispute
          </button>
        )}
    </div>
  );
}
