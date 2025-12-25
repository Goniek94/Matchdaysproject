"use client";

import { PenLine, ScanSearch } from "lucide-react";

interface FlowSelectionProps {
  onSelectManual: () => void;
  onSelectAI: () => void;
}

export default function FlowSelection({
  onSelectManual,
  onSelectAI,
}: FlowSelectionProps) {
  return (
    <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-16 space-y-4">
        <span className="inline-block py-1 px-3 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
          Start Selling
        </span>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900">
          How do you want to sell?
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Choose the workflow that suits you best. You can always switch later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* MANUAL OPTION */}
        <button
          onClick={onSelectManual}
          className="group relative flex flex-col items-start text-left bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
            <PenLine size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Manual Entry</h3>
          <p className="text-gray-500 leading-relaxed">
            I know all the details, specs, and I have my photos ready. Perfect
            for experts who want full control.
          </p>
        </button>

        {/* AI ASSIST OPTION */}
        <button
          onClick={onSelectAI}
          className="group relative flex flex-col items-start text-left bg-gradient-to-br from-white to-blue-50/30 p-10 rounded-3xl border border-blue-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
          <div className="absolute top-6 right-6 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Recommended
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <ScanSearch size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-2">AI Assist</h3>
          <p className="text-gray-500 leading-relaxed">
            Upload photos and let AI detect brand, team, year, and condition.
            We'll pre-fill the form for you.
          </p>
        </button>
      </div>
    </div>
  );
}
