/**
 * Wallet API client.
 *
 * Backend is the source of truth for balances — we never compute on the
 * client. All money values come back as Decimal strings (precision-safe);
 * convert with `parseFloat` only when displaying.
 */

import apiClient from "./client";
import type { ApiResponse } from "./config";

// ─── Types ────────────────────────────────────────────────────────────────────

export type WalletStatus = "active" | "frozen" | "closed";
export type WalletTransactionType =
  | "deposit"
  | "withdrawal"
  | "auction_credit"
  | "auction_debit"
  | "refund"
  | "fee"
  | "adjustment"
  // Bid-escrow lifecycle — money "reserved" when placing a bid, "released"
  // when outbid / auction ends without win.
  | "bid_hold"
  | "bid_release";
export type WalletTransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled";

export type BankAccountStatus = "PENDING" | "VERIFIED" | "FAILED";

export interface WalletSummary {
  id: string;
  /**
   * Spendable balance — Decimal as string. Already net of pending
   * withdrawals AND active bid holds (both are reserved up-front).
   */
  balance: string;
  /** Sum of all active bid holds. Surface as "locked in bids". */
  heldInBids: string;
  /** Convenience: balance + heldInBids (total wallet value). */
  totalValue: string;
  currency: string;
  status: WalletStatus;
  pendingWithdrawals: string;
  pendingDeposits: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: WalletTransactionType;
  status: WalletTransactionStatus;
  amount: string;
  currency: string;
  stripeRef: string | null;
  auctionId: string | null;
  description: string | null;
  balanceAfter: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface TransactionPage {
  items: WalletTransaction[];
  total: number;
  page: number;
  totalPages: number;
}

export interface InitiateDepositResponse {
  transactionId: string;
  sessionId: string;
  /** Stripe-hosted Checkout URL — redirect the browser here. */
  url: string;
  amount: string;
  currency: string;
}

export interface InitiateWithdrawalResponse {
  transactionId: string;
  payoutId: string;
  amount: string;
  currency: string;
  status: "pending";
}

export interface BankAccount {
  id: string;
  accountHolder: string;
  country: string;
  currency: string;
  last4: string | null;
  bic: string | null;
  status: BankAccountStatus;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertBankAccountPayload {
  iban: string;
  bic?: string;
  accountHolder: string;
  country: string;
}

export interface OnboardingLinkResponse {
  url: string;
  expiresAt: string;
}

// ─── Wallet ──────────────────────────────────────────────────────────────────

export async function getWallet(): Promise<ApiResponse<WalletSummary>> {
  const res = await apiClient.get<ApiResponse<WalletSummary>>("/wallet");
  return res.data;
}

export async function listTransactions(params?: {
  page?: number;
  limit?: number;
  type?: WalletTransactionType;
  status?: WalletTransactionStatus;
}): Promise<ApiResponse<TransactionPage> & TransactionPage> {
  const res = await apiClient.get<ApiResponse<TransactionPage> & TransactionPage>(
    "/wallet/transactions",
    { params },
  );
  return res.data;
}

// ─── Deposit / Withdrawal ────────────────────────────────────────────────────

export async function initiateDeposit(
  amount: number,
): Promise<ApiResponse<InitiateDepositResponse>> {
  const res = await apiClient.post<ApiResponse<InitiateDepositResponse>>(
    "/wallet/deposit/initiate",
    { amount },
  );
  return res.data;
}

export async function initiateWithdrawal(
  amount: number,
): Promise<ApiResponse<InitiateWithdrawalResponse>> {
  const res = await apiClient.post<ApiResponse<InitiateWithdrawalResponse>>(
    "/wallet/withdrawal/initiate",
    { amount },
  );
  return res.data;
}

// ─── Bank account ────────────────────────────────────────────────────────────

export async function getBankAccount(): Promise<
  ApiResponse<BankAccount | null>
> {
  const res = await apiClient.get<ApiResponse<BankAccount | null>>(
    "/wallet/bank-account",
  );
  return res.data;
}

export async function upsertBankAccount(
  payload: UpsertBankAccountPayload,
): Promise<ApiResponse<BankAccount>> {
  const res = await apiClient.put<ApiResponse<BankAccount>>(
    "/wallet/bank-account",
    payload,
  );
  return res.data;
}

export async function deleteBankAccount(): Promise<{ success: boolean }> {
  const res = await apiClient.delete<{ success: boolean }>(
    "/wallet/bank-account",
  );
  return res.data;
}

export async function startBankOnboarding(): Promise<
  ApiResponse<OnboardingLinkResponse>
> {
  const res = await apiClient.post<ApiResponse<OnboardingLinkResponse>>(
    "/wallet/bank-account/onboarding",
  );
  return res.data;
}

export async function getStripeDashboardLink(): Promise<
  ApiResponse<{ url: string }>
> {
  const res = await apiClient.get<ApiResponse<{ url: string }>>(
    "/wallet/bank-account/dashboard",
  );
  return res.data;
}

// ─── Display helpers ─────────────────────────────────────────────────────────

export function formatMoney(value: string | number, currency = "EUR"): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (!Number.isFinite(n)) return `0.00 ${currency}`;
  return n.toLocaleString("en-IE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });
}
