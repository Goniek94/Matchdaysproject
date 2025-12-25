import { UploadCloud, ScanBarcode } from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "./SmartFormUI";
import { SmartFormData } from "./types";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
}

export default function StepGallery({ data, update }: StepProps) {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <SectionHeader
        title="Main Gallery"
        subtitle="These photos will be shown on the listing."
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.galleryPhotos.map((url, idx) => (
          <div
            key={idx}
            className="aspect-square relative rounded-xl overflow-hidden shadow-sm group"
          >
            <Image src={url} alt="Gallery" fill className="object-cover" />
            <button className="absolute top-1 right-1 bg-white/90 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
              <span className="sr-only">Remove</span> ×
            </button>
          </div>
        ))}
        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-black transition-all bg-white text-gray-400 hover:text-black">
          <UploadCloud size={24} className="mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Add Photo
          </span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                const newFiles = Array.from(e.target.files).map((f) =>
                  URL.createObjectURL(f)
                );
                update("galleryPhotos", [...data.galleryPhotos, ...newFiles]);
              }
            }}
          />
        </label>
      </div>
      <div className="mt-8 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm flex items-start gap-3">
        <ScanBarcode size={20} className="flex-shrink-0 mt-0.5" />
        <p>
          Tip: Do not add verification photos (tags, defects) here. We already
          have them safely stored from previous steps.
        </p>
      </div>
    </div>
  );
}
