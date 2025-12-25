"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { SmartFormData, INITIAL_STATE } from "./types";
import SmartFormSteps from "./SmartFormSteps";
import SmartFormSummary from "./SmartFormSummary";
import SuccessView from "./SuccessView";

export default function SmartForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SmartFormData>(INITIAL_STATE);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // --- LOGIKA STANU ---
  const update = (field: keyof SmartFormData, val: any) =>
    setData((prev) => ({ ...prev, [field]: val }));
  const updatePhoto = (key: string, url: string) =>
    setData((prev) => ({ ...prev, photos: { ...prev.photos, [key]: url } }));
  const updateAi = (key: string, val: string) =>
    setData((prev) => ({
      ...prev,
      aiGenerated: { ...prev.aiGenerated, [key]: val },
    }));

  // --- LOGIKA AI I PUBLIKACJI ---
  const handleAiGeneration = () => {
    setIsAiProcessing(true);
    // Symulacja API
    setTimeout(() => {
      setData((prev) => ({
        ...prev,
        aiGenerated: {
          title: "Authentic FC Barcelona 2014/15 Home Shirt - Messi #10",
          description:
            "Oryginalna koszulka domowa FC Barcelony z sezonu 2014/2015. Klasyczny model Nike z technologią Dri-Fit. Posiada nadruk Messi 10.",
          team: "FC Barcelona",
          brand: "Nike",
          model: "Home Stadium",
          year: "2014/2015",
          size: "L",
          dimensions: "54x72 cm",
          country: "Thailand",
          estimatedValue: "350 - 450 PLN",
        },
      }));
      setIsAiProcessing(false);
      setStep(9);
    }, 2500);
  };

  const handlePublish = () => {
    setIsPublished(true);
  };

  // --- WIDOKI SPECJALNE ---

  if (isPublished) {
    return (
      <SuccessView
        status="live"
        title={data.aiGenerated.title}
        imageUrl={data.photos.front}
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
          AI Analizuje Twoje Zdjęcia
        </h2>
        <p className="text-gray-500 font-medium">
          Rozpoznajemy markę, model i szacujemy wartość...
        </p>
      </div>
    );
  }

  // --- GŁÓWNY RENDER ---
  return (
    <div className="min-h-screen pb-32">
      {/* Pasek Postępu (Sticky Top) */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-8 py-4 px-4 transition-all">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500 ease-out"
              style={{ width: `${(step / 10) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold font-mono text-gray-400">
            KROK {step}/10
          </span>
        </div>
      </div>

      <div className="px-4">
        {step <= 8 ? (
          <SmartFormSteps
            step={step}
            data={data}
            update={update}
            updatePhoto={updatePhoto}
            // Przekazujemy funkcję nawigacji, aby StepCategory mógł automatycznie przejść dalej
            onNext={() =>
              step === 8 ? handleAiGeneration() : setStep((s) => s + 1)
            }
          />
        ) : (
          <SmartFormSummary
            step={step}
            data={data}
            update={update}
            updateAi={updateAi}
            onSubmit={handlePublish}
          />
        )}
      </div>

      {/* Dolna Belka Nawigacji została usunięta zgodnie z instrukcją */}
    </div>
  );
}
