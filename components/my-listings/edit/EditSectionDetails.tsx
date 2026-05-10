"use client";

/**
 * EditSectionDetails
 * Item-level details: team/season/league/manufacturer + size + condition +
 * player + authenticity flags. All inputs honour the lock-after-bid rule
 * passed in via `isEditable`.
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
  isEditable: (key: keyof EditFormState) => boolean;
}

const inputClass = (locked: boolean) =>
  `w-full px-3 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-black/10 ${
    locked
      ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
      : "border-gray-200 focus:border-gray-400 bg-white"
  }`;

export default function EditSectionDetails({
  form,
  setField,
  isEditable,
}: EditSectionDetailsProps) {
  const lockedTeam = !isEditable("team");
  const lockedSize = !isEditable("size");
  const lockedCondition = !isEditable("condition");
  const lockedPlayer = !isEditable("playerName");
  const lockedManufacturer = !isEditable("manufacturer");
  const lockedAutograph = !isEditable("hasAutograph");

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
        Item Details
      </h3>

      {/* League / Team / Season */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            League
          </label>
          <input
            type="text"
            value={form.league}
            onChange={(e) => setField("league", e.target.value)}
            disabled={!isEditable("league")}
            placeholder="e.g. Premier League"
            className={inputClass(!isEditable("league"))}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Team
          </label>
          <input
            type="text"
            value={form.team}
            onChange={(e) => setField("team", e.target.value)}
            disabled={lockedTeam}
            placeholder="e.g. Manchester United"
            className={inputClass(lockedTeam)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Season
          </label>
          <input
            type="text"
            value={form.season}
            onChange={(e) => setField("season", e.target.value)}
            disabled={!isEditable("season")}
            placeholder="e.g. 2023/24"
            className={inputClass(!isEditable("season"))}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Manufacturer
          </label>
          <input
            type="text"
            value={form.manufacturer}
            onChange={(e) => setField("manufacturer", e.target.value)}
            disabled={lockedManufacturer}
            placeholder="e.g. Nike, Adidas"
            className={inputClass(lockedManufacturer)}
          />
        </div>
      </div>

      {/* Size + Condition */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Size
          </label>
          <select
            value={form.size}
            onChange={(e) => setField("size", e.target.value)}
            disabled={lockedSize}
            className={inputClass(lockedSize)}
          >
            <option value="">Select size</option>
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Condition
          </label>
          <select
            value={form.condition}
            onChange={(e) => setField("condition", e.target.value)}
            disabled={lockedCondition}
            className={inputClass(lockedCondition)}
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
            disabled={lockedPlayer}
            placeholder="e.g. Beckham"
            className={inputClass(lockedPlayer)}
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
            disabled={lockedPlayer}
            placeholder="e.g. 7"
            maxLength={3}
            className={inputClass(lockedPlayer)}
          />
        </div>
      </div>

      {/* Authenticity flags — collapsed when locked */}
      <div className="pt-2 border-t border-gray-100 space-y-3">
        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
          Authenticity
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <label
            className={`flex items-center gap-2 p-2.5 rounded-xl border ${
              lockedAutograph
                ? "border-gray-100 bg-gray-50 cursor-not-allowed"
                : "border-gray-200 cursor-pointer hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={form.hasAutograph}
              onChange={(e) => setField("hasAutograph", e.target.checked)}
              disabled={lockedAutograph}
              className="w-4 h-4 rounded"
            />
            <span className="text-xs font-bold text-gray-700">
              Has autograph
            </span>
          </label>

          <label
            className={`flex items-center gap-2 p-2.5 rounded-xl border ${
              !isEditable("isVintage")
                ? "border-gray-100 bg-gray-50 cursor-not-allowed"
                : "border-gray-200 cursor-pointer hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={form.isVintage}
              onChange={(e) => setField("isVintage", e.target.checked)}
              disabled={!isEditable("isVintage")}
              className="w-4 h-4 rounded"
            />
            <span className="text-xs font-bold text-gray-700">Vintage</span>
          </label>
        </div>

        {form.hasAutograph && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Autograph details
            </label>
            <input
              type="text"
              value={form.autographDetails}
              onChange={(e) => setField("autographDetails", e.target.value)}
              disabled={!isEditable("autographDetails")}
              placeholder="e.g. Signed in person at training, 2019"
              className={inputClass(!isEditable("autographDetails"))}
            />
          </div>
        )}

        {form.isVintage && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Vintage year
            </label>
            <input
              type="text"
              value={form.vintageYear}
              onChange={(e) => setField("vintageYear", e.target.value)}
              disabled={!isEditable("vintageYear")}
              placeholder="e.g. 1998"
              maxLength={10}
              className={inputClass(!isEditable("vintageYear"))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
