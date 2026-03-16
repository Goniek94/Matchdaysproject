"use client";

import LegitCheck from "../../aitools/LegitCheck";

export default function LegitCheckPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-red-500">
            AI Authentication
          </span>
          <h1 className="text-3xl font-black mt-2 mb-1">Legit Check</h1>
          <p className="text-gray-500 text-sm">
            Upload photos of your item and our AI will verify authenticity
            instantly.
          </p>
        </div>
        <LegitCheck />
      </div>
    </div>
  );
}
