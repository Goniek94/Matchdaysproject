"use client";

import { SmartFormData } from "./types";
import StepCategory from "./StepCategory";
import StepCompletionMode from "./StepCompletionMode";
import StepPhotosGuidedFull from "./StepPhotosGuidedFull";
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
<<<<<<< HEAD
      // Guided photo wizard — leads user through photos one group at a time
      return (
        <StepPhotosGuidedFull
          data={data}
          update={update}
          onNext={onNext}
          onBack={onBack}
        />
      );
=======
      // Step 3: Photos Upload - Different for each category
      if (data.category === "footwear") {
        // Footwear: 5 parts (Overview, Labels, Sole, Details, Inside)
        return (
          <StepPhotosFootwear data={data} update={update} onNext={onNext} />
        );
      } else if (data.category === "jackets") {
        // Jackets: 5 parts (Overview, Branding, Labels, Construction, Material)
        return (
          <StepPhotosJackets data={data} update={update} onNext={onNext} />
        );
      } else if (data.category === "pants") {
        // Pants: 4 parts (Overview, Branding, Labels, Material)
        return <StepPhotosPants data={data} update={update} onNext={onNext} />;
      } else if (data.category === "accessories") {
        // Accessories: 4 simple photos (no sub-steps)
        return (
          <StepPhotosAccessories data={data} update={update} />
        );
      } else {
        // Shirts: 5 sub-steps (Front, Tags, Back, Details, More)
        return (
          <StepPhotosGuidedFull data={data} update={update} onNext={onNext} />
        );
      }

>>>>>>> b4a964b208ac84352bb983237b815715e12e3b10
    case 4:
      // Step 4 depends on the chosen completion mode
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
