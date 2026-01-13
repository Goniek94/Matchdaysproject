"use client";

import { useState } from "react";
import { Loader2, ArrowRight, ArrowLeft, Wand2 } from "lucide-react";
import { SmartFormData, INITIAL_STATE } from "./types";
import SmartFormSteps from "./SmartFormSteps";
import SmartFormSummary from "./SmartFormSummary";
import SuccessView from "./SuccessView";

export default function SmartForm({ onBack }: { onBack?: () => void } = {}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SmartFormData>(INITIAL_STATE);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // --- LOGIC: STATE ---
  const update = (field: keyof SmartFormData, val: any) =>
    setData((prev) => ({ ...prev, [field]: val }));

  // --- LOGIC: NAVIGATION ---
  const handleNext = () => {
    if (step === 8) {
      handleAiGeneration();
    } else {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackNavigation = () => {
    if (step === 1) {
      if (onBack) onBack();
    } else {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // --- LOGIC: AI & PUBLISH ---
  const handleAiGeneration = () => {
    setIsAiProcessing(true);
    // TODO: Implement AI analysis based on selected features
    setTimeout(() => {
      setIsAiProcessing(false);
      setStep(7); // Go to summary
    }, 2500);
  };

  const handlePublish = () => {
    setIsPublished(true);
  };

  // --- SPECIAL VIEWS ---

  if (isPublished) {
    return (
      <SuccessView
        status="live"
        title={data.title || "Your Listing"}
        imageUrl={data.photos[0]?.url || ""}
        onReset={() => {
          setIsPublished(false);
          setStep(1);
          setData(INITIAL_STATE);
        }}
      />
    );
  }

  if (isAiProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 animate-pulse"></div>
          <Loader2 className="w-16 h-16 text-black animate-spin relative z-10" />
        </div>
        <h2 className="text-3xl font-black mt-8 mb-2">
          AI Is Analyzing Your Photos
        </h2>
        <p className="text-gray-500 font-medium">
          Identifying brand, model, and estimating value...
        </p>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen pb-24">
      {/* Progress Bar (Sticky Top) */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-8 py-4 px-4 transition-all">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold font-mono text-gray-400">
            STEP {step}/5
          </span>
        </div>
      </div>

      <div className="px-4 max-w-4xl mx-auto">
        {step <= 5 ? (
          <>
            {/* Step Content */}
            <SmartFormSteps
              step={step}
              data={data}
              update={update}
              onNext={handleNext}
            />

            {/* --- BUTTONS SECTION (STATIC) for Steps 1-8 --- */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
              {/* Back Button */}
              <button
                onClick={handleBackNavigation}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft
                  size={18}
                  className="transition-transform group-hover:-translate-x-1"
                />
                {step === 1 ? "Cancel" : "Back"}
              </button>

              {/* Next / AI Button */}
              <button
                onClick={handleNext}
                disabled={isAiProcessing}
                className={`flex items-center gap-2 px-10 py-3 rounded-xl font-bold text-white shadow-lg shadow-gray-200 transition-all hover:scale-[1.02] active:scale-95 ${
                  step === 8
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-200"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {step === 8 ? (
                  <>
                    Generate with AI <Wand2 size={18} />
                  </>
                ) : (
                  <>
                    Next <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Summary View - Coming Soon */
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Summary - Coming Soon</h2>
            <button
              onClick={handlePublish}
              className="px-8 py-3 bg-black text-white rounded-xl font-bold"
            >
              Publish Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
