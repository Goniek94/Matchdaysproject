import { AlertTriangle, Camera, ArrowRight } from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "./SmartFormUI";
import { SmartFormData, CONDITIONS } from "./types";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  updatePhoto: (key: string, url: string) => void;
}

export default function StepCondition({
  data,
  update,
  updatePhoto,
}: StepProps) {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <SectionHeader
        title="Condition Check"
        subtitle="Honesty builds trust with buyers."
      />

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
        <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" /> Are there any
          defects?
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => update("hasDefects", false)}
            className={`py-3 rounded-lg font-bold text-sm border transition-all ${
              !data.hasDefects
                ? "border-black bg-black text-white"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            No, perfect condition
          </button>
          <button
            onClick={() => update("hasDefects", true)}
            className={`py-3 rounded-lg font-bold text-sm border transition-all ${
              data.hasDefects
                ? "border-amber-500 bg-amber-50 text-amber-700"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            Yes, it has flaws
          </button>
        </div>

        {data.hasDefects && (
          <div className="pt-4 border-t border-gray-100 animate-in fade-in">
            <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">
              Add defect photos (Max 3)
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {data.photos.defects.map((url, i) => (
                <div
                  key={i}
                  className="w-20 h-20 relative flex-shrink-0 rounded-lg overflow-hidden border border-gray-200"
                >
                  <Image src={url} alt="Defect" fill className="object-cover" />
                </div>
              ))}
              <label className="w-20 h-20 flex-shrink-0 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0])
                      updatePhoto(
                        "defects",
                        URL.createObjectURL(e.target.files[0]) as any
                      );
                  }}
                />
                <Camera size={20} className="text-gray-400" />
              </label>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 pl-1">
          Overall Condition Rating
        </label>
        <div className="relative">
          <select
            value={data.condition}
            onChange={(e) => update("condition", e.target.value)}
            className="w-full p-4 bg-gray-50 border-transparent rounded-xl text-base font-bold focus:bg-white focus:ring-2 focus:ring-black outline-none appearance-none transition-all"
          >
            {CONDITIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ArrowRight size={16} className="rotate-90" />
          </div>
        </div>
      </div>
    </div>
  );
}
