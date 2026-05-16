"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SmartFormData, INITIAL_STATE, Photo } from "./types";
import SmartFormSteps from "./SmartFormSteps";
import { SuccessView } from "./steps";
import { SmartFormSummary } from "./summary";
import { createAuctionFromForm } from "@/lib/api/auctions.api";
import { uploadPhotos } from "@/lib/supabase";
import { analyzeListingAsync } from "@/lib/api/ai";
import { logger } from "@/lib/logger";
import { useAuth } from "@/lib/context/AuthContext";

// AI path: 5 steps (Category → Photos → Mode → AI Analysis → Pricing)
// Manual path: 5 steps (Category → Photos → Mode → Details → Pricing)

/**
 * Draft persistence key. Stored in localStorage so a refresh / accidental
 * tab-close / mid-flow login redirect doesn't lose 5 minutes of typing.
 *
 * We persist EVERYTHING EXCEPT `photos` — photo state holds File objects
 * (or blob: URLs) which can't be re-hydrated from JSON, plus they're the
 * biggest payload (base64 → MB of localStorage). When the user returns
 * to a restored draft, they'll need to re-add photos; everything else
 * (title, description, category, pricing, mode) is preserved.
 */
const DRAFT_STORAGE_KEY = "matchdays.add-listing.draft.v1";
const DRAFT_AUTOSAVE_DEBOUNCE_MS = 500;

function loadDraft(): Partial<SmartFormData> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SmartFormData> & {
      __savedAt?: number;
    };
    // Stale draft (>14 days) — auto-discard so users don't find a
    // half-finished listing from a forgotten session.
    if (
      parsed.__savedAt &&
      Date.now() - parsed.__savedAt > 14 * 24 * 60 * 60_000
    ) {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveDraft(data: SmartFormData): void {
  if (typeof window === "undefined") return;
  try {
    // Strip photos before persisting — see DRAFT_STORAGE_KEY docstring.
    const { photos: _photos, ...rest } = data;
    void _photos;
    const payload = { ...rest, __savedAt: Date.now() };
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota exceeded / private-browsing — ignore. Better to silently
    // lose draft than to break the form.
  }
}

function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    /* noop */
  }
}

