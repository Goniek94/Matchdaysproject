"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SmartFormData, INITIAL_STATE, Photo } from "./types";
import SmartFormSteps from "./SmartFormSteps";
import { SuccessView } from "./steps";
import { SmartFormSummary } from "./summary";
import { createSportsListing } from "@/lib/api/listings.api";
import { uploadPhotos } from "@/lib/supabase";

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
      console.group(
        "📡 [Publish] Step 3: Sending to backend (createSportsListing)",
      );
      console.log(
        "Data being sent:",
        JSON.stringify(
          {
            title: dataWithPhotos.title,
            category: dataWithPhotos.category,
            listingType: dataWithPhotos.listingType,
            price: dataWithPhotos.price,
            startPrice: dataWithPhotos.startPrice,
            duration: dataWithPhotos.duration,
            photosCount: dataWithPhotos.photos.length,
            photoUrls: dataWithPhotos.photos.map((p) =>
              p.url?.substring(0, 60),
            ),
          },
          null,
          2,
        ),
      );
      const result = await createSportsListing(dataWithPhotos);
      console.log("📡 Backend response:", JSON.stringify(result, null, 2));
      console.groupEnd();

      if (result.success) {
        console.log("🎉 [Publish] SUCCESS! Listing created:", result.data);
        // Save the real auction ID from backend response
        const createdId = result.data?.id;
        console.log("🆔 Created listing ID:", createdId);
        setPublishedListingId(createdId || null);
        setPublishedPhotos(photosWithIds);
        setData(dataWithPhotos);
        setIsPublished(true);
      } else {
        console.error("❌ [Publish] FAILED:", result.error || result.message);
        alert(`Failed to create listing: ${result.error || result.message}`);
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

  // --- STEP 6: FINAL SUMMARY + PUBLISH ---
  if (step === 6) {
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

  // --- MAIN RENDER (steps 1-5) ---
  const isStep4AI = step === 4 && data.completionMode === "AI";
  const isPhotoStep = step === 3;

  return (
    <div className="min-h-screen pb-24 pt-24">
      {/* Progress Bar */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-8 py-4 px-4 transition-all">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold font-mono text-gray-400">
            STEP {step}/5
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

        {!isPhotoStep && !isStep4AI && (
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

        {isStep4AI && (
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleBackNavigation}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft
                size={18}
                className="transition-transform group-hover:-translate-x-1"
              />
              Back
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-10 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95"
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
