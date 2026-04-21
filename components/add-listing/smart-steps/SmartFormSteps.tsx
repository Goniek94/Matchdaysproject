"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { SmartFormData } from "./types";
import {
  StepCategory,
  StepCompletionMode,
  StepAISummary,
  StepPricing,
  StepProductDetailsManual,
} from "./steps";
import { PhotoStepRouter } from "./photo-steps";

interface SmartFormStepsProps {
  step: number;
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext: () => void;
  onBack: () => void;
}

// Steps: 1 Category → 2 Photos → 3 Mode Selection
// AI path:     4 AI Analysis → 5 Summary (in SmartForm)
// Manual path: 4 Details → 5 Pricing → 6 Summary (in SmartForm)

export default function SmartFormSteps({
  step,
  data,
  update,
  onNext,
  onBack,
}: SmartFormStepsProps) {
  switch (step) {
    case 1:
      return <StepCategory data={data} update={update} onNext={onNext} />;
    case 2:
      return (
        <PhotoStepRouter
          data={data}
          update={update}
          onNext={onNext}
          onBack={onBack}
        />
      );
    case 3:
      return <StepCompletionMode data={data} update={update} onNext={onNext} />;
    case 4:
      if (data.completionMode === "AI")
        return <StepAISummary data={data} update={update} onNext={onNext} />;
      return <StepProductDetailsManual data={data} update={update} />;
    case 5:
      if (data.completionMode === "MANUAL")
        return <StepPricing data={data} update={update} />;
      return null;
    default:
      return null;
  }
}
