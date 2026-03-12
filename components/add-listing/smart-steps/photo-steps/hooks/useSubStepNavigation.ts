"use client";

import { useState, useCallback } from "react";

/**
 * Custom hook for managing sub-step navigation within photo steps.
 * Handles forward/backward navigation and scroll-to-top behavior.
 */
export function useSubStepNavigation(
  totalSubSteps: number,
  onComplete?: () => void,
) {
  const [currentSubStep, setCurrentSubStep] = useState(0);

  const handleNext = useCallback(() => {
    if (currentSubStep < totalSubSteps - 1) {
      setCurrentSubStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (onComplete) {
      onComplete();
    }
  }, [currentSubStep, totalSubSteps, onComplete]);

  const handleBack = useCallback(() => {
    if (currentSubStep > 0) {
      setCurrentSubStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentSubStep]);

  const isFirstStep = currentSubStep === 0;
  const isLastStep = currentSubStep === totalSubSteps - 1;

  return {
    currentSubStep,
    setCurrentSubStep,
    handleNext,
    handleBack,
    isFirstStep,
    isLastStep,
    totalSubSteps,
  };
}
