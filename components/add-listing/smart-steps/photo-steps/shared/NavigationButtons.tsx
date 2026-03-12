"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationButtonsProps {
  onNext: () => void;
  onBack: () => void;
  isNextDisabled?: boolean;
  isLastStep?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

/**
 * Reusable navigation buttons for photo sub-steps.
 * Handles Next/Back with disabled state and custom labels.
 */
export function NavigationButtons({
  onNext,
  onBack,
  isNextDisabled = false,
  isLastStep = false,
  nextLabel,
  backLabel = "Back",
}: NavigationButtonsProps) {
  const resolvedNextLabel =
    nextLabel ?? (isLastStep ? "Complete" : "Next Part");

  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        {backLabel}
      </button>

      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={cn(
          "flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white text-sm transition-all",
          !isNextDisabled
            ? "bg-black hover:bg-gray-800 hover:scale-[1.02] active:scale-95"
            : "bg-gray-200 text-gray-400 cursor-not-allowed",
        )}
      >
        {resolvedNextLabel}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
