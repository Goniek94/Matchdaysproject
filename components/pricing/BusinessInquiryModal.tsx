"use client";

import { useState } from "react";
import { X, Loader2, Building2, Check } from "lucide-react";
import { submitBusinessInquiry } from "@/lib/api/business-inquiries";

interface Props {
  onClose: () => void;
}

/**
 * "Are you a shop?" B2B lead-capture modal. Anonymous-allowed — backend
 * stamps userId if a JWT cookie is present, otherwise stores as anon.
 *
 * On success we show a thank-you state for 2s before auto-closing so the
 * user has tangible feedback. Errors surface inline; we don't throw the
 * modal away on failure (would lose their typed message).
 */
export function BusinessInquiryModal({ onClose }: Props) {
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [estimatedVolume, setEstimatedVolume] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    businessName.trim().length > 0 &&
    contactName.trim().length > 0 &&
    /.+@.+\..+/.test(email.trim()) &&
    message.trim().length >= 10 &&
    !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitBusinessInquiry({
        businessName: businessName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        estimatedVolume: estimatedVolume.trim() || undefined,
        message: message.trim(),
      });
      setSubmitted(true);
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl p-7 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Check size={32} strokeWidth={3} />
            </div>
            <h2 className="text-xl font-black text-white mb-2">
              Thanks — we&apos;ll be in touch
            </h2>
            <p className="text-sm text-white/50">
              Our sales team typically responds within 1 business day.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-white/10 text-white/70">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                  Talk to sales
                </h2>
                <p className="text-[11px] text-white/40 font-medium">
                  Tell us about your shop and we&apos;ll prepare a custom offer.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Field
                label="Business name"
                value={businessName}
                onChange={setBusinessName}
                placeholder="Cracovia Memorabilia Sp. z o.o."
                required
              />
              <Field
                label="Contact name"
                value={contactName}
                onChange={setContactName}
                placeholder="Anna Kowalska"
                required
              />
              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="anna@cracoviamemorabilia.pl"
                type="email"
                required
              />
              <Field
                label="Phone (optional)"
                value={phone}
                onChange={setPhone}
                placeholder="+48 600 000 000"
              />
              <Field
                label="Estimated volume (optional)"
                value={estimatedVolume}
                onChange={setEstimatedVolume}
                placeholder="~120 listings / month"
              />

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                  Tell us about your operation
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Current platforms, average sale price, what you're looking for from MatchDays…"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors resize-none"
                />
                <div className="text-[10px] text-white/30 text-right mt-1">
                  {message.length} / 2000
                </div>
              </div>

              {error && (
                <div className="px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full mt-2 py-3.5 font-black text-sm rounded-2xl bg-white text-black hover:bg-white/90 active:scale-95 transition-all uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send inquiry"
                )}
              </button>
              <p className="text-[10px] text-white/30 text-center">
                By submitting, you agree to be contacted by our sales team
                about your inquiry.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Local helpers ────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
      />
    </div>
  );
}
