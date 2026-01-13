import { CATEGORIES, SmartFormData } from "./types";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext?: () => void;
}

export default function StepCategory({ data, update, onNext }: StepProps) {
  const handleSelect = (id: string) => {
    const selectedCategory = CATEGORIES.find((cat) => cat.id === id);
    update("category", id);
    update("categorySlug", selectedCategory?.label || id);
  };

  const canProceed = data.category !== "";

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Main Container with Shadow */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
        {/* Nagłówek */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2">
            What are you selling?
          </h2>
          <p className="text-base text-gray-500 font-medium">
            Choose the category that best fits your item
          </p>
        </div>

        {/* Siatka kategorii */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
          {CATEGORIES.map((cat) => {
            const isSelected = data.category === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={cn(
                  "group relative flex flex-col items-center justify-center p-4 h-32 md:h-40 w-full text-center transition-all duration-300 ease-out rounded-2xl border-2 outline-none",
                  isSelected
                    ? "border-black bg-gray-50 shadow-xl scale-[1.02]"
                    : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-lg hover:-translate-y-1"
                )}
              >
                {/* Ikona */}
                <div
                  className={cn(
                    "p-3 rounded-xl transition-colors duration-300 mb-2",
                    isSelected
                      ? "bg-black text-white"
                      : "bg-gray-50 text-black group-hover:bg-gray-100"
                  )}
                >
                  <cat.icon size={28} strokeWidth={1.5} />
                </div>

                {/* Nazwa kategorii */}
                <span className="block text-sm md:text-base font-bold tracking-tight text-gray-900 group-hover:text-black">
                  {cat.label}
                </span>

                {/* Wskaźnik wyboru */}
                <div className="absolute top-2 right-2 transition-all duration-300">
                  {isSelected && (
                    <div className="bg-black text-white rounded-full p-0.5 shadow-lg animate-in zoom-in">
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
