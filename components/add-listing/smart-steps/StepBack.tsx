import { SectionHeader, PhotoBox } from "./SmartFormUI";
import { SmartFormData } from "./types";

interface StepProps {
  data: SmartFormData;
  updatePhoto: (key: string, url: string) => void;
}

export default function StepBack({ data, updatePhoto }: StepProps) {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <SectionHeader
        title="Now the back"
        subtitle="Flip it over. Show nameset if present."
      />
      <div className="grid grid-cols-2 gap-4">
        <PhotoBox
          label="Full Back"
          subLabel="Entire back side"
          imageUrl={data.photos.back}
          onUpload={(u) => updatePhoto("back", u)}
        />
        <PhotoBox
          label="Name & Number"
          subLabel="Close-up (Optional)"
          imageUrl={data.photos.nameset}
          onUpload={(u) => updatePhoto("nameset", u)}
          optional
        />
      </div>
    </div>
  );
}
