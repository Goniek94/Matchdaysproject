"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Camera,
  Shirt,
  ArrowRight,
  History,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

// --- TYPY DANYCH ---
type ListingScenario = "MODERN_AI" | "RETRO_AI" | "MANUAL_QUEUE" | null;

interface FormData {
  // Krok 1: Podstawy
  brand: string;
  itemType: string;
  year: number;

  // Krok 2: Autentyczność (Core Logic)
  hasIdCode: boolean | null; // Czy produkt w ogóle miał kod?
  tagCondition: "readable" | "damaged" | null; // A czy B
  idCodeValue: string;

  // Krok 3: Zdjęcia (Symulacja)
  images: string[];
}

interface SmartFormProps {
  onBack: () => void; // Funkcja powrotu do ekranu wyboru (przekazywana z page.tsx)
}

export default function SmartForm({ onBack }: SmartFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    brand: "",
    itemType: "shirt",
    year: 2024,
    hasIdCode: null,
    tagCondition: null,
    idCodeValue: "",
    images: [],
  });

  const [scenario, setScenario] = useState<ListingScenario>(null);

  // --- LOGIKA "MÓZG" FORMULARZA ---
  // Decyduje o ścieżce weryfikacji na żywo
  useEffect(() => {
    if (!formData.tagCondition) {
      setScenario(null);
      return;
    }

    // SCENARIUSZ 3: PRODUKT USZKODZONY/NIEPEWNY (Priorytet najwyższy)
    // Jeśli metka jest uszkodzona, zawsze idzie do kolejki manualnej (eksperta)
    if (formData.tagCondition === "damaged") {
      setScenario("MANUAL_QUEUE");
      return;
    }

    // Jeśli metka jest czytelna, sprawdzamy rok:
    if (formData.tagCondition === "readable") {
      // SCENARIUSZ 1: PRODUKT NOWOCZESNY (> 2010) - Szybka weryfikacja kodem
      if (formData.year > 2010) {
        setScenario("MODERN_AI");
      }
      // SCENARIUSZ 2: PRODUKT RETRO (< 2010) - Weryfikacja hybrydowa
      else {
        setScenario("RETRO_AI");
      }
    }
  }, [formData.year, formData.tagCondition]);

  const updateForm = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- KROK 1: PODSTAWOWE DANE ---
  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shirt className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-2xl font-bold">Describe your Item</h2>
        <p className="text-gray-500">
          Let's start with the basics for AI analysis.
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold uppercase tracking-wider mb-2">
          Brand
        </label>
        <select
          value={formData.brand}
          onChange={(e) => updateForm("brand", e.target.value)}
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
        >
          <option value="">Select Brand</option>
          <option value="nike">Nike</option>
          <option value="adidas">Adidas</option>
          <option value="puma">Puma</option>
          <option value="umbro">Umbro</option>
          <option value="kappa">Kappa</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold uppercase tracking-wider mb-2">
          Release Year (Estimate)
        </label>
        <input
          type="number"
          value={formData.year}
          onChange={(e) => updateForm("year", parseInt(e.target.value))}
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
          min="1980"
          max="2025"
        />
        <p className="text-xs text-gray-400 mt-2">
          This helps us determine which verification process to use.
        </p>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!formData.brand}
        className="w-full py-4 bg-black text-white font-bold rounded-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
      >
        Next Step <ArrowRight size={18} />
      </button>

      {/* Przycisk powrotu do wyboru metody */}
      <button
        onClick={onBack}
        className="w-full py-3 text-gray-500 font-bold hover:text-black transition-colors"
      >
        Cancel & Go Back
      </button>
    </div>
  );

  // --- KROK 2: WERYFIKACJA STANU (LOGIKA SCENARIUSZY) ---
  const renderStep2 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">Authenticity Check</h2>
        <p className="text-gray-500">The "Safety Valve" Verification System</p>
      </div>

      {/* A. Czy produkt posiada metki wewnętrzne? */}
      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          1. Internal Tags / Codes
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => updateForm("hasIdCode", true)}
            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
              formData.hasIdCode === true
                ? "border-black bg-black text-white"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            Yes, present
          </button>
          <button
            onClick={() => updateForm("hasIdCode", false)}
            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
              formData.hasIdCode === false
                ? "border-black bg-black text-white"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            No / Was cut off
          </button>
        </div>
      </div>

      {/* B. Stan Metki (Warunek Kluczowy) */}
      {formData.hasIdCode !== null && (
        <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            2. Tag Condition
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Be honest. We accept damaged items, but we need to verify them
            manually.
          </p>

          <div className="space-y-3">
            {/* Opcja: Czytelna */}
            <button
              onClick={() => updateForm("tagCondition", "readable")}
              className={`w-full text-left p-4 rounded-xl border-2 flex items-start gap-3 transition-all ${
                formData.tagCondition === "readable"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <div
                className={`mt-1 p-1 rounded-full ${
                  formData.tagCondition === "readable"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <CheckCircle size={14} />
              </div>
              <div>
                <span className="font-bold block">A. Fully Readable</span>
                <span className="text-sm text-gray-500">
                  Product codes are visible and clear.
                </span>
              </div>
            </button>

            {/* Opcja: Uszkodzona (SCENARIUSZ 3) */}
            <button
              onClick={() => updateForm("tagCondition", "damaged")}
              className={`w-full text-left p-4 rounded-xl border-2 flex items-start gap-3 transition-all ${
                formData.tagCondition === "damaged"
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <div
                className={`mt-1 p-1 rounded-full ${
                  formData.tagCondition === "damaged"
                    ? "bg-amber-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <AlertTriangle size={14} />
              </div>
              <div>
                <span className="font-bold block">
                  B. Cut / Faded / Missing
                </span>
                <span className="text-sm text-gray-500">
                  I can't read the code or the tag is gone.
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* --- DYNAMICZNY WYNIK (SCENARIUSZE) --- */}

      {scenario === "MODERN_AI" && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold">
            <CheckCircle size={20} />
            <span>AI Fast Track Available</span>
          </div>
          <p className="text-sm text-blue-700 mb-4">
            Great! Your item is modern ({formData.year}) and has readable tags.
            Enter the code below for instant verification.
          </p>
          <input
            type="text"
            placeholder="e.g. CZ1234-001"
            className="w-full p-4 bg-white border border-blue-200 rounded-xl font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.idCodeValue}
            onChange={(e) => updateForm("idCodeValue", e.target.value)}
          />
        </div>
      )}

      {scenario === "RETRO_AI" && (
        <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 mb-3 text-purple-800 font-bold">
            <History size={20} />
            <span>Vintage Verification Process</span>
          </div>
          <p className="text-sm text-purple-700 mb-4">
            Since this is a retro item ({formData.year}), codes might not be in
            our modern database. Please enter the code if visible, but{" "}
            <strong>photos of stitching & materials</strong> will be required
            next.
          </p>
          <input
            type="text"
            placeholder="Code (Optional for vintage)"
            className="w-full p-4 bg-white border border-purple-200 rounded-xl font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.idCodeValue}
            onChange={(e) => updateForm("idCodeValue", e.target.value)}
          />
        </div>
      )}

      {scenario === "MANUAL_QUEUE" && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 mb-3 text-amber-800 font-bold">
            <AlertCircle size={20} />
            <span>Manual Verification Required</span>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Don't worry!</strong> We love items with history. Because
            the tags are damaged, our AI can't verify this instantly.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-amber-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              Item will be listed as <strong>"Pending Verification"</strong>.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              Our expert team will review your photos within 24h.
            </li>
          </ul>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={
            !scenario ||
            (scenario === "MODERN_AI" && formData.idCodeValue.length < 3)
          }
          className="flex-1 py-4 bg-black text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          {scenario === "MANUAL_QUEUE"
            ? "Proceed to Photo Evidence"
            : "Verify & Continue"}{" "}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  // --- KROK 3: ZDJĘCIA (Symulacja dla AI) ---
  const renderStep3 = () => (
    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 animate-in fade-in zoom-in-95 duration-300">
      <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-400">Step 3: AI Photo Scan</h3>
      <p className="text-gray-400 max-w-md mx-auto mb-6">
        Depending on the scenario detected (<strong>{scenario}</strong>), we
        would now ask for specific angles.
      </p>

      {scenario === "MANUAL_QUEUE" && (
        <div className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-bold mb-6">
          ⚠️ Requirement: Macro shots of stitching & fabric
        </div>
      )}
      {scenario === "MODERN_AI" && (
        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold mb-6">
          🤖 AI Action: Scanning inner tag code...
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setStep(2)}
          className="text-black underline font-bold"
        >
          Go Back
        </button>
        {/* Tu byłby przycisk "Finish Listing" */}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Progress Bar - Prosty wskaźnik postępu */}
      <div className="flex items-center gap-2 mb-10 px-2">
        <div
          className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
            step >= 1 ? "bg-black" : "bg-gray-200"
          }`}
        ></div>
        <div
          className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
            step >= 2 ? "bg-black" : "bg-gray-200"
          }`}
        ></div>
        <div
          className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
            step >= 3 ? "bg-black" : "bg-gray-200"
          }`}
        ></div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}
