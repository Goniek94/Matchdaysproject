"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Wand2,
  History,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Importujemy pod-komponenty z tego samego folderu
import StepBasicInfo from "./StepBasicInfo";
import StepPhotos from "./StepPhotos";
import StepPricing from "./StepPricing";

// --- TYPY DANYCH ---
type TagStatus = "modern" | "vintage" | "washed" | "cut" | null;
type VerificationStatus = "verified" | "pending_expert" | "high_risk" | null;
type ListingType = "auction" | "buy_now";

interface MandatoryPhotos {
  front: string | null;
  back: string | null;
  crest: string | null;
  tags: string | null;
}

interface FormData {
  title: string;
  brand: string;
  team: string;
  year: string;
  size: string;
  condition: string;
  description: string;
  tagStatus: TagStatus;
  mandatoryPhotos: MandatoryPhotos;
  extraPhotos: string[];
  listingType: ListingType;
  price: string;
  auctionDuration: string;
  acceptOffers: boolean;
}

const INITIAL_DATA: FormData = {
  title: "",
  brand: "",
  team: "",
  year: "",
  size: "",
  condition: "excellent",
  description: "",
  tagStatus: null,
  mandatoryPhotos: { front: null, back: null, crest: null, tags: null },
  extraPhotos: [],
  listingType: "auction",
  price: "",
  auctionDuration: "7",
  acceptOffers: true,
};

interface ManualFormProps {
  onBack: () => void;
}

export default function ManualForm({ onBack }: ManualFormProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationStatus>(null);

  // Scroll na górę przy zmianie kroku
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const updateData = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // --- WALIDACJA ---
  const mandatoryFilled = Object.values(data.mandatoryPhotos).every(
    (val) => val !== null
  );
  // Liczymy zdjęcia (obowiązkowe + dodatkowe)
  const totalPhotosCount =
    (data.mandatoryPhotos.front ? 1 : 0) +
    (data.mandatoryPhotos.back ? 1 : 0) +
    (data.mandatoryPhotos.crest ? 1 : 0) +
    (data.mandatoryPhotos.tags ? 1 : 0) +
    data.extraPhotos.length;

  const isStep2Valid =
    mandatoryFilled &&
    totalPhotosCount >= 4 && // Wymagamy minimum 4 zdjęć (podstawowych)
    data.description.trim().length > 10;

  const isStep3Valid = data.price.length > 0 && !isNaN(Number(data.price));

  // --- FINALIZACJA I "Safety Valve" ---
  const runSafetyValve = () => {
    setIsAnalyzing(true);
    // Symulacja weryfikacji
    setTimeout(() => {
      setIsAnalyzing(false);
      // Prosta logika decyzyjna na podstawie Tag Status
      if (data.tagStatus === "modern" && data.mandatoryPhotos.tags) {
        setVerificationResult("verified");
      } else if (["vintage", "washed", "cut"].includes(data.tagStatus || "")) {
        setVerificationResult("pending_expert");
      } else {
        setVerificationResult("high_risk");
      }
      setStep(4);
    }, 2500);
  };

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center py-32 text-center animate-pulse">
      <Wand2 className="w-16 h-16 text-blue-600 mb-6" />
      <h2 className="text-3xl font-black">Verifying Listing Safety...</h2>
      <p className="text-gray-500 mt-2">
        Checking tags and photos against our database.
      </p>
    </div>
  );

  const renderResult = () => (
    <div className="max-w-xl mx-auto bg-white p-10 rounded-3xl shadow-xl text-center animate-in zoom-in-95">
      {verificationResult === "verified" ? (
        <>
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-4">Verified & Ready!</h2>
          <p className="text-gray-500 mb-8 text-lg">
            Your listing for <strong>{data.title}</strong> meets our safety
            standards and is ready to go live immediately.
          </p>
          <button
            onClick={() => alert("Redirect to Success Page")}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Publish Now
          </button>
        </>
      ) : (
        <>
          <History className="w-20 h-20 text-amber-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-4">Expert Review Needed</h2>
          <p className="text-gray-500 mb-8 text-lg">
            Because this is a <strong>{data.tagStatus}</strong> item, our
            experts need to verify the photos manually to ensure authenticity.
          </p>
          <div className="bg-amber-50 p-4 rounded-xl mb-8 text-left text-sm text-amber-800">
            <strong>What happens next?</strong>
            <br />
            1. Listing will be visible as "Pending".
            <br />
            2. Review usually takes &lt; 24h.
            <br />
            3. You will be notified via email.
          </div>
          <button
            onClick={() => alert("Redirect to Pending Page")}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Submit for Review
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {/* Pasek postępu */}
      {!isAnalyzing && verificationResult === null && (
        <div className="max-w-xl mx-auto h-1 bg-gray-200 rounded-full mb-12 overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${step * 25}%` }}
          ></div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {isAnalyzing ? (
            renderAnalyzing()
          ) : step === 4 ? (
            renderResult()
          ) : (
            <>
              {step === 1 && (
                <StepBasicInfo data={data} updateData={updateData} />
              )}
              {step === 2 && <StepPhotos data={data} updateData={updateData} />}
              {step === 3 && (
                <StepPricing data={data} updateData={updateData} />
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nawigacja Dół */}
      {!isAnalyzing && verificationResult === null && (
        <div className="max-w-4xl mx-auto flex justify-between mt-12 pt-8 border-t border-gray-200">
          <button
            onClick={() => {
              if (step === 1) onBack();
              else setStep((s) => s - 1);
            }}
            className="flex items-center font-bold text-gray-500 hover:text-black transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2" size={20} /> Back
          </button>

          <button
            onClick={() => {
              if (step === 3) runSafetyValve();
              else setStep((s) => s + 1);
            }}
            disabled={
              (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)
            }
            className={`flex items-center px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
              (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)
                ? "bg-gray-300 cursor-not-allowed shadow-none"
                : "bg-black hover:scale-105 hover:bg-gray-900"
            }`}
          >
            {step === 3 ? "Verify & Publish" : "Next Step"}{" "}
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
