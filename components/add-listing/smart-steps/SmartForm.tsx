"use client";

import { useState, useRef, useEffect } from "react";
import {
  Shirt,
  Scissors,
  Layers,
  Footprints,
  Disc, // Ikony kategorii
  Camera,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  UploadCloud,
  Edit3,
  DollarSign,
  Gavel,
  ScanBarcode,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

// --- KONFIGURACJA I TYPY ---

const CATEGORIES = [
  { id: "shirt", label: "Koszulka", icon: Shirt },
  { id: "shorts", label: "Spodenki", icon: Scissors },
  { id: "outerwear", label: "Kurtka/Bluza", icon: Layers },
  { id: "boots", label: "Buty", icon: Footprints },
  { id: "accessories", label: "Akcesoria", icon: Disc },
];

const CONDITIONS = [
  { id: "bnwt", label: "Nowy z metką (BNWT)" },
  { id: "bnwot", label: "Nowy bez metki (BNWOT)" },
  { id: "excellent", label: "Bardzo dobry" },
  { id: "good", label: "Dobry" },
  { id: "fair", label: "Dostateczny" },
];

interface SmartFormData {
  category: string;
  // Zdjęcia Weryfikacyjne
  photos: {
    front: string | null;
    neckTag: string | null;
    back: string | null;
    nameset: string | null; // Opcjonalne
    logo: string | null;
    sponsor: string | null;
    seams: string | null;
    backDetail: string | null;
    washTags: string | null;
    codeTag: string | null;
    defects: string[];
  };
  // Dane o kodzie
  productCode: string;
  isVintage: boolean; // Przed 2005
  isNoTag: boolean; // Sprana/Wycięta

  // Stan i Defekty
  hasDefects: boolean;
  condition: string;

  // Dodatkowe info użytkownika
  userNotes: string;

  // Zdjęcia do galerii (czyste)
  galleryPhotos: string[];

  // DANE WYGENEROWANE PRZEZ AI (do edycji w kroku 9)
  aiGenerated: {
    title: string;
    description: string;
    team: string;
    brand: string;
    model: string;
    year: string;
    size: string;
    dimensions: string;
    country: string;
    estimatedValue: string;
  };

  // Pricing (Krok 10)
  listingType: "auction" | "buy_now";
  price: string;
}

const INITIAL_STATE: SmartFormData = {
  category: "",
  photos: {
    front: null,
    neckTag: null,
    back: null,
    nameset: null,
    logo: null,
    sponsor: null,
    seams: null,
    backDetail: null,
    washTags: null,
    codeTag: null,
    defects: [],
  },
  productCode: "",
  isVintage: false,
  isNoTag: false,
  hasDefects: false,
  condition: "excellent",
  userNotes: "",
  galleryPhotos: [],
  aiGenerated: {
    title: "",
    description: "",
    team: "",
    brand: "",
    model: "",
    year: "",
    size: "",
    dimensions: "",
    country: "",
    estimatedValue: "",
  },
  listingType: "auction",
  price: "",
};

// --- KOMPONENT UPLOADERA ---
const PhotoBox = ({
  label,
  subLabel,
  imageUrl,
  onUpload,
  optional = false,
}: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      onClick={() => !imageUrl && inputRef.current?.click()}
      className={`relative aspect-[3/4] bg-gray-50 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-black transition-all overflow-hidden ${
        imageUrl ? "border-solid border-gray-300" : "border-gray-200"
      }`}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) =>
          e.target.files?.[0] &&
          onUpload(URL.createObjectURL(e.target.files[0]))
        }
      />
      {imageUrl ? (
        <>
          <Image src={imageUrl} alt={label} fill className="object-cover" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-sm hover:scale-105"
          >
            <Edit3 size={14} />
          </button>
        </>
      ) : (
        <div className="p-3">
          <Camera className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <div className="text-xs font-bold uppercase text-gray-700">
            {label}
          </div>
          <div className="text-[10px] text-gray-400 leading-tight mt-1">
            {subLabel}
          </div>
          {optional && (
            <span className="text-[9px] bg-gray-200 px-2 py-0.5 rounded-full mt-2 inline-block">
              Opcjonalne
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default function SmartForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SmartFormData>(INITIAL_STATE);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Helper do aktualizacji
  const update = (field: keyof SmartFormData, val: any) =>
    setData((prev) => ({ ...prev, [field]: val }));
  const updatePhoto = (key: string, url: string) =>
    setData((prev) => ({ ...prev, photos: { ...prev.photos, [key]: url } }));
  const updateAi = (key: string, val: string) =>
    setData((prev) => ({
      ...prev,
      aiGenerated: { ...prev.aiGenerated, [key]: val },
    }));

  // Scroll na górę przy zmianie kroku
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // --- SYMULACJA AI (Między krokiem 8 a 9) ---
  const generateAiContent = () => {
    setIsAiProcessing(true);
    setTimeout(() => {
      // Tutaj normalnie byłby strzał do API z obrazkami
      setData((prev) => ({
        ...prev,
        aiGenerated: {
          title: "Authentic FC Barcelona 2014/15 Home Shirt - Messi #10",
          description:
            "Oryginalna koszulka domowa FC Barcelony z sezonu 2014/2015. Klasyczny model Nike z technologią Dri-Fit. Koszulka posiada na plecach nadruk z nazwiskiem Messi i numerem 10. Stan zachowania jest bardzo dobry, materiał zachował żywe kolory.",
          team: "FC Barcelona",
          brand: "Nike",
          model: "Home Stadium",
          year: "2014/2015",
          size: "L",
          dimensions: "54cm (szer) x 72cm (dł)",
          country: "Thailand",
          estimatedValue: "350 - 450 PLN",
        },
      }));
      setIsAiProcessing(false);
      setStep(9);
    }, 2500);
  };

  // --- RENDERY KROKÓW ---

  const renderStep1_Category = () => (
    <div className="animate-in fade-in slide-in-from-right-4">
      <h2 className="text-2xl font-black text-center mb-8">
        1. Wybierz Kategorię
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => update("category", cat.id)}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
              data.category === cat.id
                ? "border-black bg-black text-white"
                : "border-gray-100 hover:border-gray-300 bg-white"
            }`}
          >
            <cat.icon size={32} />
            <span className="font-bold">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2_Front = () => (
    <div className="animate-in fade-in slide-in-from-right-4">
      <h2 className="text-2xl font-black text-center mb-2">
        2. Przód i Rozmiar
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Zrób zdjęcie całego przodu oraz metki przy szyi.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <PhotoBox
          label="Cały Przód"
          subLabel="Produkt w całości"
          imageUrl={data.photos.front}
          onUpload={(url: string) => updatePhoto("front", url)}
        />
        <PhotoBox
          label="Metka Rozmiaru"
          subLabel="Szyja + Kraj produkcji"
          imageUrl={data.photos.neckTag}
          onUpload={(url: string) => updatePhoto("neckTag", url)}
        />
      </div>
    </div>
  );

  const renderStep3_Back = () => (
    <div className="animate-in fade-in slide-in-from-right-4">
      <h2 className="text-2xl font-black text-center mb-2">3. Tył i Nadruki</h2>
      <p className="text-gray-500 text-center mb-8">
        Pokaż nam plecy produktu.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <PhotoBox
          label="Cały Tył"
          subLabel="Produkt w całości"
          imageUrl={data.photos.back}
          onUpload={(url: string) => updatePhoto("back", url)}
        />
        <PhotoBox
          label="Nazwisko / Numer"
          subLabel="Jeśli występuje"
          imageUrl={data.photos.nameset}
          onUpload={(url: string) => updatePhoto("nameset", url)}
          optional
        />
      </div>
    </div>
  );

  const renderStep4_Details = () => (
    <div className="animate-in fade-in slide-in-from-right-4">
      <h2 className="text-2xl font-black text-center mb-2">
        4. Detale i Zbliżenia
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Kluczowe dla weryfikacji autentyczności.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <PhotoBox
          label="Logo Klubu/Marki"
          subLabel="Zbliżenie na herb/łyżwę"
          imageUrl={data.photos.logo}
          onUpload={(url: string) => updatePhoto("logo", url)}
        />
        <PhotoBox
          label="Sponsor / Detal"
          subLabel="Środek koszulki"
          imageUrl={data.photos.sponsor}
          onUpload={(url: string) => updatePhoto("sponsor", url)}
        />
        <PhotoBox
          label="Szwy / Wykończenie"
          subLabel="Dół koszulki lub rękaw"
          imageUrl={data.photos.seams}
          onUpload={(url: string) => updatePhoto("seams", url)}
        />
        <PhotoBox
          label="Zbliżenie Tyłu"
          subLabel="Detale nadruku (opcja)"
          imageUrl={data.photos.backDetail}
          onUpload={(url: string) => updatePhoto("backDetail", url)}
          optional
        />
      </div>
    </div>
  );

  const renderStep5_Codes = () => (
    <div className="animate-in fade-in slide-in-from-right-4">
      <h2 className="text-2xl font-black text-center mb-2">
        5. Tagi Wewnętrzne
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Szukaj małych metek wewnątrz, na dole.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <PhotoBox
          label="Metki Prania"
          subLabel="Wszystkie warstwy"
          imageUrl={data.photos.washTags}
          onUpload={(url: string) => updatePhoto("washTags", url)}
        />
        <PhotoBox
          label="Kod Seryjny"
          subLabel="Mała metka z kodem"
          imageUrl={data.photos.codeTag}
          onUpload={(url: string) => updatePhoto("codeTag", url)}
        />
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
        <label className="block text-xs font-bold uppercase text-gray-500">
          Wpisz Kod Produktu
        </label>
        <div className="relative">
          <ScanBarcode
            className="absolute left-3 top-3.5 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder={
              data.isVintage || data.isNoTag
                ? "Kod niedostępny"
                : "np. CZ1234-001"
            }
            value={data.productCode}
            onChange={(e) => update("productCode", e.target.value)}
            disabled={data.isVintage || data.isNoTag}
            className="w-full pl-10 p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-black font-mono uppercase disabled:bg-gray-100 disabled:text-gray-400"
          />
        </div>

        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={data.isVintage}
              onChange={(e) => update("isVintage", e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm font-medium">
              Produkt przed 2005 (Brak kodów)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={data.isNoTag}
              onChange={(e) => update("isNoTag", e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm font-medium">
              Metka sprana / wycięta / brak
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep6_Defects = () => (
    <div className="animate-in fade-in slide-in-from-right-4">
      <h2 className="text-2xl font-black text-center mb-2">
        6. Stan i Defekty
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Bądź szczery - to buduje zaufanie.
      </p>

      <div className="bg-white border p-6 rounded-2xl mb-6 shadow-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="text-amber-500" /> Czy produkt ma defekty?
        </h3>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => update("hasDefects", false)}
            className={`flex-1 py-3 rounded-xl border-2 font-bold ${
              !data.hasDefects
                ? "bg-black text-white border-black"
                : "border-gray-200 text-gray-400"
            }`}
          >
            Nie, brak
          </button>
          <button
            onClick={() => update("hasDefects", true)}
            className={`flex-1 py-3 rounded-xl border-2 font-bold ${
              data.hasDefects
                ? "bg-amber-500 text-white border-amber-500"
                : "border-gray-200 text-gray-400"
            }`}
          >
            Tak, posiada
          </button>
        </div>

        {data.hasDefects && (
          <div className="animate-in fade-in pt-4 border-t border-gray-100">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
              Dodaj zdjęcie uszkodzenia
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {data.photos.defects.map((url, i) => (
                <div
                  key={i}
                  className="w-20 h-20 relative flex-shrink-0 rounded-lg overflow-hidden border"
                >
                  <Image src={url} alt="Defekt" fill className="object-cover" />
                </div>
              ))}
              <label className="w-20 h-20 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-black">
                <Camera size={20} className="text-gray-400" />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const newPhotos = [
                        ...data.photos.defects,
                        URL.createObjectURL(e.target.files[0]),
                      ];
                      updatePhoto("defects", newPhotos as any);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
          Ogólny Stan Produktu
        </label>
        <select
          value={data.condition}
          onChange={(e) => update("condition", e.target.value)}
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
        >
          {CONDITIONS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep7_Notes = () => (
    <div className="animate-in fade-in slide-in-from-right-4">
      <h2 className="text-2xl font-black text-center mb-2">
        7. Dodatkowe Informacje
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Czy chcesz nam coś jeszcze powiedzieć o produkcie?
      </p>
      <textarea
        className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-black resize-none text-lg"
        placeholder="Opisz historię przedmiotu, skąd go masz, lub inne ważne detale, których nie widać na zdjęciach..."
        value={data.userNotes}
        onChange={(e) => update("userNotes", e.target.value)}
      />
    </div>
  );

  const renderStep8_Gallery = () => (
    <div className="animate-in fade-in slide-in-from-right-4">
      <h2 className="text-2xl font-black text-center mb-2">
        8. Galeria Aukcji
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Te zdjęcia będą widoczne dla kupujących. <br />
        <span className="text-xs text-red-500 font-bold">
          NIE dodawaj zdjęć weryfikacyjnych (metek itp.) - system już je ma.
        </span>
      </p>

      <div className="grid grid-cols-3 gap-3">
        {data.galleryPhotos.map((url, idx) => (
          <div
            key={idx}
            className="aspect-square relative rounded-xl overflow-hidden shadow-sm"
          >
            <Image src={url} alt="Gallery" fill className="object-cover" />
          </div>
        ))}
        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-black transition-all">
          <UploadCloud className="mb-2 text-gray-400" />
          <span className="text-xs font-bold text-gray-500">Dodaj Zdjęcia</span>
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
    </div>
  );

  // --- STEP 9: PODSUMOWANIE AI (Kluczowy widok) ---
  const renderStep9_Summary = () => (
    <div className="animate-in fade-in pb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-400" /> Podsumowanie AI
        </h2>
        <p className="text-gray-500">
          Sprawdź dane wygenerowane przez nasz system i popraw je jeśli trzeba.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEWA KOLUMNA: Zdjęcia */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-lg bg-gray-100">
            {data.photos.front ? (
              <Image
                src={data.photos.front}
                alt="Main"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Brak zdjęcia głównego
              </div>
            )}
            <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
              Główne
            </div>
          </div>
          {/* Miniaturki (Galeria) */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {data.galleryPhotos.map((url, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-lg relative flex-shrink-0 overflow-hidden border"
              >
                <Image src={url} alt="thumb" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* ŚRODEK: Opis i Tytuł */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div>
            <label className="flex justify-between text-xs font-bold uppercase text-gray-500 mb-1">
              Tytuł Ogłoszenia <Edit3 size={12} className="cursor-pointer" />
            </label>
            <textarea
              value={data.aiGenerated.title}
              onChange={(e) => updateAi("title", e.target.value)}
              className="w-full text-xl font-black text-gray-900 bg-transparent border-b border-gray-200 focus:border-black outline-none resize-none h-20"
            />
          </div>

          <div>
            <label className="flex justify-between text-xs font-bold uppercase text-gray-500 mb-1">
              Opis Produktu (AI) <Edit3 size={12} className="cursor-pointer" />
            </label>
            <textarea
              value={data.aiGenerated.description}
              onChange={(e) => updateAi("description", e.target.value)}
              className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm leading-relaxed text-gray-600 focus:outline-none focus:border-black resize-none"
            />
          </div>
        </div>

        {/* PRAWA STRONA: Panel Atrybutów */}
        <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4 border-b pb-2">
            Detale Produktu
          </h3>
          <div className="space-y-4 text-sm">
            {[
              {
                l: "Kategoria",
                v: "category",
                val: CATEGORIES.find((c) => c.id === data.category)?.label,
              },
              { l: "Marka", v: "brand", ai: true },
              { l: "Zespół / Klub", v: "team", ai: true },
              { l: "Model", v: "model", ai: true },
              { l: "Rozmiar", v: "size", ai: true },
              { l: "Wymiary", v: "dimensions", ai: true },
              { l: "Kraj Produkcji", v: "country", ai: true },
              {
                l: "Kod Seryjny",
                v: "productCode",
                val: data.productCode || "Brak / Vintage",
              },
            ].map((item: any) => (
              <div
                key={item.l}
                className="flex flex-col border-b border-gray-50 pb-2 last:border-0"
              >
                <span className="text-xs text-gray-400 font-bold uppercase">
                  {item.l}
                </span>
                {item.ai ? (
                  <input
                    value={(data.aiGenerated as any)[item.v]}
                    onChange={(e) => updateAi(item.v, e.target.value)}
                    className="font-semibold text-gray-900 bg-transparent outline-none focus:bg-gray-50 px-1 -ml-1 rounded"
                  />
                ) : (
                  <span className="font-semibold text-gray-900">
                    {item.val}
                  </span>
                )}
              </div>
            ))}

            {/* Edycja Stanu */}
            <div className="flex flex-col border-b border-gray-50 pb-2">
              <span className="text-xs text-gray-400 font-bold uppercase">
                Stan
              </span>
              <select
                value={data.condition}
                onChange={(e) => update("condition", e.target.value)}
                className="font-semibold text-gray-900 bg-transparent outline-none -ml-1"
              >
                {CONDITIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Wycena */}
            <div className="pt-2">
              <span className="text-xs text-blue-500 font-bold uppercase">
                Szacowana Wartość
              </span>
              <div className="text-xl font-black text-blue-600">
                {data.aiGenerated.estimatedValue}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep10_Pricing = () => (
    <div className="animate-in fade-in slide-in-from-right-4 max-w-xl mx-auto">
      <h2 className="text-3xl font-black text-center mb-8">
        Strategia Sprzedaży
      </h2>
      <div className="bg-black text-white p-8 rounded-3xl shadow-xl">
        <div className="flex gap-2 mb-8 p-1 bg-gray-800 rounded-xl">
          <button
            onClick={() => update("listingType", "auction")}
            className={`flex-1 py-3 font-bold rounded-lg transition-all ${
              data.listingType === "auction"
                ? "bg-white text-black"
                : "text-gray-400"
            }`}
          >
            Aukcja
          </button>
          <button
            onClick={() => update("listingType", "buy_now")}
            className={`flex-1 py-3 font-bold rounded-lg transition-all ${
              data.listingType === "buy_now"
                ? "bg-white text-black"
                : "text-gray-400"
            }`}
          >
            Kup Teraz
          </button>
        </div>

        <div className="mb-8">
          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">
            {data.listingType === "auction"
              ? "Cena Wywoławcza"
              : "Cena Sprzedaży"}
          </label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl">
              PLN
            </span>
            <input
              type="number"
              value={data.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="0.00"
              className="w-full pl-20 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-3xl font-bold focus:border-white outline-none"
            />
          </div>
        </div>

        <button
          onClick={() => alert("Opublikowano!")}
          className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-black text-lg rounded-xl transition-all shadow-lg shadow-green-900/50"
        >
          OPUBLIKUJ
        </button>
      </div>
    </div>
  );

  // --- GŁÓWNY LAYOUT ---

  if (isAiProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Sparkles className="w-16 h-16 text-yellow-400 animate-spin mb-6" />
        <h2 className="text-2xl font-black">AI Analizuje Twoje Zdjęcia...</h2>
        <p className="text-gray-500 mt-2">
          Rozpoznawanie marki, modelu i generowanie opisu.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Pasek postępu */}
      <div className="mb-8">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-300"
            style={{ width: `${(step / 10) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mt-2">
          <span>Start</span>
          <span>Weryfikacja</span>
          <span>Detale</span>
          <span>Publikacja</span>
        </div>
      </div>
      {step === 1 && renderStep1_Category()}
      {step === 2 && renderStep2_Front()}
      {step === 3 && renderStep3_Back()}
      {step === 4 && renderStep4_Details()}
      {step === 5 && renderStep5_Codes()}
      {step === 6 && renderStep6_Defects()}
      {step === 7 && renderStep7_Notes()}
      {step === 8 && renderStep8_Gallery()}
      {step === 9 && renderStep9_Summary()}
      {step === 10 && renderStep10_Pricing()}
      {/* Nawigacja */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur border-t border-gray-200 p-4 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => (step === 1 ? onBack() : setStep((s) => s - 1))}
            className="flex items-center px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={18} className="mr-1" /> Wróć
          </button>

          {step < 9 && (
            <button
              onClick={() =>
                step === 8 ? generateAiContent() : setStep((s) => s + 1)
              }
              className="flex items-center px-8 py-3 bg-black text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              {step === 8 ? "Generuj z AI" : "Dalej"}{" "}
              <ChevronRight size={18} className="ml-2" />
            </button>
          )}

          {step === 9 && (
            <button
              onClick={() => setStep(10)}
              className="flex items-center px-8 py-3 bg-black text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Przejdź do Wyceny <DollarSign size={18} className="ml-2" />
            </button>
          )}
        </div>
      </div>
      <div className="h-24" /> {/* Spacer dla fixed bottom bar */}
    </div>
  );
}
