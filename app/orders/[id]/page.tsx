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
  AWAITING_SHIPPING: {
    label: "Item paid — confirm shipping",
    tone: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Truck size={14} />,
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

          {/* Money breakdown — different shape for buyer vs seller.
              Buyer sees: item + seller's shipping + handling fee → total.
              Seller sees: item − platform fee + their shipping payout → their net. */}
          <div className="space-y-2 my-5">
            <Row label="Item" value={formatMoney(order.itemPrice, order.currency)} />

            {role === "seller" ? (
              // Seller view — what they actually take home.
              <>
                <Row
                  label={`Platform fee (${(order.feeRate * 100).toFixed(0)}% · ${order.feeTier})`}
                  value={`−${formatMoney(order.platformFee, order.currency)}`}
                  muted
                />
                {parseFloat(order.sellerShippingPayout) > 0 && (
                  <Row
                    label="Shipping payout"
                    value={`+${formatMoney(order.sellerShippingPayout, order.currency)}`}
                    muted
                  />
                )}
                <Row
                  label="Your payout"
                  value={formatMoney(order.sellerPayout, order.currency)}
                  strong
                />
              </>
            ) : (
              // Buyer view — what they actually pay. Handling fee
              // disclosed as a separate line for transparency (we
              // promised this in the pricing page).
              <>
                {parseFloat(order.sellerShippingPayout) > 0 && (
                  <Row
                    label="Shipping"
                    value={formatMoney(order.sellerShippingPayout, order.currency)}
                  />
                )}
                {parseFloat(order.shippingHandlingFee) > 0 && (
                  <Row
                    label="Handling fee"
                    value={formatMoney(order.shippingHandlingFee, order.currency)}
                  />
                )}
                <Row
                  label="Total"
                  value={formatMoney(order.totalPaid, order.currency)}
                  strong
                />
              </>
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

      {/* Won-auction states (PENDING_PAYMENT + AWAITING_SHIPPING) share one
          unified "🎉 You won! Confirm" experience. The Confirm CTA branches
          on the status under the hood:
            • PENDING_PAYMENT (legacy auction win, no hold) → payFromWallet
            • AWAITING_SHIPPING (item paid via bid escrow) → confirmShipping
          Cancel is the same code path either way — reason-coded, with a
          7-day bid ban for unjustified codes (changed mind, can't afford). */}
      {role === "buyer" &&
        (order.status === "PENDING_PAYMENT" ||
          order.status === "AWAITING_SHIPPING") && (
          <WonOrderActions
            order={order}
            busy={busy}
            onConfirm={(addr) =>
              runAction(
                order.status === "AWAITING_SHIPPING"
                  ? "Confirm shipping"
                  : "Pay & confirm",
                async () => {
                  // ConfirmedAddress is a plain JSON object — the API
                  // signatures want `Record<string, unknown>`, so we
                  // serialise through one (no transformation, just typing).
                  const addrJson = addr as unknown as Record<string, unknown>;
                  if (order.status === "AWAITING_SHIPPING") {
                    return ordersApi.confirmShipping(order.id, addrJson);
                  }
                  // PENDING_PAYMENT path — try wallet first, fall back to
                  // Stripe if the buyer doesn't have enough (Stripe still
                  // surfaces as a separate redirect, not auto).
                  return ordersApi.pay(order.id, {
                    paymentMethod: "WALLET",
                    shippingAddress: addrJson,
                  });
                },
              )
            }
            onCancel={(payload) =>
              runAction("Cancel order", () =>
                ordersApi.cancelAsBuyer(order.id, payload),
              ).then(() => router.push("/history"))
            }
          />
        )}

      {/* PAID — seller view: ship address card + 48h SLA + ship form + cancel-with-refund */}
      {role === "seller" && order.status === "PAID" && (
        <SellerShipBlock
          order={order}
          carrier={carrier}
          tracking={tracking}
          setCarrier={setCarrier}
          setTracking={setTracking}
          busy={busy}
          onShip={() =>
            runAction("Mark shipped", () =>
              ordersApi.markShipped(order.id, {
                carrier: carrier.trim(),
                trackingNumber: tracking.trim(),
              }),
            )
          }
          onCancel={(payload) =>
            runAction("Cancel sale", () =>
              ordersApi.cancelAsSeller(order.id, payload),
            )
          }
        />
      )}

      {/* AWAITING_SHIPPING — seller view: same as PAID but item-only paid yet */}
      {role === "seller" && order.status === "AWAITING_SHIPPING" && (
        <div className="space-y-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong>Item paid €{parseFloat(order.itemPrice).toFixed(2)}</strong>{" "}
            into escrow at auction close. Buyer is still confirming their
            shipping address — you'll get a notification + email the moment
            they do, then you'll have 48h to ship.
          </p>
          <SellerCancelButton
            busy={busy}
            onCancel={(payload) =>
              runAction("Cancel sale", () =>
                ordersApi.cancelAsSeller(order.id, payload),
              )
            }
          />
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

      {/* DELIVERED — buyer has 48h to confirm or dispute, otherwise auto-release */}
      {role === "buyer" && order.status === "DELIVERED" && (
        <DeliveredCountdown
          deliveredAt={order.deliveredAt}
          busy={busy}
          onConfirm={() =>
            runAction("Release funds", () =>
              ordersApi.confirmReceipt(order.id),
            )
          }
        />
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

// ─── Won-order experience ────────────────────────────────────────────────────
//
// Unified "🎉 You won! Confirm your transaction" surface shown to a buyer
// whose order is in PENDING_PAYMENT or AWAITING_SHIPPING. Replaces the
// older "Pay with card / Cancel" pair with a celebratory card that:
//
//   1. Names the item + sale price up front (no hunting for it)
//   2. Lets the buyer pick a shipping METHOD (Paczkomat, courier, pickup)
//   3. Collects the address (or the paczkomat code for locker delivery)
//   4. Shows the post-confirm contract: "Seller ships → you have 48h
//      after delivery to confirm or report a problem → otherwise funds
//      auto-release to seller."
//   5. Offers Cancel-with-reason; unjustified reasons cost a 7-day bid ban.

type ShippingMethod = "courier" | "paczkomat" | "pickup";

interface ConfirmedAddress {
  method: ShippingMethod;
  fullName?: string;
  line1?: string;
  line2?: string | null;
  city?: string;
  postalCode?: string;
  country?: string;
  paczkomatCode?: string;
  phone?: string;
  notes?: string | null;
}

function WonOrderActions(props: {
  order: OrderDto;
  busy: boolean;
  onConfirm: (addr: ConfirmedAddress) => unknown;
  onCancel: (payload: {
    reasonCode: ordersApi.CancelReasonCode;
    reasonText?: string;
  }) => unknown;
}) {
  const { order } = props;
  const [method, setMethod] = useState<ShippingMethod>("courier");
  const [fullName, setFullName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paczkomatCode, setPaczkomatCode] = useState("");
  const [phone, setPhone] = useState("");
  const [showCancel, setShowCancel] = useState(false);

  const itemPrice = parseFloat(order.itemPrice);
  const alreadyPaid = order.status === "AWAITING_SHIPPING";

  const ready =
    fullName.trim() &&
    phone.trim() &&
    (method === "paczkomat"
      ? paczkomatCode.trim().length >= 4
      : line1.trim() && city.trim() && postalCode.trim() && country.trim());

  const submit = () => {
    if (!ready) return;
    const addr: ConfirmedAddress = {
      method,
      fullName: fullName.trim(),
      phone: phone.trim(),
      ...(method === "paczkomat"
        ? { paczkomatCode: paczkomatCode.trim().toUpperCase() }
        : {
            line1: line1.trim(),
            line2: line2.trim() || null,
            city: city.trim(),
            postalCode: postalCode.trim(),
            country: country.trim(),
          }),
    };
    void props.onConfirm(addr);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Celebration header */}
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl text-center">
          <div className="text-2xl mb-1">🎉</div>
          <div className="text-base font-black text-emerald-900">
            You won!
          </div>
          <p className="text-xs text-emerald-800 mt-1">
            {alreadyPaid
              ? `Item paid €${itemPrice.toFixed(2)} from your wallet at auction close. Confirm shipping to finish.`
              : `Confirm your transaction below to complete the purchase (€${itemPrice.toFixed(2)} will be debited from your wallet).`}
          </p>
        </div>

        {/* Shipping method picker — three radio cards */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
            Delivery method
          </div>
          <div className="grid grid-cols-3 gap-2">
            <MethodCard
              active={method === "courier"}
              onClick={() => setMethod("courier")}
              label="Courier"
              hint="DPD / DHL"
            />
            <MethodCard
              active={method === "paczkomat"}
              onClick={() => setMethod("paczkomat")}
              label="Paczkomat"
              hint="InPost locker"
            />
            <MethodCard
              active={method === "pickup"}
              onClick={() => setMethod("pickup")}
              label="Pickup"
              hint="From seller"
            />
          </div>
        </div>

        {/* Address — fields swap based on method */}
        <div className="grid grid-cols-1 gap-2">
          <Field
            label="Full name"
            value={fullName}
            onChange={setFullName}
            placeholder="Jan Kowalski"
          />
          <Field
            label="Phone"
            value={phone}
            onChange={setPhone}
            placeholder="+48 600 000 000"
          />
          {method === "paczkomat" ? (
            <Field
              label="Paczkomat code"
              value={paczkomatCode}
              onChange={setPaczkomatCode}
              placeholder="KRA01M"
            />
          ) : method === "courier" ? (
            <>
              <Field
                label="Address line"
                value={line1}
                onChange={setLine1}
                placeholder="ul. Marszałkowska 1"
              />
              <Field
                label="Apt / suite (optional)"
                value={line2}
                onChange={setLine2}
                placeholder=""
              />
              <div className="grid grid-cols-[1fr_120px] gap-2">
                <Field
                  label="City"
                  value={city}
                  onChange={setCity}
                  placeholder="Kraków"
                />
                <Field
                  label="Postal code"
                  value={postalCode}
                  onChange={setPostalCode}
                  placeholder="30-001"
                />
              </div>
              <Field
                label="Country"
                value={country}
                onChange={setCountry}
                placeholder="Poland"
              />
            </>
          ) : (
            <Field
              label="Pickup city (seller will coordinate)"
              value={city}
              onChange={(v) => {
                setCity(v);
                setLine1(v);
                setPostalCode("PICKUP");
                setCountry("PL");
              }}
              placeholder="Kraków"
            />
          )}
        </div>

        {/* The contract — what happens after Confirm */}
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs text-blue-900 leading-relaxed">
            <strong>What happens next:</strong> The seller is notified to ship
            within 48h. You'll get an email + in-app alert when the parcel is
            on the way, with the tracking number. Once delivered, you have
            <strong> 48h to confirm everything's OK or open a dispute</strong>
            {" "}— after that, the funds release to the seller automatically.
          </p>
        </div>

        {/* Confirm + Cancel */}
        <button
          type="button"
          disabled={!ready || props.busy}
          onClick={submit}
          className="w-full py-3 text-sm font-bold bg-black text-white rounded-xl disabled:opacity-50"
        >
          {props.busy
            ? "Confirming…"
            : alreadyPaid
              ? "Confirm address & pay shipping"
              : "Confirm transaction & pay"}
        </button>
        <button
          type="button"
          disabled={props.busy}
          onClick={() => setShowCancel(true)}
          className="w-full py-3 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl disabled:opacity-50"
        >
          Cancel order
        </button>
      </div>

      {showCancel && (
        <CancelReasonModal
          busy={props.busy}
          onClose={() => setShowCancel(false)}
          onConfirm={(payload) => {
            setShowCancel(false);
            props.onCancel(payload);
          }}
        />
      )}
    </>
  );
}

function MethodCard(props: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`p-3 text-left rounded-xl border-2 transition-all ${
        props.active
          ? "border-black bg-black/5"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="text-xs font-black">{props.label}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{props.hint}</div>
    </button>
  );
}

/**
 * Cancel modal — coded reasons make the bid-ban consequence visible BEFORE
 * the user submits. Unjustified reasons (changed_mind / cant_afford / etc.)
 * show a red warning banner above the confirm button. The frontend doesn't
 * compute the ban — backend does — we just mirror the policy as text.
 */
function CancelReasonModal(props: {
  busy: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    reasonCode: ordersApi.CancelReasonCode;
    reasonText?: string;
  }) => void;
}) {
  const [reasonCode, setReasonCode] = useState<
    ordersApi.CancelReasonCode | null
  >(null);
  const [reasonText, setReasonText] = useState("");

  const selected = ordersApi.CANCEL_REASON_CODES.find(
    (r) => r.code === reasonCode,
  );
  const isUnjustified = selected ? !selected.justified : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div>
          <h3 className="text-base font-black">Why are you cancelling?</h3>
          <p className="text-xs text-gray-500 mt-1">
            Some reasons cost a 7-day bid ban — we'll flag them clearly so
            you know before confirming.
          </p>
        </div>

        <div className="space-y-1.5">
          {ordersApi.CANCEL_REASON_CODES.map((r) => (
            <label
              key={r.code}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-colors ${
                reasonCode === r.code
                  ? "bg-black/5 ring-1 ring-black"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="cancel-reason"
                checked={reasonCode === r.code}
                onChange={() => setReasonCode(r.code)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="text-sm font-bold">{r.label}</div>
                {!r.justified && (
                  <div className="text-[10px] font-bold text-red-600 mt-0.5">
                    Costs a 7-day bid ban
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>

        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            Tell us more (optional)
          </span>
          <textarea
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            placeholder="A bit of context helps us improve."
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
          />
        </div>

        {isUnjustified && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-xs text-red-700 leading-relaxed">
              <strong>Heads up:</strong> Cancelling for this reason triggers a
              <strong> 7-day bid ban</strong> on your account. You'll still
              be able to browse + buy-now, but not place new bids.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={props.onClose}
            disabled={props.busy}
            className="py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl disabled:opacity-50"
          >
            Keep order
          </button>
          <button
            type="button"
            disabled={!reasonCode || props.busy}
            onClick={() =>
              reasonCode &&
              props.onConfirm({
                reasonCode,
                reasonText: reasonText.trim() || undefined,
              })
            }
            className={`py-2.5 text-sm font-bold rounded-xl disabled:opacity-50 text-white ${
              isUnjustified
                ? "bg-red-600 hover:bg-red-700"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {props.busy
              ? "Cancelling…"
              : isUnjustified
                ? "Cancel + accept ban"
                : "Cancel order"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
        {props.label}
      </span>
      <input
        type="text"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
      />
    </label>
  );
}

// ─── Seller-side shipping block ─────────────────────────────────────────────
//
// Shown when role=seller AND status=PAID. Composes:
//   • Buyer's confirmed address (card) — pulled from order.shippingAddress
//   • 48h ship deadline countdown (paidAt + 48h)
//   • Carrier + tracking inputs + "Mark shipped" CTA (existing)
//   • Cancel-with-refund secondary CTA

function SellerShipBlock(props: {
  order: OrderDto;
  carrier: string;
  tracking: string;
  setCarrier: (v: string) => void;
  setTracking: (v: string) => void;
  busy: boolean;
  onShip: () => unknown;
  onCancel: (payload: { reasonCode: string; reasonText?: string }) => unknown;
}) {
  const { order } = props;
  const addr = (order.shippingAddress ?? {}) as Record<string, unknown>;
  const shipDeadline = order.paidAt
    ? new Date(new Date(order.paidAt).getTime() + 48 * 60 * 60_000)
    : null;
  const remaining = shipDeadline ? shipDeadline.getTime() - Date.now() : null;
  const lateForShipping = remaining !== null && remaining <= 0;
  const hours =
    remaining !== null ? Math.max(0, Math.floor(remaining / 3_600_000)) : 0;
  const mins =
    remaining !== null
      ? Math.max(0, Math.floor((remaining % 3_600_000) / 60_000))
      : 0;

  return (
    <div className="space-y-3">
      {/* Ship deadline countdown */}
      {shipDeadline && (
        <div
          className={`p-3 rounded-xl text-xs leading-relaxed ${
            lateForShipping
              ? "bg-red-50 border border-red-200 text-red-800"
              : "bg-amber-50 border border-amber-200 text-amber-900"
          }`}
        >
          {lateForShipping ? (
            <>
              <strong>You're past the 48h ship window.</strong> Shipping ASAP
              keeps your reputation intact — repeated late shipments lead to
              listing penalties.
            </>
          ) : (
            <>
              <strong>Ship within {hours}h {mins}m</strong> to keep your
              seller rating. Order was paid {order.paidAt
                ? new Date(order.paidAt).toLocaleString()
                : "recently"}.
            </>
          )}
        </div>
      )}

      {/* Buyer address card */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
          Ship to
        </div>
        {Object.keys(addr).length === 0 ? (
          <p className="text-xs text-gray-500 italic">
            Address not provided yet.
          </p>
        ) : (
          <>
            <p className="text-sm font-bold text-gray-900">
              {String(addr.fullName ?? "—")}
            </p>
            {addr.phone && (
              <p className="text-xs text-gray-600 mt-0.5">
                📞 {String(addr.phone)}
              </p>
            )}
            <div className="text-xs text-gray-700 mt-2 leading-relaxed">
              {addr.paczkomatCode ? (
                <p>
                  <strong>Paczkomat:</strong> {String(addr.paczkomatCode)}
                </p>
              ) : (
                <>
                  <p>{String(addr.line1 ?? "")}</p>
                  {addr.line2 && <p>{String(addr.line2)}</p>}
                  <p>
                    {String(addr.postalCode ?? "")} {String(addr.city ?? "")}
                  </p>
                  <p>{String(addr.country ?? "")}</p>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Carrier + tracking */}
      <input
        value={props.carrier}
        onChange={(e) => props.setCarrier(e.target.value)}
        placeholder="Carrier (DPD, InPost…)"
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10"
      />
      <input
        value={props.tracking}
        onChange={(e) => props.setTracking(e.target.value)}
        placeholder="Tracking number"
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10"
      />
      <button
        type="button"
        disabled={props.busy || !props.carrier.trim() || !props.tracking.trim()}
        onClick={props.onShip}
        className="w-full py-3 text-sm font-bold bg-black text-white rounded-xl disabled:opacity-50"
      >
        Mark as shipped
      </button>

      <SellerCancelButton busy={props.busy} onCancel={props.onCancel} />
    </div>
  );
}

/** Secondary CTA — opens a small inline reason picker for seller cancel. */
function SellerCancelButton(props: {
  busy: boolean;
  onCancel: (payload: { reasonCode: string; reasonText?: string }) => unknown;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("item_damaged");
  const [text, setText] = useState("");

  const reasons = [
    { code: "item_damaged", label: "Item damaged during packing" },
    { code: "lost_in_storage", label: "Can't locate the item in my storage" },
    { code: "out_of_stock", label: "Item is no longer available" },
    { code: "other", label: "Other reason" },
  ];

  if (!open) {
    return (
      <button
        type="button"
        disabled={props.busy}
        onClick={() => setOpen(true)}
        className="w-full py-2.5 text-xs font-bold text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-xl disabled:opacity-50"
      >
        Cancel sale & refund buyer
      </button>
    );
  }

  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
      <div className="text-xs font-bold text-red-900">Why are you cancelling?</div>
      <div className="space-y-1">
        {reasons.map((r) => (
          <label
            key={r.code}
            className="flex items-center gap-2 text-xs text-red-900"
          >
            <input
              type="radio"
              checked={reason === r.code}
              onChange={() => setReason(r.code)}
            />
            {r.label}
          </label>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tell the buyer what happened (optional, max 500 chars)."
        rows={2}
        maxLength={500}
        className="w-full px-2.5 py-2 text-xs bg-white border border-red-200 rounded-lg resize-none"
      />
      <p className="text-[10px] text-red-700 leading-snug">
        The buyer will be refunded in full + notified. Repeated cancels affect
        your seller rating.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={props.busy}
          className="py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg disabled:opacity-50"
        >
          Keep order
        </button>
        <button
          type="button"
          disabled={props.busy}
          onClick={() =>
            props.onCancel({
              reasonCode: reason,
              reasonText: text.trim() || undefined,
            })
          }
          className="py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
        >
          {props.busy ? "Cancelling…" : "Confirm cancel"}
        </button>
      </div>
    </div>
  );
}

// ─── Buyer-side delivery countdown ───────────────────────────────────────────
//
// Shown when role=buyer AND status=DELIVERED. The buyer has 48h after
// `deliveredAt` to confirm receipt or open a dispute — after that the
// escrow auto-releases to the seller. UI surfaces the countdown so the
// buyer can't claim they didn't know.

function DeliveredCountdown(props: {
  deliveredAt: string | null;
  busy: boolean;
  onConfirm: () => unknown;
}) {
  const deadline = props.deliveredAt
    ? new Date(props.deliveredAt).getTime() + 48 * 60 * 60_000
    : null;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = deadline ? deadline - now : null;
  const hours =
    remaining !== null ? Math.max(0, Math.floor(remaining / 3_600_000)) : 0;
  const mins =
    remaining !== null
      ? Math.max(0, Math.floor((remaining % 3_600_000) / 60_000))
      : 0;
  const overdue = remaining !== null && remaining <= 0;

  return (
    <div className="space-y-3">
      <div
        className={`p-3 rounded-xl text-xs leading-relaxed ${
          overdue
            ? "bg-gray-100 border border-gray-200 text-gray-600"
            : "bg-emerald-50 border border-emerald-100 text-emerald-900"
        }`}
      >
        {overdue ? (
          <>
            <strong>48h window passed</strong> — funds will auto-release to
            the seller shortly. You can still open a dispute if something's
            wrong, but it'll go through manual review.
          </>
        ) : (
          <>
            <strong>
              {hours}h {mins}m left
            </strong>{" "}
            to confirm the item is OK or open a dispute. After that, the
            funds auto-release to the seller.
          </>
        )}
      </div>
      <button
        type="button"
        disabled={props.busy}
        onClick={props.onConfirm}
        className="w-full py-3 text-sm font-bold bg-black text-white rounded-xl disabled:opacity-50"
      >
        ✓ Everything's OK — release funds to seller
      </button>
    </div>
  );
}
