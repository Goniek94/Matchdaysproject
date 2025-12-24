"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Shirt,
  CheckCircle2,
  AlertTriangle,
  Tag,
  Calendar,
  Ruler,
  Scissors,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Sparkles,
  ScanLine,
  Trophy,
  Footprints,
  Layers,
  Disc,
  Globe,
  PenTool,
  Clock,
  Trash2,
  Plus,
  ZoomIn,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// --- KONFIGURACJA ---

type ListingMode = "auto" | "manual" | null;
type ConditionType = "bnwt" | "very_good" | "good" | "fair";

interface ListingState {
  category: string;
  photos: Record<string, string | null>;
  extraPhotos: string[];
  mainPhotoKey: string;

  // Step 4 Logic
  productCode: string;
  isVintage: boolean;
  isTagMissing: boolean;

  // Step 5 Logic
  condition: ConditionType;
  hasDefects: boolean;
  defectPhotos: string[];

  // Step 6 Logic
  userNotes: string;

  // Step 7 (Details Review)
  title: string;
  description: string;

  // SPECS
  brand: string;
  team: string;
  season: string; // NEW
  model: string; // NEW
  size: string;
  dimensions: string;
  country: string;
  estimatedValue: string; // NEW (Wycena)

  // Step 8 (Pricing)
  saleType: "auction" | "buy_now";
  startPrice: string;
  minPrice: string;
  duration: string;
  buyNowPrice: string;
}

const initialListingState: ListingState = {
  category: "shirt",
  photos: {},
  extraPhotos: [],
  mainPhotoKey: "front",
  productCode: "",
  isVintage: false,
  isTagMissing: false,
  condition: "very_good",
  hasDefects: false,
  defectPhotos: [],
  userNotes: "",
  title: "",
  description: "",
  brand: "",
  team: "",
  season: "",
  model: "",
  size: "",
  dimensions: "",
  country: "",
  estimatedValue: "",
  saleType: "auction",
  startPrice: "",
  minPrice: "",
  duration: "7 days",
  buyNowPrice: "",
};

const CATEGORIES = [
  { id: "shirt", label: "Jersey / Shirt", icon: Shirt },
  { id: "boots", label: "Boots / Cleats", icon: Footprints },
  { id: "outerwear", label: "Jacket / Hoodie", icon: Layers },
  { id: "pants", label: "Shorts / Pants", icon: Scissors },
  { id: "accessory", label: "Ball / Accessory", icon: Disc },
];

const CONDITIONS = [
  {
    id: "bnwt",
    label: "Brand New with Tags (BNWT)",
    desc: "Never worn, tags attached.",
  },
  { id: "very_good", label: "Very Good", desc: "Used, almost like new." },
  { id: "good", label: "Good / Used", desc: "Visible wear, fully functional." },
  { id: "fair", label: "Fair", desc: "Significant flaws or wear." },
];

// --- COMPONENTS ---

const PhotoUploadBox = ({
  label,
  subLabel,
  imageUrl,
  onUpload,
  isMain,
  onSetMain,
  onDelete,
  icon,
}: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const IconToRender = icon || Camera;

  return (
    <div
      onClick={() => !imageUrl && inputRef.current?.click()}
      className={`relative aspect-[3/4] rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center overflow-hidden bg-gray-50 hover:bg-white
      ${
        imageUrl
          ? "border-solid border-gray-300"
          : "border-gray-300 hover:border-black"
      }
      ${isMain ? "ring-4 ring-green-500 border-transparent" : ""}`}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) =>
          e.target.files?.[0] &&
          onUpload(URL.createObjectURL(e.target.files[0]))
        }
      />

      {imageUrl ? (
        <>
          <Image src={imageUrl} alt={label} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetMain && onSetMain();
              }}
              className="bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full hover:scale-105"
            >
              {isMain ? "IS MAIN COVER" : "SET AS MAIN"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="bg-gray-200 text-black text-[10px] font-bold px-3 py-1.5 rounded-full hover:scale-105"
            >
              CHANGE
            </button>
          </div>
          {isMain && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              MAIN
            </div>
          )}
        </>
      ) : (
        <div className="p-2 flex flex-col items-center">
          <IconToRender className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-sm font-bold">{label}</p>
          <p className="text-[10px] text-gray-500">{subLabel}</p>
        </div>
      )}
    </div>
  );
};

