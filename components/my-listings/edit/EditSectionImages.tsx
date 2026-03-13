"use client";

/**
 * EditSectionImages
 * Read-only image gallery preview in the edit panel
 * (Full image management is on the listing detail page)
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
  const preview = images.slice(0, 5);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Images ({images.length})
        </h3>
        <Link
          href={`/auction/${listing.id}`}
          target="_blank"
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Manage
          <ExternalLink size={11} />
        </Link>
      </div>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <ImageIcon size={24} className="text-gray-300 mb-1" />
          <p className="text-xs text-gray-400">No images uploaded</p>
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {preview.map((src, i) => (
            <div
              key={i}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 ${
                i === 0 ? "border-black" : "border-gray-200"
              }`}
            >
              <Image
                src={src}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] font-bold text-center py-0.5">
                  MAIN
                </div>
              )}
            </div>
          ))}
          {images.length > 5 && (
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-500">
                +{images.length - 5}
              </span>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400">
        To add or reorder images, visit the listing page.
      </p>
    </div>
  );
}
