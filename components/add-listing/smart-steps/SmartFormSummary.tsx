import { Sparkles, Edit3, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { SmartFormData, CONDITIONS } from "./types";

interface SmartFormSummaryProps {
  step: number;
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  updateAi: (key: string, val: string) => void;
  onSubmit: () => void;
}

export default function SmartFormSummary({
  step,
  data,
  update,
  updateAi,
  onSubmit,
}: SmartFormSummaryProps) {
  // KROK 9: PODSUMOWANIE AI
  if (step === 9) {
    return (
      <div className="max-w-6xl mx-auto animate-in fade-in duration-700 pb-24">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
            <Sparkles size={14} /> Analiza Zakończona
          </span>
          <h2 className="text-4xl font-black text-gray-900">
            Sprawdź dane przedmiotu
          </h2>
          <p className="text-gray-500 mt-2">
            Nasz system AI przygotował opis. Możesz edytować każde pole.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* LEWA: ZDJĘCIA */}
          <div className="w-full lg:w-5/12 space-y-4 sticky top-8">
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden relative shadow-2xl bg-gray-100">
              {data.photos.front && (
                <Image
                  src={data.photos.front}
                  alt="Main"
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                <span className="text-white font-bold text-sm tracking-widest uppercase">
                  Podgląd Główny
                </span>
              </div>
            </div>
            {/* Miniaturki */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[data.photos.back, data.photos.neckTag, ...data.galleryPhotos]
                .filter(Boolean)
                .map((url, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-xl relative flex-shrink-0 overflow-hidden border border-gray-200"
                  >
                    <Image
                      src={url as string}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* PRAWA: DANE I OPIS */}
          <div className="w-full lg:w-7/12 space-y-8">
            {/* Tytuł i Opis */}
            <div className="space-y-6">
              <div className="group relative">
                <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">
                  Tytuł Ogłoszenia
                </label>
                <textarea
                  value={data.aiGenerated.title}
                  onChange={(e) => updateAi("title", e.target.value)}
                  className="w-full text-3xl font-black text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-black outline-none resize-none h-auto overflow-hidden leading-tight transition-all"
                  rows={2}
                />
                <Edit3
                  className="absolute top-6 right-0 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  size={20}
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">
                  Opis AI
                </label>
                <textarea
                  value={data.aiGenerated.description}
                  onChange={(e) => updateAi("description", e.target.value)}
                  className="w-full h-48 bg-gray-50 rounded-2xl p-6 text-gray-600 leading-relaxed border border-transparent focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-black outline-none resize-none transition-all"
                />
              </div>
            </div>

            {/* Tabela Atrybutów */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-lg shadow-gray-100/50">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />{" "}
                Zweryfikowane Cechy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                {[
                  { l: "Marka", v: "brand" },
                  { l: "Drużyna", v: "team" },
                  { l: "Model", v: "model" },
                  { l: "Rok", v: "year" },
                  { l: "Rozmiar", v: "size" },
                  { l: "Kraj", v: "country" },
                ].map((item) => (
                  <div key={item.v} className="border-b border-gray-100 pb-2">
                    <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                      {item.l}
                    </span>
                    <input
                      value={(data.aiGenerated as any)[item.v]}
                      onChange={(e) => updateAi(item.v, e.target.value)}
                      className="font-bold text-gray-900 bg-transparent w-full outline-none focus:text-blue-600 transition-colors"
                    />
                  </div>
                ))}

                <div className="border-b border-gray-100 pb-2">
                  <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                    Stan
                  </span>
                  <select
                    value={data.condition}
                    onChange={(e) => update("condition", e.target.value)}
                    className="font-bold text-gray-900 bg-transparent w-full outline-none -ml-1 py-0 cursor-pointer"
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Wycena AI */}
            <div className="bg-blue-50/50 rounded-2xl p-6 flex items-center justify-between border border-blue-100">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase">
                  Sugerowana Wartość
                </span>
                <p className="text-blue-900 font-medium text-sm mt-1">
                  Na podstawie ostatnich sprzedaży tego modelu.
                </p>
              </div>
              <div className="text-2xl font-black text-blue-600">
                {data.aiGenerated.estimatedValue}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // KROK 10: CENA I PUBLIKACJA
  if (step === 10) {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black mb-4">Strategia Sprzedaży</h2>
          <p className="text-gray-500">
            Decyzja należy do Ciebie. Aukcja czy Kup Teraz?
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 relative overflow-hidden">
          <div className="flex gap-2 mb-10 p-1.5 bg-gray-100 rounded-2xl">
            <button
              onClick={() => update("listingType", "auction")}
              className={`flex-1 py-4 font-bold rounded-xl transition-all shadow-sm ${
                data.listingType === "auction"
                  ? "bg-white text-black shadow-md"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Aukcja (Licytacja)
            </button>
            <button
              onClick={() => update("listingType", "buy_now")}
              className={`flex-1 py-4 font-bold rounded-xl transition-all shadow-sm ${
                data.listingType === "buy_now"
                  ? "bg-white text-black shadow-md"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Kup Teraz
            </button>
          </div>

          <div className="text-center mb-12">
            <label className="block text-xs font-bold uppercase text-gray-400 mb-4">
              {data.listingType === "auction"
                ? "Cena startowa"
                : "Cena sprzedaży"}
            </label>
            <div className="inline-flex items-center justify-center relative">
              <span className="text-4xl font-black text-gray-300 absolute left-[-3rem]">
                PLN
              </span>
              <input
                type="number"
                placeholder="0"
                value={data.price}
                onChange={(e) => update("price", e.target.value)}
                className="text-7xl font-black text-gray-900 text-center w-64 bg-transparent outline-none border-b-4 border-gray-100 focus:border-black transition-all placeholder:text-gray-200"
              />
            </div>
          </div>

          <button
            onClick={onSubmit}
            className="w-full py-5 bg-black text-white rounded-2xl font-bold text-xl hover:bg-gray-800 hover:scale-[1.02] transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3"
          >
            Opublikuj Ofertę <Sparkles className="text-yellow-400" />
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            Publikując akceptujesz regulamin serwisu Matchdays.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