const SpecRow = ({ label, value, onChange, placeholder }: any) => (
  <div className="flex flex-col border-b border-gray-100 py-3 last:border-0">
    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full font-semibold text-gray-900 bg-transparent focus:outline-none focus:bg-gray-50 rounded px-1 -ml-1 transition-colors"
    />
  </div>
);

// --- MAIN PAGE ---

export default function AddListingPage() {
  const [mode, setMode] = useState<ListingMode>(null);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ListingState>(initialListingState);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  const update = (key: keyof ListingState, val: any) => {
    setData((prev) => ({ ...prev, [key]: val }));
  };

  const setPhoto = (key: string, url: string) => {
    setData((prev) => ({ ...prev, photos: { ...prev.photos, [key]: url } }));
  };

  const addExtraPhoto = (url: string) => {
    setData((prev) => ({ ...prev, extraPhotos: [...prev.extraPhotos, url] }));
  };

  const generateListing = () => {
    setIsAIProcessing(true);
    setTimeout(() => {
      // AI Simulation
      const generatedTitle = `Authentic ${
        data.isVintage ? "Vintage " : ""
      }Nike FC Barcelona Home Jersey`;
      const generatedDesc = `Here is a fantastic piece of football history. The item has been professionally inspected.
        
${data.userNotes ? `Seller Notes: ${data.userNotes}` : ""}

Ready for shipment worldwide.`;

      setData((prev) => ({
        ...prev,
        title: generatedTitle,
        description: generatedDesc,
        brand: "Nike",
        team: "FC Barcelona",
        season: "2014/2015", // AI
        model: "Home Kit / Stadium", // AI
        size: "L",
        country: "Thailand",
        dimensions: "54cm x 72cm",
        estimatedValue: "€45.00 - €60.00", // AI Valuation
      }));
      setIsAIProcessing(false);
      setStep(7); // Go to Details Review
    }, 2000);
  };

  // --- STEPS RENDER ---

  // ... (Steps 1-6 are same as before, abbreviated here for brevity, assume they exist) ...
  // Wklejam je ponownie dla kompletności, żebyś miał cały plik.

  const renderStep1 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="text-center">
        <h2 className="text-2xl font-black">1. Basics</h2>
        <p className="text-gray-500">Category & Front</p>
      </div>
      <div className="grid grid-cols-5 gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => update("category", cat.id)}
            className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
              data.category === cat.id
                ? "bg-black text-white border-black"
                : "bg-white border-gray-200 hover:border-gray-400"
            }`}
          >
            <cat.icon size={20} />
            <span className="text-[10px] font-bold">{cat.label}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <PhotoUploadBox
          label="Full Front"
          subLabel="Whole item visible"
          imageUrl={data.photos["front"]}
          onUpload={(url: string) => setPhoto("front", url)}
          isMain={data.mainPhotoKey === "front"}
          onSetMain={() => update("mainPhotoKey", "front")}
        />
        <PhotoUploadBox
          label="Neck Area"
          subLabel="Size + Country + Logo"
          imageUrl={data.photos["neck"]}
          onUpload={(url: string) => setPhoto("neck", url)}
          isMain={data.mainPhotoKey === "neck"}
          onSetMain={() => update("mainPhotoKey", "neck")}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="text-center">
        <h2 className="text-2xl font-black">2. Back</h2>
        <p className="text-gray-500">Reverse & Nameset</p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <PhotoUploadBox
          label="Full Back"
          subLabel="Whole back visible"
          imageUrl={data.photos["back"]}
          onUpload={(url: string) => setPhoto("back", url)}
          isMain={data.mainPhotoKey === "back"}
          onSetMain={() => update("mainPhotoKey", "back")}
        />
        <PhotoUploadBox
          label="Nameset / Number"
          subLabel="Close up (If any)"
          imageUrl={data.photos["nameset"]}
          onUpload={(url: string) => setPhoto("nameset", url)}
          isMain={data.mainPhotoKey === "nameset"}
          onSetMain={() => update("mainPhotoKey", "nameset")}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="text-center">
        <h2 className="text-2xl font-black">3. Close-ups</h2>
        <p className="text-gray-500">Crucial for authentication</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <PhotoUploadBox
          label="Chest Logo"
          subLabel="Badge"
          imageUrl={data.photos["crest"]}
          onUpload={(url: string) => setPhoto("crest", url)}
          icon={ZoomIn}
        />
        <PhotoUploadBox
          label="Sponsor"
          subLabel="Print condition"
          imageUrl={data.photos["sponsor"]}
          onUpload={(url: string) => setPhoto("sponsor", url)}
          icon={ZoomIn}
        />
        <PhotoUploadBox
          label="Seams / Hem"
          subLabel="Stitching"
          imageUrl={data.photos["hem"]}
          onUpload={(url: string) => setPhoto("hem", url)}
          icon={ZoomIn}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="text-center">
        <h2 className="text-2xl font-black">4. Authenticity</h2>
        <p className="text-gray-500">Internal Tags & Codes</p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <PhotoUploadBox
          label="Wash Tags"
          subLabel="Internal labels"
          imageUrl={data.photos["washtags"]}
          onUpload={(url: string) => setPhoto("washtags", url)}
        />
        <PhotoUploadBox
          label="Product Code"
          subLabel="Small tag"
          imageUrl={data.photos["codetag"]}
          onUpload={(url: string) => setPhoto("codetag", url)}
        />
      </div>
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={data.isVintage}
              onChange={(e) => update("isVintage", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
            />
            Pre-2005 (Vintage)
          </label>
          <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={data.isTagMissing}
              onChange={(e) => update("isTagMissing", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
            />
            Tags Missing / Cut
          </label>
        </div>
        {!data.isTagMissing && (
          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-gray-500">
              Type Product Code
            </label>
            <div className="relative">
              <ScanLine
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder={
                  data.isVintage ? "e.g. Vintage" : "e.g. CZ2131-010"
                }
                value={data.productCode}
                onChange={(e) => update("productCode", e.target.value)}
                className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black font-mono uppercase"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="text-center">
        <h2 className="text-2xl font-black">5. Condition</h2>
        <p className="text-gray-500">Defects & Overall Rating</p>
      </div>
      <div className="bg-white border-2 border-gray-100 p-6 rounded-2xl mb-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <AlertTriangle className="text-amber-500" size={20} />
          Any defects?
        </h3>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => update("hasDefects", false)}
            className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all ${
              !data.hasDefects
                ? "border-black bg-black text-white"
                : "border-gray-200 text-gray-500"
            }`}
          >
            No, Perfect
          </button>
          <button
            onClick={() => update("hasDefects", true)}
            className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all ${
              data.hasDefects
                ? "border-amber-500 bg-amber-50 text-amber-700"
                : "border-gray-200 text-gray-500"
            }`}
          >
            Yes, Defects
          </button>
        </div>
        {data.hasDefects && (
          <div className="grid grid-cols-3 gap-2 animate-in fade-in">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden"
              >
                {data.defectPhotos[i] ? (
                  <Image
                    src={data.defectPhotos[i]}
                    alt="defect"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Plus className="mx-auto text-gray-300" />
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const newPhotos = [...data.defectPhotos];
                      newPhotos[i] = URL.createObjectURL(e.target.files[0]);
                      update("defectPhotos", newPhotos);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
          Overall Rating
        </label>
        <div className="space-y-2">
          {CONDITIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => update("condition", c.id as any)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                data.condition === c.id
                  ? "border-black bg-gray-50"
                  : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <div>
                <div className="font-bold text-sm">{c.label}</div>
                <div className="text-xs text-gray-400">{c.desc}</div>
              </div>
              {data.condition === c.id && <CheckCircle2 size={16} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="text-center">
        <h2 className="text-2xl font-black">6. Final Touches</h2>
        <p className="text-gray-500">Extra photos & Your story</p>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
          Gallery Extras (Optional)
        </label>
        <div className="grid grid-cols-4 gap-3">
          {data.extraPhotos.map((url, idx) => (
            <div
              key={idx}
              className="aspect-square rounded-xl overflow-hidden relative group"
            >
              <Image src={url} alt="extra" fill className="object-cover" />
              <button
                onClick={() => {
                  const newExtra = data.extraPhotos.filter((_, i) => i !== idx);
                  update("extraPhotos", newExtra);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
          <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-black transition-colors">
            <Plus size={20} className="text-gray-400" />
            <input
              type="file"
              className="hidden"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  Array.from(e.target.files).forEach((file) =>
                    addExtraPhoto(URL.createObjectURL(file))
                  );
                }
              }}
            />
          </label>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
          Seller Notes
        </label>
        <textarea
          className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 outline-none resize-none"
          placeholder="Tell us about the history of this item..."
          value={data.userNotes}
          onChange={(e) => update("userNotes", e.target.value)}
        />
      </div>
    </div>
  );

  // --- STEP 7: REVIEW DETAILS (NO PRICING YET) ---
  const renderStep7 = () => (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black">7. Review Details</h2>
        <p className="text-gray-500">
          Verify everything is correct before pricing.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* 1. PHOTO */}
        <div className="aspect-[4/5] bg-gray-100 relative">
          {(() => {
            let url = data.photos[data.mainPhotoKey];
            if (!url) url = Object.values(data.photos).find((v) => v) || null;
            return url ? (
              <Image src={url} alt="Main" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Photo
              </div>
            );
          })()}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md">
            {Object.values(data.photos).filter((x) => x).length +
              data.extraPhotos.length}{" "}
            Photos
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* 2. TITLE */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
              Title
            </label>
            <input
              value={data.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full text-2xl font-black text-gray-900 border-b border-gray-200 pb-2 focus:border-black focus:outline-none"
            />
          </div>

          {/* 3. DESCRIPTION */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
              Description
            </label>
            <textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full text-sm text-gray-600 leading-relaxed border border-gray-200 rounded-xl p-4 focus:ring-1 focus:ring-black outline-none h-40 resize-none"
            />
          </div>

          {/* 4. SPECS GRID (ORDER AS REQUESTED) */}
          <div>
            <h3 className="text-sm font-bold uppercase mb-4 border-b pb-2">
              Technical Specs
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <SpecRow
                label="Category"
                value={data.category}
                onChange={(v: string) => update("category", v)}
              />
              {/* PRZEDMIOT mapped to Category for simplicity, or add new field if distinct */}

              <SpecRow
                label="Brand"
                value={data.brand}
                onChange={(v: string) => update("brand", v)}
              />
              <SpecRow
                label="Club / Team"
                value={data.team}
                onChange={(v: string) => update("team", v)}
              />
              <SpecRow
                label="Season"
                value={data.season}
                onChange={(v: string) => update("season", v)}
              />
              <SpecRow
                label="Model"
                value={data.model}
                onChange={(v: string) => update("model", v)}
              />

              <div className="flex flex-col border-b border-gray-100 py-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">
                  Condition
                </label>
                <select
                  value={data.condition}
                  onChange={(e) => update("condition", e.target.value as any)}
                  className="w-full font-semibold bg-transparent outline-none -ml-1"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <SpecRow
                label="Size"
                value={data.size}
                onChange={(v: string) => update("size", v)}
              />
              <SpecRow
                label="Dimensions"
                value={data.dimensions}
                onChange={(v: string) => update("dimensions", v)}
              />
              <SpecRow
                label="Country of Prod."
                value={data.country}
                onChange={(v: string) => update("country", v)}
              />
              <SpecRow
                label="Product Code"
                value={data.productCode}
                onChange={(v: string) => update("productCode", v)}
              />
            </div>
          </div>

          {/* 5. VALUATION */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <label className="block text-[10px] font-bold text-blue-500 uppercase mb-1">
              Estimated Value
            </label>
            <input
              value={data.estimatedValue}
              onChange={(e) => update("estimatedValue", e.target.value)}
              className="w-full bg-transparent text-blue-900 font-bold text-lg focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // --- STEP 8: PRICING (SEPARATE STEP) ---
  const renderStep8 = () => (
    <div className="animate-in fade-in slide-in-from-right-8 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black">8. Pricing Strategy</h2>
        <p className="text-gray-500">How do you want to sell this?</p>
      </div>

      <div className="max-w-xl mx-auto bg-black text-white p-8 rounded-3xl shadow-2xl">
        {/* Toggle */}
        <div className="flex gap-2 mb-8 p-1 bg-gray-800 rounded-xl">
          <button
            onClick={() => update("saleType", "auction")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              data.saleType === "auction"
                ? "bg-white text-black shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Auction
          </button>
          <button
            onClick={() => update("saleType", "buy_now")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              data.saleType === "buy_now"
                ? "bg-white text-black shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Buy Now
          </button>
        </div>

        {data.saleType === "auction" ? (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">
                  Starting Bid (€)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    €
                  </span>
                  <input
                    type="number"
                    value={data.startPrice}
                    onChange={(e) => update("startPrice", e.target.value)}
                    placeholder="1.00"
                    className="w-full pl-8 p-4 bg-gray-900 border border-gray-700 rounded-xl text-white font-bold focus:border-white outline-none text-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">
                  Duration
                </label>
                <select
                  value={data.duration}
                  onChange={(e) => update("duration", e.target.value)}
                  className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-white font-bold focus:border-white outline-none h-[62px]"
                >
                  <option value="3 days">3 Days</option>
                  <option value="5 days">5 Days</option>
                  <option value="7 days">7 Days</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">
                Reserve Price (Hidden)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  €
                </span>
                <input
                  type="number"
                  value={data.minPrice}
                  onChange={(e) => update("minPrice", e.target.value)}
                  placeholder="Optional"
                  className="w-full pl-8 p-4 bg-gray-900 border border-gray-700 rounded-xl text-white font-bold focus:border-white outline-none"
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2 pt-2 border-t border-gray-800">
              <Clock size={12} /> Auction ends on{" "}
              {new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in py-8">
            <label className="block text-center text-xs font-bold uppercase text-gray-400 mb-4">
              Set your price
            </label>
            <div className="relative max-w-xs mx-auto">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 text-2xl font-light">
                €
              </span>
              <input
                type="number"
                value={data.buyNowPrice}
                onChange={(e) => update("buyNowPrice", e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-6 py-6 bg-gray-900 border-2 border-gray-700 rounded-2xl text-white text-4xl font-bold focus:border-green-500 outline-none text-center"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // --- RENDER MAIN LAYOUT ---

  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-black mb-12">New Listing</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setMode("auto")}
                className="group bg-black text-white p-10 rounded-3xl text-left hover:scale-[1.02] transition-transform relative overflow-hidden shadow-2xl"
              >
                <Sparkles
                  size={80}
                  className="absolute -top-4 -right-4 text-gray-800 opacity-50"
                />
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="text-yellow-400" /> Auto Mode
                </h2>
                <p className="text-gray-400 mb-8">
                  AI scans photos to fill details. You review at the end.
                </p>
                <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm">
                  Start Auto &rarr;
                </span>
              </button>
              <button
                onClick={() => {
                  setMode("manual");
                  setStep(7);
                }}
                className="group bg-gray-50 border-2 border-gray-200 text-black p-10 rounded-3xl text-left hover:border-black transition-all"
              >
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <PenTool /> Manual
                </h2>
                <p className="text-gray-500 mb-8">
                  Skip the wizard. Go straight to the editor.
                </p>
                <span className="bg-black text-white px-4 py-2 rounded-full font-bold text-sm">
                  Start Manual &rarr;
                </span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {isAIProcessing && (
        <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center">
          <Loader2 size={48} className="animate-spin mb-4" />
          <h2 className="text-2xl font-bold">Generating Listing...</h2>
          <p className="text-gray-500">
            Analysing Photos • Reading Tags • Writing Description
          </p>
        </div>
      )}

      <main className="flex-grow pt-28 pb-32 px-4 max-w-5xl mx-auto w-full">
        {step < 7 && (
          <div className="mb-10 flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s <= step ? "w-8 bg-black" : "w-2 bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
        {step === 6 && renderStep6()}
        {step === 7 && renderStep7()}
        {step === 8 && renderStep8()}
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur border-t border-gray-200 p-4 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button
            onClick={() =>
              step === 1 ? setMode(null) : setStep((prev) => prev - 1)
            }
            className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Back
          </button>

          {step < 6 && (
            <button
              onClick={() => setStep((prev) => prev + 1)}
              className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
            >
              Next Step <ChevronRight size={18} />
            </button>
          )}

          {step === 6 && (
            <button
              onClick={generateListing}
              className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Sparkles className="text-yellow-400" size={18} /> Generate{" "}
              <ChevronRight size={18} />
            </button>
          )}

          {step === 7 && (
            <button
              onClick={() => setStep(8)}
              className="bg-black text-white px-12 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
            >
              Next: Pricing <ChevronRight size={18} />
            </button>
          )}

          {step === 8 && (
            <button
              onClick={() => alert("Listing Published Successfully!")}
              className="bg-green-600 text-white px-12 py-3 rounded-xl font-bold hover:bg-green-700 hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-green-200"
            >
              <CheckCircle2 size={20} /> PUBLISH NOW
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
