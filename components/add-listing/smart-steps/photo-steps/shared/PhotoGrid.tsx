"use client";

import { ReactNode } from "react";
import { Camera } from "lucide-react";

interface PhotoGridProps {
  children: ReactNode;
  showTipBar?: boolean;
  isCritical?: boolean;
  criticalWarning?: string;
}

/**
 * Grid layout for photo slots with optional tip bar and critical warning.
 * Wraps PhotoSlot components in a responsive grid.
 */
export function PhotoGrid({
  children,
  showTipBar = true,
  isCritical = false,
  criticalWarning,
}: PhotoGridProps) {
  return (
    <div className="space-y-4 mb-6">
      {isCritical && criticalWarning && (
        <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl">
          <p className="text-sm font-bold text-red-900">{criticalWarning}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">{children}</div>

      {showTipBar && (
        <div className="mt-6 p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Camera size={13} className="text-amber-600" />
          </div>
          <p className="text-xs text-amber-800">
            <strong>Tip:</strong> Hover the camera icon on each slot for photo
            instructions.
          </p>
        </div>
      )}
    </div>
  );
}
