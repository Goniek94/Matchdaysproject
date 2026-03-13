"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Share2,
  Eye,
  Plus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

interface SuccessViewProps {
  status: "live" | "pending"; // 'live' = opublikowane, 'pending' = weryfikacja
  title: string; // Tytuł ogłoszenia
  listingId?: string; // ID do linkowania (opcjonalne)
  imageUrl?: string | null; // Zdjęcie główne (opcjonalne)
  onReset: () => void; // Funkcja "Add Another" (resetuje formularz)
}

export default function SuccessView({
  status,
  title,
  listingId = "123", // placeholder
  imageUrl,
  onReset,
}: SuccessViewProps) {
  const isLive = status === "live";

  return (
    <div className="max-w-2xl mx-auto text-center py-10 animate-in fade-in zoom-in-95 duration-500">
      {/* Icon & Header */}
      <div className="mb-8">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${
            isLive
              ? "bg-green-100 text-green-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {isLive ? <CheckCircle2 size={48} /> : <Clock size={48} />}
        </div>

        <h1 className="text-4xl font-black mb-2 text-gray-900">
          {isLive ? "Listing Published!" : "Sent for Review"}
        </h1>
        <p className="text-lg text-gray-500 max-w-lg mx-auto">
          {isLive
            ? "Your item is now live on the marketplace and visible to collectors worldwide."
            : "Your item has been securely received. Our experts will verify the authenticity within 24 hours."}
        </p>
      </div>

      {/* Item Card Preview */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-lg mb-10 flex items-center gap-4 text-left max-w-lg mx-auto transform hover:scale-[1.02] transition-transform">
        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0">
          {imageUrl ? (
            <Image src={imageUrl} alt="Item" fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
              <ShieldCheck size={24} />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 line-clamp-1">
            {title || "Untitled Item"}
          </h3>
          <p className="text-sm text-gray-500 mb-1">
            {isLive ? "Active Auction" : "Pending Verification"}
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-green-600">
            {isLive && (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{" "}
                LIVE NOW
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 max-w-sm mx-auto">
        {isLive && (
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/auction/${listingId}`}
              className="flex items-center justify-center gap-2 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
            >
              <Eye size={18} /> View Listing
            </Link>
            <button
              onClick={() => alert("Share Modal Open")}
              className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-gray-100 text-black font-bold rounded-xl hover:border-black transition-all"
            >
              <Share2 size={18} /> Share
            </button>
          </div>
        )}

        {!isLive && (
          <Link
            href="/dashboards"
            className="flex items-center justify-center gap-2 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all w-full"
          >
            Go to My Dashboard <ArrowRight size={18} />
          </Link>
        )}

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 w-full py-4 text-gray-500 font-bold hover:text-black hover:bg-gray-50 rounded-xl transition-all"
        >
          <Plus size={18} /> Sell Another Item
        </button>
      </div>
    </div>
  );
}
