"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SmartFormData } from "@/types/features/listing.types";

interface PlayerOptionsFormProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
}

/**
 * Player name/number toggle for shirt back photos.
 * Allows user to indicate the shirt has no player print.
 */
export function PlayerOptionsForm({ data, update }: PlayerOptionsFormProps) {
  const updateVerification = (field: string, value: any) => {
    update("verification", { ...data.verification, [field]: value });
  };

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all select-none",
        data.verification.noPlayerPrint
          ? "border-orange-400 bg-orange-50"
          : "border-gray-200 bg-gray-50 hover:border-gray-300",
      )}
      onClick={() =>
        updateVerification("noPlayerPrint", !data.verification.noPlayerPrint)
      }
    >
      <div
        className={cn(
          "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
          data.verification.noPlayerPrint
            ? "bg-orange-500 border-orange-500"
            : "border-gray-400",
        )}
      >
        {data.verification.noPlayerPrint && (
          <CheckCircle2 size={13} className="text-white" />
        )}
      </div>
      <div>
        <p className="font-bold text-gray-900 text-sm">
          No player name or number
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Plain/blank shirt — skip player photos
        </p>
      </div>
    </div>
  );
}
