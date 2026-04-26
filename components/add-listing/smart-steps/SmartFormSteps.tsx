"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { SmartFormData } from "./types";
import {
  StepCategory,
  StepCompletionMode,
  StepAISummary,
  StepEditListing,
  StepPricing,
  StepProductDetailsManual,
  StepPreAnalysis,
} from "./steps";
import { PhotoStepRouter } from "./photo-steps";

interface SmartFormStepsProps {
  step: number;
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext: () => void;
  onBack: () => void;
}

// Steps: 1 Category → 2 Photos → 3 Pre-Analysis → 4 Mode Selection
// AI path:     5 AI Analysis → 6 Edit Listing → 7 Pricing → Summary
// Manual path: 5 Details     → 6 Pricing      → Summary

export default function SmartFormSteps({
  step,
  data,
  update,
  onNext,
  onBack,
}: SmartFormStepsProps) {
  const isAI = data.completionMode === "AI";

  switch (step) {
    case 1:
      return <StepCategory data={data} update={update} onNext={onNext} />;
    case 2:
      return (
        <PhotoStepRouter data={data} update={update} onNext={onNext} onBack={onBack} />
      );
    case 3:
      return <StepPreAnalysis data={data} update={update} />;
    case 4:
      return <StepCompletionMode data={data} update={update} onNext={onNext} />;
    case 5:
      if (isAI)
        return <StepAISummary data={data} update={update} onNext={onNext} onBack={onBack} />;
      return <StepProductDetailsManual data={data} update={update} />;
    case 6:
      if (isAI)
        return <StepEditListing data={data} update={update} onNext={onNext} onBack={onBack} />;
      return <StepPricing data={data} update={update} />;
    case 7:
      if (isAI)
        return <StepPricing data={data} update={update} />;
      return null;
    default:
      return null;
  }
}
