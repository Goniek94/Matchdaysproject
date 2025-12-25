import { SectionHeader, PhotoBox } from "./SmartFormUI";
import { SmartFormData } from "./types";

interface StepProps {
  data: SmartFormData;
  updatePhoto: (key: string, url: string) => void;
}

export default function StepDetails({ data, updatePhoto }: StepProps) {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <SectionHeader
        title="Key Details"
        subtitle="Help us verify authenticity with close-ups."
      />
      <div className="grid grid-cols-2 gap-3">
        <PhotoBox
          label="Team Badge"
          subLabel="Crest close-up"
          imageUrl={data.photos.logo}
          onUpload={(u) => updatePhoto("logo", u)}
        />
        <PhotoBox
          label="Brand Logo"
          subLabel="Nike/Adidas logo"
          imageUrl={data.photos.sponsor}
          onUpload={(u) => updatePhoto("sponsor", u)}
        />
        <PhotoBox
          label="Sponsor / Print"
          subLabel="Chest detail"
          imageUrl={data.photos.seams}
          onUpload={(u) => updatePhoto("seams", u)}
        />
        <PhotoBox
          label="Other Detail"
          subLabel="Embroidery, patch"
          imageUrl={data.photos.backDetail}
          onUpload={(u) => updatePhoto("backDetail", u)}
          optional
        />
      </div>
    </div>
  );
}
