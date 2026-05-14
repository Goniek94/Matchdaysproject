"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Wallet as WalletIcon,
  CheckCircle2,
  AlertTriangle,
  Banknote,
  Loader2,
  ExternalLink,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import {
  getBankAccount,
  upsertBankAccount,
  deleteBankAccount,
  startBankOnboarding,
  getStripeDashboardLink,
  type BankAccount,
} from "@/lib/api/wallet";
import { cn } from "@/lib/utils";

// ─── IBAN helpers ────────────────────────────────────────────────────────────

const COUNTRIES = [
  { code: "PL", label: "Poland" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "ES", label: "Spain" },
  { code: "IT", label: "Italy" },
  { code: "NL", label: "Netherlands" },
  { code: "BE", label: "Belgium" },
  { code: "AT", label: "Austria" },
  { code: "PT", label: "Portugal" },
  { code: "IE", label: "Ireland" },
  { code: "FI", label: "Finland" },
  { code: "GB", label: "United Kingdom" },
];

function normalizeIban(raw: string): string {
  return raw.replace(/[\s_-]/g, "").toUpperCase();
}

function formatIbanForDisplay(raw: string): string {
  return normalizeIban(raw).match(/.{1,4}/g)?.join(" ") ?? raw;
}

// ─── Status badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: BankAccount["status"] }) {
  const map = {
    PENDING: {
      bg: "bg-amber-50 border-amber-200 text-amber-800",
      icon: <Loader2 size={11} className="animate-spin" />,
      label: "Pending verification",
    },
    VERIFIED: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: <CheckCircle2 size={11} />,
      label: "Verified",
    },
    FAILED: {
      bg: "bg-red-50 border-red-200 text-red-700",
      icon: <AlertTriangle size={11} />,
      label: "Verification failed",
    },
  };
  const meta = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-full border",
        meta.bg,
      )}
    >
      {meta.icon}
      {meta.label}
    </span>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function WalletSettings() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"save" | "onboard" | "delete" | "dashboard" | null>(null);
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [editing, setEditing] = useState(false);

  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [country, setCountry] = useState("PL");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBankAccount();
      if (res.success && res.data) {
        setAccount(res.data);
        setEditing(false);
      } else {
        setAccount(null);
        setEditing(true);
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Could not load bank settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    const normalized = normalizeIban(iban);
    if (normalized.length < 15) {
      toast.error("IBAN looks too short.");
      return;
    }
    if (!accountHolder.trim()) {
      toast.error("Account holder name is required.");
      return;
    }
    setBusy("save");
    try {
      const res = await upsertBankAccount({
        iban: normalized,
        bic: bic ? bic.replace(/\s+/g, "").toUpperCase() : undefined,
        accountHolder: accountHolder.trim(),
        country: country.toUpperCase(),
      });
      if (res.success) {
        toast.success("Bank account saved. Now verify it with Stripe to enable payouts.");
        await load();
      } else {
        toast.error(res.message ?? "Save failed.");
      }
    } catch (err: any) {
      const msg = Array.isArray(err?.message) ? err.message.join(" • ") : err?.message;
      toast.error(msg ?? "Save failed.");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remove this bank account? You'll be unable to withdraw until you add a new one.")) {
      return;
    }
    setBusy("delete");
    try {
      await deleteBankAccount();
      setAccount(null);
      setEditing(true);
      setIban("");
      setBic("");
      setAccountHolder("");
      toast.success("Bank account removed.");
    } catch (err: any) {
      toast.error(err?.message ?? "Delete failed.");
    } finally {
      setBusy(null);
    }
  };

  const handleStartOnboarding = async () => {
    setBusy("onboard");
    try {
      const res = await startBankOnboarding();
      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error(res.message ?? "Could not start verification.");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Verification flow unavailable.");
    } finally {
      setBusy(null);
    }
  };

  const handleOpenDashboard = async () => {
    setBusy("dashboard");
    try {
      const res = await getStripeDashboardLink();
      if (res.success && res.data?.url) {
        window.open(res.data.url, "_blank");
      } else {
        toast.error(res.message ?? "Dashboard not available yet.");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Dashboard unavailable.");
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div id="bank-account" className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
          <WalletIcon size={22} className="text-gray-800" />
          Wallet & Payouts
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Connect a bank account to receive payouts from sales and wallet withdrawals.
          Funds are processed securely by Stripe — we never see your full account number.
        </p>
      </div>

      {/* Bank account card */}
      {!editing && account ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center shrink-0">
                <Banknote size={20} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                  Bank account
                </p>
                <p className="text-base font-bold text-gray-900 truncate">
                  {account.accountHolder}
                </p>
                <p className="text-sm text-gray-500 font-mono">
                  {account.country} · IBAN ****{account.last4 ?? "----"}
                  {account.bic && <> · BIC {account.bic}</>}
                </p>
              </div>
            </div>
            <StatusBadge status={account.status} />
          </div>

          {/* Action row */}
          <div className="flex flex-col sm:flex-row gap-2 p-4 bg-gray-50/50">
            {account.status !== "VERIFIED" ? (
              <button
                onClick={handleStartOnboarding}
                disabled={busy === "onboard"}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-black text-white font-bold text-sm rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {busy === "onboard" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ShieldCheck size={14} />
                )}
                {account.status === "FAILED" ? "Retry verification" : "Verify with Stripe"}
                <ExternalLink size={12} />
              </button>
            ) : (
              <button
                onClick={handleOpenDashboard}
                disabled={busy === "dashboard"}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-2 border-gray-200 text-gray-800 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {busy === "dashboard" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ExternalLink size={14} />
                )}
                Open Stripe dashboard
              </button>
            )}
            <button
              onClick={() => {
                setIban("");
                setBic(account.bic ?? "");
                setAccountHolder(account.accountHolder);
                setCountry(account.country);
                setEditing(true);
              }}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-2 border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors"
            >
              Replace
            </button>
            <button
              onClick={handleDelete}
              disabled={busy === "delete"}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-2 border-red-100 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {busy === "delete" ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Remove
            </button>
          </div>

          {account.status !== "VERIFIED" && (
            <div className="px-6 py-4 border-t border-gray-100 bg-amber-50/40">
              <p className="text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">Heads up:</span> withdrawals are disabled until your bank account is verified.
                Stripe will collect a quick KYC (identity confirmation) — usually under 5 minutes.
              </p>
            </div>
          )}
        </div>
      ) : (
        // Form
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                Account holder full name
              </span>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="John Doe"
                className="mt-1.5 w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:border-black focus:outline-none transition-colors"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                Country of bank
              </span>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1.5 w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:border-black focus:outline-none transition-colors bg-white"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label} ({c.code})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                BIC / SWIFT (optional)
              </span>
              <input
                type="text"
                value={bic}
                onChange={(e) => setBic(e.target.value.toUpperCase())}
                placeholder="BREXPLPW"
                className="mt-1.5 w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-mono font-semibold focus:border-black focus:outline-none transition-colors uppercase"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                IBAN
              </span>
              <input
                type="text"
                value={formatIbanForDisplay(iban)}
                onChange={(e) => setIban(normalizeIban(e.target.value))}
                placeholder="PL61 1090 1014 0000 0712 1981 2874"
                className="mt-1.5 w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-mono font-semibold focus:border-black focus:outline-none transition-colors tracking-wider"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                We validate the IBAN locally before saving. Spaces are ignored.
              </p>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            {account && (
              <button
                onClick={() => setEditing(false)}
                disabled={busy === "save"}
                className="py-2.5 px-4 bg-white border-2 border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={busy === "save"}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-black text-white font-bold text-sm rounded-xl hover:bg-gray-800 disabled:opacity-50"
            >
              {busy === "save" ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Save bank account
            </button>
          </div>
        </div>
      )}

      {/* Trust line */}
      <div className="flex items-center gap-2.5 text-xs text-gray-500">
        <ShieldCheck size={14} className="text-gray-400" />
        <span>
          Your bank details are tokenized and handled by Stripe (PCI DSS Level 1).
          Matchdays only stores the last 4 digits for display.
        </span>
      </div>
    </div>
  );
}
