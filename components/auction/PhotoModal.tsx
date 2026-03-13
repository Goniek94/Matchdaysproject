"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoModalProps {
  isOpen: boolean;
  photos: string[];
  photoIndex: number;
  onClose: () => void;
  prevPhoto: () => void;
  nextPhoto: () => void;
  setPhotoIndex: (index: number) => void;
}

/**
 * Full-screen photo modal with keyboard navigation, touch swipe support,
 * and thumbnail strip. Ported 1:1 from marketplace-frontend PhotoModal.
 */
export default function PhotoModal({
  isOpen,
  photos = [],
  photoIndex = 0,
  onClose,
  prevPhoto,
  nextPhoto,
  setPhotoIndex,
}: PhotoModalProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Memoize handlers to avoid stale closures in event listener
  const handleClose = useCallback(() => onClose(), [onClose]);
  const handlePrev = useCallback(() => prevPhoto(), [prevPhoto]);
  const handleNext = useCallback(() => nextPhoto(), [nextPhoto]);

  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Handle keyboard navigation
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isOpen, handleClose, handlePrev, handleNext]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[photoIndex] || "";

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && photos.length > 1) nextPhoto();
    if (isRightSwipe && photos.length > 1) prevPhoto();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* Background overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal content */}
      <div className="relative w-full h-full flex flex-col">
        {/* Header with close button and counter */}
        <div className="flex justify-between items-center p-4 text-white z-10">
          <div className="text-sm font-medium">
            Photo {photoIndex + 1} of {photos.length}
          </div>
          <button
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            onClick={onClose}
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image container */}
        <div className="flex-1 flex items-center justify-center relative px-4 pb-4">
          {/* Navigation buttons - hidden on mobile, visible on desktop */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10 hidden sm:flex items-center justify-center"
                title="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10 hidden sm:flex items-center justify-center"
                title="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main image with touch support */}
          <img
            src={currentPhoto}
            alt={`Enlarged photo ${photoIndex + 1}`}
            className="max-w-[95vw] max-h-[75vh] w-auto h-auto object-contain select-none"
            style={{ maxWidth: "95vw", maxHeight: "75vh" }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            draggable={false}
          />
        </div>

        {/* Thumbnail navigation */}
        {photos.length > 1 && (
          <div className="px-4 pb-4">
            <div className="flex justify-center gap-2 overflow-x-auto py-2">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setPhotoIndex(index)}
                  className={`
                    flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden
                    transition-all duration-200 border-2
                    ${
                      index === photoIndex
                        ? "border-white ring-2 ring-white/50 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100 hover:border-white/50"
                    }
                  `}
                  title={`Photo ${index + 1}`}
                >
                  <img
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile swipe hint */}
        {photos.length > 1 && (
          <div className="text-center text-white/70 text-xs pb-2 sm:hidden">
            Swipe or select a thumbnail
          </div>
        )}
      </div>
    </div>
  );
}
