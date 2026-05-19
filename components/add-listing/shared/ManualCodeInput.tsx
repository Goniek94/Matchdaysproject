"use client";

/**
 * Manual entry field for tag codes that AI couldn't read off a photo.
 *
 * Surfaced in the listing flow only when the AI extraction step returns
 * `readable: false` for a code field — never as a default form input.
 * Goal: let the seller help us out when the photo is blurry/glared,
 * without opening a back-door to type whatever they want.
 *
 * Anti-fabrication layers (cooperating, not redundant):
 *   1. Brand-aware regex validation — typing "ABC123" for a Nike item
 *      fails because Nike uses "XX1234-567".
 *   2. Era guard — pre-2005 vintage brands legitimately had no codes,
 *      we accept blank input then.
 *   3. Confirmation checkbox — the seller is on record that they
 *      physically read the code from the tag.
 *   4. Backend appends "USER_SUPPLIED:code" to Auction.aiInconsistencies,
 *      moderator cross-references against the close-up photo.
 *
 * None of these is bulletproof alone; together they make wholesale
 * fabrication noticeably more work than just listing an honest item.
 */
import React, { useMemo, useState } from "react";
import {
  validateBrandCode,
  getBrandCodePlaceholder,
} from "@/lib/constants/brand-code-formats";

interface ManualCodeInputProps {
  brand: string | null | undefined;
  season?: string | null;
  value: string;
  onChange: (value: string) => void;
  /** Why the AI couldn't read it. Shown to the seller as context. */
  aiFailureReason?: string;
  /** Seller must check this before the field counts as submitted. */
  confirmed: boolean;
  onConfirmedChange: (value: boolean) => void;
}

export function ManualCodeInput({
  brand,
  season,
  value,
  onChange,
  aiFailureReason,
  confirmed,
  onConfirmedChange,
}: ManualCodeInputProps) {
  const [touched, setTouched] = useState(false);
  const placeholder = useMemo(() => getBrandCodePlaceholder(brand), [brand]);

  const validation = useMemo(() => {
    if (!value) return null;
    if (!brand) return null;
    return validateBrandCode(brand, value, season ?? null);
  }, [brand, value, season]);

  const showError = touched && validation && validation.valid === false;
  const showInfo = validation && validation.valid === null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
      <div className="flex items-start gap-2">
        <span className="text-amber-600 text-lg leading-none">🤖</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">
            AI couldn&apos;t read the tag code
          </p>
          {aiFailureReason && (
            <p className="text-xs text-gray-600 mt-0.5">
              Reason: {aiFailureReason}
            </p>
          )}
          <p className="text-xs text-gray-600 mt-1">
            Please type the code as printed on the tag. We use it to verify
            the item — not to chase you.
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-gray-700">
          Manufacturer code
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.trim().toUpperCase())}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 rounded-md border text-sm font-mono tracking-wide bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 ${
            showError
              ? "border-red-400"
              : validation?.valid === true
                ? "border-green-400"
                : "border-gray-300"
          }`}
        />
        {showError && (
          <p className="text-xs text-red-600">{validation!.reason}</p>
        )}
        {showInfo && (
          <p className="text-xs text-amber-700">{validation!.reason}</p>
        )}
        {validation?.valid === true && (
          <p className="text-xs text-green-700">
            Format matches {validation.format?.brand} pattern ✓
          </p>
        )}
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => onConfirmedChange(e.target.checked)}
          className="mt-0.5"
        />
        <span className="text-xs text-gray-700 leading-snug">
          I read this code directly from the tag on the item.
          <br />
          <span className="text-gray-500">
            False information may lead to the listing being rejected and a
            strike on your account.
          </span>
        </span>
      </label>
    </div>
  );
}
