"use client";

import { ReactNode } from "react";

interface PhotoStepLayoutProps {
  children: ReactNode;
}

/**
 * Consistent layout wrapper for all photo step components.
 * Provides the white card container with animation.
 */
export function PhotoStepLayout({ children }: PhotoStepLayoutProps) {
  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
        {children}
      </div>
    </div>
  );
}
