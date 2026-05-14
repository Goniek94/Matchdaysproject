"use client";

// Wallet is per-user (balance, transactions, Stripe redirect handling) — there's
// nothing useful to prerender. Opting out of static generation also sidesteps
// the Next 14 "useSearchParams must be wrapped in Suspense" build error that
// surfaced once we started reading ?deposit=success from the Stripe return URL.
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Wallet as WalletIcon,
  ArrowDownToLine,
  ArrowUpFromLine,
  Loader2,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  Banknote,
  Receipt,
} from "lucide-react";
import {
  formatMoney,
  getWallet,
  initiateDeposit,
  initiateWithdrawal,
  listTransactions,
  type WalletSummary,
  type WalletTransaction,
} from "@/lib/api/wallet";
import { cn } from "@/lib/utils";

// ─── Sub-components ──────────────────────────────────────────────────────────

function BalanceHero({
  wallet,
  onDeposit,
  onWithdraw,
  refreshing,
  onRefresh,
}: {
  wallet: WalletSummary;
  onDeposit: () => void;
  onWithdraw: () => void;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const balance = parseFloat(wallet.balance);
  const pendingOut = parseFloat(wallet.pendingWithdrawals);
  const pendingIn = parseFloat(wallet.pendingDeposits);
  const hasPending = pendingOut > 0 || pendingIn > 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-7 md:p-10 shadow-2xl">
      {/* Decorative grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
            <WalletIcon size={20} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">
              Available balance
            </p>
            <p className="text-xs text-white/40">
              Matchdays wallet · {wallet.currency}
            </p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors"
          title="Refresh"
        >
          <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="relative">
        <p className="text-6xl md:text-7xl font-black tracking-tighter leading-none">
          {formatMoney(balance, wallet.currency)}
        </p>
        {hasPending && (
          <div className="flex flex-wrap gap-3 mt-5 text-xs">
            {pendingIn > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
                <Clock size={11} />
                +{formatMoney(pendingIn)} pending deposit
              </span>
            )}
            {pendingOut > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold">
                <Clock size={11} />
                −{formatMoney(pendingOut)} pending withdrawal
              </span>
            )}
          </div>
        )}
      </div>

      <div className="relative grid grid-cols-2 gap-3 mt-8">
        <button
          onClick={onDeposit}
          className="group flex items-center justify-between rounded-2xl bg-white text-black px-5 py-4 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
        >
          <span className="flex items-center gap-2.5">
            <ArrowDownToLine size={18} />
            Deposit
          </span>
          <ChevronRight
            size={18}
            className="text-gray-400 group-hover:translate-x-0.5 transition-transform"
          />
        </button>
        <button
          onClick={onWithdraw}
          disabled={balance <= 0}
          className={cn(
            "group flex items-center justify-between rounded-2xl px-5 py-4 font-bold transition-all border-2",
            balance > 0
              ? "border-white/20 bg-white/5 text-white hover:bg-white/10"
              : "border-white/5 bg-white/0 text-white/30 cursor-not-allowed",
          )}
        >
          <span className="flex items-center gap-2.5">
            <ArrowUpFromLine size={18} />
            Withdraw
          </span>
          <ChevronRight
            size={18}
            className="opacity-40 group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}

const TX_META: Record<
  WalletTransaction["type"],
  { label: string; icon: React.ReactNode; sign: "+" | "−" }
> = {
  deposit: {
    label: "Deposit",
    icon: <ArrowDownToLine size={14} className="text-emerald-600" />,
    sign: "+",
  },
  withdrawal: {
    label: "Withdrawal",
    icon: <ArrowUpFromLine size={14} className="text-amber-600" />,
    sign: "−",
  },
  auction_credit: {
    label: "Sale credit",
    icon: <ArrowDownToLine size={14} className="text-emerald-600" />,
    sign: "+",
  },
  auction_debit: {
    label: "Purchase",
    icon: <ArrowUpFromLine size={14} className="text-gray-700" />,
    sign: "−",
  },
  refund: {
    label: "Refund",
    icon: <ArrowDownToLine size={14} className="text-emerald-600" />,
    sign: "+",
  },
  fee: {
    label: "Platform fee",
    icon: <Receipt size={14} className="text-gray-500" />,
    sign: "−",
  },
  adjustment: {
    label: "Adjustment",
    icon: <Banknote size={14} className="text-gray-500" />,
    sign: "+",
  },
};

const STATUS_META: Record<
  WalletTransaction["status"],
  { label: string; className: string; icon: React.ReactNode }
> = {
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 size={11} />,
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock size={11} />,
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle size={11} />,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    icon: <XCircle size={11} />,
  },
};

function TransactionRow({ tx }: { tx: WalletTransaction }) {
  const meta = TX_META[tx.type] ?? TX_META.adjustment;
  const status = STATUS_META[tx.status];
  const amount = parseFloat(tx.amount);

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-bold text-gray-900">{meta.label}</span>
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
              status.className,
            )}
          >
            {status.icon}
            {status.label}
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate">
          {tx.description ?? "—"}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {new Date(tx.createdAt).toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p
          className={cn(
            "text-sm font-extrabold tabular-nums",
            meta.sign === "+"
              ? tx.status === "completed"
                ? "text-emerald-600"
                : "text-gray-400"
              : "text-gray-900",
          )}
        >
          {meta.sign}
          {formatMoney(amount, tx.currency)}
        </p>
        {tx.balanceAfter && (
          <p className="text-[10px] text-gray-400 tabular-nums">
            bal {formatMoney(tx.balanceAfter, tx.currency)}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Amount modal (deposit / withdraw) ────────────────────────────────────────

function AmountModal({
  mode,
  open,
  onClose,
  onConfirm,
  maxAmount,
  busy,
}: {
  mode: "deposit" | "withdraw";
  open: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  maxAmount?: number;
  busy: boolean;
}) {
  const [amount, setAmount] = useState("");
  const presets = mode === "deposit" ? [20, 50, 100, 250] : [25, 50, 100];

  useEffect(() => {
    if (open) setAmount("");
  }, [open]);

  if (!open) return null;

  const numeric = parseFloat(amount);
  const validAmount =
    Number.isFinite(numeric) &&
    numeric > 0 &&
    (mode === "deposit" || (maxAmount !== undefined && numeric <= maxAmount));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-4 rounded-3xl bg-white shadow-2xl p-6 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
              {mode === "deposit" ? (
                <ArrowDownToLine size={16} className="text-white" />
              ) : (
                <ArrowUpFromLine size={16} className="text-white" />
              )}
            </div>
            <h2 className="text-lg font-black text-gray-900">
              {mode === "deposit" ? "Deposit funds" : "Withdraw funds"}
            </h2>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          {mode === "deposit"
            ? "You'll be redirected to Stripe to complete the payment securely. Funds appear in your wallet once the payment confirms."
            : `Payouts go to your verified bank account via Stripe. Available to withdraw: ${formatMoney(maxAmount ?? 0)}.`}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {presets.map((v) => (
            <button
              key={v}
              onClick={() => setAmount(String(v))}
              className={cn(
                "px-3 py-1.5 rounded-xl border-2 text-sm font-bold transition-colors",
                String(v) === amount
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
              )}
            >
              €{v}
            </button>
          ))}
          {mode === "withdraw" && maxAmount && maxAmount > 0 && (
            <button
              onClick={() => setAmount(maxAmount.toFixed(2))}
              className="px-3 py-1.5 rounded-xl border-2 border-gray-200 bg-white text-sm font-bold text-gray-700 hover:border-gray-400 transition-colors"
            >
              All
            </button>
          )}
        </div>

        <label className="block">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
            Amount (EUR)
          </span>
          <div className="mt-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">
              €
            </span>
            <input
              autoFocus
              type="number"
              inputMode="decimal"
              step="0.01"
              min={mode === "deposit" ? 1 : 5}
              max={mode === "deposit" ? 10000 : maxAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-4 text-2xl font-black text-gray-900 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none tabular-nums"
            />
          </div>
        </label>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={busy}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(numeric)}
            disabled={!validAmount || busy}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
              validAmount && !busy
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed",
            )}
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            {mode === "deposit" ? "Continue to Stripe" : "Request payout"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function WalletPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  const loadAll = useCallback(async (showSpinner = true) => {
    if (showSpinner) setRefreshing(true);
    try {
      const [w, tx] = await Promise.all([getWallet(), listTransactions({ limit: 20 })]);
      if (w.success && w.data) setWallet(w.data);
      // listTransactions returns { items, total, ... } spread on ApiResponse
      const items = (tx as any).items ?? (tx.data as any)?.items;
      if (items) setTransactions(items);
    } catch (err: any) {
      toast.error(err?.message ?? "Could not load wallet.");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll(false);
  }, [loadAll]);

  // Returned from Stripe Checkout — show a toast and refresh.
  useEffect(() => {
    const deposit = searchParams.get("deposit");
    if (deposit === "success") {
      toast.success(
        "Payment received — funds will appear once Stripe confirms (usually seconds).",
      );
      // Refresh shortly after, then once more in case the webhook is slow.
      loadAll();
      const t = setTimeout(() => loadAll(false), 4000);
      // Clean URL
      router.replace("/wallet");
      return () => clearTimeout(t);
    }
    if (deposit === "cancelled") {
      toast("Deposit cancelled — no charge was made.");
      router.replace("/wallet");
    }
  }, [searchParams, router, loadAll]);

  const handleDeposit = async (amount: number) => {
    setActionBusy(true);
    try {
      const res = await initiateDeposit(amount);
      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error(res.message ?? "Could not start the deposit.");
      }
    } catch (err: any) {
      toast.error(
        Array.isArray(err?.message) ? err.message.join(" • ") : err?.message ?? "Deposit failed.",
      );
    } finally {
      setActionBusy(false);
      setDepositOpen(false);
    }
  };

  const handleWithdraw = async (amount: number) => {
    setActionBusy(true);
    try {
      const res = await initiateWithdrawal(amount);
      if (res.success) {
        toast.success(
          "Payout requested. You'll see the funds in your bank account once Stripe processes it.",
        );
        setWithdrawOpen(false);
        await loadAll(false);
      } else {
        toast.error(res.message ?? "Could not request the withdrawal.");
      }
    } catch (err: any) {
      toast.error(
        Array.isArray(err?.message) ? err.message.join(" • ") : err?.message ?? "Withdrawal failed.",
      );
    } finally {
      setActionBusy(false);
    }
  };

  const balance = useMemo(
    () => (wallet ? parseFloat(wallet.balance) : 0),
    [wallet],
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <div className="h-44 bg-gray-100 rounded-3xl animate-pulse" />
        <div className="mt-6 h-64 bg-gray-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">
        <AlertTriangle size={28} className="text-red-500 mx-auto mb-3" />
        <h1 className="text-xl font-black text-gray-900">Wallet unavailable</h1>
        <p className="text-sm text-gray-500 mt-1">Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900">
            Wallet
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Top up, withdraw, and review every euro that moved through your
            Matchdays account.
          </p>
        </div>
        <Link
          href="/settings#bank-account"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
        >
          Bank settings
          <ChevronRight size={14} />
        </Link>
      </div>

      <BalanceHero
        wallet={wallet}
        onDeposit={() => setDepositOpen(true)}
        onWithdraw={() => setWithdrawOpen(true)}
        refreshing={refreshing}
        onRefresh={() => loadAll()}
      />

      <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest">
              Recent activity
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Last 20 transactions
            </p>
          </div>
        </div>
        {transactions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <Receipt size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-bold text-gray-700">No activity yet</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Your deposits, withdrawals and marketplace flows will land here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </div>

      <AmountModal
        mode="deposit"
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        onConfirm={handleDeposit}
        busy={actionBusy}
      />
      <AmountModal
        mode="withdraw"
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onConfirm={handleWithdraw}
        maxAmount={balance}
        busy={actionBusy}
      />
    </div>
  );
}
