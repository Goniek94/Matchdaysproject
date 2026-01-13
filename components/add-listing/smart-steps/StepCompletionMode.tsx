import { SmartFormData } from "./types";
import { Sparkles, PenTool, Coins, CheckCircle2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StepProps {
  data: SmartFormData;
  update: (field: keyof SmartFormData, val: any) => void;
  onNext?: () => void;
}

export default function StepCompletionMode({
  data,
  update,
  onNext,
}: StepProps) {
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [userCredits] = useState(10); // Mock - should come from user context/API

  const handleModeSelect = (mode: "AI" | "MANUAL") => {
    if (mode === "AI" && userCredits < 1) {
      setShowCreditModal(true);
      return;
    }
    update("completionMode", mode);
    // Automatically go to next step after selection
    if (onNext) {
      setTimeout(() => onNext(), 300);
    }
  };

  const toggleAIFeature = (feature: keyof SmartFormData["aiFeatures"]) => {
    update("aiFeatures", {
      ...data.aiFeatures,
      [feature]: !data.aiFeatures[feature],
    });
  };

  const canProceed = data.completionMode !== null;
  const selectedAIFeatures = Object.values(data.aiFeatures).filter(
    Boolean
  ).length;

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Main Container with Shadow */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2">
            How would you like to continue?
          </h2>
          <p className="text-base text-gray-500 font-medium">
            Choose AI assistance or fill in details manually
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* AI Mode Card */}
          <button
            onClick={() => handleModeSelect("AI")}
            className={cn(
              "group relative p-6 rounded-2xl border-2 text-left transition-all duration-300",
              data.completionMode === "AI"
                ? "border-blue-600 bg-blue-50 shadow-2xl scale-[1.02]"
                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-xl hover:-translate-y-1"
            )}
          >
            {/* Recommended Badge */}
            <div className="absolute -top-3 left-8">
              <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                ⭐ RECOMMENDED
              </span>
            </div>

            {/* Icon */}
            <div
              className={cn(
                "inline-flex p-4 rounded-2xl mb-6 transition-colors",
                data.completionMode === "AI"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
              )}
            >
              <Sparkles size={32} strokeWidth={2} />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Use AI Assistance
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our AI will analyze your photos and automatically fill in product
              details, pricing, and authenticity score.
            </p>

            {/* Features List */}
            <ul className="space-y-3 mb-6">
              {[
                "Automatic product recognition",
                "Smart pricing suggestions",
                "Authenticity verification",
                "Professional description",
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle2
                    size={16}
                    className={cn(
                      "flex-shrink-0",
                      data.completionMode === "AI"
                        ? "text-blue-600"
                        : "text-gray-400"
                    )}
                  />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Credits Info */}
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200">
              <Coins size={18} className="text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                Costs 1 AI credit • You have{" "}
                <span className="font-bold text-gray-900">{userCredits}</span>{" "}
                credits
              </span>
            </div>

            {/* Selection Indicator */}
            {data.completionMode === "AI" && (
              <div className="absolute top-6 right-6">
                <div className="bg-blue-600 text-white rounded-full p-1 shadow-lg animate-in zoom-in">
                  <CheckCircle2 size={24} />
                </div>
              </div>
            )}
          </button>

          {/* Manual Mode Card */}
          <button
            onClick={() => handleModeSelect("MANUAL")}
            className={cn(
              "group relative p-8 rounded-3xl border-2 text-left transition-all duration-300",
              data.completionMode === "MANUAL"
                ? "border-gray-900 bg-gray-50 shadow-2xl scale-[1.02]"
                : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-xl hover:-translate-y-1"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "inline-flex p-4 rounded-2xl mb-6 transition-colors",
                data.completionMode === "MANUAL"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 group-hover:bg-gray-900 group-hover:text-white"
              )}
            >
              <PenTool size={32} strokeWidth={2} />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Fill Manually
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Enter all product details yourself. Best if you know exactly what
              you're selling.
            </p>

            {/* Features List */}
            <ul className="space-y-3 mb-6">
              {[
                "Full control over details",
                "No AI credits required",
                "Manual review process",
                "Flexible pricing",
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle2
                    size={16}
                    className={cn(
                      "flex-shrink-0",
                      data.completionMode === "MANUAL"
                        ? "text-gray-900"
                        : "text-gray-400"
                    )}
                  />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Free Badge */}
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200">
              <span className="text-2xl">✓</span>
              <span className="text-sm font-medium text-gray-700">
                Free • No credits required
              </span>
            </div>

            {/* Selection Indicator */}
            {data.completionMode === "MANUAL" && (
              <div className="absolute top-6 right-6">
                <div className="bg-gray-900 text-white rounded-full p-1 shadow-lg animate-in zoom-in">
                  <CheckCircle2 size={24} />
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-bold text-gray-900">💡 Tip:</span> AI-verified
            listings get published faster and have higher buyer trust. Manual
            listings go through a review process before publication.
          </p>
        </div>
      </div>

      {/* Credit Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 animate-in zoom-in slide-in-from-bottom-4">
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-yellow-100 rounded-full mb-4">
                <Coins size={32} className="text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No AI Credits
              </h3>
              <p className="text-gray-600">
                You need at least 1 AI credit to use AI assistance.
              </p>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-[1.02] transition-transform">
                Buy AI Credits
              </button>
              <button
                onClick={() => {
                  setShowCreditModal(false);
                  handleModeSelect("MANUAL");
                }}
                className="w-full py-3 px-6 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Continue Manually
              </button>
              <button
                onClick={() => setShowCreditModal(false)}
                className="w-full py-3 px-6 text-gray-500 font-medium hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
