"use client";

import { useState } from "react";
import type { SmartFormData } from "@/types/features/listing.types";
import {
  SummaryHeader,
  ImageGallery,
  TitleCard,
  DescriptionCard,
  ProductDetails,
  BoostOptions,
  ActionButtons,
} from "./shared";

// ============================================
// TYPES
// ============================================

interface SmartFormSummaryProps {
  data: SmartFormData;
  update: (
    field: keyof SmartFormData,
    val: SmartFormData[keyof SmartFormData],
  ) => void;
  onPublish: () => void;
  onBack: () => void;
  isPublishing?: boolean;
}

// ============================================
// COMPONENT
// ============================================

// Pre-publish summary. Deliberately minimal: photo · title · description ·
// details · boosters · publish. The AI verification report and price
// estimate are NOT shown here — they live permanently in the seller's
// Scoring tab in the dashboard. Duplicating them here was confusing
// (sellers thought publishing meant re-running AI) and crowded the screen.
const SmartFormSummary = ({
  data,
  update,
  onPublish,
  onBack,
  isPublishing = false,
}: SmartFormSummaryProps) => {
  const [activeImage, setActiveImage] = useState<string | null>(
    data.photos?.[0]?.url || null,
  );
  const [selectedBoosts, setSelectedBoosts] = useState<string[]>([]);

  const toggleBoost = (id: string) =>
    setSelectedBoosts((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <SummaryHeader />

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* ── Left column (3/5): Photo + Title + Description ── */}
        <div className="lg:col-span-3 space-y-5">
          <ImageGallery
            photos={data.photos}
            activeImage={activeImage}
            onImageSelect={setActiveImage}
          />

          <TitleCard
            title={data.title}
            completionMode={data.completionMode}
            onUpdate={(val) => update("title", val)}
          />

          <DescriptionCard
            description={data.description}
            onUpdate={(val) => update("description", val)}
          />
        </div>

        {/* ── Right column (2/5): Details → Boosters → Publish ── */}
        <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-20">
          <ProductDetails
            data={data}
            onUpdate={(field, val) => update(field, val)}
          />

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
