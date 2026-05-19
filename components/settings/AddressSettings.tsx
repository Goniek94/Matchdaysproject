"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader2, MapPin } from "lucide-react";
import {
  getMyAddress,
  updateMyAddress,
  type UserAddress,
} from "@/lib/api/users";

/**
 * Address & shipping settings.
 *
 * One source of truth for the buyer's shipping address — surfaced both in
 * its own settings tab and deep-linked from the checkout page when an
 * address is missing/incomplete (`/settings#address`).
 *
 * Form fields map 1-to-1 to backend columns on the User row:
 *   addressStreet · addressCity · addressPostalCode · addressCountry
 * The API wrapper translates `{street, city, postalCode, country}` to those
 * snake-ish names; the frontend stays clean.
 *
 * Validation is intentionally light — the backend stores nullable strings
 * and the checkout page does its own "is this usable?" check (see
 * isAddressUsable). The only thing we strictly require on save is at least
 * ONE field — otherwise the user just hit Save by accident on an empty
 * form and would wipe an existing record.
 */
export default function AddressSettings() {
  const [form, setForm] = useState<UserAddress>({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<
    { kind: "success" | "error"; message: string } | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyAddress();
        if (cancelled) return;
        // Backend wraps in { data: { address } }. Older shape returned
        // address at the root — handle both defensively so we don't blank
        // the form on a transitional deploy.
        const r = res as { data?: { address?: UserAddress }; address?: UserAddress };
        const addr = r?.data?.address ?? r?.address ?? null;
        if (addr) {
          setForm({
            street: addr.street ?? "",
            city: addr.city ?? "",
            postalCode: addr.postalCode ?? "",
            country: addr.country ?? "",
          });
        }
      } catch {
        // Silent — fall through to an empty form. The user will see no
        // pre-filled values and can save fresh.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-focus the section when navigated to via `/settings#address`.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#address") {
      // Defer one tick so the layout has settled.
      const t = setTimeout(() => {
        document.getElementById("address-form-street")?.focus();
      }, 200);
      return () => clearTimeout(t);
    }
  }, []);

  const isUsable =
    Boolean(form.street?.trim()) &&
    Boolean(form.city?.trim()) &&
    Boolean(form.postalCode?.trim()) &&
    Boolean(form.country?.trim());

  const handleChange = (key: keyof UserAddress, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (feedback) setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Require at least one non-empty field — bare Save on an empty form
    // would null out an existing address (PATCH semantics on the backend).
    const anyField =
      form.street?.trim() ||
      form.city?.trim() ||
      form.postalCode?.trim() ||
      form.country?.trim();
    if (!anyField) {
      setFeedback({
        kind: "error",
        message: "Please fill in at least one field before saving.",
      });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const res = await updateMyAddress({
        street: form.street?.trim() || null,
        city: form.city?.trim() || null,
        postalCode: form.postalCode?.trim() || null,
        country: form.country?.trim() || null,
      });
      const r = res as { success?: boolean; message?: string };
      if (r?.success === false) {
        setFeedback({
          kind: "error",
          message: r?.message ?? "Failed to save address.",
        });
        return;
      }
      setFeedback({
        kind: "success",
        message: "Address saved. You can now proceed to checkout.",
      });
    } catch (err: unknown) {
      const e = err as { message?: string; error?: string };
      setFeedback({
        kind: "error",
        message:
          e?.message ?? e?.error ?? "Failed to save address. Try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="address" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        <MapPin className="text-gray-700" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Sellers use this to ship your purchases. We snapshot it onto each
        order at checkout time, so editing later won&apos;t affect orders
        already in flight.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="animate-spin" size={20} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Street */}
          <div>
            <label
              htmlFor="address-form-street"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Street and number
            </label>
            <input
              id="address-form-street"
              type="text"
              autoComplete="street-address"
              value={form.street ?? ""}
              onChange={(e) => handleChange("street", e.target.value)}
              placeholder="ul. Kwiatowa 12 / 3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-gray-400 focus:outline-none"
            />
          </div>

          {/* Postal code + city */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="address-form-postalCode"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Postal code
              </label>
              <input
                id="address-form-postalCode"
                type="text"
                autoComplete="postal-code"
                value={form.postalCode ?? ""}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                placeholder="00-001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-gray-400 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="address-form-city"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                City
              </label>
              <input
                id="address-form-city"
                type="text"
                autoComplete="address-level2"
                value={form.city ?? ""}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Warszawa"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="address-form-country"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Country
            </label>
            <input
              id="address-form-country"
              type="text"
              autoComplete="country-name"
              value={form.country ?? ""}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder="Poland"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-gray-400 focus:outline-none"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Used to calculate shipping cost on each listing.
            </p>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`flex items-start gap-3 p-3 rounded-xl border text-sm ${
                feedback.kind === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {feedback.kind === "success" ? (
                <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              )}
              <p>{feedback.message}</p>
            </div>
          )}

          {/* Completion hint */}
          {!isUsable && !feedback && (
            <div className="flex items-start gap-3 p-3 rounded-xl border bg-amber-50 border-amber-200 text-amber-800 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <p>
                Fill in <strong>all four</strong> fields to use this address at
                checkout. Partial addresses are saved but won&apos;t pass the
                checkout validation.
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Saving…" : "Save address"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
