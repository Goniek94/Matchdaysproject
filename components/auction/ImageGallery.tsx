"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PhotoModal from "./PhotoModal";

interface ImageGalleryProps {
  images: string[];
  title: string;
  verified?: boolean;
  rare?: boolean;
}

/**
 * Image gallery with main image, thumbnails, navigation arrows,
 * and full-screen photo modal (ported from marketplace-frontend).
 */
export default function ImageGallery({
  images,
  title,
  verified = true,
  rare = false,
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [];
  const mainImage = displayImages[activeIndex] || "";

  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNextImage = () => {
    setActiveIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const modalNext = () => {
    setModalIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  const modalPrev = () => {
    setModalIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  if (displayImages.length === 0) {
    return (
      <div className="relative w-full aspect-square bg-gray-100 rounded-3xl flex items-center justify-center">
        <p className="text-gray-400 text-sm">No images available</p>
      </div>
    );
  }

  return (
    <div className="sticky top-24 h-fit">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-3xl overflow-hidden mb-4 group">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
          onClick={() => openModal(activeIndex)}
        />

        {/* Navigation arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors z-10 opacity-0 group-hover:opacity-100"
              title="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors z-10 opacity-0 group-hover:opacity-100"
              title="Next"
            >
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2.5 py-1 rounded-full text-xs font-medium">
          {activeIndex + 1} / {displayImages.length}
        </div>

        {/* Verified Badge */}
        {verified && (
          <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-2 rounded-full text-xs font-medium uppercase tracking-widest backdrop-blur shadow-lg">
            ✓ Verified
          </div>
        )}

        {/* Rare Badge */}
        {rare && (
          <div className="absolute top-4 right-4 bg-black/85 text-white px-3 py-2 rounded-full text-xs font-medium uppercase tracking-widest backdrop-blur">
            Rare
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-square bg-gray-100 rounded-xl overflow-hidden transition-all ${
              activeIndex === index
                ? "ring-2 ring-black ring-offset-2"
                : "hover:ring-2 hover:ring-gray-300 ring-offset-1"
            }`}
          >
            <img
              src={image}
              alt={`${title} - View ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
              {index + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Photo Modal */}
      <PhotoModal
        isOpen={isModalOpen}
        photos={displayImages}
        photoIndex={modalIndex}
        onClose={closeModal}
        prevPhoto={modalPrev}
        nextPhoto={modalNext}
        setPhotoIndex={setModalIndex}
      />
    </div>
  );
}
