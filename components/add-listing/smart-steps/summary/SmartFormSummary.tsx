"use client";

import { useState } from "react";
import type { SmartFormData } from "@/types/features/listing.types";
import {
  SummaryHeader,
  ImageGallery,
  TitleCard,
  DescriptionCard,
  VerificationDetails,
  PricingCard,
  ProductDetails,
  BoostOptions,
  ActionButtons,
} from "./shared";

// ============================================
// TYPES
// ============================================

interface SmartFormSummaryProps {
  data: SmartFormData;
  onPublish: () => void;
  onBack: () => void;
  isPublishing?: boolean;
}

// ============================================
// COMPONENT
// ============================================

const SmartFormSummary = ({
  data,
  onPublish,
  onBack,
  isPublishing = false,
}: SmartFormSummaryProps) => {
  const [activeImage, setActiveImage] = useState<string | null>(
    data.photos?.[0]?.url || null,
  );
  const [selectedBoosts, setSelectedBoosts] = useState<string[]>([]);

  const toggleBoost = (id: string) => {
    setSelectedBoosts((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <SummaryHeader />

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left column (3/5): Gallery + Title + Description */}
        <div className="lg:col-span-3 space-y-5">
          <ImageGallery
            photos={data.photos}
            activeImage={activeImage}
            onImageSelect={setActiveImage}
          />
          <TitleCard title={data.title} completionMode={data.completionMode} />
          <DescriptionCard description={data.description} />
          <VerificationDetails data={data} />
        </div>

        {/* Right column (2/5): Pricing + Verified + Product Details + Boost + Actions */}
        <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-20">
          <PricingCard data={data} />
          <ProductDetails data={data} />
          <BoostOptions
            selectedBoosts={selectedBoosts}
            onToggleBoost={toggleBoost}
          />
          <ActionButtons
            onPublish={onPublish}
            onBack={onBack}
            isPublishing={isPublishing}
          />
        </div>
      </div>
    </div>
  );
};

export default SmartFormSummary;
