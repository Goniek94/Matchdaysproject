import { SmartFormData } from "./types";

// Importujemy komponenty z tego samego folderu
import StepCategory from "./StepCategory";
import StepFront from "./StepFront";
import StepBack from "./StepBack";
import StepDetails from "./StepDetails";
import StepAuthenticity from "./StepAuthenticity";
import StepCondition from "./StepCondition";
import StepNotes from "./StepNotes";
import StepGallery from "./StepGallery";

interface SmartFormStepsProps {
  step: number;
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  updatePhoto: (key: string, url: string) => void;
}

export default function SmartFormSteps({
  step,
  data,
  update,
  updatePhoto,
}: SmartFormStepsProps) {
  switch (step) {
    case 1:
      return <StepCategory data={data} update={update} />;
    case 2:
      return <StepFront data={data} updatePhoto={updatePhoto} />;
    case 3:
      return <StepBack data={data} updatePhoto={updatePhoto} />;
    case 4:
      return <StepDetails data={data} updatePhoto={updatePhoto} />;
    case 5:
      return (
        <StepAuthenticity
          data={data}
          update={update}
          updatePhoto={updatePhoto}
        />
      );
    case 6:
      return (
        <StepCondition data={data} update={update} updatePhoto={updatePhoto} />
      );
    case 7:
      return <StepNotes data={data} update={update} />;
    case 8:
      return <StepGallery data={data} update={update} />;
    default:
      return null;
  }
}
