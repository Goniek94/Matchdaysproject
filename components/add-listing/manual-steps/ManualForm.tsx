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

// Import nowych pod-komponentów
import StepBasicInfo from "../manual-steps/StepBasicInfo";
import StepPhotos from "../manual-steps/StepPhotos";
import StepPricing from "../manual-steps/StepPricing";

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const updateData = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // --- WALIDACJA DLA NAWIGACJI ---
  const mandatoryFilled = Object.values(data.mandatoryPhotos).every(
    (val) => val !== null
  );
  const totalPhotosCount =
    (data.mandatoryPhotos.front ? 1 : 0) +
    (data.mandatoryPhotos.back ? 1 : 0) +
    (data.mandatoryPhotos.crest ? 1 : 0) +
    (data.mandatoryPhotos.tags ? 1 : 0) +
    data.extraPhotos.length;

  const isStep2Valid =
    mandatoryFilled &&
    totalPhotosCount >= 5 &&
    data.description.trim().length > 10;
  const isStep3Valid = data.price.length > 0 && !isNaN(Number(data.price));

  // --- FINALIZACJA ---
  const runSafetyValve = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (data.tagStatus === "modern" && data.mandatoryPhotos.tags) {
        setVerificationResult("verified");
      } else if (["vintage", "washed", "cut"].includes(data.tagStatus || "")) {
        setVerificationResult("pending_expert");
      } else {
        setVerificationResult("high_risk");
      }
      setStep(4);
    }, 3000);
  };

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center py-32 text-center animate-pulse">
      <Wand2 className="w-16 h-16 text-blue-600 mb-6" />
      <h2 className="text-3xl font-black">Verifying...</h2>
    </div>
  );

  const renderResult = () => (
    <div className="max-w-xl mx-auto bg-white p-10 rounded-3xl shadow-xl text-center">
      {verificationResult === "verified" ? (
        <>
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Verified & Ready!</h2>
          <p className="text-gray-500 mb-6">
            Your listing for <strong>{data.title}</strong> is ready to go live.
          </p>
          <button className="w-full bg-black text-white py-4 rounded-xl font-bold">
            Publish Now
          </button>
        </>
      ) : (
        <>
          <History className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Expert Review Needed</h2>
          <p className="text-gray-500 mb-6">
            Due to vintage status, we need a manual check.
          </p>
          <button className="w-full bg-black text-white py-4 rounded-xl font-bold">
            Submit to Experts
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="container-max w-full">
      {/* Pasek postępu */}
      {!isAnalyzing && verificationResult === null && (
        <div className="max-w-xl mx-auto h-1 bg-gray-200 rounded-full mb-12 overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-500"
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
        >
          {isAnalyzing ? (
            renderAnalyzing()
          ) : (
            <>
              {step === 1 && (
                <StepBasicInfo data={data} updateData={updateData} />
              )}
              {step === 2 && <StepPhotos data={data} updateData={updateData} />}
              {step === 3 && (
                <StepPricing data={data} updateData={updateData} />
              )}
              {step === 4 && renderResult()}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {!isAnalyzing && verificationResult === null && (
        <div className="max-w-4xl mx-auto flex justify-between mt-12 pt-8 border-t border-gray-200">
          <button
            onClick={() => {
              if (step === 1) onBack();
              else setStep((s) => s - 1);
            }}
            className="flex items-center font-bold text-gray-500 hover:text-black"
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
            className={`flex items-center px-8 py-3 rounded-xl font-bold text-white transition-all ${
              (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black hover:scale-105"
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
