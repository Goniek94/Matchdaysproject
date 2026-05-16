/**
 * Orders API client.
 *
 * Backend canonical routes — see `src/modules/orders/orders.controller.ts`:
 *
 *   POST   /orders/buy-now/:auctionId        → create PENDING_PAYMENT order
 *   POST   /orders/:id/pay                   → wallet or stripe-checkout
 *   POST   /orders/:id/ship                  → seller marks SHIPPED
 *   POST   /orders/:id/deliver               → buyer marks DELIVERED
 *   POST   /orders/:id/confirm-receipt       → buyer release escrow → COMPLETED
 *   POST   /orders/:id/cancel                → buyer cancels PENDING_PAYMENT
 *   POST   /orders/:id/dispute               → either party opens dispute
 *   POST   /orders/:id/refund                → admin-only refund
 *   GET    /orders/:id                       → participant only
 *   GET    /orders/my/buying[?status=...]    → caller's purchases
 *   GET    /orders/my/selling[?status=...]   → caller's sales
 *
 * Money values are returned as Decimal strings ("12.50") — never compute on
 * the client beyond display formatting. Use `formatMoney` from wallet.ts.
 */

import apiClient from "./client";
import type { ApiResponse } from "./config";

// ─── Types ────────────────────────────────────────────────────────────────────

export const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  // Item already paid via bid-hold capture. Buyer still has to confirm
  // shipping address + pay shipping handling fee — see confirmShipping().
  "AWAITING_SHIPPING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
  "DISPUTED",
  "REFUND_REQUESTED",
  "REFUNDED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type PaymentMethod = "WALLET" | "STRIPE_CARD";

export interface OrderAuctionSummary {
  id: string;
  title: string;
  images: string[];
  itemType: string | null;
  shippingFrom?: string | null;
  seller?: { id: string; username: string } | null;
}

export interface OrderPartyMini {
  id: string;
  username: string;
  email?: string;
}

/**
 * Single-order shape. Mirrors the Prisma Order plus the includes the backend
 * attaches in `findById` / list endpoints.
 *
 * Note: timestamps are ISO strings; money fields are Decimal strings.
 */
export interface OrderDto {
  id: string;

  // Relations
  auctionId: string;
  auction: OrderAuctionSummary;
  buyerId: string;
  buyer?: OrderPartyMini;
  sellerId: string;
  seller?: OrderPartyMini;

  // Money (Decimal strings)
  itemPrice: string;
  /** Total shipping charged to the buyer (already includes handling fee). */
  shippingCost: string;
  /** What the seller receives for postage (their declared cost). */
  sellerShippingPayout: string;
  /** Platform handling fee — disclosed to buyer as a separate line. */
  shippingHandlingFee: string;
  platformFee: string;
  totalPaid: string;
  sellerPayout: string;
  currency: string;
  feeTier: string;
  feeRate: number;

  // State
  status: OrderStatus;
  paymentMethod: PaymentMethod | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  buyerDebitTxId: string | null;
  sellerCreditTxId: string | null;
  refundTxId: string | null;

  // Shipping
  shippingAddress: Record<string, unknown> | null;
  shippingCarrier: string | null;
  trackingNumber: string | null;

  // Lifecycle timestamps
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  refundedAt: string | null;
  disputedAt: string | null;

  // Disputes / cancel reasons
  refundReason: string | null;
  cancelReason: string | null;

  createdAt: string;
  updatedAt: string;
}

export type OrderListItem = Omit<OrderDto, "buyer" | "seller"> & {
  buyer?: OrderPartyMini;
  seller?: OrderPartyMini;
};

// ─── Pay endpoint discriminated response ─────────────────────────────────────

export interface PayWalletResult {
  paid: true;
  order: OrderDto;
}

export interface PayStripeResult {
  paid: false;
  checkoutUrl: string;
  sessionId: string;
}

export type PayResult = PayWalletResult | PayStripeResult;

// ─── Request payloads ────────────────────────────────────────────────────────

export interface PayOrderPayload {
  paymentMethod: PaymentMethod;
  /** Snapshotted onto the order before payment confirmation. */
  shippingAddress?: Record<string, unknown>;
}

export interface ShipOrderPayload {
  carrier: string;
  trackingNumber: string;
}

export interface DisputeOrderPayload {
  reason: string;
}

export interface CancelOrderPayload {
  reason?: string;
}

export interface RefundOrderPayload {
  reason: string;
}

// ─── Endpoints ───────────────────────────────────────────────────────────────

export async function createFromBuyNow(
  auctionId: string,
): Promise<ApiResponse<OrderDto>> {
  const res = await apiClient.post<ApiResponse<OrderDto>>(
    `/orders/buy-now/${auctionId}`,
  );
  return res.data;
}

export async function getOrder(orderId: string): Promise<ApiResponse<OrderDto>> {
  const res = await apiClient.get<ApiResponse<OrderDto>>(`/orders/${orderId}`);
  return res.data;
}

export async function listBuying(
  status?: OrderStatus,
): Promise<ApiResponse<OrderListItem[]>> {
  const res = await apiClient.get<ApiResponse<OrderListItem[]>>(
    "/orders/my/buying",
    { params: status ? { status } : undefined },
  );
  return res.data;
}

export async function listSelling(
  status?: OrderStatus,
): Promise<ApiResponse<OrderListItem[]>> {
  const res = await apiClient.get<ApiResponse<OrderListItem[]>>(
    "/orders/my/selling",
    { params: status ? { status } : undefined },
  );
  return res.data;
}

export async function pay(
  orderId: string,
  payload: PayOrderPayload,
): Promise<ApiResponse<PayResult>> {
  const res = await apiClient.post<ApiResponse<PayResult>>(
    `/orders/${orderId}/pay`,
    payload,
  );
  return res.data;
}

