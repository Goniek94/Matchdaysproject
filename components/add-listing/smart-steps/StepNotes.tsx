import { SectionHeader } from "./SmartFormUI";
import { SmartFormData } from "./types";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
}

export default function StepNotes({ data, update }: StepProps) {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <SectionHeader
        title="Your Story"
        subtitle="Tell us about the item's history (Optional)."
      />
      <div className="bg-gray-50 p-1 rounded-2xl">
        <textarea
          className="w-full h-56 p-6 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none text-base leading-relaxed text-gray-700 placeholder:text-gray-300 transition-all"
          placeholder="e.g. Bought at Camp Nou in 2015, barely worn. Has the original matchday print..."
          value={data.userNotes}
          onChange={(e) => update("userNotes", e.target.value)}
        />
      </div>
    </div>
  );
}
