"use client";

/**
 * EditSectionDetails
 * Jersey-specific details: size, condition, player name/number
 */

import type { EditFormState } from "./useEditForm";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Youth", "Other"];
const CONDITIONS = [
  { value: "new_with_tags", label: "New with tags" },
  { value: "new_without_tags", label: "New without tags" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

interface EditSectionDetailsProps {
  form: EditFormState;
  setField: <K extends keyof EditFormState>(
    key: K,
    value: EditFormState[K],
  ) => void;
}

export default function EditSectionDetails({
  form,
  setField,
}: EditSectionDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
        Jersey Details
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Size */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Size
          </label>
          <select
            value={form.size}
            onChange={(e) => setField("size", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all bg-white"
          >
            <option value="">Select size</option>
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Condition
          </label>
          <select
            value={form.condition}
            onChange={(e) => setField("condition", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all bg-white"
          >
            <option value="">Select condition</option>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Player name + number */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Player Name
          </label>
          <input
            type="text"
            value={form.playerName}
            onChange={(e) => setField("playerName", e.target.value)}
            placeholder="e.g. Beckham"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Player Number
          </label>
          <input
            type="text"
            value={form.playerNumber}
            onChange={(e) => setField("playerNumber", e.target.value)}
            placeholder="e.g. 7"
            maxLength={3}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
