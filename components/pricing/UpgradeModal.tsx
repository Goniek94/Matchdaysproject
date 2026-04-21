"use client";

import { useState } from "react";
import {
  X,
  Check,
  CreditCard,
  Lock,
  Loader2,
} from "lucide-react";
import { initiateSubscription, confirmSubscription } from "@/lib/api/subscription";
import { useAuth } from "@/lib/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlanDef {
  id: string;
  name: string;
  monthlyPrice: number;
  color: string;
  border: string;
  bg: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ReactNode;
}

interface UpgradeModalProps {
  plan: PlanDef;
  onClose: () => void;
  onSuccess: (tier: string, expiry: string | null) => void;
}

// ─── Duration options ─────────────────────────────────────────────────────────

const DURATIONS = [
  { months: 1,  label: "1 month",   discount: 0 },
  { months: 3,  label: "3 months",  discount: 10 },
  { months: 6,  label: "6 months",  discount: 20 },
  { months: 12, label: "12 months", discount: 30 },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCard(val: string) {
  return val
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UpgradeModal({ plan, onClose, onSuccess }: UpgradeModalProps) {
  const { refreshUser } = useAuth();

  const [selectedMonths, setSelectedMonths] = useState(1);
  const [step, setStep] = useState<"summary" | "payment" | "success">("summary");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Card form state
  const [cardName, setCardName]     = useState("");
  const [cardNum, setCardNum]       = useState("");
  const [expiry, setExpiry]         = useState("");
  const [cvv, setCvv]               = useState("");

  const duration = DURATIONS.find((d) => d.months === selectedMonths) ?? DURATIONS[0];
  const discountedPrice =
    plan.monthlyPrice * selectedMonths * (1 - duration.discount / 100);

  const handlePay = async () => {
    if (!cardName || cardNum.replace(/\s/g, "").length < 16 || expiry.length < 5 || cvv.length < 3) {
      setError("Please fill in all card details correctly.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // Step 1: get a signed payment-intent token from the backend
      const { paymentToken } = await initiateSubscription(plan.id, selectedMonths);

      // Step 2: confirm the upgrade — backend verifies the token before applying
      const res = await confirmSubscription(paymentToken);
      if (res.success) {
        await refreshUser();
        onSuccess(res.data.subscriptionTier, res.data.subscriptionExpiry ?? null);
        setStep("success");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#0f0f14", border: `1px solid ${plan.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-5"
          style={{ background: plan.bg, borderBottom: `1px solid ${plan.border}` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: plan.badgeBg }}>
              <span style={{ color: plan.badgeText }}>{plan.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Upgrading to</p>
              <h2 className="text-xl font-black text-white leading-none">{plan.name} Plan</h2>
            </div>
          </div>
        </div>

        {step === "success" ? (
          /* ── Success state ── */
          <div className="px-6 py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">You&apos;re all set!</h3>
            <p className="text-sm text-white/50 mb-6">
              Welcome to <span style={{ color: plan.badgeText }}>{plan.name}</span>. Your subscription is now active.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-black text-sm text-white transition-all hover:opacity-90"
              style={{ background: plan.badgeBg, border: `1px solid ${plan.border}` }}
            >
              Go to dashboard
            </button>
          </div>
        ) : step === "summary" ? (
          /* ── Plan summary + duration picker ── */
          <div className="px-6 py-5 space-y-5">
            {/* Duration selector */}
            <div>
              <p className="text-xs font-black text-white/40 uppercase tracking-wider mb-3">
                Billing period
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.months}
                    onClick={() => setSelectedMonths(d.months)}
                    className={`relative rounded-xl p-3 text-left transition-all border ${
                      selectedMonths === d.months
                        ? "border-current"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    style={
                      selectedMonths === d.months
                        ? { borderColor: plan.border, background: plan.bg }
                        : { background: "rgba(255,255,255,0.03)" }
                    }
                  >
                    {d.discount > 0 && (
                      <span
                        className="absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full"
                        style={{ background: plan.badgeBg, color: plan.badgeText }}
                      >
                        -{d.discount}%
                      </span>
                    )}
                    <p className="text-sm font-black text-white">{d.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                      €{(plan.monthlyPrice * d.months * (1 - d.discount / 100)).toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Price summary */}
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex justify-between text-sm text-white/50 mb-1">
                <span>{plan.name} × {selectedMonths} month{selectedMonths > 1 ? "s" : ""}</span>
                <span>€{(plan.monthlyPrice * selectedMonths).toFixed(2)}</span>
              </div>
              {duration.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-400 mb-1">
                  <span>Discount ({duration.discount}%)</span>
                  <span>-€{(plan.monthlyPrice * selectedMonths * duration.discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-white/10 mt-2 pt-2 flex justify-between font-black text-white">
                <span>Total</span>
                <span style={{ color: plan.badgeText }}>€{discountedPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setStep("payment")}
              className="w-full py-3.5 rounded-xl font-black text-sm transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ background: plan.badgeBg, color: plan.badgeText, border: `1px solid ${plan.border}` }}
            >
              <CreditCard size={16} />
              Continue to payment
            </button>
          </div>
        ) : (
          /* ── Payment form ── */
          <div className="px-6 py-5 space-y-4">
            {/* Order recap */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">{plan.name} · {duration.label}</span>
              <span className="font-black" style={{ color: plan.badgeText }}>€{discountedPrice.toFixed(2)}</span>
            </div>

            {/* Card fields */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                  Cardholder name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-white/20 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                  Card number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNum}
                  onChange={(e) => setCardNum(formatCard(e.target.value))}
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-white/20 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-white/20 outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-white/20 outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-xs font-bold text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-black text-sm transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: plan.badgeBg, color: plan.badgeText, border: `1px solid ${plan.border}` }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Lock size={14} />
                  Pay €{discountedPrice.toFixed(2)}
                </>
              )}
            </button>

            <button
              onClick={() => setStep("summary")}
              className="w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              ← Back
            </button>

            <p className="text-center text-[10px] text-white/20 flex items-center justify-center gap-1">
              <Lock size={9} />
              Payments are encrypted and secure
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
