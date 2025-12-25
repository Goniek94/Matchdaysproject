import { CATEGORIES, SmartFormData } from "./types";
import { CheckCircle2 } from "lucide-react";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
}

export default function StepCategory({ data, update }: StepProps) {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Nagłówek - bardzo kompaktowy */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Select Category
        </h2>
        <p className="text-sm text-gray-500">What kind of item is this?</p>
      </div>

      {/* Siatka 3x2 - Niskie karty, żeby nie było scrollowania */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = data.category === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => update("category", cat.id)}
              className={`
                group relative 
                h-32 w-full
                rounded-xl border
                flex flex-col items-center justify-center gap-2
                transition-all duration-200
                outline-none
                ${
                  isSelected
                    ? "border-black bg-black text-white shadow-md ring-1 ring-black ring-offset-1"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50"
                }
              `}
            >
              {/* Ikona */}
              <div
                className={`
                p-2 rounded-full transition-colors
                ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-900 group-hover:bg-white"
                }
              `}
              >
                <cat.icon size={24} strokeWidth={1.5} />
              </div>

              {/* Tekst */}
              <div className="text-center px-2">
                <span
                  className={`block font-bold text-sm leading-tight ${
                    isSelected ? "text-white" : "text-gray-900"
                  }`}
                >
                  {cat.label}
                </span>
                <span
                  className={`block text-[10px] mt-0.5 opacity-80 ${
                    isSelected ? "text-gray-300" : "text-gray-400"
                  }`}
                >
                  {cat.desc}
                </span>
              </div>

              {/* Checkmark - tylko gdy wybrane */}
              {isSelected && (
                <div className="absolute top-2 right-2 text-white animate-in zoom-in duration-200">
                  <CheckCircle2 size={16} fill="white" className="text-black" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
