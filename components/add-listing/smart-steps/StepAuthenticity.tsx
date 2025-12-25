import { ScanBarcode } from "lucide-react";
import { SectionHeader, PhotoBox } from "./SmartFormUI";
import { SmartFormData } from "./types";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  updatePhoto: (key: string, url: string) => void;
}

export default function StepAuthenticity({
  data,
  update,
  updatePhoto,
}: StepProps) {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <SectionHeader
        title="Authenticity Check"
        subtitle="The most important step. Find inner tags."
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <PhotoBox
          label="Wash Tags"
          subLabel="Inner bottom side"
          imageUrl={data.photos.washTags}
          onUpload={(u) => updatePhoto("washTags", u)}
        />
        <PhotoBox
          label="Product Code"
          subLabel="Small tag with code"
          imageUrl={data.photos.codeTag}
          onUpload={(u) => updatePhoto("codeTag", u)}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
            Enter Product Code (If visible)
          </label>
          <div className="relative">
            <ScanBarcode
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={
                data.isVintage || data.isNoTag
                  ? "Code unavailable"
                  : "e.g. CZ1234-001"
              }
              value={data.productCode}
              onChange={(e) => update("productCode", e.target.value)}
              disabled={data.isVintage || data.isNoTag}
              className="w-full pl-10 p-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black font-mono uppercase tracking-widest transition-all disabled:opacity-50 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <label
            className={`flex-1 flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              data.isVintage
                ? "border-black bg-gray-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={data.isVintage}
              onChange={(e) => update("isVintage", e.target.checked)}
              className="w-4 h-4 accent-black"
            />
            <span className="font-bold text-xs">Vintage Item (Pre-2005)</span>
          </label>
          <label
            className={`flex-1 flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              data.isNoTag
                ? "border-black bg-gray-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={data.isNoTag}
              onChange={(e) => update("isNoTag", e.target.checked)}
              className="w-4 h-4 accent-black"
            />
            <span className="font-bold text-xs">Tags Cut / Faded</span>
          </label>
        </div>
      </div>
    </div>
  );
}
