"use client";

import { useState } from "react";
import { Package, Pencil, Check, X, ChevronDown } from "lucide-react";
import type { SmartFormData } from "@/types/features/listing.types";
import { CONDITIONS, SHIRT_SIZES } from "@/lib/constants/listing.constants";
import {
  getCategoryDetailRows,
  getConditionLabel,
  getConditionColor,
} from "../summary.helpers";
import DetailRow from "./DetailRow";

interface ProductDetailsProps {
  data: SmartFormData;
  onUpdate?: (
    field: keyof SmartFormData,
    value: SmartFormData[keyof SmartFormData],
  ) => void;
}

// Keys that can be AI-detected (come from aiData fallback in summary.helpers)
const AI_DETECTED_KEYS = new Set([
  "country",
  "serialCode",
  "playerName",
  "playerNumber",
  "productionYear",
  "sizeEU",
  "sizeUK",
]);

// ── Inline editable field ────────────────────────────────────────────────────

interface EditableFieldProps {
  label: string;
  /** Displayed text in view mode */
  displayValue: string;
  /** Actual value used as draft initial state (e.g. condition id like "excellent") */
  draftValue?: string;
  aiDetected?: boolean;
  onSave?: (val: string) => void;
  options?: { id: string; label: string }[];
  colorClass?: string;
}

const EditableField = ({
  label,
  displayValue,
  draftValue,
  aiDetected,
  onSave,
  options,
  colorClass,
}: EditableFieldProps) => {
  const [editing, setEditing] = useState(false);
  // Use draftValue (e.g. condition id) when available, otherwise displayValue
  const [draft, setDraft] = useState(draftValue ?? displayValue);

  const handleEdit = () => {
    setDraft(draftValue ?? displayValue);
    setEditing(true);
  };

  const handleConfirm = () => {
    if (onSave) onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(draftValue ?? displayValue);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50/80">
        <span className="text-xs font-medium text-gray-500 shrink-0">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {options ? (
            /* Dropdown select */
            <div className="relative">
              <select
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="appearance-none text-xs font-bold text-gray-900 bg-white border border-gray-200 rounded-lg pl-2.5 pr-7 py-1 outline-none focus:border-primary cursor-pointer"
                autoFocus
              >
                {options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={11}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          ) : (
            /* Text input */
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
                if (e.key === "Escape") handleCancel();
              }}
              className="text-xs font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-2.5 py-1 outline-none focus:border-primary w-28"
              autoFocus
            />
          )}
          <button
            onClick={handleConfirm}
            className="p-1 rounded-full bg-black text-white hover:bg-gray-800 transition-all"
            title="Save"
          >
            <Check size={10} />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 transition-all"
            title="Cancel"
          >
            <X size={10} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-gray-50/60 transition-colors">
      <span className="text-xs font-medium text-gray-500 shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-1.5 min-w-0">
        {colorClass ? (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorClass}`}
          >
            {displayValue}
          </span>
        ) : (
          <span className="text-xs font-bold text-gray-900 text-right capitalize break-words">
            {displayValue}
          </span>
        )}
        {aiDetected && (
          <span
            title="Detected by AI"
            className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5 shrink-0"
          >
            AI
          </span>
        )}
        {onSave && (
          <button
            onClick={handleEdit}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-gray-400 hover:text-gray-700"
            title={`Edit ${label}`}
          >
            <Pencil size={10} />
          </button>
        )}
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────

const ProductDetails = ({ data, onUpdate }: ProductDetailsProps) => {
  const isAuction = data.listingType === "auction";
  const detailRows = getCategoryDetailRows(data.categorySlug).filter((row) => {
    const val = row.getValue(data);
    return val !== undefined && val !== null && val !== "";
  });

  const conditionLabel = data.condition
    ? getConditionLabel(data.condition)
    : null;
  const conditionColor = data.condition
    ? getConditionColor(data.condition)
    : "";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <Package size={15} className="text-primary" />
        <span className="text-sm font-bold text-gray-900">Item Details</span>
        {onUpdate && (
          <span className="ml-auto text-[10px] text-gray-400 flex items-center gap-1">
            <Pencil size={9} />
            Hover to edit
          </span>
        )}
      </div>

      <div className="divide-y divide-gray-50">
        {/* Listing type */}
        <DetailRow
          label="Listing Type"
          value={isAuction ? "Auction" : "Buy Now"}
        />

        {/* Condition — editable with dropdown; display human label, save id */}
        {conditionLabel && (
          <EditableField
            label="Condition"
            displayValue={conditionLabel}
            draftValue={data.condition}
            colorClass={conditionColor}
            onSave={
              onUpdate
                ? (val) =>
                    onUpdate("condition", val as SmartFormData["condition"])
                : undefined
            }
            options={CONDITIONS.map((c) => ({ id: c.id, label: c.label }))}
          />
        )}

        {/* Dynamic category rows */}
        {detailRows.map((row) => {
          const rawValue = row.getValue(data);
          const value = rawValue || "";

          // Determine if value came from AI (not from form field directly)
          const formValue = (() => {
            switch (row.key) {
              case "country":
                return data.countryOfProduction;
              case "serialCode":
                return data.serialCode;
              case "playerName":
                return data.playerName;
              case "playerNumber":
                return data.playerNumber;
              case "productionYear":
                return data.productionYear;
              case "sizeEU":
                return data.sizeEU;
              case "sizeUK":
                return data.sizeUK;
              default:
                return rawValue;
            }
          })();

          const isAiDetected =
            AI_DETECTED_KEYS.has(row.key) && !formValue && !!rawValue;

          // Determine which field key to update and whether it has options
          const getUpdateHandler = () => {
            if (!onUpdate) return undefined;
            switch (row.key) {
              case "size":
                return (val: string) => onUpdate("size", val);
              case "playerName":
                return (val: string) => onUpdate("playerName", val);
              case "playerNumber":
                return (val: string) => onUpdate("playerNumber", val);
              case "season":
                return (val: string) => onUpdate("season", val);
              default:
                return undefined;
            }
          };

          const getSizeOptions = () => {
            if (row.key === "size") {
              return SHIRT_SIZES.map((s) => ({ id: s.id, label: s.label }));
            }
            return undefined;
          };

          // For size, display the label from SHIRT_SIZES if available
          const getDisplayValue = () => {
            if (row.key === "size") {
              const found = SHIRT_SIZES.find(
                (s) => s.id === value.toLowerCase(),
              );
              return found ? found.label : value;
            }
            return value;
          };

          return (
            <EditableField
              key={row.key}
              label={row.label}
              displayValue={getDisplayValue()}
              draftValue={value}
              aiDetected={isAiDetected}
              onSave={getUpdateHandler()}
              options={getSizeOptions()}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProductDetails;
