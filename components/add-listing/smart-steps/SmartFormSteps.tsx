import { SmartFormData } from "./types";

// Import new components
import StepCategory from "./StepCategory";
import StepCompletionMode from "./StepCompletionMode";
import StepPhotosGuidedFull from "./StepPhotosGuidedFull";
import StepPhotosFootwear from "./StepPhotosFootwear";
import StepProductDetailsManual from "./StepProductDetailsManual";
import StepAISummary from "./StepAISummary";
import StepPricing from "./StepPricing";

interface SmartFormStepsProps {
  step: number;
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext?: () => void;
}

export default function SmartFormSteps({
  step,
  data,
  update,
  onNext,
}: SmartFormStepsProps) {
  const isAI = data.completionMode === "AI";
  const isManual = data.completionMode === "MANUAL";

  switch (step) {
    case 1:
      // Step 1: Category Selection
      return <StepCategory data={data} update={update} />;

    case 2:
      // Step 2: Completion Mode (AI vs Manual)
      return <StepCompletionMode data={data} update={update} onNext={onNext} />;

    case 3:
      // Step 3: Photos Upload - Different for each category
      if (data.category === "footwear") {
        // Footwear: 5 parts (Overview, Labels, Sole, Details, Inside)
        return (
          <StepPhotosFootwear data={data} update={update} onNext={onNext} />
        );
      } else {
        // Shirts: 5 sub-steps (Front, Tags, Back, Details, More)
        return (
          <StepPhotosGuidedFull data={data} update={update} onNext={onNext} />
        );
      }

    case 4:
      // Step 4: Different based on AI/Manual
      if (isAI) {
        // AI: Show summary with AI-generated data
        return <StepAISummary data={data} update={update} />;
      } else if (isManual) {
        // Manual: Show form to fill in details
        return <StepProductDetailsManual data={data} update={update} />;
      }
      return <div>Please select completion mode first</div>;

    case 5:
      // Step 5: Pricing (same for both AI and Manual)
      return <StepPricing data={data} update={update} />;

    default:
      return null;
  }
}
