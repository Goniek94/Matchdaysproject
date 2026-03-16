"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ProductDetail {
  label: string;
  value: string;
}

interface ProductDetailsProps {
  description: string;
  details: ProductDetail[];
}

export default function ProductDetails({
  description,
  details,
}: ProductDetailsProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-12">
      <p className="text-base text-gray-700 leading-relaxed mb-8">
        {description}
      </p>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center justify-between w-full px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-base font-semibold text-gray-900">
            Product Details
          </h2>
          {open ? (
            <ChevronUp size={18} className="text-gray-400 shrink-0" />
          ) : (
            <ChevronDown size={18} className="text-gray-400 shrink-0" />
          )}
        </button>

        {/* Grid */}
        {open && (
          <div className="grid grid-cols-2 border-t border-gray-200">
            {details.map((detail, index) => (
              <div
                key={index}
                className="px-5 py-4 border-b border-gray-100 min-w-0 [&:nth-child(odd)]:border-r [&:nth-child(odd)]:border-gray-100"
              >
                <p className="text-xs text-gray-400 font-medium mb-1 truncate">
                  {detail.label}
                </p>
                <p className="text-sm font-semibold text-gray-900 break-words">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
