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
  shippingCost: string;
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
