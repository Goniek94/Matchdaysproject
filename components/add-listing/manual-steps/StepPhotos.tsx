"use client";

import { useState } from "react";
import { CheckCircle2, ImageIcon, Plus, Trash2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StepPhotosProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

export default function StepPhotos({ data, updateData }: StepPhotosProps) {
  // Stan lokalny dla AI (nie musi być w głównym formularzu)
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  // Logika zdjęć (lokalna pomocnicza)
  const handleMandatoryUpload = (slot: string) => {
    const mockUrl = `mandatory-${slot}-${Date.now()}`;
    updateData("mandatoryPhotos", {
      ...data.mandatoryPhotos,
      [slot]: mockUrl,
    });
  };

  const handleExtraUpload = () => {
    if (data.extraPhotos.length >= 20) return;
    const mockUrl = `extra-${Date.now()}`;
    updateData("extraPhotos", [...data.extraPhotos, mockUrl]);
  };

  const removeExtraPhoto = (index: number) => {
    const newPhotos = data.extraPhotos.filter(
      (_: any, i: number) => i !== index
    );
    updateData("extraPhotos", newPhotos);
  };

  const generateDescription = () => {
    if (!aiPrompt) return;
    setIsGeneratingDesc(true);
    setTimeout(() => {
      const desc = `Authentic ${data.team || "football"} shirt by ${
        data.brand || "brand"
      }. \n\nDetails:\n- Condition: ${data.condition}\n- Size: ${
        data.size
      }\n\nAdditional info: ${aiPrompt}\n\nIncludes all original tags shown in photos. Perfect for collectors.`;
      updateData("description", desc);
      setIsGeneratingDesc(false);
      setShowAiInput(false);
    }, 1500);
  };

  const totalPhotosCount =
    (data.mandatoryPhotos.front ? 1 : 0) +
    (data.mandatoryPhotos.back ? 1 : 0) +
    (data.mandatoryPhotos.crest ? 1 : 0) +
    (data.mandatoryPhotos.tags ? 1 : 0) +
    data.extraPhotos.length;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* 1. Weryfikacja */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">
              Verification Photos
            </h3>
            <p className="text-sm text-gray-500">
              Mandatory angles for safety check.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(data.mandatoryPhotos).map((slot) => (
            <div
              key={slot}
              onClick={() => handleMandatoryUpload(slot)}
              className={`aspect-[3/4] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                data.mandatoryPhotos[slot]
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              {data.mandatoryPhotos[slot] ? (
                <div className="text-green-600 flex flex-col items-center">
                  <CheckCircle2 className="mb-2" />
                  <span className="text-xs font-bold capitalize">
                    {slot} Added
                  </span>
                </div>
              ) : (
                <div className="text-gray-400 flex flex-col items-center text-center p-2">
                  <span className="mb-2">📷</span>
                  <span className="text-xs font-bold uppercase">{slot}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tag Status */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <label className="text-xs font-bold uppercase text-gray-500 block mb-3">
            Item Tag Status
          </label>
          <div className="flex flex-wrap gap-2">
            {["modern", "vintage", "cut", "washed"].map((status) => (
              <button
                key={status}
                onClick={() => updateData("tagStatus", status)}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                  data.tagStatus === status
                    ? "bg-black text-white border-black"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Galeria */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ImageIcon size={20} className="text-gray-600" />
            <h3 className="text-xl font-black text-gray-900">Gallery</h3>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              totalPhotosCount >= 5
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            Total: {totalPhotosCount} / 20 (Min 5)
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {data.extraPhotos.map((photo: string, idx: number) => (
            <div
              key={idx}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
            >
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                IMG {idx + 1}
              </div>
              <button
                onClick={() => removeExtraPhoto(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {totalPhotosCount < 20 && (
            <button
              onClick={handleExtraUpload}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-black"
            >
              <Plus size={24} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Opis z AI */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-black">Description</h3>
          <button
            onClick={() => setShowAiInput(!showAiInput)}
            className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
          >
            <Sparkles size={12} className="mr-1" /> AI Assist
          </button>
        </div>
        <AnimatePresence>
          {showAiInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex gap-2 p-1">
                <input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Key details (e.g. mint condition, worn by Messi)..."
                  className="flex-1 border rounded-lg p-2 text-sm"
                />
                <button
                  onClick={generateDescription}
                  disabled={isGeneratingDesc}
                  className="bg-blue-600 text-white px-4 rounded-lg text-sm"
                >
                  {isGeneratingDesc ? "..." : "Go"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <textarea
          value={data.description}
          onChange={(e) => updateData("description", e.target.value)}
          className="w-full p-4 bg-gray-50 border rounded-xl h-32 focus:outline-none focus:bg-white focus:border-black"
          placeholder="Item description..."
        ></textarea>
      </div>
    </div>
  );
}
