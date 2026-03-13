import Image from "next/image";
import { Shirt } from "lucide-react";
import type { Photo } from "@/types/features/listing.types";

interface ImageGalleryProps {
  photos: Photo[];
  activeImage: string | null;
  onImageSelect: (url: string) => void;
}

/** Full-width image gallery with thumbnail strip */
const ImageGallery = ({
  photos,
  activeImage,
  onImageSelect,
}: ImageGalleryProps) => (
  <div className="rounded-2xl overflow-hidden bg-gray-950 shadow-lg">
    <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
      {activeImage ? (
        <Image
          src={activeImage}
          alt="Preview"
          fill
          className="object-contain"
          priority
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <Shirt size={48} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No images uploaded</p>
          </div>
        </div>
      )}
    </div>

    {/* Thumbnail strip */}
    {photos && photos.length > 1 && (
      <div className="p-3 bg-gray-900 flex gap-2 overflow-x-auto">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => onImageSelect(photo.url)}
            className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
              activeImage === photo.url
                ? "border-white scale-105 opacity-100"
                : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            <Image
              src={photo.url}
              alt={`Photo ${i + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    )}
  </div>
);

export default ImageGallery;
