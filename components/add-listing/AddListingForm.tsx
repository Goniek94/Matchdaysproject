"use client";

import { useState } from "react";
import { CATEGORIES, INITIAL_FORM_DATA, ListingFormData } from "./types";
import CategorySelector from "./CategorySelector";
import ModeSelector from "./ModeSelector";
import PhotoUpload from "./PhotoUpload";
import AIResults from "./AIResults";
import DynamicFields from "./DynamicFields";
import PricingSection from "./PricingSection";
import AdditionalPhotos from "./AdditionalPhotos";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

// Main steps of the form
const STEPS = [
  { id: 1, name: "Category", description: "Select product category" },
  { id: 2, name: "Photos", description: "Upload product photos" },
  { id: 3, name: "Details", description: "Fill product information" },
  {
    id: 4,
    name: "More Photos",
    description: "Add additional photos (optional)",
  },
  { id: 5, name: "Pricing", description: "Set price and shipping" },
  { id: 6, name: "Summary", description: "Review and publish" },
];

export default function AddListingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>(INITIAL_FORM_DATA);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  // Get selected category data
  const selectedCategory = CATEGORIES.find(
    (cat) => cat.id === formData.category
  );

  // Update form data
  const updateFormData = (updates: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Handle AI processing
  const handleAIProcess = async () => {
    if (!formData.useAI || formData.aiCreditsAvailable <= 0) return;

    setIsProcessingAI(true);
    try {
      // TODO: Call AI API with photos
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock AI results
      const mockAIResults = {
        title: "Nike Manchester United Home Jersey 2023/24",
        description:
          "Original Manchester United home jersey from 2023/24 season. Excellent condition, worn a few times. Size M, Slim Fit.",
        confidence: 0.92,
        detectedFields: {
          team: "Manchester United",
          league: "Premier League",
          season: "2023/24",
          type: "Home",
          manufacturer: "Nike",
          size: "M",
        },
        estimatedValue: { min: 250, max: 350 },
      };

      updateFormData({
        aiGenerated: mockAIResults,
        title: mockAIResults.title,
        description: mockAIResults.description,
        specificFields: mockAIResults.detectedFields,
      });
    } catch (error) {
      console.error("AI processing error:", error);
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Validate current step
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.category; // Only category required
      case 2:
        return true; // Photos are optional
      case 3:
        if (!selectedCategory) return false;
        const requiredFields = selectedCategory.specificFields.filter(
          (f) => f.required
        );

        // Basic validation
        const basicValid =
          formData.title &&
          formData.description &&
          requiredFields.every((f) => formData.specificFields[f.id]);

        // Additional validation for shirts
        if (selectedCategory.id === "shirts") {
          // If has defects, must have at least one defect photo
          if (formData.hasDefects && formData.defectPhotos.length === 0) {
            return false;
          }
          // Tag condition is required
          if (!formData.tagCondition) {
            return false;
          }
        }

        return basicValid;
      case 4:
        return true; // Additional photos are optional
      case 5:
        return (
          formData.condition &&
          ((formData.listingType === "auction" &&
            formData.startingBid &&
            formData.startingBid > 0) ||
            (formData.listingType === "buy_now" &&
              formData.buyNowPrice &&
              formData.buyNowPrice > 0))
        );
      default:
        return true;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // TODO: Submit to API
      console.log("Submitting listing:", formData);
      alert("Listing has been added!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while adding the listing");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Add New Listing
          </h1>
          <p className="text-gray-600">
            {formData.useAI && formData.aiCreditsAvailable > 0 ? (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI will help you fill the form automatically
              </span>
            ) : (
              "Fill out the form to add your listing"
            )}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep > step.id
                        ? "bg-green-500 text-white"
                        : currentStep === step.id
                        ? "bg-blue-600 text-white ring-4 ring-blue-200"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-sm font-medium text-gray-900">
                      {step.name}
                    </p>
                    <p className="text-xs text-gray-500 hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-6 shadow-xl">
          {/* Step 1: Category Selection */}
          {currentStep === 1 && (
            <CategorySelector
              selectedCategory={formData.category}
              onCategoryChange={(category) => updateFormData({ category })}
            />
          )}

          {/* Step 2: Photo Upload */}
          {currentStep === 2 && selectedCategory && (
            <PhotoUpload
              category={selectedCategory}
              photos={formData.photos}
              onPhotosChange={(photos) => updateFormData({ photos })}
              useAI={formData.useAI}
              aiCreditsAvailable={formData.aiCreditsAvailable}
              onAIToggle={(useAI) => updateFormData({ useAI })}
              onAIProcess={handleAIProcess}
              isProcessing={isProcessingAI}
            />
          )}

          {/* Step 3: Details & AI Results */}
          {currentStep === 3 && selectedCategory && (
            <div className="space-y-6">
              {/* AI Results (if available) */}
              {formData.aiGenerated && (
                <AIResults
                  aiData={formData.aiGenerated}
                  onEdit={(field, value) => {
                    if (field === "title") {
                      updateFormData({ title: value });
                    } else if (field === "description") {
                      updateFormData({ description: value });
                    } else {
                      updateFormData({
                        specificFields: {
                          ...formData.specificFields,
                          [field]: value,
                        },
                      });
                    }
                  }}
                />
              )}

              {/* Dynamic Fields */}
              <DynamicFields
                category={selectedCategory}
                formData={formData}
                onUpdate={updateFormData}
              />
            </div>
          )}

          {/* Step 4: Additional Photos */}
          {currentStep === 4 && (
            <AdditionalPhotos
              photos={formData.additionalPhotos}
              onPhotosChange={(photos) =>
                updateFormData({ additionalPhotos: photos })
              }
            />
          )}

          {/* Step 5: Pricing */}
          {currentStep === 5 && (
            <PricingSection formData={formData} onUpdate={updateFormData} />
          )}

          {/* Step 6: Summary */}
          {currentStep === 6 && selectedCategory && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Listing Summary
              </h2>

              {/* Preview */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Photos */}
                <div>
                  <h3 className="font-semibold mb-3">Photos</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(formData.photos)
                      .filter(([_, url]) => url)
                      .map(([id, url]) => (
                        <img
                          key={id}
                          src={url || ""}
                          alt={id}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-semibold mb-3">Details</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {selectedCategory.name}
                    </p>
                    <p>
                      <span className="font-medium">Title:</span>{" "}
                      {formData.title}
                    </p>
                    <p>
                      <span className="font-medium">Condition:</span>{" "}
                      {formData.condition}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {formData.listingType === "auction"
                        ? "Auction"
                        : "Buy Now"}
                    </p>
                    {formData.listingType === "auction" && (
                      <p>
                        <span className="font-medium">Starting bid:</span>{" "}
                        {formData.startingBid} PLN
                      </p>
                    )}
                    {formData.buyNowPrice && formData.buyNowPrice > 0 && (
                      <p>
                        <span className="font-medium">Buy Now:</span>{" "}
                        {formData.buyNowPrice} PLN
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {formData.description}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep < STEPS.length ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Check className="w-4 h-4" />
                Publish Listing
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
