"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Edit3, Zap, Clock } from "lucide-react";

interface ModeSelectorProps {
  aiCreditsAvailable: number;
  onSelectMode: (useAI: boolean) => void;
}

export default function ModeSelector({
  aiCreditsAvailable,
  onSelectMode,
}: ModeSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose How to Fill the Form
        </h2>
        <p className="text-gray-600">
          Use AI to automatically fill details from photos, or fill manually
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* AI Mode */}
        <Card
          className={`p-6 cursor-pointer transition-all hover:shadow-xl border-2 ${
            aiCreditsAvailable > 0
              ? "hover:border-purple-500"
              : "opacity-60 cursor-not-allowed"
          }`}
          onClick={() => aiCreditsAvailable > 0 && onSelectMode(true)}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-600">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AI-Powered Mode
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload photos and let AI automatically detect and fill all
                product details
              </p>
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Zap className="w-4 h-4 text-purple-600" />
                <span>Automatic field detection</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Saves time - fills in seconds</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Edit3 className="w-4 h-4 text-purple-600" />
                <span>Editable results</span>
              </div>
            </div>

            {aiCreditsAvailable > 0 ? (
              <div className="mt-4 w-full">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-purple-900">
                    Available Credits: {aiCreditsAvailable}
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    1 credit will be used
                  </p>
                </div>
                <Button className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  Use AI Mode
                </Button>
              </div>
            ) : (
              <div className="mt-4 w-full">
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700">
                    No AI Credits Available
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Purchase credits to use AI mode
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Manual Mode */}
        <Card
          className="p-6 cursor-pointer transition-all hover:shadow-xl border-2 hover:border-gray-900"
          onClick={() => onSelectMode(false)}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-gray-900">
              <Edit3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Manual Mode
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Fill all product details manually with full control over every
                field
              </p>
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Edit3 className="w-4 h-4 text-gray-900" />
                <span>Complete control</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Zap className="w-4 h-4 text-gray-900" />
                <span>No credits required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-gray-900" />
                <span>Takes more time</span>
              </div>
            </div>

            <div className="mt-4 w-full">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900">
                  Always Available
                </p>
                <p className="text-xs text-gray-600 mt-1">Free to use</p>
              </div>
              <Button className="w-full mt-3 bg-gray-900 hover:bg-gray-800 text-white">
                Use Manual Mode
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> AI mode works best with clear, well-lit
          photos showing product details, tags, and logos. You can always edit
          AI-generated information before publishing.
        </p>
      </div>
    </div>
  );
}
