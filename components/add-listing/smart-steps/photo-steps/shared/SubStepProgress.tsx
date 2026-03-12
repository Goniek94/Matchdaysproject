"use client";

import { cn } from "@/lib/utils";

interface SubStepProgressProps {
  currentSubStep: number;
  totalSubSteps: number;
  title: string;
  description: string;
}

/**
 * Progress bar for photo sub-steps.
 * Shows current position and colored segments for completed/active/upcoming steps.
 */
export function SubStepProgress({
  currentSubStep,
  totalSubSteps,
  title,
  description,
}: SubStepProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-1">
            {title}
          </h2>
          <p className="text-sm text-gray-500 font-medium max-w-lg">
            {description}
          </p>
        </div>
        <span className="text-xs font-bold text-gray-400 mt-1 shrink-0 ml-4">
          PART {currentSubStep + 1}/{totalSubSteps}
        </span>
      </div>

      <div className="flex gap-1.5">
        {Array.from({ length: totalSubSteps }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-500",
              index < currentSubStep
                ? "bg-green-500"
                : index === currentSubStep
                  ? "bg-black"
                  : "bg-gray-100",
            )}
          />
        ))}
      </div>
    </div>
  );
}