export default function SmartForm({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Auth gate. Anonymous users get redirected to /login with the current
  // path as `next` — after successful login they land back here and
  // (because the draft is persisted) keep whatever they typed before.
  // `authLoading` must be resolved first so we don't flash-redirect
  // a still-validating session.
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      // No dedicated `/login` route in this frontend — auth lives in
      // the navbar modal + a standalone `/register` page. We route to
      // `/register` with a `next` param so the post-auth flow can hop
      // the user back here. (Register page reads `next` and redirects
      // on success — verify if changing.)
      const next = encodeURIComponent(pathname ?? "/add-listing");
      router.replace(`/register?next=${next}`);
    }
  }, [authLoading, isAuthenticated, pathname, router]);

  const [step, setStep] = useState(1);
  const [data, setData] = useState<SmartFormData>(INITIAL_STATE);
  const [draftRestored, setDraftRestored] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedPhotos, setPublishedPhotos] = useState<Photo[]>([]);
  const [publishedListingId, setPublishedListingId] = useState<string | null>(
    null,
  );

  // Load draft on mount — once per page load. Photos always start empty
  // (see DRAFT_STORAGE_KEY rationale).
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setData((prev) => ({ ...prev, ...draft, photos: prev.photos }));
      setDraftRestored(true);
    }
  }, []);

  // Autosave — debounced so we don't write to localStorage on every
  // keystroke. Skipped once we've published or are mid-publish so a
  // stale "almost finished" draft can't shadow the success state.
  const autosaveRef = useRef<number | null>(null);
  useEffect(() => {
    if (isPublishing || isPublished) return;
    if (autosaveRef.current) window.clearTimeout(autosaveRef.current);
    autosaveRef.current = window.setTimeout(() => {
      saveDraft(data);
    }, DRAFT_AUTOSAVE_DEBOUNCE_MS);
    return () => {
      if (autosaveRef.current) window.clearTimeout(autosaveRef.current);
    };
  }, [data, isPublishing, isPublished]);

  const update = (
    field: keyof SmartFormData,
    val: SmartFormData[keyof SmartFormData],
  ) => setData((prev) => ({ ...prev, [field]: val }));

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

      logger.debug("[Publish] START", "SmartForm", {
        title: data.title,
        category: data.category,
        listingType: data.listingType,
        completionMode: data.completionMode,
        photosCount: data.photos.length,
      });

      // 1. Upload photos to Supabase Storage
      logger.debug("[Publish] Uploading photos", "SmartForm", {
        count: data.photos.length,
      });
      const uploadedPhotos = await uploadPhotos(data.photos);
      logger.debug("[Publish] Photos uploaded", "SmartForm", {
        uploaded: uploadedPhotos.length,
      });

      // 2. Map back to Photo[] preserving ids
      const photosWithIds: Photo[] = data.photos.map((photo, index) => ({
        ...photo,
        url: uploadedPhotos[index]?.url || photo.url,
      }));

      // 3. Zaktualizuj data z nowymi URLami
      const dataWithPhotos: SmartFormData = {
        ...data,
        photos: photosWithIds,
      };

      // 4. Save listing to backend
      logger.debug("[Publish] Sending to backend", "SmartForm");
      const result = await createAuctionFromForm(dataWithPhotos);

      if (result.success) {
        logger.info("[Publish] Listing created", "SmartForm", {
          id: result.data?.id,
        });
        setPublishedListingId(result.data?.id || null);
        setPublishedPhotos(photosWithIds);
        setData(dataWithPhotos);
        setIsPublished(true);
        // Successful publish — drop the autosaved draft so the next
        // visit to /add-listing starts fresh instead of restoring a
        // listing the user just shipped.
        clearDraft();

        // Background AI verification
        const photoGroupKey = data.itemCategory || data.category || "shirts";
        const bgPhotos = photosWithIds
          .filter((p) => p.url?.startsWith("http"))
          .slice(0, 6)
          .map((p) => ({ url: p.url, typeHint: p.typeHint || "front_far" }));

        if (bgPhotos.length > 0 && result.data?.id) {
          // Fire-and-forget — backend queues the Gemini job, returns 202
          // immediately, and the worker writes the score back to the auction
          // (auto-publishes if ≥90). User gets a notification when done.
          analyzeListingAsync(photoGroupKey, bgPhotos, result.data.id).catch(
            (err) =>
              logger.warn("Background AI enqueue failed", "SmartForm", err),
          );
        }
      } else {
        logger.error("[Publish] Failed", "SmartForm", {
          message: result.message,
        });
        const detail = Array.isArray(result.message)
          ? result.message.join("\n• ")
          : result.message;
        alert(`Failed to create listing:\n\n• ${detail}`);
      }
    } catch (error) {
      logger.error("[Publish] Exception", "SmartForm", error);
      // Surface validation errors from the backend so users (and we) can see
      // exactly which field is rejected — opaque "try again" wastes everyone's time.
      const err = error as {
        message?: string | string[];
        error?: string;
        status?: number;
      };
      const detail = Array.isArray(err.message)
        ? err.message.join("\n• ")
        : err.message || err.error || "Unknown error";
      alert(`Failed to publish (${err.status ?? "?"}):\n\n• ${detail}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // AI path has 7 steps (adds Pre-Analysis + Edit Listing), Manual has 6
  const totalSteps = data.completionMode === "AI" ? 7 : 6;

  // --- SPECIAL VIEWS ---
  if (isPublished) {
    return (
      <SuccessView
        status="pending"
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
      <div className="min-h-screen pb-24 pt-24 px-4 max-w-7xl mx-auto">
        <SmartFormSummary
          data={data}
          update={update}
          onPublish={handlePublish}
          onBack={handleBackNavigation}
          isPublishing={isPublishing}
        />
      </div>
    );
  }

  // --- MAIN RENDER (steps 1–N) ---
  // Ukrywamy główne przyciski nawigacyjne na krokach, które mają własną nawigację
  // Steps that manage their own navigation buttons
  const hideNavButtons =
    step === 1 ||
    step === 2 ||
    step === 4 || // step 4 = CompletionMode (own nav)
    (step === 5 && data.completionMode === "AI") || // StepAISummary
    (step === 6 && data.completionMode === "AI"); // StepEditListing

  return (
    <div className="min-h-screen pb-24 pt-20">
      {/* Draft-restored banner. One-time, dismissable. Tells the user
          their previous typing was preserved AND that photos were not
          (because we can't serialize File objects). */}
      {draftRestored && (
        <div className="max-w-6xl mx-auto px-6 pb-3">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900">
            <span>
              <strong>Wczytano niedokończony szkic.</strong> Zdjęcia trzeba
              dodać ponownie — reszta jest zachowana.
            </span>
            <button
              type="button"
              onClick={() => setDraftRestored(false)}
              className="text-blue-600 hover:text-blue-800 font-bold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-4 py-3 px-6 transition-all">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
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

      <div
        className={`px-6 mx-auto ${step === 6 && data.completionMode === "AI" ? "max-w-7xl" : "max-w-6xl"}`}
      >
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
              {step === totalSteps ? "Review Listing" : "Next"}{" "}
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