/**
 * Confirm shipping address + pay shipping handling fee on an
 * AWAITING_SHIPPING order. The item was already paid via the bid escrow
 * when the auction closed; this finishes the transaction and moves the
 * order to PAID. Backend recomputes the shipping cost from the auction's
 * declared shipping value — we never trust the client for pricing.
 */
export async function confirmShipping(
  orderId: string,
  shippingAddress: Record<string, unknown>,
): Promise<ApiResponse<{ order: OrderDto }>> {
  const res = await apiClient.post<ApiResponse<{ order: OrderDto }>>(
    `/orders/${orderId}/confirm-shipping`,
    { shippingAddress },
  );
  return res.data;
}

/**
 * Reason codes the buyer can pick when cancelling a won auction. UI keeps
 * these stable so we can attach a "ban warning" badge to the unjustified
 * ones AT THE PICKER, before the user submits. Backend has the same set
 * (kept in OrdersService.UNJUSTIFIED_CANCEL_CODES).
 *
 * `justified` reasons skip the bid ban (real product / counterparty
 * problems). `unjustified` reasons cost the user a 7-day bid ban — the UI
 * MUST show this in the picker, and confirm via a second click.
 */
export const CANCEL_REASON_CODES = [
  // Justified — no penalty
  { code: "delivery_impossible", label: "Can't deliver to my country / address", justified: true },
  { code: "seller_problem", label: "Seller seems unresponsive / suspicious", justified: true },
  { code: "wrong_item", label: "Item is not as described in the listing", justified: true },
  // Unjustified — incurs a 7-day bid ban
  { code: "changed_mind", label: "Changed my mind", justified: false },
  { code: "cant_afford", label: "Can't afford it right now", justified: false },
  { code: "no_longer_interested", label: "No longer interested", justified: false },
  { code: "other", label: "Other reason (not listed)", justified: false },
] as const;

export type CancelReasonCode = (typeof CANCEL_REASON_CODES)[number]["code"];

/**
 * Buyer cancels a won auction (PENDING_PAYMENT or AWAITING_SHIPPING).
 * Unjustified reason codes (changed_mind, cant_afford, etc.) trigger a
 * 7-day bid ban — surface that warning to the user before they confirm.
 */
export async function cancelAsBuyer(
  orderId: string,
  payload: { reasonCode: CancelReasonCode; reasonText?: string },
): Promise<ApiResponse<OrderDto>> {
  const res = await apiClient.post<ApiResponse<OrderDto>>(
    `/orders/${orderId}/cancel-as-buyer`,
    payload,
  );
  return res.data;
}

/**
 * Seller cancels a sold order (any status up to and including PAID, NOT
 * after SHIPPED). Refunds the buyer in full — item price always, and
 * shipping fee too if it was already paid. No bid ban (sellers aren't
 * bidders) but the cancel is recorded for reputation tracking.
 */
export async function cancelAsSeller(
  orderId: string,
  payload: { reasonCode: string; reasonText?: string },
): Promise<ApiResponse<OrderDto>> {
  const res = await apiClient.post<ApiResponse<OrderDto>>(
    `/orders/${orderId}/cancel-as-seller`,
    payload,
  );
  return res.data;
}

export async function markShipped(
  orderId: string,
  payload: ShipOrderPayload,
): Promise<ApiResponse<OrderDto>> {
  const res = await apiClient.post<ApiResponse<OrderDto>>(
    `/orders/${orderId}/ship`,
    payload,
  );
  return res.data;
}

export async function markDelivered(
  orderId: string,
): Promise<ApiResponse<OrderDto>> {
  const res = await apiClient.post<ApiResponse<OrderDto>>(
    `/orders/${orderId}/deliver`,
  );
  return res.data;
}

export async function confirmReceipt(
  orderId: string,
): Promise<ApiResponse<OrderDto>> {
  const res = await apiClient.post<ApiResponse<OrderDto>>(
    `/orders/${orderId}/confirm-receipt`,
  );
  return res.data;
}

export async function cancelOrder(
  orderId: string,
  payload: CancelOrderPayload = {},
): Promise<ApiResponse<OrderDto>> {
  const res = await apiClient.post<ApiResponse<OrderDto>>(
    `/orders/${orderId}/cancel`,
    payload,
  );
  return res.data;
}

export async function openDispute(
  orderId: string,
  payload: DisputeOrderPayload,
): Promise<ApiResponse<OrderDto>> {
  const res = await apiClient.post<ApiResponse<OrderDto>>(
    `/orders/${orderId}/dispute`,
    payload,
  );
  return res.data;
}

export async function refundOrder(
  orderId: string,
  payload: RefundOrderPayload,
): Promise<ApiResponse<OrderDto>> {
  const res = await apiClient.post<ApiResponse<OrderDto>>(
    `/orders/${orderId}/refund`,
    payload,
  );
  return res.data;
}

// ─── Display helpers ─────────────────────────────────────────────────────────

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Awaiting payment",
  AWAITING_SHIPPING: "Item paid — confirm shipping",
  PAID: "Paid — preparing to ship",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  DISPUTED: "Disputed",
  REFUND_REQUESTED: "Refund requested",
  REFUNDED: "Refunded",
  CANCELLED: "Cancelled",
};

export function orderStatusLabel(status: OrderStatus): string {
  return STATUS_LABEL[status] ?? status;
}

/** Statuses where the order is still live (funds in escrow, not finalised). */
export function isOrderActive(status: OrderStatus): boolean {
  return (
    status === "PENDING_PAYMENT" ||
    status === "PAID" ||
    status === "SHIPPED" ||
    status === "DELIVERED" ||
    status === "DISPUTED" ||
    status === "REFUND_REQUESTED"
  );
}
