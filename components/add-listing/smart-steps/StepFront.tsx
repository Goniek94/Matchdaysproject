import { SectionHeader, PhotoBox } from "./SmartFormUI";
import { SmartFormData } from "./types";

interface StepProps {
  data: SmartFormData;
  updatePhoto: (key: string, url: string) => void;
}

export default function StepFront({ data, updatePhoto }: StepProps) {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <SectionHeader
        title="Show us the item"
        subtitle="Take a clear photo of the front and the neck tag."
      />
      <div className="grid grid-cols-2 gap-4">
        <PhotoBox
          label="Full Front"
          subLabel="Entire item visible"
          imageUrl={data.photos.front}
          onUpload={(u) => updatePhoto("front", u)}
        />
        <PhotoBox
          label="Neck Tag"
          subLabel="Size & Origin"
          imageUrl={data.photos.neckTag}
          onUpload={(u) => updatePhoto("neckTag", u)}
        />
      </div>
    </div>
  );
}
