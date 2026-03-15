"use client";

/**
 * EditSectionImages
 * Image gallery preview at the top of the edit panel.
 * Shows thumbnails in a horizontal scroll with MAIN badge on first image.
 * Full image management is available on the listing detail page.
 */

import Image from "next/image";
import { ImageIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { MyListing } from "@/types/features/listings.types";

interface EditSectionImagesProps {
  listing: MyListing;
}

export default function EditSectionImages({ listing }: EditSectionImagesProps) {
  const images = listing.images ?? [];

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-center justify-between px-6 pt-4">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Images ({images.length})
        </span>
        <Link
          href={`/auction/${listing.id}`}
          target="_blank"
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Manage
          <ExternalLink size={11} />
        </Link>
      </div>

      {/* Thumbnails */}
      {images.length === 0 ? (
        <div className="mx-6 flex flex-col items-center justify-center h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <ImageIcon size={24} className="text-gray-300 mb-1" />
          <p className="text-xs text-gray-400">No images uploaded</p>
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto px-6 pb-1 scrollbar-hide">
          {images.map((src, i) => (
            <div
              key={i}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                i === 0
                  ? "border-gray-900 shadow-md"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={src}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] font-black text-center py-0.5 tracking-widest">
                  MAIN
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-gray-400 px-6">
        To add or reorder images, visit the listing page.
      </p>
    </div>
  );
}
