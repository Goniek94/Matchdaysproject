"use client";

import { SmartFormData } from "./types";
import StepCategory from "./StepCategory";
import StepCompletionMode from "./StepCompletionMode";
import { PhotoStepRouter } from "./photo-steps";
import StepAISummary from "./StepAISummary";
import StepProductDetailsManual from "./StepProductDetailsManual";
import StepPricing from "./StepPricing";

interface SmartFormStepsProps {
  step: number;
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext: () => void;
  onBack: () => void;
}

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
      return <StepCompletionMode data={data} update={update} onNext={onNext} />;
    case 3:
      return (
        <PhotoStepRouter
          data={data}
          update={update}
          onNext={onNext}
          onBack={onBack}
        />
      );
    case 4:
      if (data.completionMode === "AI") {
        return <StepAISummary data={data} update={update} />;
      }
      return <StepProductDetailsManual data={data} update={update} />;
    case 5:
      return <StepPricing data={data} update={update} />;
    default:
      return null;
  }
}
