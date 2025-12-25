import { CATEGORIES, SmartFormData } from "./types";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils"; // Zakładam, że masz cn (clsx/tailwind-merge), jeśli nie - użyj zwykłego stringa

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext?: () => void; // Opcjonalnie: funkcja do przejścia dalej
}

export default function StepCategory({ data, update, onNext }: StepProps) {
  const handleSelect = (id: string) => {
    update("category", id);
    // Opcjonalnie: Automatyczne przejście dalej po 400ms (żeby użytkownik zobaczył zaznaczenie)
    if (onNext) {
      setTimeout(() => {
        onNext();
      }, 350);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Nagłówek - Większy i z lepszym spacingiem */}
      <div className="mb-12 md:mb-16">
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4">
          What are you selling?
        </h2>
        <p className="text-xl text-gray-500 font-medium max-w-2xl">
          Choose the category that best fits your item. This helps us find the
          right buyers and price history.
        </p>
      </div>

      {/* Siatka - Większa, responsywna, wypełniająca przestrzeń */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {CATEGORIES.map((cat) => {
          const isSelected = data.category === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={cn(
                "group relative flex flex-col items-start p-8 h-64 md:h-80 w-full text-left transition-all duration-300 ease-out rounded-3xl border-2 outline-none",
                isSelected
                  ? "border-black bg-gray-50 shadow-2xl scale-[1.02]"
                  : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-xl hover:-translate-y-1"
              )}
            >
              {/* Ikona w tle - duża i artystyczna */}
              <div
                className={cn(
                  "absolute -right-4 -bottom-4 opacity-5 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12",
                  isSelected
                    ? "opacity-10 scale-110 text-black"
                    : "text-gray-900"
                )}
              >
                <cat.icon size={180} strokeWidth={1} />
              </div>

              {/* Ikona w nagłówku */}
              <div
                className={cn(
                  "mb-auto p-4 rounded-2xl transition-colors duration-300",
                  isSelected
                    ? "bg-black text-white"
                    : "bg-gray-50 text-black group-hover:bg-gray-100"
                )}
              >
                <cat.icon size={32} strokeWidth={1.5} />
              </div>

              {/* Treść */}
              <div className="relative z-10 mt-6">
                <span className="block text-2xl font-bold tracking-tight text-gray-900 mb-2 group-hover:text-black">
                  {cat.label}
                </span>
                <span className="block text-sm font-medium text-gray-500 leading-relaxed pr-8">
                  {cat.desc}
                </span>
              </div>

              {/* Wskaźnik wyboru / Strzałka */}
              <div className="absolute top-6 right-6 transition-all duration-300">
                {isSelected ? (
                  <div className="bg-black text-white rounded-full p-1 shadow-lg animate-in zoom-in spin-in-90">
                    <CheckCircle2 size={24} />
                  </div>
                ) : (
                  <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gray-400">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>

              {/* Aktywny Border (Bottom) - styl 'active tab' */}
              {isSelected && (
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black rounded-b-2xl animate-in fade-in zoom-in-x duration-300" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Funkcja pomocnicza, jeśli nie masz pliku utils.ts
