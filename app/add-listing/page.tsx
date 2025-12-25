"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlowSelection from "@/components/add-listing/smart-steps/FlowSelection";
import ManualForm from "@/components/add-listing/manual-steps/ManualForm";
import SmartForm from "@/components/add-listing/smart-steps/SmartForm";

export default function AddListingPage() {
  // Stan decydujący o tym, który widok jest aktywny
  const [mode, setMode] = useState<"selection" | "manual" | "smart">(
    "selection"
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4">
        {mode === "selection" && (
          <FlowSelection
            onSelectManual={() => setMode("manual")}
            onSelectAI={() => setMode("smart")}
          />
        )}

        {mode === "manual" && (
          <ManualForm onBack={() => setMode("selection")} />
        )}

        {mode === "smart" && <SmartForm onBack={() => setMode("selection")} />}
      </main>

      <Footer />
    </div>
  );
}
