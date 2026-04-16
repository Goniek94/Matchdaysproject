"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SmartFormData, INITIAL_STATE, Photo } from "./types";
import SmartFormSteps from "./SmartFormSteps";
import { SuccessView } from "./steps";
import { SmartFormSummary } from "./summary";
import { createAuctionFromForm, updateListingVerification } from "@/lib/api/auctions.api";
import { uploadPhotos } from "@/lib/supabase";
import { analyzeListing } from "@/lib/api/ai";

// AI path: 4 steps (Category → Photos → Mode → AI Analysis)
// Manual path: 5 steps (Category → Photos → Mode → Details → Pricing)
// Defaults to 5 (MANUAL) until user picks AI at step 3

export default function SmartForm({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SmartFormData>(INITIAL_STATE);
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedPhotos, setPublishedPhotos] = useState<Photo[]>([]);
  const [publishedListingId, setPublishedListingId] = useState<string | null>(
    null,
  );

  const update = (field: keyof SmartFormData, val: any) =>
    setData((prev) => ({ ...prev, [field]: val }));

  const handleNext = () => {
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackNavigation = () => {
    if (step === 1) {
      if (onBack) onBack();
    } else {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);

      // === DEBUG: Full form data before publish ===
      console.group("🚀 [Publish] START - Full form data");
      console.log("📋 Title:", data.title);
      console.log("📋 Description:", data.description);
      console.log("📋 Category:", data.category, "| Slug:", data.categorySlug);
      console.log("📋 Listing type:", data.listingType);
      console.log("📋 Price:", data.price, "| Start price:", data.startPrice);
      console.log("📋 Duration:", data.duration);
      console.log("📋 Completion mode:", data.completionMode);
      console.log(
        "📋 Brand:",
        data.brand,
        "| Model:",
        data.model,
        "| Club:",
        data.club,
      );
      console.log(
        "📋 Condition:",
        data.condition,
        "| Size:",
        data.size,
        "| Season:",
        data.season,
      );
      console.log("📋 Verification status:", data.verificationStatus);
      console.log("📋 Verification details:", data.verification);
      console.log("📸 Photos count:", data.photos.length);
      data.photos.forEach((photo, i) => {
        const urlType = photo.url?.startsWith("data:")
          ? "BASE64"
          : photo.url?.startsWith("blob:")
            ? "BLOB"
            : photo.url?.startsWith("http")
              ? "HTTP"
              : "UNKNOWN";
        console.log(
          `  📸 Photo[${i}]: type=${urlType}, typeHint=${photo.typeHint}, url=${photo.url?.substring(0, 80)}...`,
        );
      });
      console.groupEnd();

      // 1. Upload zdjęć do Supabase Storage
      console.group("📤 [Publish] Step 1: Uploading photos to Supabase...");
      console.log("Photos to upload:", data.photos.length);
      console.log(
        "Base64 photos (will be uploaded):",
        data.photos.filter((p) => p.url?.startsWith("data:")).length,
      );
      console.log(
        "Blob photos (will NOT be uploaded):",
        data.photos.filter((p) => p.url?.startsWith("blob:")).length,
      );
      console.log(
        "HTTP photos (already uploaded):",
        data.photos.filter((p) => p.url?.startsWith("http")).length,
      );
      const uploadedPhotos = await uploadPhotos(data.photos);
      console.log(
        "✅ Upload result:",
        uploadedPhotos.length,
        "photos returned",
      );
      uploadedPhotos.forEach((photo, i) => {
        console.log(
          `  ✅ Uploaded[${i}]: url=${photo.url?.substring(0, 80)}...`,
        );
      });
      console.groupEnd();

      // 2. Zmapuj z powrotem na Photo[] zachowując id
      console.group("🔄 [Publish] Step 2: Mapping photos back to Photo[]");
      const photosWithIds: Photo[] = data.photos.map((photo, index) => {
        const newUrl = uploadedPhotos[index]?.url || photo.url;
        const wasUpdated = newUrl !== photo.url;
        console.log(
          `  Photo[${index}]: ${wasUpdated ? "✅ UPDATED" : "⚠️ KEPT ORIGINAL"} -> ${newUrl?.substring(0, 80)}...`,
        );
        return {
          ...photo,
          url: newUrl,
        };
      });
      console.groupEnd();

      // 3. Zaktualizuj data z nowymi URLami
      const dataWithPhotos: SmartFormData = {
        ...data,
        photos: photosWithIds,
      };

      // 4. Zapisz listing do bazy
      console.log("📡 [Publish] Step 3: Sending to backend...");
      const result = await createAuctionFromForm(dataWithPhotos);
      console.log("📡 Backend response:", result.success, result.message);

      if (result.success) {
        console.log("🎉 [Publish] SUCCESS! Listing created:", result.data?.id);
        setPublishedListingId(result.data?.id || null);
        setPublishedPhotos(photosWithIds);
        setData(dataWithPhotos);
        setIsPublished(true);

        // Background AI verification — runs for ALL modes, silent, no UI.
        // AI mode: re-verifies with uploaded URLs (more reliable than base64).
        // Manual mode: first verification — determines auto-live vs manual review.
        // Score >= 90% → AI_VERIFIED_HIGH (auto-live)
        // Score 60–89% → AI_VERIFIED_MEDIUM (manual review)
        // Score < 60%  → FLAGGED (manual review)
        const photoGroupKey = data.itemCategory || data.category || "shirts";
        const bgPhotos = photosWithIds
          .filter((p) => p.url?.startsWith("http"))
          .slice(0, 6)
          .map((p) => ({ url: p.url, typeHint: p.typeHint || "front_far" }));

        if (bgPhotos.length > 0 && result.data?.id) {
          const listingId = result.data.id;
          analyzeListing(photoGroupKey, bgPhotos)
            .then((aiResult) => {
              if (aiResult.success && aiResult.data) {
                updateListingVerification(
                  listingId,
                  aiResult.data.authenticityScore,
                  aiResult.data as unknown as Record<string, any>,
                );
              }
            })
            .catch(() => {});
        }
      } else {
        console.error("❌ [Publish] FAILED:", result.message);
        alert(`Failed to create listing: ${result.message}`);
      }
    } catch (error) {
      console.error("💥 [Publish] EXCEPTION:", error);
      console.error("💥 [Publish] Error stack:", (error as Error).stack);
      alert("An error occurred while publishing. Please try again.");
    } finally {
      setIsPublishing(false);
      console.log("🏁 [Publish] END");
    }
  };

  const totalSteps = data.completionMode === "AI" ? 4 : 5;

  // --- SPECIAL VIEWS ---
  if (isPublished) {
    return (
      <SuccessView
        status="live"
        title={data.title || "Your Listing"}
        listingId={publishedListingId || undefined}
        imageUrl={publishedPhotos[0]?.url || ""}
        onReset={() => {
          setIsPublished(false);
          setStep(1);
          setData(INITIAL_STATE);
          setPublishedPhotos([]);
          setPublishedListingId(null);
        }}
      />
    );
  }

  // --- FINAL SUMMARY + PUBLISH (step after last) ---
  if (step === totalSteps + 1) {
    return (
      <div className="min-h-screen pb-24 pt-24 px-4 max-w-4xl mx-auto">
        <SmartFormSummary
          data={data}
          onPublish={handlePublish}
          onBack={handleBackNavigation}
          isPublishing={isPublishing}
        />
      </div>
    );
  }

  // --- MAIN RENDER (steps 1–N) ---
  // Steps with their own navigation (no outer nav buttons):
  //   2 = Photos (PhotoStepRouter has its own buttons)
  //   3 = Mode selection (auto-advances on card click)
  //   4 = AI Analysis (StepAISummary has its own Continue button)
  const hideNavButtons =
    step === 2 ||
    step === 3 ||
    (step === 4 && data.completionMode === "AI");

  return (
    <div className="min-h-screen pb-24 pt-24">
      {/* Progress Bar */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-8 py-4 px-4 transition-all">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold font-mono text-gray-400">
            STEP {step}/{totalSteps}
          </span>
        </div>
      </div>

      <div className="px-4 max-w-4xl mx-auto">
        <SmartFormSteps
          step={step}
          data={data}
          update={update}
          onNext={handleNext}
          onBack={handleBackNavigation}
        />

        {/* Navigation buttons — hidden on steps that manage their own nav */}
        {!hideNavButtons && (
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleBackNavigation}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft
                size={18}
                className="transition-transform group-hover:-translate-x-1"
              />
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-10 py-3 rounded-xl font-bold text-white bg-black hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all hover:scale-[1.02] active:scale-95"
            >
              Next <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
