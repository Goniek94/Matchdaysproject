"use client";

import LegitCheck from "../../aitools/LegitCheck";

export default function LegitCheckPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-red-500">
            AI Photo Analysis
          </span>
          <h1 className="text-3xl font-black mt-2 mb-1">AI Confidence Check</h1>
          <p className="text-gray-500 text-sm">
            Upload photos of your item. Our AI analyzes details against known
            authentic samples and returns a confidence score. Final verification
            by a Matchdays moderator.
          </p>
        </div>
        <LegitCheck />
      </div>
    </div>
  );
}
