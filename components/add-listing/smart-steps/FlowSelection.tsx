"use client";

import {
  Sparkles,
  ArrowRight,
  Keyboard,
} from "lucide-react";

interface FlowSelectionProps {
  onSelectManual: () => void;
  onSelectAI: () => void;
}

export default function FlowSelection({
  onSelectManual,
  onSelectAI,
}: FlowSelectionProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-block py-2 px-4 rounded-full bg-gray-100 text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
          Choose Your Method
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
          How Do You Want to List?
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Choose the method that works best for you. Let our AI do the work or
          fill everything manually.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* OPTION 1: MANUAL */}
        <button
          onClick={onSelectManual}
          className="group text-left p-10 rounded-[2rem] border-2 border-gray-100 bg-white hover:border-gray-300 transition-colors relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8">
            <Keyboard size={32} className="text-gray-900" />
          </div>

          <h3 className="text-3xl font-bold mb-3 text-gray-900">
            Manual Entry
          </h3>
          <p className="text-gray-500 font-medium leading-relaxed mb-10 max-w-sm">
            For experts. Fill out the form step by step with your own
            descriptions and details.
          </p>

          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide border-b-2 border-transparent group-hover:border-black w-max transition-all pb-1">
            Choose Manual <ArrowRight size={16} />
          </div>
        </button>

        {/* OPTION 2: SMART AI */}
        <button
          onClick={onSelectAI}
          className="group text-left p-10 rounded-[2rem] border-2 border-blue-50 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-200 transition-colors relative overflow-hidden"
        >
          <div className="absolute top-8 right-8 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            Recommended
          </div>

          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 text-blue-600">
            <Sparkles size={32} />
          </div>

          <h3 className="text-3xl font-bold mb-3 text-gray-900">
            Smart AI Assistant
          </h3>
          <p className="text-gray-600 font-medium leading-relaxed mb-10 max-w-sm">
            Take photos and we'll handle the rest. Our system will identify the
            product, find its details, and estimate its value.
          </p>

          <div className="flex items-center gap-2 text-sm font-bold text-blue-700 uppercase tracking-wide border-b-2 border-transparent group-hover:border-blue-700 w-max transition-all pb-1">
            Start with AI <ArrowRight size={16} />
          </div>
        </button>
      </div>
    </div>
  );
}
