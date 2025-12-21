"use client";

import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  title: string;
  verified?: boolean;
  rare?: boolean;
}

export default function ImageGallery({
  images,
  title,
  verified = true,
  rare = false,
}: ImageGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleThumbnailClick = (image: string, index: number) => {
    setMainImage(image);
    setActiveIndex(index);
  };

  return (
    <div className="sticky top-24 h-fit">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-gray-100 border border-gray-200 rounded-[2px] overflow-hidden mb-4 group">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
        />

        {/* Verified Badge */}
        {verified && (
          <div className="absolute top-4 left-4 bg-black/85 text-white px-3 py-2 rounded-[2px] text-xs font-medium uppercase tracking-widest backdrop-blur">
            ✓ Verified
          </div>
        )}

        {/* Rare Badge */}
        {rare && (
          <div className="absolute top-4 right-4 bg-black/85 text-white px-3 py-2 rounded-[2px] text-xs font-medium uppercase tracking-widest backdrop-blur">
            Rare
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(image, index)}
            className={`relative aspect-square bg-gray-100 border-2 rounded-[2px] overflow-hidden transition-all hover:border-black ${
              activeIndex === index
                ? "border-black"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <img
              src={image}
              alt={`${title} - View ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
