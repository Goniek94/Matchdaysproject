"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SmartFormData, INITIAL_STATE } from "./types";
import SmartFormSteps from "./SmartFormSteps";
import SmartFormSummary from "./SmartFormSummary";
import SuccessView from "./SuccessView";
import { createSportsListing } from "@/lib/api/listings.api";

export default function SmartForm({ onBack }: { onBack?: () => void } = {}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SmartFormData>(INITIAL_STATE);
  const [isPublished, setIsPublished] = useState(false);

  const update = (field: keyof SmartFormData, val: any) =>
    setData((prev) => ({ ...prev, [field]: val }));

  const handleNext = () => {
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackNavigation = () => {
    if (step === 1) {
      if (onBack) onBack();
    } else {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePublish = async () => {
    try {
      const result = await createSportsListing(data);
      if (result.success) {
        setIsPublished(true);
      } else {
        alert(`Failed to create listing: ${result.error || result.message}`);
      }
    } catch (error) {
      alert("An error occurred while publishing. Please try again.");
    }
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

  // --- STEP 6: FINAL SUMMARY + PUBLISH ---
  if (step === 6) {
    return (
      <div className="min-h-screen pb-24 pt-24 px-4 max-w-4xl mx-auto">
        <SmartFormSummary
          data={data}
          onPublish={handlePublish}
          onBack={handleBackNavigation}
        />
      </div>
    );
  }

  // --- MAIN RENDER (steps 1-5) ---
  const isStep4AI = step === 4 && data.completionMode === "AI";
  const isPhotoStep = step === 3;

  return (
    <div className="min-h-screen pb-24 pt-24">
      {/* Progress Bar */}
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
        <SmartFormSteps
          step={step}
          data={data}
          update={update}
          onNext={handleNext}
          onBack={handleBackNavigation}
        />

        {/* Buttons — hidden for step 3 (photos have their own Next)
            and for step 4 AI (StepAISummary manages its own flow) */}
        {!isPhotoStep && !isStep4AI && (
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
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

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-10 py-3 rounded-xl font-bold text-white bg-black hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all hover:scale-[1.02] active:scale-95"
            >
              Next <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 4 AI — Back + Continue buttons after analysis */}
        {isStep4AI && (
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleBackNavigation}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft
                size={18}
                className="transition-transform group-hover:-translate-x-1"
              />
              Back
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-10 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95"
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
